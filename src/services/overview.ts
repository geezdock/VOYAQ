import { getOverview } from "@/actions/data";

export interface OverviewResult {
  description: string;
  bestTimeToVisit: string;
  language: string;
  currency: string;
  timeZone: string;
  image: string | null;
  wikiUrl: string | null;
  quickFacts: { label: string; value: string }[];
}

export async function fetchOverview(destination: string): Promise<OverviewResult | null> {
  try {
    return await getOverview(destination) as unknown as OverviewResult;
  } catch {
    return null;
  }
}
