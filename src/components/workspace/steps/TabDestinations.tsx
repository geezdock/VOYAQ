"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Plus, X, Lock, Unlock } from "lucide-react";
import type { Squad } from "@/types/squad";
import { useSquad } from "@/lib/SquadContext";

interface TabDestinationsProps {
  squad: Squad;
  onUpdate: (squad: Squad) => void;
}

export function TabDestinations({ squad, onUpdate }: TabDestinationsProps) {
  const { isMe, currentUserId } = useSquad();
  const [newDest, setNewDest] = useState("");

  const totalVotes = squad.votes.length;
  const totalMembers = squad.members.length;
  const destCounts = squad.destinations.map((dest) => {
    const votes = squad.votes.filter((v) => v.destination === dest);
    return {
      name: dest,
      votes: votes.length,
      pct: totalVotes > 0 ? Math.round((votes.length / totalVotes) * 100) : 0,
      voters: votes.map((v) => squad.members.find((m) => m.id === v.memberId)).filter(Boolean),
    };
  });
  destCounts.sort((a, b) => b.votes - a.votes);
  const leading = destCounts[0];
  const leadingPct = totalMembers > 0 ? Math.round(((leading?.votes || 0) / totalMembers) * 100) : 0;
  const isLocked = !!squad.lockedDestination;

  function handleAddDest() {
    if (!newDest.trim() || isLocked) return;
    if (squad.destinations.includes(newDest.trim())) return;
    onUpdate({
      ...squad,
      destinations: [...squad.destinations, newDest.trim()],
    });
    setNewDest("");
  }

  function handleVote(dest: string) {
    if (isLocked) return;
    const uid = currentUserId || "me";
    const existing = squad.votes.find((v) => isMe(v.memberId));
    const newVotes = existing
      ? squad.votes.map((v) =>
          isMe(v.memberId) ? { ...v, destination: dest } : v
        )
      : [...squad.votes, { memberId: uid, destination: dest }];
    onUpdate({ ...squad, votes: newVotes });
  }

  function handleRemoveDest(dest: string) {
    if (isLocked) return;
    onUpdate({
      ...squad,
      destinations: squad.destinations.filter((d) => d !== dest),
      votes: squad.votes.filter((v) => v.destination !== dest),
    });
  }

  function handleLock(dest: string) {
    onUpdate({ ...squad, lockedDestination: dest, destination: dest });
  }

  function handleUnlock() {
    onUpdate({ ...squad, lockedDestination: undefined });
  }

  const myVote = squad.votes.find((v) => isMe(v.memberId))?.destination;

  return (
    <div className="max-w-lg space-y-6">
      {isLocked && (
        <div className="border-[3px] border-success/30 rounded-[16px] bg-success/5 p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[8px] bg-success flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-heading text-sm font-bold text-ink">
                  Destination Locked
                </p>
                <p className="font-mono text-xs text-ink-muted">
                  {squad.lockedDestination}
                </p>
              </div>
            </div>
            <button
              onClick={handleUnlock}
              className="font-heading text-xs font-bold text-ink-muted hover:text-error transition-colors min-h-[44px] py-2"
            >
              Unlock
            </button>
          </div>
        </div>
      )}

      <div className={`border-[3px] rounded-[16px] bg-white p-5 sm:p-6 shadow-bruted-lg ${isLocked ? "border-success/30" : "border-ink"}`}>
        <div className="flex items-center justify-between mb-5">
          <span className="font-mono text-xs font-bold text-ink-muted uppercase tracking-wider">
            Destination Vote
          </span>
          {leading && leading.votes > 0 && !isLocked && (
            <div className="flex items-center gap-1.5 bg-success/10 border border-success/30 rounded-full px-3 py-1">
              <Check className="w-4 h-4 text-success" />
              <span className="font-heading text-xs font-bold text-success">
                {leading.name} Leading
              </span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {destCounts.map((dest, i) => (
            <div key={dest.name} className="space-y-1.5">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleVote(dest.name)}
                  disabled={isLocked}
                  className={`font-heading text-sm sm:text-lg font-bold max-sm:w-20 sm:w-36 shrink-0 text-left transition-colors ${
                    squad.lockedDestination === dest.name
                      ? "text-success"
                      : myVote === dest.name
                      ? "text-accent"
                      : "text-ink hover:text-accent"
                  } ${isLocked ? "cursor-default" : ""}`}
                >
                  {dest.name}
                  {squad.lockedDestination === dest.name && (
                    <Check className="w-4 h-4 text-success inline ml-1" />
                  )}
                </button>
                <div className="flex-1 h-9 rounded-[8px] bg-clay-light/30 overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dest.pct}%` }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className={`h-full rounded-[8px] flex items-center px-3 ${
                      squad.lockedDestination === dest.name
                        ? "bg-gradient-to-r from-success to-success/80"
                        : myVote === dest.name
                        ? "bg-gradient-to-r from-accent to-accent-dark"
                        : "bg-gradient-to-r from-clay to-clay-light"
                    }`}
                  >
                    <div className="flex items-center gap-0.5">
                      {dest.voters.slice(0, 5).map((voter, j) => (
                        <div
                          key={j}
                          className={`w-5 h-5 rounded-full ${voter?.color || "bg-ink-muted"} flex items-center justify-center ring-[1.5px] ring-white -ml-1 first:ml-0`}
                        >
                          <span className="text-[8px] font-heading font-bold text-white leading-none">
                            {voter?.initial}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
                <span className="font-mono text-sm font-bold text-ink w-8 text-right tabular-nums">
                  {dest.votes}
                </span>
                {!isLocked && (
                  <button
                    onClick={() => handleRemoveDest(dest.name)}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-surface-alt rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-ink-muted" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {!isLocked && (
          <div className="mt-5 pt-4 border-t border-ink/10">
            <div className="flex gap-2">
              <input
                value={newDest}
                onChange={(e) => setNewDest(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddDest()}
                className="brut-input flex-1 text-sm"
                placeholder="Add destination..."
              />
              <button
                onClick={handleAddDest}
                disabled={!newDest.trim()}
                className="brut-btn px-4 text-sm min-h-[44px] disabled:opacity-40"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-ink-muted">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-heading text-sm">
              {totalVotes} vote{totalVotes !== 1 ? "s" : ""} cast
            </span>
          </div>

          {!isLocked && leading && leading.votes > 0 && leadingPct >= 50 && (
            <button
              onClick={() => handleLock(leading.name)}
              className="flex items-center gap-1.5 brut-btn text-sm px-4 min-h-[44px]"
            >
              <Lock className="w-4 h-4" />
              Lock {leading.name}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
