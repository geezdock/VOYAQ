"use client";

import { motion } from "framer-motion";
import { Plane, Train, Car, Bike, IndianRupee, Timer, ArrowRight, SearchX, RefreshCw } from "lucide-react";
import { useFetch } from "@/lib/hooks/useFetch";
import { fetchTransport } from "@/lib/services/transport";
import type { TransportOption } from "@/types/destination";

interface HubTransportProps {
  destinationName: string;
}

const modeIcon: Record<string, typeof Plane> = {
  Flight: Plane,
  Train: Train,
  Taxi: Car,
  "Scooter Rental": Bike,
  Bus: Car,
};

export function HubTransport({ destinationName }: HubTransportProps) {
  const { data: options, loading, error, retry } = useFetch<TransportOption[]>(
    () => fetchTransport(destinationName),
    [destinationName],
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="font-heading text-sm text-ink-muted">Loading transport options...</p>
      </div>
    );
  }

  if (error || !options || options.length === 0) {
    return (
      <div className="text-center py-16 space-y-4">
        <SearchX className="w-10 h-10 text-ink-muted/40 mx-auto" />
        <p className="font-heading text-sm text-ink-muted">
          {error ? "Failed to load transport options" : "No transport options found"}
        </p>
        <p className="font-mono text-xs text-ink-muted/60">
          {error ? "Check your connection and try again" : "Try searching again or check local guides"}
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
    <div className="space-y-4">
      {options.map((option, i) => {
        const Icon = modeIcon[option.mode] || Car;
        return (
          <motion.div
            key={`${option.mode}-${option.from}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="border-2 border-ink/10 rounded-[12px] bg-surface-card p-4 sm:p-5 space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-[10px] bg-ink/5 border border-ink/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-ink" />
                </div>
                <div>
                  <h3 className="font-heading text-sm font-bold text-ink">{option.mode}</h3>
                  <p className="font-mono text-xs text-ink-muted">{option.details}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-mono text-sm font-bold text-accent">
                  ₹{option.cost.toLocaleString("en-IN")}
                </p>
                {option.mode !== "Taxi" && option.mode !== "Scooter Rental" && (
                  <p className="font-mono text-[10px] text-ink-muted">{option.duration}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs text-ink-muted bg-surface-alt/50 px-3 py-2 rounded-bruted">
              <span className="font-semibold text-ink">{option.from}</span>
              <ArrowRight className="w-3 h-3" />
              <span className="font-semibold text-ink">{option.to}</span>
              {option.mode === "Scooter Rental" && (
                <span className="ml-auto flex items-center gap-1">
                  <Timer className="w-3 h-3" />
                  {option.duration}
                </span>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}