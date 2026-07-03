"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Users } from "lucide-react";
import { EmptyState } from "./EmptyState";
import { SquadGrid } from "./SquadGrid";
import { UserAvatarDropdown } from "./UserAvatarDropdown";
import { useSquad } from "@/lib/SquadContext";
import { mockSquads } from "@/lib/mock";
import type { Squad } from "@/types/squad";

export function DashboardView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const joinCode = searchParams.get("join");

  const { squads, updateSquad, addSquad, isMe, currentUserId } = useSquad();
  const [dismissed, setDismissed] = useState(false);

  const pendingJoin = useMemo(() => {
    if (!joinCode || dismissed) return null;
    const found = squads.find((s) => s.inviteCode === joinCode) || mockSquads.find((s) => s.inviteCode === joinCode);
    if (!found) return null;
    if (found.members.some((m) => isMe(m.id)) || found.members.length >= found.memberLimit) return null;
    return found;
  }, [joinCode, squads, dismissed, isMe]);

  // Handle redirect + URL cleanup for join codes
  useEffect(() => {
    if (!joinCode) return;
    const found = squads.find((s) => s.inviteCode === joinCode) || mockSquads.find((s) => s.inviteCode === joinCode);
    if (found) {
      const alreadyJoined = found.members.some((m) => isMe(m.id));
      if (alreadyJoined || found.members.length >= found.memberLimit) {
        router.push(`/workspace/${found.id}`);
      }
    }
    window.history.replaceState({}, "", "/dashboard");
  }, [joinCode, squads, router, isMe]);

  function handleJoinSquad() {
    if (!pendingJoin) return;
    const updated: Squad = {
      ...pendingJoin,
      members: [
        ...pendingJoin.members,
        {
          id: currentUserId || "me",
          name: "You",
          initial: "Y",
          color: "bg-accent",
          verified: true,
          joinedAt: new Date().toISOString(),
        },
      ],
    };
    updateSquad(updated);
    setDismissed(true);
    router.push(`/workspace/${updated.id}`);
  }

  return (
    <div className="min-h-screen">
      <header className="border-b-2 border-ink bg-surface-card">
        <div className="max-w-6xl mx-auto px-4 py-0 flex items-center justify-between h-16">
          <div className="w-28">
            <span className="font-display text-xl font-bold text-ink">
              VOYAQ
            </span>
          </div>

          <div className="w-28 flex justify-end">
            <UserAvatarDropdown />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {squads.length > 0 ? (
          <motion.div
            key="squad-list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-display text-2xl font-bold text-ink">
                Your Squads
              </h1>
              <button
                onClick={() => router.push("/create")}
                className="brut-btn text-sm px-5 py-3 min-h-[44px]"
              >
                + New Squad
              </button>
            </div>
            <SquadGrid
              squads={squads}
              onSelect={(id) => {
                const s = squads.find((sq) => sq.id === id);
                const tripStatuses = ["booked", "pending", "cancelled"];
                if (s && tripStatuses.includes(s.status)) {
                  router.push(`/trip/${id}`);
                } else {
                  router.push(`/workspace/${id}`);
                }
              }}
            />
          </motion.div>
        ) : (
          <EmptyState />
        )}
      </main>

      {/* Join Squad Modal */}
      <AnimatePresence>
        {pendingJoin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-ink/40"
              onClick={() => setDismissed(true)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="brut-card w-full max-w-md relative z-10 text-center space-y-6"
            >
              <div className="mx-auto w-14 h-14 rounded-bruted-lg border-2 border-ink flex items-center justify-center bg-peach">
                <Users className="w-7 h-7 text-ink" />
              </div>

              <div className="space-y-2">
                <p className="font-display text-2xl font-bold text-ink">
                  Join {pendingJoin.name}
                </p>
                {pendingJoin.destination && (
                  <p className="font-mono text-sm text-ink-muted">
                    {pendingJoin.destination}
                  </p>
                )}
              </div>

              <div className="brut-card !p-4 !shadow-bruted-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-heading text-sm text-ink-muted">Members</span>
                  <span className="font-mono text-sm font-bold text-ink">
                    {pendingJoin.members.length} / {pendingJoin.memberLimit}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {pendingJoin.members.slice(0, 8).map((m) => (
                    <div
                      key={m.id}
                      className={`w-7 h-7 rounded-full ${m.color} flex items-center justify-center ring-2 ring-white`}
                    >
                      <span className="text-xs font-heading font-bold text-white">
                        {m.initial}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setDismissed(true)}
                  className="flex-1 brut-btn text-sm !bg-surface-card !text-ink !shadow-bruted-sm hover:!shadow-bruted"
                >
                  Cancel
                </button>
                <button
                  onClick={handleJoinSquad}
                  className="flex-1 brut-btn text-sm"
                >
                  Join Squad
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
