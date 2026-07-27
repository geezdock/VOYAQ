"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react";
import { mockSquads } from "@/shared/mock";
import { useAuth } from "@/shared/providers/AuthContext";
import { createClient } from "@/services/supabase/client";
import type { Squad } from "@/types/squad";

const STORAGE_KEY = "voyaq_squads_v1";

interface SquadContextValue {
  squads: Squad[];
  currentUserId: string | null;
  isMe: (id: string) => boolean;
  loading: boolean;
  error: string | null;
  isRealtimeConnected: boolean;
  getSquad: (id: string) => Squad | undefined;
  updateSquad: (squad: Squad) => void;
  addSquad: (squad: Squad) => Promise<Squad>;
  toast: string | null;
  showToast: (message: string) => void;
  dismissToast: () => void;
}

const SquadContext = createContext<SquadContextValue | null>(null);

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

function loadSavedSquads(): Squad[] {
  if (typeof window === "undefined") return mockSquads;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return mockSquads;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : mockSquads;
  } catch {
    return mockSquads;
  }
}

export function SquadProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [squads, setSquads] = useState<Squad[]>(mockSquads);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);
  const [error] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const previousRef = useRef<Map<string, Squad>>(new Map());

  // Load persisted squads on mount
  useEffect(() => {
    const loaded = loadSavedSquads();
    setSquads(loaded);
    previousRef.current = new Map(loaded.map((s) => [s.id, s]));
    setIsInitialized(true);
  }, []);

  // Save squads to localStorage whenever state changes after initialization
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(squads));
    } catch {
      // quota or SSR error
    }
  }, [squads, isInitialized]);

  const showToast = useCallback((msg: string) => setToast(msg), []);
  const dismissToast = useCallback(() => setToast(null), []);

  // Subscribe to Supabase Realtime channel for live squad updates across users
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return;
    }

    try {
      const supabase = createClient();
      const channel = supabase
        .channel("public:squads_live")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "squads" },
          (payload) => {
            if (payload.new && typeof payload.new === "object" && "id" in payload.new) {
              const updatedFromCloud = payload.new as Record<string, unknown>;
              setSquads((prev) =>
                prev.map((s) => {
                  if (s.id === updatedFromCloud.id) {
                    const nextSquad: Squad = {
                      ...s,
                      name: String(updatedFromCloud.name ?? s.name),
                      lockedDestination: updatedFromCloud.locked_destination
                        ? String(updatedFromCloud.locked_destination)
                        : s.lockedDestination,
                      lockedBudget:
                        typeof updatedFromCloud.locked_budget === "number"
                          ? updatedFromCloud.locked_budget
                          : s.lockedBudget,
                    };
                    return nextSquad;
                  }
                  return s;
                }),
              );
              showToast("⚡ Live squad update received from a member!");
            }
          },
        )
        .subscribe((status) => {
          if (status === "SUBSCRIBED") {
            setIsRealtimeConnected(true);
          }
        });

      return () => {
        supabase.removeChannel(channel);
      };
    } catch {
      // Realtime subscription fallback
    }
  }, [showToast]);

  const currentUserId = user?.id ?? null;

  const isMe = useCallback(
    (id: string) => id === "me" || id === currentUserId,
    [currentUserId],
  );

  const getSquad = useCallback(
    (id: string) => squads.find((s) => s.id === id),
    [squads],
  );

  const updateSquad = useCallback(
    (updated: Squad) => {
      setSquads((prev) => {
        const next = prev.map((s) => (s.id === updated.id ? updated : s));
        return next;
      });

      const prevSquad = previousRef.current.get(updated.id);
      previousRef.current.set(updated.id, updated);

      // Hybrid Cloud Sync attempt if Supabase URL is configured
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        try {
          const supabase = createClient();
              supabase
                .from("squads")
                .upsert({
                  id: updated.id,
                  name: updated.name,
                  invite_code: updated.inviteCode,
                  locked_destination: updated.lockedDestination ?? null,
                  locked_budget: updated.lockedBudget ?? null,
                  locked_dates: updated.lockedDates ? JSON.stringify(updated.lockedDates) : null,
                })
            .then(({ error: cloudError }) => {
              if (cloudError) console.warn("Supabase squad sync fallback to local storage:", cloudError.message);
            });
        } catch {
          // Fallback to local persistence
        }
      }

      // Contextual toast notifications for lock changes
      if (updated.lockedDestination && (!prevSquad || !prevSquad.lockedDestination)) {
        showToast(`Destination locked: ${updated.lockedDestination}! 🎯`);
      } else if (updated.lockedBudget !== undefined && (!prevSquad || prevSquad.lockedBudget === undefined)) {
        showToast(`Budget target locked: ₹${updated.lockedBudget.toLocaleString("en-IN")}/person! 💰`);
      } else if (updated.lockedDates && (!prevSquad || !prevSquad.lockedDates)) {
        showToast(`Dates locked! 📅`);
      }
    },
    [showToast],
  );

  const addSquad = useCallback(
    async (squad: Squad): Promise<Squad> => {
      setSquads((prev) => [squad, ...prev]);
      previousRef.current.set(squad.id, squad);

      // Hybrid Cloud Sync attempt if Supabase URL is configured
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        try {
          const supabase = createClient();
          await supabase.from("squads").insert({
            id: squad.id,
            name: squad.name,
            invite_code: squad.inviteCode,
          });
        } catch {
          // Fallback to local persistence
        }
      }

      showToast(`Squad "${squad.name}" created! 🎉`);
      return squad;
    },
    [showToast],
  );

  return (
    <SquadContext.Provider
      value={{
        squads,
        currentUserId,
        isMe,
        loading: authLoading,
        error,
        isRealtimeConnected,
        getSquad,
        updateSquad,
        addSquad,
        toast,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </SquadContext.Provider>
  );
}

export function useSquad(): SquadContextValue {
  const ctx = useContext(SquadContext);
  if (!ctx) throw new Error("useSquad must be used within a SquadProvider");
  return ctx;
}

export { pickColor };
