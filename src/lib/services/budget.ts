import type { BudgetInsight } from "@/types/destination";

export async function fetchBudgetInsights(destination: string): Promise<BudgetInsight[] | null> {
  try {
    const res = await fetch(`/api/budget?dest=${encodeURIComponent(destination)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.insights ?? null;
  } catch {
    return null;
  }
}
