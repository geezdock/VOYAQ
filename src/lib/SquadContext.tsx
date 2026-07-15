"use client";

import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from "react";
import { mockSquads } from "./mock";
import { useAuth } from "@/contexts/AuthContext";
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
  toast: string | null;
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

export function SquadProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [squads, setSquads] = useState<Squad[]>(mockSquads);
  const [error] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const previousRef = useRef<Map<string, Squad>>(new Map(mockSquads.map((s) => [s.id, s])));

  const currentUserId = user?.id ?? null;

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
    setSquads((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    previousRef.current.set(updated.id, updated);
  }, []);

  const addSquad = useCallback(async (squad: Squad): Promise<Squad> => {
    setSquads((prev) => [squad, ...prev]);
    previousRef.current.set(squad.id, squad);
    return squad;
  }, []);

  return (
    <SquadContext.Provider value={{ squads, currentUserId, isMe, loading: authLoading, error, getSquad, updateSquad, addSquad, toast, dismissToast }}>
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
