"use client";

import { Trash2, UtensilsCrossed, Bus, Home, Camera, Tag } from "lucide-react";
import type { ExpenseEntry } from "@/types/expense";
import type { SquadMember } from "@/types/squad";
import { formatRupee } from "@/utils/currency";

interface ExpenseListProps {
  expenses: ExpenseEntry[];
  members: SquadMember[];
  onRemove: (id: string) => void;
}

const catIcon: Record<string, typeof UtensilsCrossed> = {
  food: UtensilsCrossed,
  transport: Bus,
  stay: Home,
  activities: Camera,
  other: Tag,
};

const catColor: Record<string, string> = {
  food: "text-accent",
  transport: "text-[#C4A99A]",
  stay: "text-peach-dark",
  activities: "text-success",
  other: "text-ink-muted",
};

function getMember(members: SquadMember[], id: string): SquadMember | undefined {
  return members.find((m) => m.id === id);
}

export function ExpenseList({ expenses, members, onRemove }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-10 space-y-2">
        <Tag className="w-8 h-8 text-ink-muted/30 mx-auto" />
        <p className="font-heading text-sm text-ink-muted">No expenses logged yet</p>
        <p className="font-mono text-xs text-ink-muted/60">Add your first expense above</p>
      </div>
    );
  }

  const sorted = [...expenses].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="space-y-2">
      {sorted.map((exp) => {
        const payer = getMember(members, exp.paidBy);
        const Icon = catIcon[exp.category] || Tag;
        const color = catColor[exp.category] || "text-ink-muted";
        const splitCount = exp.splitAmong.length;

        return (
          <div
            key={exp.id}
            className="flex items-center gap-3 p-3 border border-ink/10 rounded-[8px] bg-white hover:border-ink/20 transition-colors"
          >
            <div className={`w-8 h-8 rounded-full bg-ink/5 flex items-center justify-center shrink-0 ${color}`}>
              <Icon className="w-4 h-4" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-heading text-sm font-semibold text-ink truncate">{exp.description}</p>
              <p className="font-mono text-[10px] text-ink-muted">
                Paid by <span className="font-bold">{payer?.name ?? "Unknown"}</span>
                {splitCount > 1 && ` · split ${splitCount} ways`}
                {splitCount === 1 && ` · paid for self`}
                {" · "}
                {new Date(exp.date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })}
              </p>
            </div>

            <span className="font-mono text-sm font-bold text-ink shrink-0">
              {formatRupee(exp.amount)}
            </span>

            <button
              onClick={() => onRemove(exp.id)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-bruted text-ink-muted/40 hover:text-error hover:bg-error/5 transition-colors shrink-0"
              title="Remove"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
