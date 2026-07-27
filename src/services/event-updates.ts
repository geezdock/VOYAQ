import { getEventUpdates } from "@/actions/ai";

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
    return await getEventUpdates(destination, startDate, endDate) as unknown as EventDrivenUpdateResult;
  } catch {
    return null;
  }
}
