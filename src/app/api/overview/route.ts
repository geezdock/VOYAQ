import { NextResponse } from "next/server";
import { getDestinationCoords } from "@/lib/destinations";

interface WikiPage {
  extract?: string;
  thumbnail?: { source: string };
  content_urls?: { desktop: { page: string } };
  coordinates?: { lat: number; lon: number }[];
}

async function fetchWikiSummary(destination: string): Promise<WikiPage | null> {
  const searchRes = await fetch(
    `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(destination + " India")}&format=json&srlimit=1`,
    { headers: { "User-Agent": "VOYAQ/1.0" } },
  );
  const searchData = await searchRes.json();
  const title = searchData?.query?.search?.[0]?.title;
  if (!title) return null;

  const pageRes = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
    { headers: { "User-Agent": "VOYAQ/1.0" } },
  );
  if (!pageRes.ok) return null;
  return pageRes.json();
}

const STATE_FACTS: Record<string, { language: string; currency: string; timeZone: string }> = {
  "Goa": { language: "Konkani, English, Hindi", currency: "INR (₹)", timeZone: "IST (UTC+5:30)" },
  "Himachal Pradesh": { language: "Hindi, English, Pahari", currency: "INR (₹)", timeZone: "IST (UTC+5:30)" },
  "Ladakh": { language: "Hindi, English, Ladakhi", currency: "INR (₹)", timeZone: "IST (UTC+5:30)" },
  "Jammu & Kashmir": { language: "Hindi, English, Kashmiri", currency: "INR (₹)", timeZone: "IST (UTC+5:30)" },
  "Uttarakhand": { language: "Hindi, English, Garhwali", currency: "INR (₹)", timeZone: "IST (UTC+5:30)" },
  "Rajasthan": { language: "Hindi, English, Rajasthani", currency: "INR (₹)", timeZone: "IST (UTC+5:30)" },
  "Uttar Pradesh": { language: "Hindi, English, Urdu", currency: "INR (₹)", timeZone: "IST (UTC+5:30)" },
  "Delhi": { language: "Hindi, English, Punjabi", currency: "INR (₹)", timeZone: "IST (UTC+5:30)" },
  "Maharashtra": { language: "Marathi, Hindi, English", currency: "INR (₹)", timeZone: "IST (UTC+5:30)" },
  "Karnataka": { language: "Kannada, English, Hindi", currency: "INR (₹)", timeZone: "IST (UTC+5:30)" },
  "Tamil Nadu": { language: "Tamil, English", currency: "INR (₹)", timeZone: "IST (UTC+5:30)" },
  "Puducherry": { language: "Tamil, French, English", currency: "INR (₹)", timeZone: "IST (UTC+5:30)" },
  "Kerala": { language: "Malayalam, English, Hindi", currency: "INR (₹)", timeZone: "IST (UTC+5:30)" },
  "West Bengal": { language: "Bengali, English, Hindi", currency: "INR (₹)", timeZone: "IST (UTC+5:30)" },
  "Sikkim": { language: "Nepali, English, Hindi", currency: "INR (₹)", timeZone: "IST (UTC+5:30)" },
  "Meghalaya": { language: "Khasi, Garo, English", currency: "INR (₹)", timeZone: "IST (UTC+5:30)" },
  "Assam": { language: "Assamese, English, Hindi", currency: "INR (₹)", timeZone: "IST (UTC+5:30)" },
  "Telangana": { language: "Telugu, Urdu, English", currency: "INR (₹)", timeZone: "IST (UTC+5:30)" },
  "Andhra Pradesh": { language: "Telugu, English, Hindi", currency: "INR (₹)", timeZone: "IST (UTC+5:30)" },
  "Andaman & Nicobar": { language: "Hindi, English, Bengali", currency: "INR (₹)", timeZone: "IST (UTC+5:30)" },
};

const DEST_BEST_TIME: Record<string, string> = {
  goa: "November to February",
  manali: "March to June, December to February",
  leh: "May to September",
  srinagar: "April to October",
  rishikesh: "September to June",
  jaipur: "October to March",
  kerala: "September to March",
  darjeeling: "April to June, September to November",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dest = searchParams.get("dest");

  if (!dest) {
    return NextResponse.json({ error: "Missing 'dest' parameter" }, { status: 400 });
  }

  const coords = getDestinationCoords(dest);
  const key = dest.toLowerCase().trim();
  const state = coords?.state ?? "";
  const facts = STATE_FACTS[state];
  const bestTime = DEST_BEST_TIME[key] ?? "Varies by season";

  const wiki = await fetchWikiSummary(key);

  return NextResponse.json({
    description: wiki?.extract?.split("\n")[0] ?? `${dest} is a popular travel destination in ${state || "India"}.`,
    bestTimeToVisit: bestTime,
    language: facts?.language ?? "Hindi, English",
    currency: facts?.currency ?? "INR (₹)",
    timeZone: facts?.timeZone ?? "IST (UTC+5:30)",
    image: wiki?.thumbnail?.source ?? null,
    wikiUrl: wiki?.content_urls?.desktop?.page ?? null,
    quickFacts: wiki?.extract
      ? [
          { label: "Known for", value: dest },
          { label: "Region", value: state || "India" },
          { label: "Coordinates", value: coords ? `${coords.lat}°N, ${coords.lon}°E` : "—" },
          { label: "Best time", value: bestTime },
        ]
      : [],
  });
}
