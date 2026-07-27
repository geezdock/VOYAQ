import { NextResponse } from "next/server";
import { getDestinationCoords } from "@/constants/destinations";

interface OsmElement {
  type: string;
  tags?: Record<string, string>;
  lat?: number;
  lon?: number;
}

const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];

const FALLBACK_ATTRACTIONS: Record<string, { name: string; description: string; category: string; approximateCost: number; duration: string; bestTime: string }[]> = {
  manali: [
    { name: "Hadimba Temple", description: "Ancient cave temple dedicated to Hadimba Devi", category: "Temple", approximateCost: 0, duration: "1-2 hours", bestTime: "Morning" },
    { name: "Solang Valley", description: "Popular adventure sports destination with paragliding, zorbing, skiing", category: "Adventure", approximateCost: 500, duration: "Half day", bestTime: "Daytime" },
    { name: "Rohtang Pass", description: "High mountain pass with stunning Himalayan views (seasonal access)", category: "Mountain Pass", approximateCost: 0, duration: "Full day", bestTime: "Summer mornings" },
    { name: "Old Manali", description: "Charming village with cafes, guesthouses, and Manu Temple", category: "Village", approximateCost: 0, duration: "2-3 hours", bestTime: "Any time" },
    { name: "Vashisht Hot Springs", description: "Natural hot water springs with ancient temples", category: "Hot Springs", approximateCost: 0, duration: "1-2 hours", bestTime: "Evening" },
    { name: "Jogini Falls", description: "Beautiful waterfall trek from Vashisht village", category: "Waterfall", approximateCost: 0, duration: "2-3 hours", bestTime: "Morning" },
    { name: "Mall Road", description: "Main shopping and dining street in Manali", category: "Market", approximateCost: 0, duration: "1-2 hours", bestTime: "Evening" },
    { name: "Tibetan Monastery", description: "Colorful monastery with prayer wheels and Himalayan views", category: "Monastery", approximateCost: 0, duration: "1 hour", bestTime: "Morning" },
    { name: "Nehru Kund", description: "Natural spring named after Jawaharlal Nehru", category: "Spring", approximateCost: 0, duration: "30 mins", bestTime: "Morning" },
    { name: "Manali Sanctuary", description: "Wildlife sanctuary with Himalayan birds and animals", category: "Sanctuary", approximateCost: 50, duration: "2-3 hours", bestTime: "Morning" },
  ],
  goa: [
    { name: "Baga Beach", description: "Popular beach with water sports and nightlife", category: "Beach", approximateCost: 0, duration: "Half day", bestTime: "Morning/Evening" },
    { name: "Calangute Beach", description: "Largest beach in North Goa with shacks and activities", category: "Beach", approximateCost: 0, duration: "Half day", bestTime: "Morning/Evening" },
    { name: "Fort Aguada", description: "17th-century Portuguese fort with lighthouse", category: "Fort", approximateCost: 25, duration: "1-2 hours", bestTime: "Morning" },
    { name: "Dudhsagar Falls", description: "Spectacular four-tiered waterfall on the Goa-Karnataka border", category: "Waterfall", approximateCost: 0, duration: "Full day", bestTime: "Monsoon" },
    { name: "Basilica of Bom Jesus", description: "UNESCO World Heritage church holding St. Francis Xavier's remains", category: "Church", approximateCost: 0, duration: "1-2 hours", bestTime: "Morning" },
  ],
  "north goa": [
    { name: "Baga Beach", description: "Popular beach with water sports and nightlife", category: "Beach", approximateCost: 0, duration: "Half day", bestTime: "Morning/Evening" },
    { name: "Calangute Beach", description: "Largest beach in North Goa with shacks and activities", category: "Beach", approximateCost: 0, duration: "Half day", bestTime: "Morning/Evening" },
    { name: "Anjuna Flea Market", description: "Famous weekly market with clothes, jewelry, and handicrafts", category: "Market", approximateCost: 0, duration: "2-3 hours", bestTime: "Wednesday" },
    { name: "Chapora Fort", description: "Hilltop fort with panoramic views of Chapora River", category: "Fort", approximateCost: 0, duration: "1-2 hours", bestTime: "Sunset" },
    { name: "Vagator Beach", description: "Scenic beach with red cliffs and relaxed vibe", category: "Beach", approximateCost: 0, duration: "Half day", bestTime: "Morning/Evening" },
  ],
  kasol: [
    { name: "Kheerganga Trek", description: "Popular trek to hot springs with stunning Parvati Valley views", category: "Trek", approximateCost: 0, duration: "Full day", bestTime: "Morning" },
    { name: "Manikaran Sahib", description: "Famous Sikh gurudwara with hot springs", category: "Gurudwara", approximateCost: 0, duration: "2-3 hours", bestTime: "Morning" },
    { name: "Tosh Village", description: "Hippie village at end of Parvati Valley with mountain views", category: "Village", approximateCost: 0, duration: "Half day", bestTime: "Daytime" },
    { name: "Chalal Village", description: "Peaceful riverside village near Kasol", category: "Village", approximateCost: 0, duration: "2-3 hours", bestTime: "Daytime" },
    { name: "Malana Village", description: "Ancient village with unique customs and Malana cream", category: "Village", approximateCost: 0, duration: "Full day", bestTime: "Daytime" },
  ],
  shimla: [
    { name: "Mall Road", description: "Main shopping street with colonial architecture", category: "Market", approximateCost: 0, duration: "2-3 hours", bestTime: "Evening" },
    { name: "Jakhoo Temple", description: "Ancient Hanuman temple at Shimla's highest peak", category: "Temple", approximateCost: 0, duration: "1-2 hours", bestTime: "Morning" },
    { name: "Christ Church", description: "Second oldest church in North India, neo-Gothic architecture", category: "Church", approximateCost: 0, duration: "1 hour", bestTime: "Morning" },
    { name: "Kufri", description: "Hill station near Shimla with skiing and Himalayan views", category: "Hill Station", approximateCost: 0, duration: "Half day", bestTime: "Daytime" },
    { name: "Summer Hill", description: "Quiet township with beautiful views on Shimla-Kalka railway", category: "Viewpoint", approximateCost: 0, duration: "1-2 hours", bestTime: "Morning" },
  ],
};

