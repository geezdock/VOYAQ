import type { AIBudgetAllocation } from "@/types/itinerary";

export async function fetchBudgetAllocation(destination: string, budget: number): Promise<AIBudgetAllocation | null> {
  try {
    const params = new URLSearchParams({
      dest: destination,
      budget: String(budget),
    });
    const res = await fetch(`/api/ai/budget-allocator?${params}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
