import type { ItineraryResponse } from "@/types/itinerary";
import { getItinerary } from "@/actions/ai";

export interface ItineraryOptions {
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
}

export async function fetchItinerary(options: ItineraryOptions): Promise<ItineraryResponse | null> {
  try {
    return await getItinerary(options.destination, options.startDate, options.endDate, String(options.budget)) as unknown as ItineraryResponse;
  } catch {
    return null;
  }
}
