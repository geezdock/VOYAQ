import type { WeatherData } from "@/types/destination";

export async function fetchLiveWeather(
  destination: string,
): Promise<WeatherData | null> {
  try {
    const res = await fetch(`/api/weather?dest=${encodeURIComponent(destination)}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
