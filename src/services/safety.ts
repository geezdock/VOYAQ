import type { Advisory, EmergencyInfo } from "@/types/destination";

interface SafetyResult {
  advisories: Advisory[];
  emergency: EmergencyInfo;
}

export async function fetchSafety(destination: string): Promise<SafetyResult | null> {
  try {
    const res = await fetch(`/api/safety?dest=${encodeURIComponent(destination)}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
