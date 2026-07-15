"use client";

import { motion } from "framer-motion";
import { Sparkles, Umbrella, Wallet, Music, Sun, MapPin } from "lucide-react";

const tags = [
  { label: "Beach", icon: Umbrella },
  { label: "Budget Friendly", icon: Wallet },
  { label: "Nightlife", icon: Music },
  { label: "Sunset Spots", icon: Sun },
  { label: "Road Trip Stops", icon: MapPin },
];

export function StepGenerateItinerary() {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center space-y-2">
        <span className="font-mono text-xs font-bold text-accent uppercase tracking-widest">
          STEP 05
        </span>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-ink uppercase tracking-tight">
          Generate Itinerary
        </h2>
        <p className="font-heading text-sm sm:text-base text-ink-light max-w-md mx-auto">
          AI builds a complete trip plan tailored to your group.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full max-w-md border-[3px] border-ink rounded-[16px] bg-white p-5 sm:p-6 shadow-bruted-lg"
      >
        {/* AI generation progress */}
        <div className="flex items-center gap-3 mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 rounded-[8px] bg-accent border-[2px] border-ink flex items-center justify-center shrink-0"
          >
            <Sparkles className="w-5 h-5 text-white" />
          </motion.div>
          <div className="flex-1">
            <p className="font-heading text-sm font-bold text-ink">Generating itinerary</p>
            <div className="w-full h-2 rounded-[3px] bg-ink/10 overflow-hidden mt-1.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
                className="h-full rounded-[3px] bg-gradient-to-r from-accent to-accent-dark"
              />
            </div>
          </div>
        </div>

        {/* Suggestion tags */}
        <div className="mb-6">
          <p className="font-mono text-[10px] font-bold text-ink-muted uppercase tracking-wider mb-2">
            AI Suggestions
          </p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <motion.div
                key={tag.label}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.06, duration: 0.3 }}
                className="flex items-center gap-1.5 border-[2px] border-ink rounded-full px-3 py-1.5 bg-[#F7F4EF]"
              >
                <tag.icon className="w-3.5 h-3.5 text-accent" />
                <span className="font-mono text-[11px] font-bold text-ink leading-none">{tag.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Summary card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="border-[2px] border-ink rounded-[12px] bg-[#F7F4EF] p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display text-xl font-extrabold text-ink">3 Days</p>
              <p className="font-heading text-sm text-ink-light">
                <span>12 Stops</span>
                <span className="mx-1.5 text-clay">·</span>
                <span>₹4,850/person</span>
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 }}
              className="flex items-center gap-1.5 bg-success/10 border border-success/30 rounded-full px-3 py-1"
            >
              <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-heading text-xs font-bold text-success">Itinerary Ready</span>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
