import type { EventItem } from "@/types/destination";
import { getEvents } from "@/actions/data";

export async function fetchEvents(destination: string): Promise<EventItem[] | null> {
  try {
    const data = await getEvents(destination) as unknown as { events: EventItem[] };
    return data.events ?? null;
  } catch {
    return null;
  }
}
