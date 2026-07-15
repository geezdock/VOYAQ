"use client";

import { motion } from "framer-motion";
import { Tag, UtensilsCrossed, SearchX, RefreshCw } from "lucide-react";
import { useFetch } from "@/lib/hooks/useFetch";
import { fetchFood } from "@/lib/services/places";
import type { FoodItem } from "@/types/destination";

interface HubFoodProps {
  destinationName: string;
}

export function HubFood({ destinationName }: HubFoodProps) {
  const { data: items, loading, error, retry } = useFetch<FoodItem[]>(
    () => fetchFood(destinationName),
    [destinationName],
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="font-heading text-sm text-ink-muted">Finding restaurants nearby...</p>
      </div>
    );
  }

  if (error || !items || items.length === 0) {
    return (
      <div className="text-center py-16 space-y-4">
        <SearchX className="w-10 h-10 text-ink-muted/40 mx-auto" />
        <p className="font-heading text-sm text-ink-muted">
          {error ? "Failed to load restaurants" : "No restaurants found nearby"}
        </p>
        <p className="font-mono text-xs text-ink-muted/60">
          {error ? "Check your connection and try again" : "Try searching again or explore local eateries"}
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
      {items.map((item, i) => (
        <motion.div
          key={item.name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          className="border-2 border-ink/10 rounded-[12px] bg-surface-card p-4 sm:p-5 space-y-3"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-heading text-base font-bold text-ink">{item.name}</h3>
              <p className="font-mono text-xs text-ink-muted mt-0.5">{item.category}</p>
            </div>
            <span className="font-mono text-sm font-bold text-accent shrink-0">{item.priceRange}</span>
          </div>
          <p className="font-heading text-sm text-ink-muted leading-relaxed">{item.description}</p>
          <div className="flex flex-wrap items-center gap-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 font-mono text-[10px] text-ink-muted bg-ink/5 px-2 py-1 rounded-bruted"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
          {item.restaurant && (
            <div className="flex items-center gap-1.5 font-mono text-xs text-ink-muted bg-accent/5 px-3 py-2 rounded-bruted border border-accent/20">
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>{item.restaurant}</span>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}