"use client";

import { useState, useEffect, useCallback } from "react";
import type { ExpenseEntry, ExpenseSummary, Settlement } from "@/types/expense";

function storageKey(squadId: string) {
  return `voyaq_expenses_${squadId}`;
}

function loadExpenses(squadId: string): ExpenseEntry[] {
  try {
    const raw = localStorage.getItem(storageKey(squadId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveExpenses(squadId: string, expenses: ExpenseEntry[]) {
  try {
    localStorage.setItem(storageKey(squadId), JSON.stringify(expenses));
  } catch {
    // quota or SSR
  }
}

function computeSummary(expenses: ExpenseEntry[], memberIds: string[]): ExpenseSummary {
  let totalSpent = 0;
  const memberBalances: Record<string, number> = {};
  for (const m of memberIds) memberBalances[m] = 0;

  for (const e of expenses) {
    if (!memberIds.includes(e.paidBy)) continue;
    const shareGroup = e.splitAmong.filter((id) => memberIds.includes(id));
    if (shareGroup.length === 0) continue;
    const share = e.amount / shareGroup.length;
    totalSpent += e.amount;
    memberBalances[e.paidBy] += e.amount;
    for (const id of shareGroup) {
      memberBalances[id] -= share;
    }
  }

  const memberCount = memberIds.length || 1;
  const perPerson = totalSpent / memberCount;
  const settlements = computeSettlements(memberBalances, memberIds);

  return { totalSpent, perPerson, memberBalances, settlements };
}

function computeSettlements(
  balances: Record<string, number>,
  memberIds: string[],
): Settlement[] {
  const creditors: { id: string; amount: number }[] = [];
  const debtors: { id: string; amount: number }[] = [];

  for (const id of memberIds) {
    const b = balances[id] || 0;
    if (b > 1) creditors.push({ id, amount: b });
    else if (b < -1) debtors.push({ id, amount: -b });
  }

  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const settlements: Settlement[] = [];
  let ci = 0;
  let di = 0;

  while (ci < creditors.length && di < debtors.length) {
    const settled = Math.min(creditors[ci].amount, debtors[di].amount);
    if (settled > 1) {
      settlements.push({
        from: debtors[di].id,
        to: creditors[ci].id,
        amount: Math.round(settled),
      });
    }
    creditors[ci].amount -= settled;
    debtors[di].amount -= settled;
    if (creditors[ci].amount < 1) ci++;
    if (debtors[di].amount < 1) di++;
  }

  return settlements;
}

let _counter = 0;
function uid(): string {
  return `exp_${Date.now()}_${++_counter}`;
}

export function useExpenses(squadId: string, memberIds: string[]) {
  const [expenses, setExpenses] = useState<ExpenseEntry[]>([]);

  useEffect(() => {
    setExpenses(loadExpenses(squadId));
  }, [squadId]);

  const addExpense = useCallback(
    (entry: Omit<ExpenseEntry, "id" | "createdAt">) => {
      setExpenses((prev) => {
        const next = [
          ...prev,
          { ...entry, id: uid(), createdAt: new Date().toISOString() },
        ];
        saveExpenses(squadId, next);
        return next;
      });
    },
    [squadId],
  );

  const removeExpense = useCallback(
    (id: string) => {
      setExpenses((prev) => {
        const next = prev.filter((e) => e.id !== id);
        saveExpenses(squadId, next);
        return next;
      });
    },
    [squadId],
  );

  const clearExpenses = useCallback(() => {
    setExpenses([]);
    saveExpenses(squadId, []);
  }, [squadId]);

  const summary = computeSummary(expenses, memberIds);

  return { expenses, summary, addExpense, removeExpense, clearExpenses };
}
