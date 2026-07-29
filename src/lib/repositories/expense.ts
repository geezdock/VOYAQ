import { createClient } from "@/services/supabase/client";
import type { ExpenseEntry, ExpenseSummary } from "@/types/expense";

const CACHE_PREFIX = "voyaq_expenses_";

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

function computeSettlements(balances: Record<string, number>, memberIds: string[]): ExpenseSummary["settlements"] {
  const creditors: { id: string; amount: number }[] = [];
  const debtors: { id: string; amount: number }[] = [];

  for (const id of memberIds) {
    const b = balances[id] || 0;
    if (b > 1) creditors.push({ id, amount: b });
    else if (b < -1) debtors.push({ id, amount: -b });
  }

  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const settlements: ExpenseSummary["settlements"] = [];
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

function cacheKey(squadId: string) {
  return `${CACHE_PREFIX}${squadId}`;
}

function loadCached(squadId: string): ExpenseEntry[] {
  try {
    const raw = localStorage.getItem(cacheKey(squadId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCached(squadId: string, expenses: ExpenseEntry[]) {
  try {
    localStorage.setItem(cacheKey(squadId), JSON.stringify(expenses));
  } catch {
    // quota
  }
}

export class ExpenseRepository {
  private supabase = createClient();

  async fetchExpenses(
    squadId: string,
  ): Promise<{ data: ExpenseEntry[]; fromCache: boolean }> {
    const cached = loadCached(squadId);
    if (cached.length > 0) {
      this.fetchFromSupabase(squadId).then((server) => {
        if (server.length > 0) {
          saveCached(squadId, server);
        }
      });
      return { data: cached, fromCache: true };
    }

    const server = await this.fetchFromSupabase(squadId);
    saveCached(squadId, server);
    return { data: server, fromCache: false };
  }

  private async fetchFromSupabase(squadId: string): Promise<ExpenseEntry[]> {
    const { data, error } = await this.supabase
      .from("expenses")
      .select("*")
      .eq("squad_id", squadId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []).map(mapRowToExpense);
  }

  async addExpense(
    squadId: string,
    entry: Omit<ExpenseEntry, "id" | "createdAt">,
  ): Promise<ExpenseEntry> {
    const id = `exp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const createdAt = new Date().toISOString();

    const { error } = await this.supabase.from("expenses").insert({
      id,
      squad_id: squadId,
      paid_by: entry.paidBy,
      description: entry.description,
      amount: entry.amount,
      category: entry.category,
      split: entry.splitAmong,
      date: entry.date,
      created_at: createdAt,
    });

    if (error) throw new Error(error.message);

    const result: ExpenseEntry = { ...entry, id, createdAt };
    const cached = loadCached(squadId);
    cached.unshift(result);
    saveCached(squadId, cached);
    return result;
  }

  async removeExpense(squadId: string, id: string): Promise<void> {
    const { error } = await this.supabase.from("expenses").delete().eq("id", id);
    if (error) throw new Error(error.message);
    const cached = loadCached(squadId).filter((e) => e.id !== id);
    saveCached(squadId, cached);
  }

  async clearExpenses(squadId: string): Promise<void> {
    const { error } = await this.supabase
      .from("expenses")
      .delete()
      .eq("squad_id", squadId);
    if (error) throw new Error(error.message);
    saveCached(squadId, []);
  }

  computeSummary(expenses: ExpenseEntry[], memberIds: string[]): ExpenseSummary {
    return computeSummary(expenses, memberIds);
  }
}

function mapRowToExpense(row: Record<string, unknown>): ExpenseEntry {
  return {
    id: row.id as string,
    description: row.description as string,
    amount: row.amount as number,
    paidBy: row.paid_by as string,
    splitAmong: (row.split as string[]) ?? [],
    date: row.date as string,
    category: row.category as ExpenseEntry["category"],
    createdAt: row.created_at as string,
  };
}
