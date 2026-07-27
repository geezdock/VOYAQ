"use client";

import { useState } from "react";
import { Pencil, Check, X, Smartphone } from "lucide-react";
import type { ExpenseSummary } from "@/types/expense";
import type { SquadMember } from "@/types/squad";
import { formatRupee } from "@/utils/currency";

interface PerPersonBreakdownProps {
  members: SquadMember[];
  summary: ExpenseSummary;
  squadId: string;
  updateMember: (squadId: string, memberId: string, updates: Partial<SquadMember>) => void;
}

export function PerPersonBreakdown({ members, summary, squadId, updateMember }: PerPersonBreakdownProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [upiValue, setUpiValue] = useState("");

  function startEdit(member: SquadMember) {
    setEditingId(member.id);
    setUpiValue(member.upiId ?? "");
  }

  function saveUpi(memberId: string) {
    updateMember(squadId, memberId, { upiId: upiValue.trim() || undefined });
    setEditingId(null);
  }

  function cancelEdit() {
    setEditingId(null);
  }

  return (
    <div className="space-y-2">
      <h3 className="font-heading text-xs font-bold text-ink-muted uppercase tracking-wider">
        Per Person
      </h3>
      {members.map((m) => {
        const balance = summary.memberBalances[m.id] ?? 0;
        const isOwed = balance > 0;
        const isEven = Math.abs(balance) < 1;
        const isEditing = editingId === m.id;

        return (
          <div
            key={m.id}
            className="flex items-center gap-3 p-3 border border-ink/10 rounded-[8px] bg-white"
          >
            <div className={`w-8 h-8 rounded-full ${m.color} flex items-center justify-center shrink-0`}>
              <span className="text-[11px] font-heading font-bold text-white">{m.initial}</span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-heading text-sm font-semibold text-ink">{m.name}</p>
                {isEditing ? (
                  <div className="flex items-center gap-1">
                    <input
                      value={upiValue}
                      onChange={(e) => setUpiValue(e.target.value)}
                      placeholder="example@paytm"
                      className="w-40 border-2 border-accent/30 rounded-[6px] px-2 py-0.5 font-mono text-[10px] bg-surface outline-none focus:border-accent"
                      autoFocus
                    />
                    <button
                      onClick={() => saveUpi(m.id)}
                      className="w-5 h-5 flex items-center justify-center rounded text-success hover:bg-success/10 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="w-5 h-5 flex items-center justify-center rounded text-error hover:bg-error/10 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    {m.upiId ? (
                      <span className="font-mono text-[9px] text-accent bg-accent/5 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <Smartphone className="w-2.5 h-2.5" />
                        {m.upiId}
                      </span>
                    ) : null}
                    <button
                      onClick={() => startEdit(m)}
                      className="w-5 h-5 flex items-center justify-center rounded text-ink-muted/40 hover:text-ink hover:bg-ink/5 transition-colors"
                      title={m.upiId ? "Edit UPI ID" : "Set UPI ID"}
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
              <p className="font-mono text-[10px] text-ink-muted">
                {isEven
                  ? "All settled"
                  : isOwed
                    ? `To be paid back ${formatRupee(balance)}`
                    : `Owes ${formatRupee(-balance)}`}
              </p>
            </div>

            <span
              className={`font-mono text-sm font-bold shrink-0 ${
                isEven ? "text-ink-muted/40" : isOwed ? "text-success" : "text-error"
              }`}
            >
              {isEven ? "—" : isOwed ? `+${formatRupee(balance)}` : formatRupee(balance)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
