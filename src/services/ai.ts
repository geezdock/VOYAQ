import type { AISuggestion } from "@/types/destination";
import { getAISuggestions } from "@/actions/ai";

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
    const data = await getAISuggestions(options) as unknown as { suggestions: AISuggestion[] };
    return data.suggestions ?? null;
  } catch {
    return null;
  }
}
