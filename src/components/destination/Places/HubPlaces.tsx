"use client";

import { motion } from "framer-motion";
import { Clock, Sun, IndianRupee, SearchX, RefreshCw } from "lucide-react";
import { useFetch } from "@/lib/hooks/useFetch";
import { fetchAttractions } from "@/lib/services/places";
import type { Attraction } from "@/types/destination";

interface HubPlacesProps {
  destinationName: string;
}

const categoryEmoji: Record<string, string> = {
  Beach: "🏖️",
  Heritage: "🏛️",
  Nature: "🌿",
  Adventure: "🧗",
  Cultural: "🎭",
};

export function HubPlaces({ destinationName }: HubPlacesProps) {
  const { data: attractions, loading, error, retry } = useFetch<Attraction[]>(
    () => fetchAttractions(destinationName),
    [destinationName],
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="font-heading text-sm text-ink-muted">Discovering attractions nearby...</p>
      </div>
    );
  }

  if (error || !attractions || attractions.length === 0) {
    return (
      <div className="text-center py-16 space-y-4">
        <SearchX className="w-10 h-10 text-ink-muted/40 mx-auto" />
        <p className="font-heading text-sm text-ink-muted">
          {error ? "Failed to load attractions" : "No attractions found nearby"}
        </p>
        <p className="font-mono text-xs text-ink-muted/60">
          {error ? "Check your connection and try again" : "Try searching again or explore local guides"}
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

  const grouped = attractions.reduce(
    (acc, a) => {
      (acc[a.category] ??= []).push(a);
      return acc;
    },
    {} as Record<string, Attraction[]>,
  );

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{categoryEmoji[category] || "📍"}</span>
            <h2 className="font-heading text-sm font-bold text-ink uppercase tracking-wider">{category}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {items.map((attraction, i) => (
              <motion.div
                key={attraction.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="border-2 border-ink/10 rounded-[12px] bg-surface-card p-4 space-y-3"
              >
                <h3 className="font-heading text-sm font-bold text-ink">{attraction.name}</h3>
                <p className="font-heading text-xs text-ink-muted leading-relaxed">{attraction.description}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  {attraction.approximateCost > 0 ? (
                    <span className="inline-flex items-center gap-1 font-mono text-ink-muted">
                      <IndianRupee className="w-3 h-3" />
                      {attraction.approximateCost}
                    </span>
                  ) : (
                    <span className="font-mono text-success font-bold">Free</span>
                  )}
                  <span className="inline-flex items-center gap-1 font-mono text-ink-muted">
                    <Clock className="w-3 h-3" />
                    {attraction.duration}
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono text-ink-muted">
                    <Sun className="w-3 h-3" />
                    {attraction.bestTime}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}