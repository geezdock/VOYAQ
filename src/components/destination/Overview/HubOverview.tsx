"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CloudSun,
  UtensilsCrossed,
  CalendarDays,
  ShieldAlert,
  Sparkles,
  Clock,
  Wallet,
  Info,
} from "lucide-react";
import { formatRupee, getCountdown } from "@/lib/trip-utils";
import { fetchOverview } from "@/lib/services/overview";
import { fetchLiveWeather } from "@/lib/services/weather";
import { fetchBudgetInsights } from "@/lib/services/budget";
import { fetchEvents } from "@/lib/services/events";
import { fetchSafety } from "@/lib/services/safety";
import type { Squad } from "@/types/squad";
import type { OverviewResult } from "@/lib/services/overview";

interface HubOverviewProps {
  squad: Squad;
  destinationName: string;
}

export function HubOverview({ squad, destinationName }: HubOverviewProps) {
  const [overview, setOverview] = useState<OverviewResult | null>(null);
  const [weather, setWeather] = useState<{ temp: number; condition: string } | null>(null);
  const [eventsCount, setEventsCount] = useState<number>(0);
  const [advisoriesCount, setAdvisoriesCount] = useState<number>(0);
  const [budgetTotal, setBudgetTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetchOverview(destinationName),
      fetchLiveWeather(destinationName),
      fetchEvents(destinationName),
      fetchSafety(destinationName),
      fetchBudgetInsights(destinationName),
    ]).then(([ov, w, ev, sf, bd]) => {
      if (cancelled) return;
      if (ov) setOverview(ov);
      if (w) setWeather({ temp: w.current.temp, condition: w.current.condition });
      if (ev) setEventsCount(ev.length);
      if (sf) setAdvisoriesCount(sf.advisories.length);
      if (bd) setBudgetTotal(bd.reduce((s, b) => s + b.estimatedCost, 0));
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [destinationName]);

  const countdown = squad.lockedDates ? getCountdown(squad.lockedDates.start) : null;
  const budgetRatio = squad.lockedBudget ? budgetTotal / squad.lockedBudget : 0;
  const budgetHealth = budgetRatio <= 1 ? "Healthy" : budgetRatio <= 1.2 ? "Tight" : "Over";
  const budgetColor =
    budgetHealth === "Healthy" ? "text-success" : budgetHealth === "Tight" ? "text-amber-500" : "text-error";
  const budgetBg =
    budgetHealth === "Healthy" ? "bg-success/10 border-success/30" : budgetHealth === "Tight" ? "bg-amber-400/10 border-amber-400/30" : "bg-error/10 border-error/30";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="font-heading text-sm text-ink-muted">Loading overview...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-[3px] border-ink rounded-[16px] bg-white shadow-bruted-sm overflow-hidden"
      >
        <div className="p-5 sm:p-6 space-y-4">
          <p className="font-heading text-sm text-ink-muted leading-relaxed">
            {overview?.description ?? `${destinationName} is a popular travel destination in India.`}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {overview?.quickFacts?.length ? (
              overview.quickFacts.map((fact) => (
                <div key={fact.label} className="border border-ink/10 rounded-[10px] p-3 bg-surface-alt/50">
                  <p className="font-mono text-[10px] text-ink-muted uppercase tracking-wider">{fact.label}</p>
                  <p className="font-heading text-sm font-bold text-ink mt-0.5">{fact.value}</p>
                </div>
              ))
            ) : (
              <>
                <div className="border border-ink/10 rounded-[10px] p-3 bg-surface-alt/50">
                  <p className="font-mono text-[10px] text-ink-muted uppercase tracking-wider">Language</p>
                  <p className="font-heading text-sm font-bold text-ink mt-0.5">{overview?.language ?? "Hindi, English"}</p>
                </div>
                <div className="border border-ink/10 rounded-[10px] p-3 bg-surface-alt/50">
                  <p className="font-mono text-[10px] text-ink-muted uppercase tracking-wider">Currency</p>
                  <p className="font-heading text-sm font-bold text-ink mt-0.5">{overview?.currency ?? "INR (₹)"}</p>
                </div>
                <div className="border border-ink/10 rounded-[10px] p-3 bg-surface-alt/50">
                  <p className="font-mono text-[10px] text-ink-muted uppercase tracking-wider">Time Zone</p>
                  <p className="font-heading text-sm font-bold text-ink mt-0.5">{overview?.timeZone ?? "IST (UTC+5:30)"}</p>
                </div>
                <div className="border border-ink/10 rounded-[10px] p-3 bg-surface-alt/50">
                  <p className="font-mono text-[10px] text-ink-muted uppercase tracking-wider">Best Time</p>
                  <p className="font-heading text-sm font-bold text-ink mt-0.5">{overview?.bestTimeToVisit ?? "Varies"}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="border-2 border-ink/10 rounded-[12px] p-4 bg-surface-alt/50 space-y-2"
        >
          <CloudSun className="w-5 h-5 text-accent" />
          <p className="font-mono text-[10px] text-ink-muted uppercase tracking-wider">Weather</p>
          <p className="font-display text-xl font-extrabold text-ink">
            {weather ? `${weather.temp}°C` : "—"}
          </p>
          <p className="font-heading text-xs text-ink-muted">{weather?.condition ?? "Unavailable"}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="border-2 border-ink/10 rounded-[12px] p-4 bg-surface-alt/50 space-y-2"
        >
          <Wallet className={`w-5 h-5 ${budgetColor}`} />
          <p className="font-mono text-[10px] text-ink-muted uppercase tracking-wider">Budget</p>
          <p className={`font-display text-xl font-extrabold ${budgetColor}`}>{budgetHealth}</p>
          <span className={`inline-block font-mono text-[10px] px-2 py-0.5 rounded-bruted border ${budgetBg}`}>
            {formatRupee(squad.lockedBudget ?? budgetTotal)}/person
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="border-2 border-ink/10 rounded-[12px] p-4 bg-surface-alt/50 space-y-2"
        >
          <CalendarDays className="w-5 h-5 text-peach-dark" />
          <p className="font-mono text-[10px] text-ink-muted uppercase tracking-wider">Events</p>
          <p className="font-display text-xl font-extrabold text-ink">{eventsCount}</p>
          <p className="font-heading text-xs text-ink-muted">
            {eventsCount === 0 ? "No upcoming" : eventsCount === 1 ? "Event this season" : "Events this season"}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="border-2 border-ink/10 rounded-[12px] p-4 bg-surface-alt/50 space-y-2"
        >
          <ShieldAlert className="w-5 h-5 text-ink-muted" />
          <p className="font-mono text-[10px] text-ink-muted uppercase tracking-wider">Advisories</p>
          <p className="font-display text-xl font-extrabold text-ink">{advisoriesCount}</p>
          <p className="font-heading text-xs text-ink-muted">
            {advisoriesCount === 0 ? "All clear" : "Active notices"}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="border-2 border-ink/10 rounded-[12px] p-4 bg-surface-alt/50 space-y-2"
        >
          <Info className="w-5 h-5 text-[#D4836A]" />
          <p className="font-mono text-[10px] text-ink-muted uppercase tracking-wider">Type</p>
          <p className="font-heading text-sm font-bold text-ink leading-tight capitalize">
            {budgetTotal > 2500 ? "Hill / Adventure" : budgetTotal > 2000 ? "Beach" : "City"}
          </p>
          <p className="font-heading text-xs text-ink-muted truncate">Destination</p>
        </motion.div>
      </div>

      {countdown && !countdown.expired && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="border-2 border-ink/10 rounded-[12px] p-4 bg-accent/5 flex items-center gap-3"
        >
          <Clock className="w-5 h-5 text-accent shrink-0" />
          <div>
            <p className="font-heading text-sm font-bold text-ink">
              Trip starts in {countdown.days} days
            </p>
            <p className="font-mono text-xs text-ink-muted">
              {countdown.days}d {countdown.hours}h {countdown.minutes}m to departure
            </p>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="border-2 border-ink/10 rounded-[12px] p-4 bg-surface-alt/50 space-y-2"
      >
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-ink-muted" />
          <p className="font-heading text-sm font-bold text-ink">Quick Info</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <p className="font-mono text-[10px] text-ink-muted uppercase">Best time</p>
            <p className="font-heading text-xs font-semibold text-ink">{overview?.bestTimeToVisit ?? "Varies"}</p>
          </div>
          <div>
            <p className="font-mono text-[10px] text-ink-muted uppercase">Language</p>
            <p className="font-heading text-xs font-semibold text-ink">{overview?.language ?? "Hindi, English"}</p>
          </div>
          <div>
            <p className="font-mono text-[10px] text-ink-muted uppercase">Currency</p>
            <p className="font-heading text-xs font-semibold text-ink">{overview?.currency ?? "INR (₹)"}</p>
          </div>
          <div>
            <p className="font-mono text-[10px] text-ink-muted uppercase">Time zone</p>
            <p className="font-heading text-xs font-semibold text-ink">{overview?.timeZone ?? "IST (UTC+5:30)"}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
