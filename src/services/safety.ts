import type { Advisory, EmergencyInfo } from "@/types/destination";
import { getSafety } from "@/actions/data";

interface SafetyResult {
  advisories: Advisory[];
  emergency: EmergencyInfo;
}

export async function fetchSafety(destination: string): Promise<SafetyResult | null> {
  try {
    return await getSafety(destination) as unknown as SafetyResult;
  } catch {
    return null;
  }
}
