"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Users, UserMinus, Crown } from "lucide-react";
import type { Squad } from "@/types/squad";
import { useSquad } from "@/lib/SquadContext";

interface TabSquadProps {
  squad: Squad;
  onUpdate: (squad: Squad) => void;
}

export function TabSquad({ squad, onUpdate }: TabSquadProps) {
  const { isMe } = useSquad();
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const url = `${window.location.origin}/join/${squad.inviteCode}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Clipboard not available — fall back to prompt
      prompt("Copy invite link:", url);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleRemove(memberId: string) {
    onUpdate({
      ...squad,
      members: squad.members.filter((m) => m.id !== memberId),
    });
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="border border-ink/10 rounded-xl bg-white shadow-lg overflow-hidden">
        {/* Invite callout */}
        <div className="mx-5 mt-5 bg-accent/5 border border-accent/20 rounded-xl px-4 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-heading text-sm font-bold text-ink leading-tight">
              Squad Invite
            </p>
            <p className="font-mono text-[11px] text-ink-muted truncate">
              voyaq.com/join/{squad.inviteCode}
            </p>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 border-[2px] border-accent/20 rounded-lg px-3 py-2 min-h-[36px] hover:bg-accent/10 transition-colors"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-success" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-accent" />
            )}
            <span className="font-mono text-[10px] font-bold text-accent uppercase tracking-wider">
              {copied ? "Copied" : "Copy"}
            </span>
          </button>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-xs font-bold text-ink-muted uppercase tracking-wider">
              Members
            </span>
            <span className="font-mono text-[11px] font-bold text-ink-muted tabular-nums">
              {squad.members.length}/{squad.memberLimit}
            </span>
          </div>

          <div className="space-y-2">
            {squad.members.map((member, i) => {
              const isCreator = member.id === squad.createdBy;
              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  className="flex items-center gap-3 border border-ink/10 rounded-xl p-2.5 hover:bg-surface-alt/50 transition-colors"
                >
                  <div
                    className={`w-8 h-8 rounded-full ${member.color} flex items-center justify-center ring-2 ring-white shrink-0 relative`}
                  >
                    <span className="text-xs font-heading font-bold text-white">
                      {member.initial}
                    </span>
                    {isCreator && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-accent rounded-full flex items-center justify-center border-2 border-white">
                        <Crown className="w-2.5 h-2.5 text-white" />
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-heading text-sm font-bold text-ink">
                        {member.name}
                      </p>
                      {isCreator && (
                        <span className="font-mono text-[9px] font-bold text-accent bg-accent/10 px-1.5 py-0.5 rounded uppercase">
                          Organizer
                        </span>
                      )}
                    </div>
                    <p className="font-mono text-[10px] text-ink-muted">
                      {isMe(member.id) ? "You" : "Joined"}
                    </p>
                  </div>
                  {!isMe(member.id) && (
                    <button
                      onClick={() => handleRemove(member.id)}
                      className="min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-error/10 rounded-lg transition-colors"
                      title="Remove member"
                    >
                      <UserMinus className="w-4 h-4 text-ink-muted hover:text-error" />
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>

          {squad.members.length < squad.memberLimit && (
            <p className="mt-4 font-mono text-xs text-ink-muted text-center">
              Share the invite link to add more members
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
