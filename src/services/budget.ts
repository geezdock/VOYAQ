import type { BudgetInsight } from "@/types/destination";
import { getBudgetInsights } from "@/actions/data";

export async function fetchBudgetInsights(destination: string): Promise<BudgetInsight[] | null> {
  try {
    const data = await getBudgetInsights(destination) as unknown as { insights: BudgetInsight[] };
    return data.insights ?? null;
  } catch {
    return null;
  }
}
