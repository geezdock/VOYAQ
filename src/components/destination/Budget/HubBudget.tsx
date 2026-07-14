"use client";

import { motion } from "framer-motion";
import { IndianRupee, Info } from "lucide-react";
import { formatRupee } from "@/lib/trip-utils";
import type { BudgetInsight } from "@/types/destination";
import type { Squad } from "@/types/squad";

interface HubBudgetProps {
  insights: BudgetInsight[];
  squad: Squad;
}

const categoryColor: Record<string, string> = {
  Accommodation: "bg-[#D4836A]/20 border-[#D4836A]/40 text-[#D4836A]",
  Food: "bg-accent/20 border-accent/40 text-accent",
  Transport: "bg-[#C4A99A]/20 border-[#C4A99A]/40 text-[#C4A99A]",
  Activities: "bg-peach/20 border-peach/40 text-peach-dark",
  Miscellaneous: "bg-ink/10 border-ink/20 text-ink-muted",
  "Permits & Entry": "bg-blue-100/50 border-blue-300 text-blue-700",
};

export function HubBudget({ insights, squad }: HubBudgetProps) {
  const totalEstimated = insights.reduce((sum, b) => sum + b.estimatedCost, 0);
  const lockedBudget = squad.lockedBudget ?? totalEstimated;
  const remaining = lockedBudget - totalEstimated;
  const overBudget = remaining < 0;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-[3px] border-ink rounded-[16px] bg-white shadow-bruted-sm overflow-hidden"
      >
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-sm font-bold text-ink uppercase tracking-wider">Budget Breakdown</h2>
            <span className="font-mono text-xs text-ink-muted">Per person</span>
          </div>

          <div className="space-y-3">
            {insights.map((item, i) => {
              const pct = (item.estimatedCost / totalEstimated) * 100;
              return (
                <motion.div
                  key={item.category}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded-bruted border ${categoryColor[item.category] || "bg-ink/5 text-ink-muted border-ink/10"}`}>
                        {item.category}
                      </span>
                    </div>
                    <span className="font-mono text-sm font-bold text-ink">{formatRupee(item.estimatedCost)}</span>
                  </div>
                  <div className="w-full h-2 bg-ink/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-accent transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="font-mono text-[10px] text-ink-muted">{item.notes}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="border-t-2 border-ink/10 pt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-heading text-sm font-bold text-ink">Total Estimated</span>
              <span className="font-display text-xl font-extrabold text-ink">{formatRupee(totalEstimated)}</span>
            </div>
            {lockedBudget > 0 && (
              <>
                <div className="flex items-center justify-between">
                  <span className="font-heading text-sm text-ink-muted">Squad Budget</span>
                  <span className="font-mono text-sm font-bold text-ink">{formatRupee(lockedBudget)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-heading text-sm text-ink-muted">Remaining</span>
                  <span className={`font-mono text-sm font-bold ${overBudget ? "text-error" : "text-success"}`}>
                    {overBudget ? `-${formatRupee(Math.abs(remaining))}` : formatRupee(remaining)}
                  </span>
                </div>
                <div className="w-full h-3 bg-ink/5 rounded-full overflow-hidden border border-ink/10">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${overBudget ? "bg-error" : "bg-success"}`}
                    style={{ width: `${Math.min((totalEstimated / lockedBudget) * 100, 100)}%` }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
