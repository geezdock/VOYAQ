"use client";

import { useState, useEffect, useCallback } from "react";
import { ExpenseRepository } from "@/lib/repositories/expense";
import type { ExpenseEntry, ExpenseSummary } from "@/types/expense";

export function useExpenses(squadId: string, memberIds: string[]) {
  const [expenses, setExpenses] = useState<ExpenseEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [repo] = useState(() => new ExpenseRepository());

  useEffect(() => {
    let cancelled = false;

    repo.fetchExpenses(squadId).then(({ data }) => {
      if (cancelled) return;
      setExpenses(data);
      setLoading(false);
    }).catch((err) => {
      if (cancelled) return;
      setError(err.message);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [squadId, repo]);

  const addExpense = useCallback(
    (entry: Omit<ExpenseEntry, "id" | "createdAt">) => {
      repo
        .addExpense(squadId, entry)
        .then((created) => {
          setExpenses((prev) => [created, ...prev]);
        })
        .catch((err) => setError(err.message));
    },
    [squadId, repo],
  );

  const removeExpense = useCallback(
    (id: string) => {
      repo
        .removeExpense(squadId, id)
        .then(() => {
          setExpenses((prev) => prev.filter((e) => e.id !== id));
        })
        .catch((err) => setError(err.message));
    },
    [squadId, repo],
  );

  const clearExpenses = useCallback(() => {
    repo
      .clearExpenses(squadId)
      .then(() => {
        setExpenses([]);
      })
      .catch((err) => setError(err.message));
  }, [squadId, repo]);

  const summary = repo.computeSummary(expenses, memberIds);

  return { expenses, summary, loading, error, addExpense, removeExpense, clearExpenses };
}
