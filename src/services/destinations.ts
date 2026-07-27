import type { DestinationEntry } from "@/types/destination";
import { getDestinations } from "@/actions/data";

export async function fetchDestinations(params?: {
  type?: string;
  state?: string;
  q?: string;
  slug?: string;
}): Promise<DestinationEntry[] | DestinationEntry | null> {
  try {
    return await getDestinations(params) as unknown as DestinationEntry[] | DestinationEntry;
  } catch {
    return null;
  }
}

export async function fetchDestinationBySlug(slug: string): Promise<DestinationEntry | null> {
  try {
    return await getDestinations({ slug }) as unknown as DestinationEntry;
  } catch {
    return null;
  }
}
