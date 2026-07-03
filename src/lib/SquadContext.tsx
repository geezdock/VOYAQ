"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react";
import { createClient } from "./supabase";
import { mockSquads } from "./mock";
import { Toast } from "@/components/Toast";
import type { Squad } from "@/types/squad";

interface SquadContextValue {
  squads: Squad[];
  currentUserId: string | null;
  isMe: (id: string) => boolean;
  loading: boolean;
  error: string | null;
  getSquad: (id: string) => Squad | undefined;
  updateSquad: (squad: Squad) => void;
  addSquad: (squad: Squad) => Promise<Squad>;
  refreshSquads: () => Promise<void>;
  toast: string | null;
  dismissToast: () => void;
}

const SquadContext = createContext<SquadContextValue | null>(null);

let mockIdCounter = 0;

function generateMemberId() {
  mockIdCounter++;
  return `mock-${mockIdCounter}-${Date.now()}`;
}

const MOCK_COLORS = [
  "bg-[#D4836A]",
  "bg-[#E8C4B8]",
  "bg-[#C4A99A]",
  "bg-[#E09D88]",
  "bg-[#F0D5C9]",
  "bg-[#D4BFB2]",
];

function pickColor(index: number) {
  return MOCK_COLORS[index % MOCK_COLORS.length];
}

export function SquadProvider({ children }: { children: ReactNode }) {
  const [squads, setSquads] = useState<Squad[]>(mockSquads);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const previousRef = useRef<Map<string, Squad>>(new Map());
  const refreshCalledRef = useRef(false);

  useEffect(() => {
    previousRef.current = new Map(mockSquads.map((s) => [s.id, s]));
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  const isMe = useCallback(
    (id: string) => id === "me" || id === currentUserId,
    [currentUserId],
  );

  const getSquad = useCallback(
    (id: string) => squads.find((s) => s.id === id),
    [squads],
  );

  const updateSquad = useCallback((updated: Squad) => {
    const old = previousRef.current.get(updated.id);
    setSquads((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    previousRef.current.set(updated.id, updated);

    if (currentUserId && (old || updated.createdBy === currentUserId)) {
      import("./supabase/squad-queries").then(({ syncSquad }) => {
        syncSquad(updated, old || null).catch(() => {
          setToast("Offline mode: changes saved locally");
        });
      }).catch(() => {
        setToast("Offline mode: changes saved locally");
      });
    }
  }, [currentUserId]);

  const addSquad = useCallback(async (squad: Squad): Promise<Squad> => {
    if (currentUserId) {
      try {
        const { createSquadInDb } = await import("./supabase/squad-queries");
        const created = await createSquadInDb(
          {
            name: squad.name,
            inviteCode: squad.inviteCode,
            destination: squad.destination,
            memberLimit: squad.memberLimit,
            budgetPerPerson: squad.budgetPerPerson,
            startDate: squad.dateProposals[0]?.startDate,
            endDate: squad.dateProposals[0]?.endDate,
          },
          currentUserId,
        );
        setSquads((prev) => [created, ...prev]);
        previousRef.current.set(created.id, created);
        return created;
      } catch {
        setToast("Offline mode: squad saved locally");
      }
    }

    setSquads((prev) => [squad, ...prev]);
    previousRef.current.set(squad.id, squad);
    return squad;
  }, [currentUserId]);

  const refreshSquads = useCallback(async () => {
    if (!currentUserId) return;
    setLoading(true);
    setError(null);
    try {
      const { createClient: getClient } = await import("./supabase");
      const supabase = getClient();
      const { data, error: fetchError } = await supabase
        .from("squads")
        .select("*, squad_members(*, profile:profiles(*)), destinations(*), destination_votes(*), budget_preferences(*), date_proposals(*, date_proposal_votes(*)), polls(*, poll_options(*, poll_votes(*)))")
        .or(`created_by.eq.${currentUserId},squad_members.profile_id.eq.${currentUserId}`);
      if (fetchError) throw fetchError;
      if (data) {
        const { squadRowToSquad } = await import("./supabase/squad-queries");
        const mapped = data.map(squadRowToSquad);
        setSquads(mapped);
        mapped.forEach((s: Squad) => previousRef.current.set(s.id, s));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load squads");
      setSquads(mockSquads);
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUserId(session?.user?.id || null);
      if (session?.user && !refreshCalledRef.current) {
        refreshCalledRef.current = true;
        refreshSquads();
      }
    });
    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SquadContext.Provider value={{ squads, currentUserId, isMe, loading, error, getSquad, updateSquad, addSquad, refreshSquads, toast, dismissToast }}>
      <Toast message={toast} onDismiss={dismissToast} />
      {children}
    </SquadContext.Provider>
  );
}

export function useSquad(): SquadContextValue {
  const ctx = useContext(SquadContext);
  if (!ctx) throw new Error("useSquad must be used within a SquadProvider");
  return ctx;
}

export { generateMemberId, pickColor };
