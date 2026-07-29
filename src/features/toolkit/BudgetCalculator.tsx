"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { formatRupee } from "@/utils/currency";

interface BudgetItem {
  id: string;
  label: string;
  estimated: number;
  actual: number;
}

const CATEGORIES = ["Transport", "Accommodation", "Food", "Activities", "Miscellaneous"] as const;

function loadItems(): BudgetItem[] {
  try {
    const saved = localStorage.getItem("voyaq:budget");
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return [
    { id: "init1", label: "", estimated: 0, actual: 0 },
  ];
}

export default function BudgetCalculator() {
  const [items, setItems] = useState<BudgetItem[]>(loadItems);

  function save(next: BudgetItem[]) {
    setItems(next);
    try { localStorage.setItem("voyaq:budget", JSON.stringify(next)); } catch { /* ignore */ }
  }

  function update(id: string, patch: Partial<BudgetItem>) {
    save(items.map((i) => (i.id !== id ? i : { ...i, ...patch })));
  }

  function add() {
    save([...items, { id: `b${Date.now()}`, label: "", estimated: 0, actual: 0 }]);
  }

  function remove(id: string) {
    save(items.filter((i) => i.id !== id));
  }

  function resetAll() {
    save([]);
  }

  const totalEst = items.reduce((s, i) => s + (i.estimated || 0), 0);
  const totalAct = items.reduce((s, i) => s + (i.actual || 0), 0);
  const diff = totalAct - totalEst;

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Link
          href="/toolkit"
          className="flex h-10 w-10 items-center justify-center rounded-bruted border-2 border-ink/10 transition-colors hover:bg-ink/5"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Budget Calculator</h1>
          <p className="text-ink-muted text-sm">
            Track estimated vs actual trip costs
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-bruted border-2 border-ink/10 bg-surface-card p-4 text-center">
          <div className="text-xs text-ink-muted">Estimated</div>
          <div className="text-lg font-bold">{formatRupee(totalEst)}</div>
        </div>
        <div className="rounded-bruted border-2 border-ink/10 bg-surface-card p-4 text-center">
          <div className="text-xs text-ink-muted">Actual</div>
          <div className="text-lg font-bold">{formatRupee(totalAct)}</div>
        </div>
        <div className="rounded-bruted border-2 border-ink/10 bg-surface-card p-4 text-center">
          <div className="text-xs text-ink-muted">Difference</div>
          <div className={`text-lg font-bold ${diff > 0 ? "text-error" : diff < 0 ? "text-success" : ""}`}>
            {diff >= 0 ? "+" : ""}{formatRupee(diff)}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">Items</h2>
          <button
            onClick={add}
            className="flex items-center gap-1 text-sm text-ink-muted hover:text-ink"
          >
            <Plus className="h-4 w-4" /> Add item
          </button>
        </div>

        {items.length === 0 && (
          <p className="py-8 text-center text-sm text-ink-muted">
            No items yet. Add an expense category to get started.
          </p>
        )}

        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-wrap items-center gap-2 rounded-bruted border-2 border-ink/10 bg-surface-card p-3"
          >
            <select
              value={CATEGORIES.includes(item.label as typeof CATEGORIES[number]) ? item.label : "custom"}
              onChange={(e) => update(item.id, {
                label: e.target.value === "custom" ? "" : e.target.value,
              })}
              className="min-w-[140px] rounded-bruted border-2 border-ink/10 bg-surface px-2 py-1.5 text-sm outline-none focus:border-accent"
            >
              <option value="custom">Custom</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Label"
              value={item.label && CATEGORIES.includes(item.label as typeof CATEGORIES[number]) ? "" : item.label}
              onChange={(e) => update(item.id, { label: e.target.value })}
              className="min-w-0 flex-1 rounded-bruted border-2 border-ink/10 bg-surface px-2 py-1.5 text-sm outline-none focus:border-accent"
            />
            <div className="flex items-center gap-1">
              <span className="text-xs text-ink-muted">Est</span>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={item.estimated || ""}
                onChange={(e) => update(item.id, { estimated: parseInt(e.target.value) || 0 })}
                className="w-20 rounded-bruted border-2 border-ink/10 bg-surface px-2 py-1.5 text-sm outline-none focus:border-accent"
              />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-ink-muted">Act</span>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={item.actual || ""}
                onChange={(e) => update(item.id, { actual: parseInt(e.target.value) || 0 })}
                className="w-20 rounded-bruted border-2 border-ink/10 bg-surface px-2 py-1.5 text-sm outline-none focus:border-accent"
              />
            </div>
            <button
              onClick={() => remove(item.id)}
              className="text-ink-muted hover:text-error"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={resetAll}
        className="w-full rounded-bruted border-2 border-ink/10 px-4 py-3 text-sm font-medium transition-colors hover:bg-ink/5"
      >
        Reset all
      </button>
    </main>
  );
}
