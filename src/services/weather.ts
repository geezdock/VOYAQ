import type { WeatherData } from "@/types/destination";
import { getWeather } from "@/actions/data";

export async function fetchLiveWeather(destination: string): Promise<WeatherData | null> {
  try {
    return await getWeather(destination) as WeatherData;
  } catch {
    return null;
  }
}
