import { NextResponse } from "next/server";
import { getDestinationCoords } from "@/lib/destinations";

interface OsmElement {
  type: string;
  tags?: Record<string, string>;
  lat?: number;
  lon?: number;
}

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

  const radius = 8000;
  let query: string;

  if (type === "food") {
    query = `[out:json];(node["amenity"="restaurant"](around:${radius},${coords.lat},${coords.lon});node["amenity"="cafe"](around:${radius},${coords.lat},${coords.lon});way["amenity"="restaurant"](around:${radius},${coords.lat},${coords.lon}););out body;`;
  } else {
    query = `[out:json];(node["tourism"="attraction"](around:${radius},${coords.lat},${coords.lon});node["tourism"="museum"](around:${radius},${coords.lat},${coords.lon});node["historic"](around:${radius},${coords.lat},${coords.lon});way["tourism"="attraction"](around:${radius},${coords.lat},${coords.lon}););out body;`;
  }

  try {
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ data: query }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "OpenStreetMap query failed" }, { status: 502 });
    }

    const data = await res.json();
    const elements: OsmElement[] = data.elements ?? [];

    if (type === "food") {
      return NextResponse.json({ items: osmToFoodItems(elements) });
    }
    return NextResponse.json({ attractions: osmToAttractions(elements) });
  } catch {
    return NextResponse.json({ error: "Failed to fetch places" }, { status: 502 });
  }
}