const FALLBACK_FOOD: Record<string, { name: string; description: string; category: string; priceRange: string; restaurant: string; tags: string[] }[]> = {
  manali: [
    { name: "Johnson's Cafe", description: "Popular cafe with trout, pancakes, and mountain views", category: "Cafe", priceRange: "₹500-1000", restaurant: "Johnson's Cafe", tags: ["cafe", "trout", "breakfast"] },
    { name: "The Lazy Dog", description: "Riverside cafe with Israeli and Continental food", category: "Cafe", priceRange: "₹400-800", restaurant: "The Lazy Dog", tags: ["cafe", "israeli", "riverside"] },
    { name: "Dylan's Toasted & Roasted", description: "Cozy cafe known for sandwiches, coffee, and baked goods", category: "Cafe", priceRange: "₹300-600", restaurant: "Dylan's Toasted & Roasted", tags: ["cafe", "sandwiches", "coffee"] },
    { name: "Chopsticks", description: "Chinese and Tibetan restaurant popular with locals", category: "Restaurant", priceRange: "₹300-700", restaurant: "Chopsticks", tags: ["chinese", "tibetan", "local"] },
    { name: "Il Forno", description: "Italian restaurant with wood-fired pizza and pasta", category: "Restaurant", priceRange: "₹500-1200", restaurant: "Il Forno", tags: ["italian", "pizza", "pasta"] },
  ],
  goa: [
    { name: "Britto's", description: "Iconic beach shack on Baga Beach serving Goan seafood", category: "Restaurant", priceRange: "₹500-1500", restaurant: "Britto's", tags: ["goan", "seafood", "beach"] },
    { name: "Gunpowder", description: "South Indian restaurant in Assagao with authentic flavors", category: "Restaurant", priceRange: "₹800-2000", restaurant: "Gunpowder", tags: ["south indian", "authentic"] },
    { name: "Thalassa", description: "Greek taverna on Vagator cliffs with sunset views", category: "Restaurant", priceRange: "₹1000-3000", restaurant: "Thalassa", tags: ["greek", "sunset", "cliff"] },
    { name: "Fisherman's Wharf", description: "Riverside restaurant with live music and Goan cuisine", category: "Restaurant", priceRange: "₹800-2500", restaurant: "Fisherman's Wharf", tags: ["goan", "live music", "riverside"] },
  ],
};

