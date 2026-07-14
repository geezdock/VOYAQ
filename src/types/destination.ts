export interface WeatherCurrent {
  temp: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

export interface WeatherForecast {
  date: string;
  tempHigh: number;
  tempLow: number;
  condition: string;
}

export interface WeatherData {
  current: WeatherCurrent;
  forecast: WeatherForecast[];
}

export interface FoodItem {
  name: string;
  description: string;
  category: string;
  priceRange: string;
  restaurant?: string;
  tags: string[];
}

export interface Attraction {
  name: string;
  description: string;
  category: string;
  approximateCost: number;
  duration: string;
  bestTime: string;
  image?: string;
}

export interface EventItem {
  name: string;
  date: string;
  description: string;
  venue: string;
  category: string;
}

export interface Advisory {
  severity: "low" | "medium" | "high";
  title: string;
  description: string;
  source: string;
  date: string;
}

export interface EmergencyInfo {
  police: string;
  ambulance: string;
  fire: string;
  nearestHospital: string;
  touristHelpline: string;
}

export interface TransportOption {
  mode: string;
  from: string;
  to: string;
  cost: number;
  duration: string;
  details: string;
}

export interface BudgetInsight {
  category: string;
  estimatedCost: number;
  notes: string;
}

export interface AISuggestion {
  type: "weather" | "budget" | "transport" | "food" | "general";
  tip: string;
  priority: "high" | "medium" | "low";
}

export interface DestinationOverview {
  description: string;
  bestTimeToVisit: string;
  language: string;
  currency: string;
  timeZone: string;
  quickFacts: { label: string; value: string }[];
}

export interface DestinationData {
  overview: DestinationOverview;
  weather: WeatherData;
  food: FoodItem[];
  attractions: Attraction[];
  events: EventItem[];
  advisories: Advisory[];
  emergency: EmergencyInfo;
  transport: TransportOption[];
  budgetInsights: BudgetInsight[];
  aiSuggestions: AISuggestion[];
}

export type HubTab =
  | "overview"
  | "weather"
  | "food"
  | "places"
  | "events"
  | "safety"
  | "transport"
  | "budget"
  | "ai";
