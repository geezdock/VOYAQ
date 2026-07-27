import type { AIBudgetAllocation } from "@/types/itinerary";
import { getBudgetAllocation } from "@/actions/ai";

export async function fetchBudgetAllocation(destination: string, budget: number): Promise<AIBudgetAllocation | null> {
  try {
    return await getBudgetAllocation(destination, String(budget)) as unknown as AIBudgetAllocation;
  } catch {
    return null;
  }
}