function osmToFoodItems(elements: OsmElement[]) {
  const seen = new Set<string>();
  return elements
    .filter((el) => {
      const name = el.tags?.name;
      if (!name || seen.has(name.toLowerCase())) return false;
      seen.add(name.toLowerCase());
      return true;
    })
    .slice(0, 12)
    .map((el) => {
      const tags = el.tags ?? {};
      const cuisine = tags.cuisine ?? "";
      const categories = cuisine.split(";").map((c) => c.trim());
      const priceRange = tags["charge"] ?? tags["fee"] ?? "";
      return {
        name: tags.name ?? "Unknown",
        description: `${cuisine ? cuisine + " cuisine" : "Local fare"} ${tags["addr:street"] ? "at " + tags["addr:street"] : "in the area"}`,
        category: categories[0] || "Restaurant",
        priceRange: priceRange ? `₹${priceRange}` : "Varies",
        restaurant: tags.name,
        tags: [...categories, "local"],
      };
    });
}

function osmToAttractions(elements: OsmElement[]) {
  const seen = new Set<string>();
  return elements
    .filter((el) => {
      const name = el.tags?.name;
      if (!name || seen.has(name.toLowerCase())) return false;
      seen.add(name.toLowerCase());
      return true;
    })
    .slice(0, 12)
    .map((el) => {
      const tags = el.tags ?? {};
      const tourism = tags.tourism ?? tags.historic ?? tags.leisure ?? "attraction";
      return {
        name: tags.name ?? "Unknown",
        description: tags.description ?? tags.wikipedia ?? `${tourism} in the area`,
        category: tourism.charAt(0).toUpperCase() + tourism.slice(1),
        approximateCost: tags["charge"] ? parseInt(tags["charge"]) || 0 : 0,
        duration: tags["opening_hours"] ? "Varies" : "1-2 hours",
        bestTime: "Daytime",
      };
    });
}

async function fetchWithFallback(query: string) {
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ data: query }),
        signal: AbortSignal.timeout(25000),
      });
      if (res.ok) return await res.json();
    } catch {
      continue;
    }
  }
  throw new Error("All Overpass endpoints failed");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dest = searchParams.get("dest");
  const type = searchParams.get("type") ?? "attractions";

  if (!dest) {
    return NextResponse.json({ error: "Missing 'dest' parameter" }, { status: 400 });
  }

  const coords = getDestinationCoords(dest);
  if (!coords) {
    return NextResponse.json({ error: `Unknown destination: ${dest}` }, { status: 404 });
  }

  const cacheKey = `${dest}:${type}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  const radius = 5000;
  let query: string;

  if (type === "food") {
    query = `[out:json][timeout:20];(node["amenity"="restaurant"](around:${radius},${coords.lat},${coords.lon});node["amenity"="cafe"](around:${radius},${coords.lat},${coords.lon}););out body;`;
  } else {
    query = `[out:json][timeout:20];(node["tourism"="attraction"](around:${radius},${coords.lat},${coords.lon});node["tourism"="museum"](around:${radius},${coords.lat},${coords.lon});node["historic"](around:${radius},${coords.lat},${coords.lon}););out body;`;
  }

  try {
    const data = await fetchWithFallback(query);
    const elements: OsmElement[] = data.elements ?? [];

    let result;
    if (type === "food") {
      result = { items: osmToFoodItems(elements) };
    } else {
      result = { attractions: osmToAttractions(elements) };
    }

    cache.set(cacheKey, { data: result, timestamp: Date.now() });
    return NextResponse.json(result);
  } catch {
    // Fallback to static data
    const destKey = dest.toLowerCase().trim();
    let fallbackData: unknown = null;

    if (type === "food") {
      fallbackData = FALLBACK_FOOD[destKey] ? { items: FALLBACK_FOOD[destKey] } : { items: [] };
    } else {
      fallbackData = FALLBACK_ATTRACTIONS[destKey] ? { attractions: FALLBACK_ATTRACTIONS[destKey] } : { attractions: [] };
    }

    if (fallbackData && (type === "food" ? (fallbackData as { items: unknown[] }).items.length > 0 : (fallbackData as { attractions: unknown[] }).attractions.length > 0)) {
      cache.set(cacheKey, { data: fallbackData, timestamp: Date.now() });
      return NextResponse.json(fallbackData);
    }

    return NextResponse.json({ error: "Failed to fetch places" }, { status: 502 });
  }
}
