import type { AISuggestion } from "@/types/destination";

export interface SuggestOptions {
  destination: string;
  budget?: number;
  dates?: { start: string; end: string };
  preferences?: string[];
}

export async function fetchAISuggestions(
  options: SuggestOptions,
): Promise<AISuggestion[] | null> {
  try {
    const res = await fetch("/api/ai/suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(options),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.suggestions ?? null;
  } catch {
    return null;
  }
}
