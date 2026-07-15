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
    const res = await fetch(`/api/overview?dest=${encodeURIComponent(destination)}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
