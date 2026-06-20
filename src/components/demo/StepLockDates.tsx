"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useMemo } from "react";

interface DateSlot {
  date: number;
  day: string;
  available: number;
}

function generateDateSlots(): DateSlot[] {
  const avails = [3, 6, 7, 5, 2, 0, 4];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const baseDate = 12;
  return avails.map((count, i) => ({
    date: baseDate + i,
    day: days[i],
    available: count,
  }));
}

export function StepLockDates() {
  const slots = useMemo(() => generateDateSlots(), []);
  const selectedRange = [2, 3, 4];

  function getAvailColor(count: number) {
    if (count === 0) return "text-error";
    if (count <= 2) return "text-ink-muted";
    if (count <= 4) return "text-ink-light";
    return "text-success";
  }

  function getDotColor(count: number) {
    if (count === 0) return "bg-error";
    if (count <= 2) return "bg-ink-muted";
    if (count <= 4) return "bg-ink-light";
    return "bg-success";
  }

  return (
    <div className="flex flex-col items-center gap-6 sm:gap-8">
      <div className="text-center space-y-2">
        <span className="font-mono text-xs font-bold text-accent uppercase tracking-widest">
          STEP 04
        </span>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-ink uppercase tracking-tight">
          Lock Dates
        </h2>
        <p className="font-heading text-sm sm:text-base text-ink-light max-w-md mx-auto">
          See everyone&apos;s availability at a glance. Book the best overlap.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full max-w-lg border-[3px] border-ink rounded-[16px] bg-white p-4 sm:p-6 shadow-bruted-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-xs font-bold text-ink-muted uppercase tracking-wider">
            August 2026
          </span>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center gap-1.5 bg-success/10 border border-success/30 rounded-full px-3 py-1"
          >
            <Check className="w-4 h-4 text-success" />
            <span className="font-heading text-xs font-bold text-success">Aug 15–17 Locked</span>
          </motion.div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {slots.map((slot, i) => {
            const isSelected = selectedRange.includes(i);
            return (
              <motion.div
                key={slot.date}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
                className={`relative rounded-[10px] border-[2px] p-2 sm:p-3 text-center transition-colors ${
                  isSelected
                    ? "border-accent bg-accent/10"
                    : "border-ink/10 bg-white hover:border-ink/20"
                }`}
              >
                {isSelected && (
                  <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                  </div>
                )}

                <span className={`font-mono text-[9px] sm:text-[10px] font-bold uppercase leading-none ${
                  isSelected ? "text-accent" : "text-ink-muted"
                }`}>
                  {slot.day}
                </span>

                <p className={`font-display text-lg sm:text-xl font-extrabold leading-none mt-1.5 ${
                  isSelected ? "text-accent" : "text-ink"
                }`}>
                  {slot.date}
                </p>

                <div className="flex items-center justify-center gap-1 mt-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${getDotColor(slot.available)}`} />
                  <span className={`font-mono text-[8px] sm:text-[9px] font-bold leading-none ${getAvailColor(slot.available)}`}>
                    {slot.available === 0 ? "none" : `${slot.available}`}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-4 flex items-center justify-center gap-3 text-ink-muted">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-success" />
            <span className="font-mono text-[9px] font-bold">4+</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-ink-light" />
            <span className="font-mono text-[9px] font-bold">2-4</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-ink-muted" />
            <span className="font-mono text-[9px] font-bold">1-2</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-error" />
            <span className="font-mono text-[9px] font-bold">0</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-4 pt-3 border-t border-ink/10 flex items-center gap-2 text-ink-muted"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="font-heading text-sm">Best overlap: Aug 15–17 (7/8 available)</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
