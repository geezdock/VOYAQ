"use client";

import { motion } from "framer-motion";
import { Clock, Sun, IndianRupee } from "lucide-react";
import type { Attraction } from "@/types/destination";

interface HubPlacesProps {
  attractions: Attraction[];
}

const categoryEmoji: Record<string, string> = {
  Beach: "🏖️",
  Heritage: "🏛️",
  Nature: "🌿",
  Adventure: "🧗",
  Cultural: "🎭",
};

export function HubPlaces({ attractions }: HubPlacesProps) {
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
