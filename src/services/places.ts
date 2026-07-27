import type { FoodItem, Attraction } from "@/types/destination";
import { getPlaces } from "@/actions/data";

export async function fetchFood(destination: string): Promise<FoodItem[] | null> {
  try {
    const result = await getPlaces(destination, "food") as unknown as { items?: FoodItem[] };
    return result.items ?? null;
  } catch {
    return null;
  }
}

export async function fetchAttractions(destination: string): Promise<Attraction[] | null> {
  try {
    const result = await getPlaces(destination, "attractions") as unknown as { attractions?: Attraction[] };
    return result.attractions ?? null;
  } catch {
    return null;
  }
}
