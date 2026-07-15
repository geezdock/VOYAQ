import type { EventItem } from "@/types/destination";

export async function fetchEvents(destination: string): Promise<EventItem[] | null> {
  try {
    const res = await fetch(`/api/events?dest=${encodeURIComponent(destination)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.events ?? null;
  } catch {
    return null;
  }
}
