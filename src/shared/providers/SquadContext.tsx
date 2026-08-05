"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react";
import { useAuth } from "@/shared/providers/AuthContext";
import { SquadRepository } from "@/lib/repositories/squad";
import type { Squad, SquadMember } from "@/types/squad";

const VALID_COLORS = [
  "bg-[#D4836A]",
  "bg-[#E8C4B8]",
  "bg-[#C4A99A]",
  "bg-[#E09D88]",
  "bg-[#F0D5C9]",
  "bg-[#D4BFB2]",
];

interface SquadContextValue {
  squads: Squad[];
  currentUserId: string | null;
  isMe: (id: string) => boolean;
  loading: boolean;
  error: string | null;
  syncStatus: "synced" | "pending" | "error" | "conflict";
  lastSyncedAt: string | null;
  pendingMutations: number;
  isRealtimeConnected: boolean;
  getSquad: (id: string) => Squad | undefined;
  updateSquad: (squad: Squad) => void;
  updateMember: (squadId: string, memberId: string, updates: Partial<SquadMember>) => void;
  addSquad: (squad: Squad) => Promise<Squad>;
  joinSquad: (inviteCode: string) => Promise<{ squadId?: string; error?: string }>;
  retryFailedMutations: () => Promise<void>;
  toast: string | null;
  showToast: (message: string) => void;
  dismissToast: () => void;
}

const SquadContext = createContext<SquadContextValue | null>(null);

