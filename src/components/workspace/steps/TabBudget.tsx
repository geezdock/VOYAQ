"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Sparkles, Check, Lock, Unlock } from "lucide-react";
import type { Squad } from "@/types/squad";
import { useSquad } from "@/lib/SquadContext";

interface TabBudgetProps {
  squad: Squad;
  onUpdate: (squad: Squad) => void;
}

export function TabBudget({ squad, onUpdate }: TabBudgetProps) {
  const { isMe, currentUserId } = useSquad();
  const [myBudget, setMyBudget] = useState(
    squad.budgetPreferences.find((p) => isMe(p.memberId))?.amount || 5000
  );

  const totalPrefs = squad.budgetPreferences.length;
  const totalMembers = squad.members.length;
  const participationPct = totalMembers > 0 ? Math.round((totalPrefs / totalMembers) * 100) : 0;
  const amounts = [...new Set(squad.budgetPreferences.map((p) => p.amount))].sort(
    (a, b) => a - b
  );

  const groups = amounts.map((amount) => {
    const count = squad.budgetPreferences.filter((p) => p.amount === amount).length;
    return { amount, count, pct: totalPrefs > 0 ? Math.round((count / totalPrefs) * 100) : 0 };
  });

  const hasConflict = amounts.length > 1;
  const avgBudget =
    totalPrefs > 0
      ? Math.round(
          squad.budgetPreferences.reduce((sum, p) => sum + p.amount, 0) / totalPrefs
        )
      : 5000;

  const isLocked = squad.lockedBudget !== undefined;
  const canLock = participationPct >= 50 && totalPrefs > 1;

  function handleSetBudget() {
    if (isLocked) return;
    const uid = currentUserId || "me";
    const existing = squad.budgetPreferences.findIndex(
      (p) => isMe(p.memberId)
    );
    const newPrefs = [...squad.budgetPreferences];
    if (existing >= 0) {
      newPrefs[existing] = { memberId: uid, amount: myBudget };
    } else {
      newPrefs.push({ memberId: uid, amount: myBudget });
    }
    onUpdate({ ...squad, budgetPreferences: newPrefs });
  }

  function handleLockBudget() {
    onUpdate({ ...squad, lockedBudget: avgBudget, budgetPerPerson: avgBudget });
  }

  function handleUnlockBudget() {
    onUpdate({ ...squad, lockedBudget: undefined });
  }

  const formatRupee = (n: number) =>
    `₹${n.toLocaleString("en-IN")}`;

  return (
    <div className="max-w-lg space-y-4">
      {isLocked && (
        <div className="border-[3px] border-success/30 rounded-[16px] bg-success/5 p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[8px] bg-success flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-heading text-sm font-bold text-ink">
                  Budget Locked
                </p>
                <p className="font-mono text-xs text-ink-muted">
                  {formatRupee(squad.lockedBudget ?? 0)} / person
                </p>
              </div>
            </div>
            <button
              onClick={handleUnlockBudget}
              className="font-heading text-xs font-bold text-ink-muted hover:text-error transition-colors min-h-[44px] py-2"
            >
              Unlock
            </button>
          </div>
        </div>
      )}

      <div className={`border-[3px] rounded-[16px] bg-white p-5 sm:p-6 shadow-bruted-lg ${isLocked ? "border-success/30" : "border-ink"}`}>
        <div className="flex items-center justify-between mb-5">
          <span className="font-mono text-xs font-bold text-ink-muted uppercase tracking-wider">
            Your Budget
          </span>
          <span className="font-mono text-xs text-ink-muted">
            {totalPrefs}/{totalMembers} set
          </span>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-stretch flex-1">
            <span className="brut-input inline-flex items-center px-3 border-r-0 rounded-r-none bg-clay-light text-ink font-mono shrink-0 text-sm">
              ₹
            </span>
            <input
              type="number"
              inputMode="numeric"
              value={myBudget}
              onChange={(e) => setMyBudget(parseInt(e.target.value) || 0)}
              disabled={isLocked}
              className="brut-input w-full rounded-l-none font-mono text-lg disabled:opacity-50"
            />
          </div>
          <button
            onClick={handleSetBudget}
            disabled={isLocked}
            className="brut-btn px-4 text-sm min-h-[44px] disabled:opacity-40"
          >
            Set
          </button>
        </div>

        <div className="w-full h-2 rounded-full bg-ink/10 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${participationPct}%` }}
            transition={{ duration: 0.6 }}
            className="h-full rounded-full bg-accent"
          />
        </div>
        <p className="font-mono text-[10px] text-ink-muted mt-1">
          {participationPct}% of squad has set their budget
        </p>
      </div>

      {totalPrefs > 0 && (
        <div className="border-[3px] border-ink rounded-[16px] bg-white p-5 sm:p-6 shadow-bruted-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-xs font-bold text-ink-muted uppercase tracking-wider">
              Budget Preferences
            </span>
            {hasConflict && (
              <div className="flex items-center gap-1.5 bg-error/10 border border-error/30 rounded-full px-3 py-1">
                <AlertTriangle className="w-4 h-4 text-error" />
                <span className="font-heading text-xs font-bold text-error">
                  Conflict
                </span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {groups.map((group) => (
              <div key={group.amount} className="flex items-center gap-3">
                <span className="font-mono text-sm font-bold text-ink w-20">
                  {formatRupee(group.amount)}
                </span>
                <div className="flex-1 h-3 rounded-[4px] bg-ink/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${group.pct}%` }}
                    transition={{ duration: 0.6 }}
                    className="h-full rounded-[4px] bg-gradient-to-r from-accent to-accent-dark"
                  />
                </div>
                <span className="font-mono text-xs text-ink-muted w-12 text-right">
                  {group.count} {group.count === 1 ? "friend" : "friends"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {totalPrefs > 0 && (
        <div className="border-[3px] border-ink rounded-[16px] bg-white p-5 sm:p-6 shadow-bruted-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-[8px] bg-accent border-[2px] border-ink flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-heading text-sm font-bold text-ink">
                Recommended Budget
              </p>
              <p className="font-mono text-[10px] text-ink-muted">
                Based on group preferences
              </p>
            </div>
          </div>

          <div className="flex items-baseline gap-2 mb-4">
            <span className="font-display text-3xl sm:text-4xl font-extrabold text-ink">
              {formatRupee(avgBudget)}
            </span>
            <span className="font-heading text-sm text-ink-muted">/person</span>
          </div>

          {isLocked ? (
            <div className="flex items-center gap-2 bg-success/10 border border-success/30 rounded-[8px] px-4 py-2.5">
              <Check className="w-5 h-5 text-success" />
              <span className="font-heading text-sm font-bold text-success">
                Budget Locked at {formatRupee(squad.lockedBudget ?? 0)}
              </span>
            </div>
          ) : canLock ? (
            <button
              onClick={handleLockBudget}
              className="brut-btn w-full text-sm min-h-[44px]"
            >
              <Lock className="w-4 h-4 mr-1.5 inline" />
              Lock Budget at {formatRupee(avgBudget)}
            </button>
          ) : (
            <div className="text-center py-2">
              <p className="font-heading text-xs text-ink-muted">
                Need at least {Math.ceil(totalMembers * 0.5)} members to set their budget before locking
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
