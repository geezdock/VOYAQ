"use client";

import { motion } from "framer-motion";
import { Tag, UtensilsCrossed, MapPin } from "lucide-react";
import type { FoodItem } from "@/types/destination";

interface HubFoodProps {
  items: FoodItem[];
}

export function HubFood({ items }: HubFoodProps) {
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
