"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  CloudRain,
  CalendarDays,
  Info,
  RefreshCw,
  Megaphone,
} from "lucide-react";
import { useFetch } from "@/shared/hooks/useFetch";
import { fetchEventDrivenUpdates } from "@/services/event-updates";

interface EventDrivenUpdatesProps {
  destinationName: string;
  startDate?: string;
  endDate?: string;
}

const severityConfig: Record<string, { icon: typeof AlertTriangle; className: string }> = {
  critical: { icon: AlertTriangle, className: "bg-error/10 border-error/30 text-error" },
  warning: { icon: CloudRain, className: "bg-amber-50 border-amber-300 text-amber-700" },
  info: { icon: Info, className: "bg-blue-50 border-blue-200 text-blue-700" },
};

const typeIcon: Record<string, typeof AlertTriangle> = {
  weather_alert: CloudRain,
  festival_alert: CalendarDays,
  advisory: Megaphone,
};

export function EventDrivenUpdates({ destinationName, startDate, endDate }: EventDrivenUpdatesProps) {
  const { data: result, loading, error, retry } = useFetch(
    () => fetchEventDrivenUpdates(destinationName, startDate, endDate),
    [destinationName, startDate, endDate],
  );

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="border-2 border-ink/10 rounded-[12px] p-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-ink/10" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-ink/10 rounded w-2/3" />
                <div className="h-3 bg-ink/5 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 space-y-4">
        <AlertTriangle className="w-10 h-10 text-ink-muted/40 mx-auto" />
        <p className="font-heading text-sm text-ink-muted">Could not load live updates</p>
        <button
          onClick={retry}
          className="inline-flex items-center gap-1.5 font-heading text-sm font-semibold text-accent hover:text-accent/80 transition-colors min-h-[44px] px-4"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  const updates = result?.updates ?? [];

  if (updates.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <CloudRain className="w-10 h-10 text-success/40 mx-auto" />
        <p className="font-heading text-sm font-semibold text-success">All Clear</p>
        <p className="font-mono text-xs text-ink-muted/60">No weather or event alerts for {destinationName}</p>
        <button
          onClick={retry}
          className="inline-flex items-center gap-1.5 font-heading text-sm font-semibold text-accent hover:text-accent/80 transition-colors min-h-[44px] px-4"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Megaphone className="w-5 h-5 text-accent" />
        <h2 className="font-heading text-sm font-bold text-ink uppercase tracking-wider">Live Environment Alerts</h2>
      </div>

      {updates.map((update, i) => {
        const sev = severityConfig[update.severity] || severityConfig.info;
        const Icon = typeIcon[update.type] || sev.icon;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`border-2 rounded-[12px] p-4 sm:p-5 space-y-3 ${sev.className}`}
          >
            <div className="flex items-start gap-3">
              <Icon className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-heading text-sm font-bold">{update.title}</h3>
                  <span className={`font-mono text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${sev.className}`}>
                    {update.severity}
                  </span>
                </div>
                <p className="font-mono text-xs mt-1 opacity-80">{update.description}</p>
              </div>
            </div>

            <div className="border-t border-current/10 pt-3 space-y-2">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-wider opacity-60">Original Plan</p>
                <p className="font-mono text-xs mt-0.5 opacity-80">{update.originalPlan}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-accent">AI Adjustment</p>
                <p className="font-heading text-sm font-semibold mt-0.5">{update.adjustedSuggestion}</p>
              </div>
            </div>

            {update.affectedDay && (
              <p className="font-mono text-[10px] opacity-60">Affects day {update.affectedDay} of your trip</p>
            )}
          </motion.div>
        );
      })}

      <button
        onClick={retry}
        className="w-full flex items-center justify-center gap-1.5 font-mono text-xs text-ink-muted hover:text-ink transition-colors min-h-[44px]"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        Refresh Alerts
      </button>
    </div>
  );
}
