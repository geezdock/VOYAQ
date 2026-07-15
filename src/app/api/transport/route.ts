import { NextResponse } from "next/server";
import { getDestinationCoords } from "@/lib/destinations";

interface OsmElement {
  type: string;
  tags?: Record<string, string>;
  lat?: number;
  lon?: number;
}

const MAJOR_CITIES = [
  { name: "Delhi", lat: 28.6139, lon: 77.209 },
  { name: "Mumbai", lat: 19.076, lon: 72.8777 },
  { name: "Bangalore", lat: 12.9716, lon: 77.5946 },
  { name: "Chennai", lat: 13.0827, lon: 80.2707 },
  { name: "Kolkata", lat: 22.5726, lon: 88.3639 },
  { name: "Hyderabad", lat: 17.385, lon: 78.4867 },
];

const LOCAL_TRANSPORT_TEMPLATES = {
  hill: [
    { mode: "Taxi", cost: 2000, details: "Full day hire for sightseeing" },
    { mode: "Local Bus", cost: 200, details: "Cheapest option for nearby areas" },
  ],
  beach: [
    { mode: "Scooter Rental", cost: 400, details: "Per day. Most popular way to explore." },
    { mode: "Auto Rickshaw", cost: 100, details: "Per km for short trips" },
  ],
  city: [
    { mode: "Metro", cost: 50, details: "Per trip. Covers most areas." },
    { mode: "Auto Rickshaw", cost: 100, details: "Per km. Negotiate before ride." },
  ],
  desert: [
    { mode: "Taxi", cost: 2500, details: "Full day hire including desert areas" },
    { mode: "Bus", cost: 300, details: "State transport buses connect major towns" },
  ],
};

async function queryOverpass(query: string): Promise<OsmElement[]> {
  try {
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ data: query }),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.elements ?? [];
  } catch {
    return [];
  }
}

async function estimateDriveTime(originLat: number, originLon: number, destLat: number, destLon: number): Promise<string | null> {
  try {
    const res = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${originLon},${originLat};${destLon},${destLat}?overview=false`,
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.routes?.[0]) return null;
    const seconds = data.routes[0].duration;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.round((seconds % 3600) / 60);
    if (hours > 0) return `${hours} hr${minutes > 0 ? ` ${minutes} min` : ""}`;
    return `${minutes} min`;
  } catch {
    return null;
  }
}

function getDestinationType(key: string, state: string): "hill" | "beach" | "city" | "desert" {
  const hillStates = ["himachal pradesh", "uttarakhand", "ladakh", "jammu & kashmir", "sikkim"];
  const beachPlaces = ["goa", "puducherry", "andaman & nicobar"];
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
  if (!coords) {
    return NextResponse.json({ error: `Unknown destination: ${dest}` }, { status: 404 });
  }

  const key = dest.toLowerCase().trim();
  const state = coords?.state ?? "";
  const radius = 8000;
  const destType = getDestinationType(key, state);

  let airports: string[] = [];
  let railwayStations: string[] = [];
  let busStops: string[] = [];

  try {
    const query = `[out:json];(node["aeroway"="aerodrome"](around:${radius * 3},${coords.lat},${coords.lon});node["railway"="station"](around:${radius},${coords.lat},${coords.lon});node["highway"="bus_stop"](around:${radius},${coords.lat},${coords.lon}););out body;`;
    const elements = await queryOverpass(query);
    for (const el of elements) {
      const tags = el.tags ?? {};
      const name = tags.name;
      if (!name) continue;
      if (tags.aeroway === "aerodrome") airports.push(name);
      else if (tags.railway === "station") railwayStations.push(name);
      else if (tags.highway === "bus_stop") busStops.push(name);
    }
  } catch {
    // fall through
  }

  const displayName = dest.charAt(0).toUpperCase() + dest.slice(1);
  const localOptions = LOCAL_TRANSPORT_TEMPLATES[destType];

  const options: {
    mode: string;
    from: string;
    to: string;
    cost: number;
    duration: string;
    details: string;
  }[] = [];

  if (airports.length > 0) {
    options.push({
      mode: "Flight",
      from: "Major cities",
      to: airports[0],
      cost: 4000,
      duration: "1-2 hrs",
      details: `Direct flights to ${airports[0]}. Book in advance for best rates.`,
    });
  }

  if (railwayStations.length > 0) {
    const nearest = railwayStations.slice(0, 2).join(" or ");
    options.push({
      mode: "Train",
      from: "Major cities",
      to: nearest,
      cost: 1500,
      duration: "8-14 hrs",
      details: `Nearest station: ${nearest}. Book 2-3 months ahead in peak season.`,
    });
  }

  if (busStops.length > 0) {
    options.push({
      mode: "Bus",
      from: "Major cities",
      to: `${displayName} Bus Stand`,
      cost: 1000,
      duration: "12-14 hrs",
      details: `Overnight Volvo buses available. Book via RedBus.`,
    });
  }

  for (const local of localOptions) {
    options.push({
      mode: local.mode,
      from: "Local",
      to: `${displayName} area`,
      cost: local.cost,
      duration: "Per day",
      details: local.details,
    });
  }

  return NextResponse.json({ options });
}