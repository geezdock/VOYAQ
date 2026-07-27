"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  Sun,
  UtensilsCrossed,
  Bus,
  MapPin,
  Camera,
  Moon,
  Luggage,
  ChevronDown,
  ChevronUp,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  Info,
} from "lucide-react";
import { useFetch } from "@/shared/hooks/useFetch";
import { fetchItinerary } from "@/services/itinerary";
import { formatRupee } from "@/utils/currency";
import type { ItineraryResponse, ItineraryDay } from "@/types/itinerary";

interface HubItineraryProps {
  destinationName: string;
  startDate: string;
  endDate: string;
  budget: number;
}

const categoryConfig: Record<string, { icon: typeof Sun; label: string; color: string }> = {
  food: { icon: UtensilsCrossed, label: "Food", color: "bg-accent/10 text-accent" },
  transport: { icon: Bus, label: "Transport", color: "bg-[#C4A99A]/20 text-[#C4A99A]" },
  activity: { icon: Camera, label: "Activity", color: "bg-peach/20 text-peach-dark" },
  sightseeing: { icon: MapPin, label: "Sightseeing", color: "bg-blue-100/50 text-blue-700" },
  rest: { icon: Moon, label: "Rest", color: "bg-ink/10 text-ink-muted" },
  travel: { icon: Luggage, label: "Travel", color: "bg-[#D4836A]/20 text-[#D4836A]" },
};

