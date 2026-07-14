import { useMemo } from "react";
import { getDestinationData } from "../destination-data";
import type { DestinationData } from "@/types/destination";

interface UseDestinationResult {
  data: DestinationData | null;
  loading: boolean;
  error: string | null;
}

export function useDestination(destinationName: string | undefined): UseDestinationResult {
  return useMemo(() => {
    if (!destinationName) return { data: null, loading: false, error: "No destination provided" };
    const data = getDestinationData(destinationName);
    if (!data) return { data: null, loading: false, error: `No info available for ${destinationName}` };
    return { data, loading: false, error: null };
  }, [destinationName]);
}
