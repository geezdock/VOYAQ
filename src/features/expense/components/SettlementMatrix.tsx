"use client";

import dynamic from "next/dynamic";
import { ArrowRight, Smartphone, CheckCircle } from "lucide-react";
import type { Settlement } from "@/types/expense";
import type { SquadMember } from "@/types/squad";
import { formatRupee } from "@/utils/currency";

const SettlementQRLazy = dynamic(() => import("./SettlementQR").then(m => ({ default: m.SettlementQR })), { ssr: false });

interface SettlementMatrixProps {
  settlements: Settlement[];
  members: SquadMember[];
}

function getMember(members: SquadMember[], id: string): SquadMember | undefined {
  return members.find((m) => m.id === id);
}

export function SettlementMatrix({ settlements, members }: SettlementMatrixProps) {
  if (settlements.length === 0) {
    return (
      <div className="text-center py-8 space-y-2">
        <CheckCircle className="w-8 h-8 text-success/40 mx-auto" />
        <p className="font-heading text-sm font-semibold text-success">All Settled Up</p>
        <p className="font-mono text-xs text-ink-muted/60">No outstanding balances</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {settlements.map((s, i) => {
        const from = getMember(members, s.from);
        const to = getMember(members, s.to);
        if (!from || !to) return null;

        return (
          <div
            key={i}
            className="flex items-center gap-3 p-3 border-2 border-ink/10 rounded-[10px] bg-white"
          >
            <div className={`w-8 h-8 rounded-full ${from.color} flex items-center justify-center shrink-0`}>
              <span className="text-[11px] font-heading font-bold text-white">{from.initial}</span>
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-heading text-sm font-semibold text-ink">
                {from.name}
                <ArrowRight className="w-3.5 h-3.5 inline mx-1.5 text-ink-muted" />
                {to.name}
              </p>
              <p className="font-mono text-xs font-bold text-accent">{formatRupee(s.amount)}</p>
            </div>

            {to.upiId && (
              <SettlementQRLazy settlement={s} fromMember={from} toMember={to} />
            )}
          </div>
        );
      })}
    </div>
  );
}