function DayCard({ day, isExpanded, onToggle }: { day: ItineraryDay; isExpanded: boolean; onToggle: () => void }) {
  const totalSpent = day.entries.reduce((s, e) => s + e.estimatedCost, 0);
  const overBudget = totalSpent > day.dailyBudget;

  return (
    <motion.div
      layout
      className="border-2 border-ink/10 rounded-[12px] bg-white overflow-hidden"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-ink/[0.02] transition-colors min-h-[56px]"
        aria-expanded={isExpanded}
        aria-label={`Day ${day.day}: ${day.title}`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
            <span className="font-display text-sm font-extrabold text-accent">{day.day}</span>
          </div>
          <div className="text-left min-w-0">
            <h3 className="font-heading text-sm font-bold text-ink truncate">{day.title}</h3>
            <p className="font-mono text-[10px] text-ink-muted">{day.date}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className={`font-mono text-xs font-bold ${overBudget ? "text-error" : "text-success"}`}>
            {formatRupee(totalSpent)}
          </span>
          {isExpanded ? <ChevronUp className="w-4 h-4 text-ink-muted" /> : <ChevronDown className="w-4 h-4 text-ink-muted" />}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-3 border-t border-ink/5">
              {/* Timeline entries */}
              <div className="relative pl-6 space-y-3 pt-3">
                {day.entries.map((entry, i) => {
                  const cfg = categoryConfig[entry.category] || { icon: Info, label: entry.category, color: "bg-ink/5 text-ink-muted" };
                  const Icon = cfg.icon;
                  return (
                    <div key={i} className="relative">
                      {i < day.entries.length - 1 && (
                        <div className="absolute left-0 top-5 bottom-0 w-px bg-ink/10" />
                      )}
                      <div className="flex items-start gap-3">
                        <div className={`absolute -left-6 w-4 h-4 rounded-full flex items-center justify-center ${cfg.color} border border-white`}>
                          <Icon className="w-2.5 h-2.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-[11px] font-bold text-ink shrink-0">{entry.time}</span>
                            <span className="font-mono text-[10px] text-ink-muted shrink-0">{formatRupee(entry.estimatedCost)}</span>
                          </div>
                          <p className="font-heading text-sm font-semibold text-ink mt-0.5">{entry.activity}</p>
                          <p className="font-mono text-[11px] text-ink-muted mt-0.5">{entry.description}</p>
                          {entry.location && (
                            <p className="font-mono text-[10px] text-accent mt-0.5">{entry.location}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Daily tips */}
              {day.tips.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-[8px] p-3 space-y-1">
                  <p className="font-mono text-[10px] font-bold text-amber-700 uppercase tracking-wider">Tips</p>
                  {day.tips.map((tip, i) => (
                    <p key={i} className="font-mono text-[11px] text-amber-800 flex items-start gap-1.5">
                      <span className="text-amber-500 mt-0.5">•</span>
                      {tip}
                    </p>
                  ))}
                </div>
              )}

              {/* Daily budget bar */}
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-ink-muted shrink-0">Budget</span>
                <div className="flex-1 h-2 bg-ink/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${overBudget ? "bg-error" : "bg-success"}`}
                    style={{ width: `${Math.min((totalSpent / day.dailyBudget) * 100, 100)}%` }}
                  />
                </div>
                <span className="font-mono text-[10px] font-bold text-ink-muted shrink-0">
                  {formatRupee(totalSpent)} / {formatRupee(day.dailyBudget)}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function HubItinerary({ destinationName, startDate, endDate, budget }: HubItineraryProps) {
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set());
  const { data: itinerary, loading, error, retry } = useFetch<ItineraryResponse>(
    () => fetchItinerary({ destination: destinationName, startDate, endDate, budget }),
    [destinationName, startDate, endDate, budget],
  );

  function toggleDay(day: number) {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border-2 border-ink/10 rounded-[12px] p-5 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-ink/10" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-ink/10 rounded w-1/3" />
                <div className="h-3 bg-ink/5 rounded w-1/4" />
              </div>
              <div className="h-4 bg-ink/10 rounded w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !itinerary || !itinerary.days?.length) {
    return (
      <div className="text-center py-16 space-y-4">
        <CalendarDays className="w-10 h-10 text-ink-muted/40 mx-auto" />
        <p className="font-heading text-sm text-ink-muted">
          {error ? "Failed to generate itinerary" : "No itinerary available"}
        </p>
        <p className="font-mono text-xs text-ink-muted/60">
          {error ? "Check your connection and try again" : "Lock destination and dates to generate an itinerary"}
        </p>
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

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          <h2 className="font-heading text-sm font-bold text-ink uppercase tracking-wider">
            AI Itinerary — {destinationName}
          </h2>
        </div>
        <span className="font-mono text-[10px] text-ink-muted">
          Total: {formatRupee(itinerary.totalEstimatedCost)}
        </span>
      </div>

      {/* Budget indicator bar */}
      <div className="flex items-center gap-3 p-3 bg-surface-card border border-ink/10 rounded-[8px]">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[10px] text-ink-muted">Budget utilized</span>
            <span className="font-mono text-[10px] font-bold text-ink">
              {Math.round((itinerary.totalEstimatedCost / itinerary.totalBudget) * 100)}%
            </span>
          </div>
          <div className="w-full h-2 bg-ink/5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                itinerary.totalEstimatedCost > itinerary.totalBudget ? "bg-error" : "bg-accent"
              }`}
              style={{ width: `${Math.min((itinerary.totalEstimatedCost / itinerary.totalBudget) * 100, 100)}%` }}
            />
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="font-mono text-xs font-bold text-ink">{formatRupee(itinerary.totalEstimatedCost)}</p>
          <p className="font-mono text-[10px] text-ink-muted">of {formatRupee(itinerary.totalBudget)}</p>
        </div>
      </div>

      {/* Day cards */}
      <div className="space-y-2">
        {itinerary.days.map((day) => (
          <DayCard
            key={day.day}
            day={day}
            isExpanded={expandedDays.has(day.day)}
            onToggle={() => toggleDay(day.day)}
          />
        ))}
      </div>

      {itinerary.generatedAt && (
        <p className="font-mono text-[9px] text-ink-muted/40 text-center">
          Generated {new Date(itinerary.generatedAt).toLocaleString("en-IN")}
        </p>
      )}
    </div>
  );
}
