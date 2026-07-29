"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ChevronDown, ChevronUp, DollarSign } from "lucide-react";
import type { ExpenseEntry, ExpenseSummary } from "@/types/expense";
import type { SquadMember } from "@/types/squad";
import { formatRupee } from "@/utils/currency";
import { trackEvent, VOYAQ_EVENTS } from "@/lib/analytics";

interface AddExpenseFormProps {
  members: SquadMember[];
  onAdd: (entry: Omit<ExpenseEntry, "id" | "createdAt">) => void;
  summary: ExpenseSummary;
}

const CATEGORIES: ExpenseEntry["category"][] = [
  "food",
  "transport",
  "stay",
  "activities",
  "other",
];

export function AddExpenseForm({ members, onAdd, summary }: AddExpenseFormProps) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState(members[0]?.id ?? "");
  const [category, setCategory] = useState<ExpenseEntry["category"]>("food");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const allMemberIds = useMemo(() => members.map((m) => m.id), [members]);
  const [excludedIds, setExcludedIds] = useState<Set<string>>(new Set());
  const splitAmong = useMemo(
    () => allMemberIds.filter((id) => !excludedIds.has(id)),
    [allMemberIds, excludedIds],
  );

  function toggleMember(id: string) {
    setExcludedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!description || !amt || amt <= 0 || !paidBy || splitAmong.length === 0) return;

    onAdd({
      description: description.trim(),
      amount: amt,
      paidBy,
      category,
      date,
      splitAmong,
    });

    setDescription("");
    setAmount("");
    setCategory("food");
    setExcludedIds(new Set());
    setPaidBy(members[0]?.id ?? "");
    setOpen(false);
    trackEvent(VOYAQ_EVENTS.TOOLKIT_EXPENSE_LOGGED, { description: description.trim(), amount: amt, category });
  }

  return (
    <div className="border-2 border-ink/10 rounded-[12px] bg-white overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-ink/[0.02] transition-colors min-h-[56px]"
      >
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-accent" />
          <span className="font-heading text-sm font-bold text-ink uppercase tracking-wider">
            Add Expense
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-ink-muted">
            Total: {formatRupee(summary.totalSpent)}
          </span>
          {open ? (
            <ChevronUp className="w-4 h-4 text-ink-muted" />
          ) : (
            <ChevronDown className="w-4 h-4 text-ink-muted" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="px-4 sm:px-5 pb-5 space-y-4 border-t border-ink/5 pt-4">
              <div>
                <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
                  Description
                </label>
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Dinner at Dilli Chaat"
                  className="w-full border-2 border-ink/10 rounded-[8px] px-3 py-2.5 font-heading text-sm bg-surface outline-none focus:border-accent transition-colors"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="500"
                    className="w-full border-2 border-ink/10 rounded-[8px] px-3 py-2.5 font-heading text-sm bg-surface outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div className="flex-1">
                  <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ExpenseEntry["category"])}
                    className="w-full border-2 border-ink/10 rounded-[8px] px-3 py-2.5 font-heading text-sm bg-surface outline-none focus:border-accent transition-colors"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c.charAt(0).toUpperCase() + c.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border-2 border-ink/10 rounded-[8px] px-3 py-2.5 font-heading text-sm bg-surface outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div className="flex-1">
                  <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
                    Paid by
                  </label>
                  <select
                    value={paidBy}
                    onChange={(e) => setPaidBy(e.target.value)}
                    className="w-full border-2 border-ink/10 rounded-[8px] px-3 py-2.5 font-heading text-sm bg-surface outline-none focus:border-accent transition-colors"
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink-muted block mb-1.5">
                  Split among
                </label>
                <div className="flex flex-wrap gap-2">
                  {members.map((m) => {
                    const selected = splitAmong.includes(m.id);
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => toggleMember(m.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-bruted border-2 font-mono text-[11px] font-bold transition-all min-h-[44px] ${
                          selected
                            ? "bg-accent/10 text-accent border-accent/30"
                            : "bg-ink/5 text-ink-muted border-ink/10"
                        }`}
                      >
                        <span className={`w-3 h-3 rounded-full ${m.color}`} />
                        {m.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="brut-btn text-sm px-5 py-2 inline-flex items-center gap-1.5 min-h-[44px]"
                >
                  <Plus className="w-4 h-4" />
                  Add Expense
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
