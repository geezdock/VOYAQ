"use client";

import { motion } from "framer-motion";
import { Sparkles, AlertTriangle, Lightbulb, Info } from "lucide-react";
import type { AISuggestion } from "@/types/destination";

interface HubAISuggestionsProps {
  suggestions: AISuggestion[];
}

const typeConfig = {
  weather: { icon: AlertTriangle, className: "border-accent/30 bg-accent/5" },
  budget: { icon: Lightbulb, className: "border-success/30 bg-success/5" },
  transport: { icon: Lightbulb, className: "border-peach-dark/30 bg-peach-dark/5" },
  food: { icon: Lightbulb, className: "border-[#D4836A]/30 bg-[#D4836A]/5" },
  general: { icon: Info, className: "border-ink/20 bg-surface-alt/50" },
};

const priorityLabel = {
  high: "Recommended",
  medium: "Tip",
  low: "FYI",
};

const priorityColor = {
  high: "text-accent bg-accent/10 border-accent/30",
  medium: "text-ink-muted bg-ink/5 border-ink/10",
  low: "text-ink-muted/60 bg-ink/5 border-ink/5",
};

export function HubAISuggestions({ suggestions }: HubAISuggestionsProps) {
  if (suggestions.length === 0) {
    return (
      <div className="text-center py-16 space-y-3">
        <Sparkles className="w-10 h-10 text-ink-muted/40 mx-auto" />
        <p className="font-heading text-sm text-ink-muted">No AI suggestions yet</p>
        <p className="font-mono text-xs text-ink-muted/60">Suggestions will appear as your trip data grows</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-accent" />
        <p className="font-heading text-sm font-bold text-ink uppercase tracking-wider">AI-Powered Suggestions</p>
      </div>
      {suggestions.map((suggestion, i) => {
        const cfg = typeConfig[suggestion.type];
        const Icon = cfg.icon;
        return (
          <motion.div
            key={`${suggestion.type}-${i}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`border-2 rounded-[12px] p-4 sm:p-5 space-y-3 ${cfg.className}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <Icon className="w-5 h-5 text-ink shrink-0" />
                <h3 className="font-heading text-sm font-bold text-ink capitalize">{suggestion.type}</h3>
              </div>
              <span className={`font-mono text-[10px] font-bold px-2 py-1 rounded-bruted border shrink-0 ${priorityColor[suggestion.priority]}`}>
                {priorityLabel[suggestion.priority]}
              </span>
            </div>
            <p className="font-heading text-sm text-ink-muted leading-relaxed">{suggestion.tip}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
