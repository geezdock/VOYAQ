"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const destinations = [
  { name: "Goa", votes: 5, pct: 62 },
  { name: "Gokarna", votes: 2, pct: 25 },
  { name: "Pondicherry", votes: 1, pct: 13 },
];

const friendVotes = [
  { name: "Rahul", initial: "R", color: "bg-[#D4836A]", vote: "Goa" },
  { name: "Ananya", initial: "A", color: "bg-[#E8C4B8]", vote: "Goa" },
  { name: "Siddharth", initial: "S", color: "bg-[#C4A99A]", vote: "Goa" },
  { name: "Vivek", initial: "V", color: "bg-[#E09D88]", vote: "Goa" },
  { name: "Mrunal", initial: "M", color: "bg-[#F0D5C9]", vote: "Goa" },
  { name: "Karthik", initial: "K", color: "bg-[#D4BFB2]", vote: "Gokarna" },
  { name: "Priya", initial: "P", color: "bg-[#E8C4B8]", vote: "Gokarna" },
  { name: "Arjun", initial: "A", color: "bg-[#D4836A]", vote: "Pondicherry" },
];

function VoteBar({ name, votes, pct, index }: { name: string; votes: number; pct: number; index: number }) {
  const relevantFriends = friendVotes.filter((f) => f.vote === name);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-3">
        <span className="font-heading text-sm sm:text-lg font-bold text-ink w-20 sm:w-28 shrink-0">
          {name}
        </span>
        <div className="flex-1 h-9 rounded-[8px] bg-clay-light/30 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, delay: 0.2 + index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="h-full rounded-[8px] bg-gradient-to-r from-accent to-accent-dark flex items-center px-3"
          >
            <div className="flex items-center gap-0.5">
              {relevantFriends.slice(0, 5).map((f, i) => (
                <motion.div
                  key={f.name}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.15 + i * 0.05, type: "spring", stiffness: 500, damping: 18 }}
                  className={`w-5 h-5 rounded-full ${f.color} flex items-center justify-center ring-[1.5px] ring-white -ml-1 first:ml-0`}
                >
                  <span className="text-[7px] font-heading font-bold text-white leading-none">
                    {f.initial}
                  </span>
                </motion.div>
              ))}
              {relevantFriends.length > 5 && (
                <span className="font-mono text-[9px] text-white font-bold ml-1">
                  +{relevantFriends.length - 5}
                </span>
              )}
            </div>
          </motion.div>
        </div>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 + index * 0.15 }}
          className="font-mono text-sm font-bold text-ink w-8 text-right tabular-nums"
        >
          {votes}
        </motion.span>
      </div>
    </div>
  );
}

export function StepVoteDestination() {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center space-y-2">
        <span className="font-mono text-xs font-bold text-accent uppercase tracking-widest">
          STEP 02
        </span>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-ink uppercase tracking-tight">
          Vote Destination
        </h2>
        <p className="font-heading text-sm sm:text-base text-ink-light max-w-md mx-auto">
          Drop a pin. Let the group decide.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full max-w-md border-[3px] border-ink rounded-[16px] bg-white p-6 sm:p-8 shadow-bruted-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <span className="font-mono text-xs font-bold text-ink-muted uppercase tracking-wider">
            Destination Vote
          </span>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.0, duration: 0.4 }}
            className="flex items-center gap-1.5 bg-success/10 border border-success/30 rounded-full px-3 py-1"
          >
            <Check className="w-4 h-4 text-success" />
            <span className="font-heading text-xs font-bold text-success">Goa Leading</span>
          </motion.div>
        </div>

        <div className="space-y-4">
          {destinations.map((dest, i) => (
            <VoteBar key={dest.name} name={dest.name} votes={dest.votes} pct={dest.pct} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-6 pt-4 border-t border-ink/10 flex items-center gap-2 text-ink-muted"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="font-heading text-sm">8 friends voted</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
