"use client";

import { AlertTriangle, Info, OctagonAlert } from "lucide-react";
import { GOV_ADVISORIES } from "@/constants/advisories";
import type { GovAdvisory } from "@/types/intel";

interface GovAdvisoriesProps {
  state: string;
}

const severityConfig = {
  info: { icon: Info, className: "border-blue-200 bg-blue-50 text-blue-800", dot: "bg-blue-500" },
  advisory: { icon: AlertTriangle, className: "border-amber-200 bg-amber-50 text-amber-800", dot: "bg-amber-500" },
  warning: { icon: OctagonAlert, className: "border-red-200 bg-red-50 text-red-800", dot: "bg-red-500" },
};

export function GovAdvisories({ state }: GovAdvisoriesProps) {
  const advisories = GOV_ADVISORIES.filter(
    (a) => a.state.toLowerCase() === state.toLowerCase(),
  );

  if (advisories.length === 0) return null;

  return (
    <div className="space-y-3">
      {advisories.map((advisory, i) => (
        <GovAdvisoryCard key={i} advisory={advisory} />
      ))}
    </div>
  );
}

function GovAdvisoryCard({ advisory }: { advisory: GovAdvisory }) {
  const cfg = severityConfig[advisory.severity];
  const Icon = cfg.icon;

  return (
    <div className={`rounded-bruted border-2 p-4 ${cfg.className}`}>
      <div className="mb-2 flex items-start gap-3">
        <Icon className="mt-0.5 h-5 w-5 shrink-0" />
        <div className="min-w-0">
          <h3 className="font-bold leading-tight">{advisory.title}</h3>
          <div className="mt-1 flex items-center gap-2 text-xs opacity-70">
            <span>{advisory.source}</span>
            <span>·</span>
            <span>{advisory.updatedAt}</span>
          </div>
        </div>
      </div>
      <p className="text-sm leading-relaxed">{advisory.description}</p>
    </div>
  );
}
