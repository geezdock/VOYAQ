import type { FoodItem, Attraction } from "@/types/destination";

export async function fetchFood(destination: string): Promise<FoodItem[] | null> {
  try {
    const res = await fetch(`/api/places?dest=${encodeURIComponent(destination)}&type=food`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.items ?? null;
  } catch {
    return null;
  }
}

export async function fetchAttractions(destination: string): Promise<Attraction[] | null> {
  try {
    const res = await fetch(`/api/places?dest=${encodeURIComponent(destination)}&type=attractions`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.attractions ?? null;
  } catch {
    return null;
  }
}