export function SquadProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [squads, setSquads] = useState<Squad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<"synced" | "pending" | "error" | "conflict">("synced");
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [pendingMutations, setPendingMutations] = useState(0);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const repoRef = useRef<SquadRepository | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const previousRef = useRef<Map<string, Squad>>(new Map());

  const showToast = useCallback((msg: string) => setToast(msg), []);
  const dismissToast = useCallback(() => setToast(null), []);

  const currentUserId = user?.id ?? null;

  const isMe = useCallback(
    (id: string) => id === "me" || id === currentUserId,
    [currentUserId],
  );

  const getSquad = useCallback(
    (id: string) => squads.find((s) => s.id === id),
    [squads],
  );

  // Init repository
  useEffect(() => {
    repoRef.current = new SquadRepository();
  }, []);

  const subscribedRef = useRef<Set<string>>(new Set());
  const channelRef = useRef<{ unsubscribe: () => void }[]>([]);

  // Fetch squads on mount + user change
  useEffect(() => {
    if (authLoading || !repoRef.current) {
      return;
    }

    if (!currentUserId) {
      Promise.resolve().then(() => {
        setSquads([]);
        setLoading(false);
        setError(null);
      });
      return;
    }

    let cancelled = false;
    Promise.resolve()
      .then(() => {
        if (cancelled) return;
        setLoading(true);
        setError(null);
      })
      .then(() => repoRef.current!.fetchUserSquads(currentUserId))
      .then(({ data, fromCache }) => {
        if (cancelled) return;
        setSquads(data);
        previousRef.current = new Map(data.map((s) => [s.id, s]));
        setLoading(false);
        setLastSyncedAt(fromCache ? null : new Date().toISOString());
        setSyncStatus("synced");
        setPendingMutations(repoRef.current!.getPendingCount());
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
        setLoading(false);
        setSyncStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [authLoading, currentUserId]);

  // Subscribe to Realtime for active squads — subscribe to new squads as they appear
  useEffect(() => {
    if (!repoRef.current || squads.length === 0) return;

    const repo = repoRef.current;
    const currentIds = new Set(squads.map((s) => s.id));
    const newIds = [...currentIds].filter((id) => !subscribedRef.current.has(id));

    for (const id of newIds) {
      subscribedRef.current.add(id);
      const channel = repo.subscribeToSquad(id, (updated) => {
        setSquads((prev) =>
          prev.map((s) => (s.id === updated.id ? updated : s)),
        );
        previousRef.current.set(updated.id, updated);
        setSyncStatus("synced");
        setLastSyncedAt(new Date().toISOString());
      });
      channelRef.current.push(channel);
    }

    if (newIds.length > 0) {
      setIsRealtimeConnected(true);
    }

    const channels = channelRef.current;
    const subscribed = subscribedRef.current;
    return () => {
      channels.forEach((c) => c.unsubscribe());
      channelRef.current = [];
      subscribed.clear();
      setIsRealtimeConnected(false);
    };
    // Only re-run when squad count changes, not on every squad data change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [squads.length]);

  // Periodically check pending mutation count
  useEffect(() => {
    const interval = setInterval(() => {
      if (repoRef.current) {
        setPendingMutations(repoRef.current.getPendingCount());
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Flush pending mutations when online
  useEffect(() => {
    function handleOnline() {
      if (repoRef.current) {
        repoRef.current.flushQueue().then(({ ok, failed }) => {
          if (ok > 0) {
            setSyncStatus("synced");
            setLastSyncedAt(new Date().toISOString());
          }
          if (failed.length > 0) {
            setSyncStatus("error");
          }
          setPendingMutations(repoRef.current!.getPendingCount());
        });
      }
    }

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, []);

  const retryFailedMutations = useCallback(async () => {
    if (!repoRef.current) return;
    const { failed } = await repoRef.current.flushQueue();
    if (failed.length === 0) {
      setSyncStatus("synced");
    }
    setPendingMutations(repoRef.current.getPendingCount());
  }, []);

  const addSquad = useCallback(
    async (squad: Squad): Promise<Squad> => {
      const repo = repoRef.current;
      if (!repo) throw new Error("Repository not initialized");

      // Optimistic update
      setSquads((prev) => [squad, ...prev]);
      previousRef.current.set(squad.id, squad);

      try {
        const created = await repo.createSquad({
          id: squad.id,
          name: squad.name,
          inviteCode: squad.inviteCode,
          createdBy: currentUserId ?? "me",
          memberLimit: squad.memberLimit,
        });

        setSquads((prev) => prev.map((s) => (s.id === squad.id ? created : s)));
        setSyncStatus("synced");
        setLastSyncedAt(new Date().toISOString());
        showToast(`Squad "${squad.name}" created!`);
        return created;
      } catch (err) {
        // Rollback optimistic update
        setSquads((prev) => prev.filter((s) => s.id !== squad.id));
        previousRef.current.delete(squad.id);
        setSyncStatus("error");
        setError(err instanceof Error ? err.message : "Failed to create squad");
        throw err;
      }
    },
    [currentUserId, showToast],
  );

  const updateSquad = useCallback(
    (updated: Squad) => {
      const repo = repoRef.current;
      if (!repo) return;

      const prevSquad = previousRef.current.get(updated.id);

      // Optimistic update
      setSquads((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      previousRef.current.set(updated.id, updated);

      // Show contextual toasts for lock events
      if (updated.lockedDestination && (!prevSquad || !prevSquad.lockedDestination)) {
        showToast(`Destination locked: ${updated.lockedDestination}!`);
      } else if (updated.lockedBudget !== undefined && (!prevSquad || prevSquad.lockedBudget === undefined)) {
        showToast(`Budget target locked: ₹${updated.lockedBudget.toLocaleString("en-IN")}/person!`);
      } else if (updated.lockedDates && (!prevSquad || !prevSquad.lockedDates)) {
        showToast(`Dates locked!`);
      }

      setSyncStatus("pending");

      if (!navigator.onLine) {
        repo.queueMutation({
          id: updated.id,
          type: "updateSquad",
          payload: { id: updated.id, changes: updated, previous: prevSquad },
        });
        setPendingMutations(repo.getPendingCount());
        return;
      }

      repo
        .updateSquad(updated.id, updated, undefined, prevSquad)
        .then((result) => {
          if (result.conflict) {
            setSyncStatus("conflict");
            showToast("Sync conflict detected — another member updated this squad");
            setSquads((prev) =>
              prev.map((s) =>
                s.id === updated.id ? result.conflict!.serverState : s,
              ),
            );
          } else if (result.error) {
            setSyncStatus("error");
            setError(result.error);
          } else {
            setSyncStatus("synced");
            setLastSyncedAt(new Date().toISOString());
          }
        })
        .catch(() => {
          setSyncStatus("error");
        });
    },
    [showToast],
  );

  const updateMember = useCallback(
    (squadId: string, memberId: string, updates: Partial<SquadMember>) => {
      const repo = repoRef.current;
      if (!repo) return;

      setSquads((prev) =>
        prev.map((s) =>
          s.id === squadId
            ? {
                ...s,
                members: s.members.map((m) =>
                  m.id === memberId ? { ...m, ...updates } : m,
                ),
              }
            : s,
        ),
      );

      const prevSquad = previousRef.current.get(squadId);
      if (prevSquad) {
        previousRef.current.set(squadId, {
          ...prevSquad,
          members: prevSquad.members.map((m) =>
            m.id === memberId ? { ...m, ...updates } : m,
          ),
        });
      }

      repo.updateMember(squadId, memberId, updates).catch(() => {
        // RLS / dev-mode — local state remains authoritative.
      });
    },
    [],
  );

  const joinSquad = useCallback(
    async (inviteCode: string): Promise<{ squadId?: string; error?: string }> => {
      const repo = repoRef.current;
      if (!repo) return { error: "Repository not initialized" };

      const result = await repo.joinSquad(inviteCode);
      if (result.error) return { error: result.error };
      if (result.squad) {
        setSquads((prev) => {
          const exists = prev.some((s) => s.id === result.squad!.id);
          return exists
            ? prev.map((s) => (s.id === result.squad!.id ? result.squad! : s))
            : [result.squad!, ...prev];
        });
        previousRef.current.set(result.squad.id, result.squad);
      }
      return { squadId: result.squadId };
    },
    [],
  );

  return (
    <SquadContext.Provider
      value={{
        squads,
        currentUserId,
        isMe,
        loading: authLoading || loading,
        error,
        syncStatus,
        lastSyncedAt,
        pendingMutations,
        isRealtimeConnected,
        getSquad,
        updateSquad,
        updateMember,
        addSquad,
        joinSquad,
        retryFailedMutations,
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
