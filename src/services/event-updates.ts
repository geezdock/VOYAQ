export interface EventDrivenUpdateResult {
  destination: string;
  updates: Array<{
    type: "weather_alert" | "festival_alert" | "advisory";
    title: string;
    description: string;
    originalPlan: string;
    adjustedSuggestion: string;
    severity: "info" | "warning" | "critical";
    affectedDay?: number;
  }>;
}

export async function fetchEventDrivenUpdates(destination: string, startDate?: string, endDate?: string): Promise<EventDrivenUpdateResult | null> {
  try {
    const params = new URLSearchParams({ dest: destination });
    if (startDate) params.set("start", startDate);
    if (endDate) params.set("end", endDate);
    const res = await fetch(`/api/ai/event-updates?${params}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
