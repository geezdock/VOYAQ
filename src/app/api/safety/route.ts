import { NextResponse } from "next/server";
import { getDestinationCoords } from "@/lib/destinations";

interface OsmElement {
  type: string;
  tags?: Record<string, string>;
  lat?: number;
  lon?: number;
}

const STATE_TOURIST_HELPLINES: Record<string, string> = {
  "Goa": "1800-111-363",
  "Himachal Pradesh": "1800-180-8077",
  "Rajasthan": "1800-180-6124",
  "Kerala": "1800-425-4747",
  "Delhi": "1800-11-1363",
};

const DEFAULT_HELPLINE = "1800-11-1363";

const ADVISORIES: Record<string, { severity: "low" | "medium" | "high"; title: string; description: string }[]> = {
  himachal: [
    {
      severity: "low",
      title: "Mountain Road Safety",
      description: "Mountain roads can be narrow and prone to landslides during monsoon. Drive cautiously and check road conditions before traveling.",
    },
  ],
  leh: [
    {
      severity: "medium",
      title: "Altitude Sickness Risk",
      description: "Ladakh is at high altitude (3,500m+). Acclimatize for 2 days before strenuous activity. Stay hydrated and avoid alcohol.",
    },
  ],
};

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

  let hospitals: string[] = [];

  try {
    const query = `[out:json];(node["amenity"="hospital"](around:${radius},${coords.lat},${coords.lon});node["amenity"="police"](around:${radius},${coords.lat},${coords.lon});node["amenity"="pharmacy"](around:${radius},${coords.lat},${coords.lon}););out body;`;
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ data: query }),
    });
    if (res.ok) {
      const data = await res.json();
      const elements: OsmElement[] = data.elements ?? [];
      for (const el of elements) {
        const name = el.tags?.name;
        if (name) hospitals.push(name);
      }
    }
  } catch {
    // fall through to static fallback
  }

  const helpline = STATE_TOURIST_HELPLINES[state] ?? DEFAULT_HELPLINE;
  const advisories = ADVISORIES[key] ?? [];

  return NextResponse.json({
    advisories,
    emergency: {
      police: "100",
      ambulance: "108",
      fire: "101",
      nearestHospital: hospitals[0] ?? "Local hospital",
      touristHelpline: helpline,
    },
  });
}