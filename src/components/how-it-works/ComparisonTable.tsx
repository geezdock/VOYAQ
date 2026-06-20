"use client";

import { Check, X, AlertTriangle } from "lucide-react";

const rows = [
  { feature: "Destination Voting", whatsapp: false, sheets: false, splitwise: false, voyaq: true },
  { feature: "Budget Alignment", whatsapp: false, sheets: "warn", splitwise: false, voyaq: true },
  { feature: "Date Coordination", whatsapp: false, sheets: "warn", splitwise: false, voyaq: true },
  { feature: "AI Itinerary", whatsapp: false, sheets: false, splitwise: false, voyaq: true },
  { feature: "Everything in One Place", whatsapp: false, sheets: false, splitwise: false, voyaq: true },
];

function CellIcon({ value }: { value: boolean | string }) {
  if (value === true) {
    return (
      <div className="w-6 h-6 rounded-full bg-success/10 border border-success/30 flex items-center justify-center">
        <Check className="w-3.5 h-3.5 text-success" />
      </div>
    );
  }
  if (value === "warn") {
    return (
      <div className="w-6 h-6 rounded-full bg-warning/10 border border-warning/30 flex items-center justify-center">
        <AlertTriangle className="w-3.5 h-3.5 text-warning" />
      </div>
    );
  }
  return (
    <div className="w-6 h-6 rounded-full bg-ink/5 border border-ink/10 flex items-center justify-center">
      <X className="w-3.5 h-3.5 text-ink-muted" />
    </div>
  );
}

export function ComparisonTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b-[2px] border-ink">
            <th className="font-heading text-sm font-bold text-ink py-3 pr-4">Planning Method</th>
            <th className="font-heading text-sm font-bold text-ink-muted py-3 px-3 text-center">WhatsApp</th>
            <th className="font-heading text-sm font-bold text-ink-muted py-3 px-3 text-center">Sheets</th>
            <th className="font-heading text-sm font-bold text-ink-muted py-3 px-3 text-center">Splitwise</th>
            <th className="font-heading text-sm font-bold text-accent py-3 pl-3 text-center">VOYAQ</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.feature} className="border-b border-ink/10 last:border-0">
              <td className="font-heading text-sm font-semibold text-ink py-3 pr-4">{row.feature}</td>
              <td className="py-3 px-3 text-center"><CellIcon value={row.whatsapp} /></td>
              <td className="py-3 px-3 text-center"><CellIcon value={row.sheets} /></td>
              <td className="py-3 px-3 text-center"><CellIcon value={row.splitwise} /></td>
              <td className="py-3 pl-3 text-center"><CellIcon value={row.voyaq} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
