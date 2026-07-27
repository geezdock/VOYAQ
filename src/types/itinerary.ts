export interface ItineraryEntry {
  time: string;
  activity: string;
  description: string;
  category: "food" | "transport" | "activity" | "sightseeing" | "rest" | "travel";
  estimatedCost: number;
  location?: string;
}

export interface ItineraryDay {
  day: number;
  date: string;
  title: string;
  entries: ItineraryEntry[];
  dailyBudget: number;
  tips: string[];
}

export interface AIBudgetAllocation {
  stay: number;
  stayPct: number;
  food: number;
  foodPct: number;
  transport: number;
  transportPct: number;
  activities: number;
  activitiesPct: number;
  buffer: number;
  bufferPct: number;
  total: number;
  reasoning: string;
}

export interface ItineraryResponse {
  destination: string;
  totalBudget: number;
  days: ItineraryDay[];
  totalEstimatedCost: number;
  generatedAt: string;
}

export interface EventDrivenUpdate {
  type: "weather_alert" | "festival_alert" | "advisory";
  title: string;
  description: string;
  originalPlan: string;
  adjustedSuggestion: string;
  severity: "info" | "warning" | "critical";
  affectedDay?: number;
}
