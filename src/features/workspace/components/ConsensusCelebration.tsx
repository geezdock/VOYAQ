"use client";

import { motion } from "framer-motion";
import { Sparkles, MapPin, ArrowRight, CheckCircle2 } from "lucide-react";
import type { Squad } from "@/types/squad";

interface ConsensusCelebrationProps {
  squad: Squad;
  onExploreHub: () => void;
  onDismiss: () => void;
}

export function ConsensusCelebration({ squad, onExploreHub, onDismiss }: ConsensusCelebrationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm"
    >
      <div className="brut-card max-w-lg w-full bg-surface text-ink space-y-6 relative overflow-hidden border-[3px] border-ink shadow-[8px_8px_0px_#2D2A24]">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Sparkles className="w-32 h-32 text-accent" />
        </div>

        <div className="space-y-2 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-success/10 border-2 border-success text-success mb-2">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="font-mono text-xs uppercase tracking-wider text-accent font-bold block">
            Consensus Achieved
          </span>
          <h2 className="font-display text-3xl font-extrabold text-ink leading-tight">
            TRIP READY! 🚀
          </h2>
          <p className="font-heading text-sm text-ink-muted">
            The squad has locked all 3 key decisions for <strong>{squad.name}</strong>.
          </p>
        </div>

        <div className="bg-surface-card border-2 border-ink/10 rounded-bruted p-4 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-ink/5 pb-2">
            <span className="text-ink-muted">Destination:</span>
            <span className="font-bold text-accent flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {squad.lockedDestination}
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-ink/5 pb-2">
            <span className="text-ink-muted">Target Budget:</span>
            <span className="font-bold text-ink">
              ₹{squad.lockedBudget?.toLocaleString("en-IN")}/person
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-ink-muted">Dates:</span>
            <span className="font-bold text-ink">
              {squad.lockedDates ? `${squad.lockedDates.start} → ${squad.lockedDates.end}` : "Set"}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={onExploreHub}
            className="brut-btn flex-1 flex items-center justify-center gap-2 !bg-accent !text-white text-base py-3"
          >
            <span>Explore Destination Hub</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onDismiss}
            className="px-4 py-3 font-heading text-sm font-semibold text-ink-muted hover:text-ink transition-colors text-center"
          >
            Stay in Workspace
          </button>
        </div>
      </div>
    </motion.div>
  );
}
