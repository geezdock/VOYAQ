"use client";

import { useState, useEffect } from "react";
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

  const { squads, updateSquad, addSquad } = useSquad();
  const [joinSquad, setJoinSquad] = useState<Squad | null>(null);

  // Handle join code from URL
  useEffect(() => {
    if (!joinCode) return;

    // Search runtime squads first, then mock as fallback
    const found = squads.find((s) => s.inviteCode === joinCode) || mockSquads.find((s) => s.inviteCode === joinCode);
    if (found) {
      const alreadyJoined = found.members.some((m) => m.id === "me");
      if (!alreadyJoined && found.members.length < found.memberLimit) {
        setJoinSquad(found);
      } else {
        // Already joined or full — just open the squad
        router.push(`/workspace/${found.id}`);
      }
    }
    // Clear the URL param
    window.history.replaceState({}, "", "/dashboard");
  }, [joinCode]);

  function handleJoinSquad() {
    if (!joinSquad) return;
    const updated: Squad = {
      ...joinSquad,
      members: [
        ...joinSquad.members,
        {
          id: "me",
          name: "You",
          initial: "Y",
          color: "bg-accent",
          verified: true,
          joinedAt: new Date().toISOString(),
        },
      ],
    };
    updateSquad(updated);
    setJoinSquad(null);
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
        {joinSquad && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-ink/40"
              onClick={() => setJoinSquad(null)}
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
                  Join {joinSquad.name}
                </p>
                {joinSquad.destination && (
                  <p className="font-mono text-sm text-ink-muted">
                    {joinSquad.destination}
                  </p>
                )}
              </div>

              <div className="brut-card !p-4 !shadow-bruted-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-heading text-sm text-ink-muted">Members</span>
                  <span className="font-mono text-sm font-bold text-ink">
                    {joinSquad.members.length} / {joinSquad.memberLimit}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {joinSquad.members.slice(0, 8).map((m) => (
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
                  onClick={() => setJoinSquad(null)}
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
