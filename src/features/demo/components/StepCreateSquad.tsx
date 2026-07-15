"use client";

import { motion } from "framer-motion";
import { Users, Copy, Check } from "lucide-react";
import { useState } from "react";

const pendingInvites = [
  { name: "Rahul", initial: "R", color: "bg-[#D4836A]" },
  { name: "Ananya", initial: "A", color: "bg-[#E8C4B8]" },
  { name: "Siddharth", initial: "S", color: "bg-[#C4A99A]" },
  { name: "Vivek", initial: "V", color: "bg-[#E09D88]" },
  { name: "Mrunal", initial: "M", color: "bg-[#F0D5C9]" },
  { name: "Karthik", initial: "K", color: "bg-[#D4BFB2]" },
];

export function StepCreateSquad() {
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center space-y-2">
        <span className="font-mono text-xs font-bold text-accent uppercase tracking-widest">
          STEP 01
        </span>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-ink uppercase tracking-tight">
          Create a Squad
        </h2>
        <p className="font-heading text-sm sm:text-base text-ink-light max-w-md mx-auto">
          Share a link. Your squad joins instantly. No sign-up required.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full max-w-md border-[3px] border-ink rounded-[20px] bg-white shadow-bruted-lg overflow-hidden"
      >
        {/* Invite link bar */}
        <div className="bg-ink px-4 py-5 flex items-center gap-3">
          <Users className="w-5 h-5 text-accent shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-display text-sm font-bold text-surface leading-tight">
              Squad Invite
            </p>
            <p className="font-mono text-[11px] text-surface/60 truncate">
              voyaq.com/join/goa-trip-8f3a
            </p>
          </div>
          <button
            onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            className="flex items-center gap-1.5 border-[2px] border-surface/30 rounded-[8px] px-3 py-1.5 hover:bg-surface/10 transition-colors"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-success" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-surface" />
            )}
            <span className="font-mono text-[10px] font-bold text-surface uppercase tracking-wider">
              {copied ? "Copied" : "Copy"}
            </span>
          </button>
        </div>

        {/* Pending invites */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-xs font-bold text-ink-muted uppercase tracking-wider">
              Pending Invites
            </span>
            <span className="font-mono text-[11px] font-bold text-ink-muted tabular-nums">
              {pendingInvites.length}/8
            </span>
          </div>

          <div className="space-y-2">
            {pendingInvites.map((person, i) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.06, duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className="flex items-center gap-3 border-[1.5px] border-ink/10 rounded-[10px] p-2.5"
              >
                <div
                  className={`w-8 h-8 rounded-full ${person.color} flex items-center justify-center ring-2 ring-white shrink-0`}
                >
                  <span className="text-xs font-heading font-bold text-white">
                    {person.initial}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-heading text-sm font-bold text-ink">{person.name}</p>
                  <p className="font-mono text-[10px] text-ink-muted">Pending</p>
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.2 + i * 0.08, type: "spring", stiffness: 400, damping: 15 }}
                  className="w-5 h-5 rounded-full bg-success/10 border border-success/30 flex items-center justify-center"
                >
                  <Check className="w-3 h-3 text-success" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
