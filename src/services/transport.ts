import type { TransportOption } from "@/types/destination";
import { getTransport } from "@/actions/data";

export async function fetchTransport(destination: string): Promise<TransportOption[] | null> {
  try {
    const data = await getTransport(destination) as unknown as { options: TransportOption[] };
    return data.options ?? null;
  } catch {
    return null;
  }
}
