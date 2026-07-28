"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Home,
  UtensilsCrossed,
  Bus,
  Camera,
  PiggyBank,
  RefreshCw,
  BarChart3,
} from "lucide-react";
import { useEffect } from "react";
import { useFetch } from "@/shared/hooks/useFetch";
import { fetchBudgetAllocation } from "@/services/budget-allocator";
import { formatRupee } from "@/utils/currency";
import { trackEvent, VOYAQ_EVENTS } from "@/lib/analytics";
import type { AIBudgetAllocation } from "@/types/itinerary";

interface AIBudgetAllocatorProps {
  destinationName: string;
  totalBudget: number;
}

const categoryMeta: Record<string, { icon: typeof Home; label: string; color: string }> = {
  stay: { icon: Home, label: "Stay", color: "text-[#D4836A]" },
  food: { icon: UtensilsCrossed, label: "Food", color: "text-accent" },
  transport: { icon: Bus, label: "Transport", color: "text-[#C4A99A]" },
  activities: { icon: Camera, label: "Activities", color: "text-peach-dark" },
  buffer: { icon: PiggyBank, label: "Buffer", color: "text-ink-muted" },
};

export function AIBudgetAllocator({ destinationName, totalBudget }: AIBudgetAllocatorProps) {
  const { data: allocation, loading, error, retry } = useFetch<AIBudgetAllocation>(
    () => fetchBudgetAllocation(destinationName, totalBudget),
    [destinationName, totalBudget],
  );

  useEffect(() => {
    if (allocation) {
      trackEvent(VOYAQ_EVENTS.BUDGET_ALLOCATION_VIEWED, { destination: destinationName, budget: totalBudget });
    }
  }, [allocation, destinationName, totalBudget]);

  if (loading) {
    return (
      <div className="border-2 border-ink/10 rounded-[12px] p-5 animate-pulse space-y-4">
        <div className="h-5 bg-ink/10 rounded w-1/3" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between">
              <div className="h-4 bg-ink/10 rounded w-20" />
              <div className="h-4 bg-ink/10 rounded w-16" />
            </div>
            <div className="h-3 bg-ink/5 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (error || !allocation) {
    return (
      <div className="text-center py-12 space-y-4">
        <BarChart3 className="w-10 h-10 text-ink-muted/40 mx-auto" />
        <p className="font-heading text-sm text-ink-muted">Could not load budget allocation</p>
        {error && (
          <button
            onClick={retry}
            className="inline-flex items-center gap-1.5 font-heading text-sm font-semibold text-accent hover:text-accent/80 transition-colors min-h-[44px] px-4"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        )}
      </div>
    );
  }

  const categories = [
    { key: "stay", amount: allocation.stay, pct: allocation.stayPct },
    { key: "food", amount: allocation.food, pct: allocation.foodPct },
    { key: "transport", amount: allocation.transport, pct: allocation.transportPct },
    { key: "activities", amount: allocation.activities, pct: allocation.activitiesPct },
    { key: "buffer", amount: allocation.buffer, pct: allocation.bufferPct },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-2 border-ink/10 rounded-[12px] bg-white overflow-hidden"
    >
      <div className="p-5 sm:p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          <h2 className="font-heading text-sm font-bold text-ink uppercase tracking-wider">
            AI Budget Allocator
          </h2>
        </div>

        {/* Donut-like stacked bar */}
        <div className="w-full h-3 bg-ink/5 rounded-full overflow-hidden flex">
          {categories.map((cat) => {
            const meta = categoryMeta[cat.key];
            return (
              <div
                key={cat.key}
                className="h-full first:rounded-l-full last:rounded-r-full"
                style={{
                  width: `${cat.pct}%`,
                  backgroundColor: `var(--color-${cat.key === "stay" ? "peach" : cat.key === "food" ? "accent" : cat.key === "transport" ? "peach-dark" : cat.key === "activities" ? "success" : "ink-muted"})`,
                }}
                title={`${meta?.label || cat.key}: ${cat.pct}%`}
              />
            );
          })}
        </div>

        {/* Category breakdown */}
        <div className="space-y-3">
          {categories.map((cat, i) => {
            const meta = categoryMeta[cat.key] || { icon: BarChart3, label: cat.key, color: "text-ink" };
            const Icon = meta.icon;
            return (
              <motion.div
                key={cat.key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3"
              >
                <Icon className={`w-4 h-4 ${meta.color}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-sm font-semibold text-ink">{meta.label}</span>
                    <span className="font-mono text-xs font-bold text-ink">{formatRupee(cat.amount)}</span>
                  </div>
                  <div className="w-full h-1.5 bg-ink/5 rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${cat.pct}%`,
                        backgroundColor: `var(--color-${cat.key === "stay" ? "peach" : cat.key === "food" ? "accent" : cat.key === "transport" ? "peach-dark" : cat.key === "activities" ? "success" : "ink-muted"})`,
                      }}
                    />
                  </div>
                </div>
                <span className="font-mono text-[11px] font-bold text-ink-muted w-10 text-right">{cat.pct}%</span>
              </motion.div>
            );
          })}
        </div>

        {/* Total */}
        <div className="border-t border-ink/10 pt-3 flex items-center justify-between">
          <span className="font-heading text-sm font-bold text-ink">Total Budget</span>
          <span className="font-display text-xl font-extrabold text-ink">{formatRupee(allocation.total)}</span>
        </div>

        {/* Reasoning */}
        {allocation.reasoning && (
          <div className="bg-accent/5 border border-accent/20 rounded-[8px] p-3">
            <p className="font-mono text-[11px] text-ink-muted leading-relaxed">{allocation.reasoning}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
