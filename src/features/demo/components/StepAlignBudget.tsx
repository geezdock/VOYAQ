"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Sparkles, Check } from "lucide-react";

const budgetGroups = [
  { label: "₹3,500", friends: 2, pct: 25 },
  { label: "₹5,000", friends: 4, pct: 50 },
  { label: "₹6,500", friends: 2, pct: 25 },
];

export function StepAlignBudget() {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center space-y-2">
        <span className="font-mono text-xs font-bold text-accent uppercase tracking-widest">
          STEP 03
        </span>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-ink uppercase tracking-tight">
          Align Budget
        </h2>
        <p className="font-heading text-sm sm:text-base text-ink-light max-w-md mx-auto">
          AI detects conflicts and finds the sweet spot everyone agrees on.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full max-w-md space-y-4"
      >
        {/* Conflict card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="border-[3px] border-ink rounded-[16px] bg-white p-5 sm:p-6 shadow-bruted-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-xs font-bold text-ink-muted uppercase tracking-wider">
              Budget Preferences
            </span>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-1.5 bg-error/10 border border-error/30 rounded-full px-3 py-1"
            >
              <AlertTriangle className="w-4 h-4 text-error" />
              <span className="font-heading text-xs font-bold text-error">Budget Conflict</span>
            </motion.div>
          </div>

          <div className="space-y-3">
            <div className="flex h-10 rounded-[8px] overflow-hidden border-[2px] border-ink">
              {budgetGroups.map((group) => (
                <div
                  key={group.label}
                  style={{ width: `${group.pct}%` }}
                  className="flex items-center justify-center bg-gradient-to-b from-[#F0D5C9] to-[#E8C4B8] border-r last:border-r-0 border-ink"
                >
                  <span className="font-heading text-[11px] font-bold text-ink">{group.label}</span>
                </div>
              ))}
            </div>
            {budgetGroups.map((group) => (
              <div key={group.label} className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-ink-muted w-16">{group.label}</span>
                <div className="flex-1 h-2 rounded-[3px] bg-ink/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(group.friends / 8) * 100}%` }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="h-full rounded-[3px] bg-ink/30"
                  />
                </div>
                <span className="font-heading text-xs text-ink-light">
                  {group.friends} {group.friends === 1 ? "friend" : "friends"}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* AI card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="border-[3px] border-ink rounded-[16px] bg-white p-5 sm:p-6 shadow-bruted-lg"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-[8px] bg-accent border-[2px] border-ink flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-heading text-sm font-bold text-ink">AI Recommended Budget</p>
              <p className="font-mono text-[10px] text-ink-muted">Based on group preferences</p>
            </div>
          </div>

          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-display text-4xl font-extrabold text-ink">₹5,000</span>
            <span className="font-heading text-sm text-ink-muted">/person</span>
          </div>

          <div className="flex items-center gap-2 text-success mb-4">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
            <span className="font-heading text-sm font-bold">
              Save <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>₹650</motion.span> per person
            </span>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.0 }}
            className="flex items-center gap-2 bg-success/10 border border-success/30 rounded-[8px] px-4 py-2.5"
          >
            <Check className="w-5 h-5 text-success" />
            <span className="font-heading text-sm font-bold text-success">Budget Locked</span>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
