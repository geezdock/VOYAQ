import { NextResponse } from "next/server";
import { getDestinationCoords } from "@/lib/destinations";

const CATEGORIES_BY_TYPE: Record<string, { category: string; baseCost: number; notes: string }[]> = {
  beach: [
    { category: "Accommodation", baseCost: 2000, notes: "Mid-range hotel or hostel per night" },
    { category: "Food", baseCost: 1200, notes: "3 meals + snacks at local/mid-range places" },
    { category: "Transport", baseCost: 500, notes: "Scooter rental + fuel split per person" },
    { category: "Activities", baseCost: 800, notes: "Water sports, entry fees, guided tours" },
    { category: "Miscellaneous", baseCost: 500, notes: "Shopping, tips, random expenses" },
  ],
  hill: [
    { category: "Accommodation", baseCost: 1500, notes: "Budget guesthouses or hostels per night" },
    { category: "Food", baseCost: 1000, notes: "3 meals at cafes and dhabas" },
    { category: "Transport", baseCost: 1000, notes: "Shared taxi or bus for sightseeing" },
    { category: "Activities", baseCost: 2000, notes: "Trekking, paragliding, or skiing" },
    { category: "Permits & Entry", baseCost: 300, notes: "Park permits, temple entry fees" },
  ],
  city: [
    { category: "Accommodation", baseCost: 2500, notes: "Mid-range hotel or hostel per night" },
    { category: "Food", baseCost: 1500, notes: "3 meals at a mix of street food and restaurants" },
    { category: "Transport", baseCost: 500, notes: "Metro, auto-rickshaws, bus pass" },
    { category: "Activities", baseCost: 1000, notes: "Museum entries, heritage walks, shows" },
    { category: "Miscellaneous", baseCost: 500, notes: "Shopping, tips, random expenses" },
  ],
  desert: [
    { category: "Accommodation", baseCost: 2000, notes: "Desert camps or mid-range hotel per night" },
    { category: "Food", baseCost: 1200, notes: "3 meals at local restaurants" },
    { category: "Transport", baseCost: 1500, notes: "Jeep safaris, camel rides, taxi hire" },
    { category: "Activities", baseCost: 1500, notes: "Desert safari, cultural shows, fort visits" },
    { category: "Miscellaneous", baseCost: 400, notes: "Shopping, tips, random expenses" },
  ],
};

const COST_MODIFIERS = {
  budget: 0.7,
  mid: 1.0,
  premium: 1.4,
};

function getCostTier(amenityCount: number): "budget" | "mid" | "premium" {
  if (amenityCount < 20) return "budget";
  if (amenityCount < 80) return "mid";
  return "premium";
}

function getDestinationType(key: string, state: string): "beach" | "hill" | "city" | "desert" {
  const beachPlaces = ["goa", "puducherry", "andaman & nicobar"];
  const hillStates = ["himachal pradesh", "uttarakhand", "ladakh", "jammu & kashmir", "sikkim"];
  const desertPlaces = ["rajasthan"];
  if (beachPlaces.includes(key) || beachPlaces.includes(state.toLowerCase())) return "beach";
  if (desertPlaces.includes(key) || desertPlaces.includes(state.toLowerCase())) return "desert";
  if (hillStates.includes(key) || hillStates.includes(state.toLowerCase())) return "hill";
  return "city";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dest = searchParams.get("dest");

  if (!dest) {
    return NextResponse.json({ error: "Missing 'dest' parameter" }, { status: 400 });
  }

  const coords = getDestinationCoords(dest);
  const key = dest.toLowerCase().trim();
  const state = coords?.state ?? "";
  const destType = getDestinationType(key, state);
  const categories = CATEGORIES_BY_TYPE[destType];

  let amenityCount = 0;

  if (coords) {
    try {
      const radius = 8000;
      const query = `[out:json];(node["amenity"~"restaurant|cafe|hotel|bank|atm"](around:${radius},${coords.lat},${coords.lon}););out count;`;
      const res = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ data: query }),
      });
      if (res.ok) {
        const data = await res.json();
        amenityCount = data.elements?.[0]?.tags?.total ?? data.elements?.length ?? 0;
      }
    } catch {
      // use default modifier
    }
  }

  const tier = getCostTier(amenityCount);
  const modifier = COST_MODIFIERS[tier];

  return NextResponse.json({
    insights: categories.map((c) => ({
      ...c,
      estimatedCost: Math.round(c.baseCost * modifier),
    })),
    destinationType: destType,
    costTier: tier,
  });
}