import type { ItineraryResponse } from "@/types/itinerary";

export interface ItineraryOptions {
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
}

export async function fetchItinerary(options: ItineraryOptions): Promise<ItineraryResponse | null> {
  try {
    const params = new URLSearchParams({
      dest: options.destination,
      start: options.startDate,
      end: options.endDate,
      budget: String(options.budget),
    });
    const res = await fetch(`/api/ai/itinerary?${params}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
