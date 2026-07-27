"use client";

import { ArrowLeft, DollarSign, Users, Wallet } from "lucide-react";
import type { Squad } from "@/types/squad";
import { useSquad } from "@/shared/providers/SquadContext";
import { useExpenses } from "../hooks/useExpenses";
import { formatRupee } from "@/utils/currency";
import { AddExpenseForm } from "./AddExpenseForm";
import { ExpenseList } from "./ExpenseList";
import { SettlementMatrix } from "./SettlementMatrix";
import { PerPersonBreakdown } from "./PerPersonBreakdown";

interface ExpenseTrackerProps {
  squad: Squad;
  onBack: () => void;
}

export function ExpenseTracker({ squad, onBack }: ExpenseTrackerProps) {
  const { updateMember } = useSquad();
  const { expenses, summary, addExpense, removeExpense, clearExpenses } = useExpenses(
    squad.id,
    squad.members.map((m) => m.id),
  );

  return (
    <div className="min-h-screen">
      <header className="border-b border-ink/10 bg-surface-card">
        <div className="max-w-3xl mx-auto px-4 flex items-center justify-between h-14">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 font-heading text-sm font-semibold text-ink-muted hover:text-ink transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Trip
          </button>
          <h1 className="font-display text-lg font-bold text-ink uppercase tracking-tight">
            Expenses
          </h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 sm:py-8 space-y-6">
        {/* Summary bar */}
        <div className="border-2 border-ink rounded-[12px] bg-white shadow-bruted-sm overflow-hidden">
          <div className="p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="w-5 h-5 text-accent" />
              <h2 className="font-heading text-sm font-bold text-ink uppercase tracking-wider">
                {squad.name} — Expense Summary
              </h2>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="font-mono text-[10px] text-ink-muted uppercase tracking-wider">Total Spent</p>
                <p className="font-display text-xl sm:text-2xl font-extrabold text-ink mt-1">
                  {formatRupee(summary.totalSpent)}
                </p>
              </div>
              <div className="text-center border-x border-ink/10">
                <p className="font-mono text-[10px] text-ink-muted uppercase tracking-wider">Per Person</p>
                <p className="font-display text-xl sm:text-2xl font-extrabold text-ink mt-1">
                  {formatRupee(summary.perPerson)}
                </p>
              </div>
              <div className="text-center">
                <p className="font-mono text-[10px] text-ink-muted uppercase tracking-wider">Members</p>
                <p className="font-display text-xl sm:text-2xl font-extrabold text-ink mt-1">
                  {squad.members.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Add expense form */}
        <AddExpenseForm members={squad.members} onAdd={addExpense} summary={summary} />

        {/* Expense list */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-accent" />
              <h3 className="font-heading text-sm font-bold text-ink uppercase tracking-wider">
                Expenses ({expenses.length})
              </h3>
            </div>
            {expenses.length > 0 && (
              <button
                onClick={clearExpenses}
                className="font-mono text-[10px] font-bold text-error hover:text-error/80 transition-colors px-2 py-1 min-h-[36px]"
              >
                Clear All
              </button>
            )}
          </div>
          <ExpenseList expenses={expenses} members={squad.members} onRemove={removeExpense} />
        </div>

        {/* Per-person breakdown */}
        {expenses.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-accent" />
              <h3 className="font-heading text-sm font-bold text-ink uppercase tracking-wider">
                Balances
              </h3>
            </div>
            <PerPersonBreakdown members={squad.members} summary={summary} squadId={squad.id} updateMember={updateMember} />
          </div>
        )}

        {/* Settlement matrix */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-accent" />
            <h3 className="font-heading text-sm font-bold text-ink uppercase tracking-wider">
              Settle Up
            </h3>
          </div>
          <SettlementMatrix settlements={summary.settlements} members={squad.members} />
        </div>
      </main>
    </div>
  );
}
