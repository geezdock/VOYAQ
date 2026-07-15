import type { TransportOption } from "@/types/destination";

export async function fetchTransport(destination: string): Promise<TransportOption[] | null> {
  try {
    const res = await fetch(`/api/transport?dest=${encodeURIComponent(destination)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.options ?? null;
  } catch {
    return null;
  }
}
