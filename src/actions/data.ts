"use server";

import { getDestinationCoords, DESTINATION_CATALOG, getDestinationsByType, getDestinationsByState, searchDestinations, getDestinationEntry } from "@/constants/destinations";
import { memo } from "@/lib/cache";

// ─── Helpers ───────────────────────────────────────────

function wmoToCondition(code: number): string {
  if (code === 0 || code === 1) return "Sunny";
  if (code === 2) return "Partly Cloudy";
  if (code === 3) return "Cloudy";
  if (code >= 45 && code <= 48) return "Foggy";
  if ((code >= 51 && code <= 55) || code === 56 || code === 57) return "Light Rain";
  if ((code >= 61 && code <= 65) || code === 66 || code === 67) return "Showers";
  if (code >= 71 && code <= 77) return "Snow";
  if (code >= 80 && code <= 82) return "Showers";
  if (code >= 85 && code <= 86) return "Snow";
  if (code >= 95 && code <= 99) return "Thunderstorms";
  return "Sunny";
}

interface WikiPage {
  extract?: string;
  thumbnail?: { source: string };
  content_urls?: { desktop: { page: string } };
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

function getDestinationType(key: string, state: string): "beach" | "hill" | "city" | "desert" {
  const beachPlaces = ["goa", "puducherry", "andaman & nicobar"];
  const hillStates = ["himachal pradesh", "uttarakhand", "ladakh", "jammu & kashmir", "sikkim"];
  const desertPlaces = ["rajasthan"];
  if (beachPlaces.includes(key) || beachPlaces.includes(state.toLowerCase())) return "beach";
  if (desertPlaces.includes(key) || desertPlaces.includes(state.toLowerCase())) return "desert";
  if (hillStates.includes(key) || hillStates.includes(state.toLowerCase())) return "hill";
  return "city";
}

interface OsmElement {
  type: string;
  tags?: Record<string, string>;
  lat?: number;
  lon?: number;
}

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

const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];

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

// ─── Static fallback data ──────────────────────────────

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

const LOCAL_TRANSPORT_TEMPLATES: Record<string, { mode: string; cost: number; details: string }[]> = {
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

const STATE_TOURIST_HELPLINES: Record<string, string> = {
  Goa: "1800-111-363",
  "Himachal Pradesh": "1800-180-8077",
  Rajasthan: "1800-180-6124",
  Kerala: "1800-425-4747",
  Delhi: "1800-11-1363",
};
const DEFAULT_HELPLINE = "1800-11-1363";

const ADVISORIES: Record<string, { severity: "low" | "medium" | "high"; title: string; description: string }[]> = {
  himachal: [{ severity: "low", title: "Mountain Road Safety", description: "Mountain roads can be narrow and prone to landslides during monsoon. Drive cautiously and check road conditions before traveling." }],
  leh: [{ severity: "medium", title: "Altitude Sickness Risk", description: "Ladakh is at high altitude (3,500m+). Acclimatize for 2 days before strenuous activity. Stay hydrated and avoid alcohol." }],
};

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

const COST_MODIFIERS: Record<string, number> = { budget: 0.7, mid: 1.0, premium: 1.4 };

function getCostTier(amenityCount: number): "budget" | "mid" | "premium" {
  if (amenityCount < 20) return "budget";
  if (amenityCount < 80) return "mid";
  return "premium";
}

// ─── Actions ───────────────────────────────────────────

export async function getWeather(dest: string) {
  return memo(`weather:${dest}`, 15 * 60 * 1000, async () => {
    const coords = getDestinationCoords(dest);
    if (!coords) throw new Error(`Unknown destination: ${dest}`);
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${coords.lat}` +
        `&longitude=${coords.lon}` +
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m` +
        `&daily=temperature_2m_max,temperature_2m_min,weather_code` +
        `&forecast_days=5` +
        `&timezone=auto`,
    );
    if (!res.ok) throw new Error("Open-Meteo request failed");
    const data = await res.json();
    return {
      current: {
        temp: Math.round(data.current.temperature_2m),
        condition: wmoToCondition(data.current.weather_code),
        icon: "",
        humidity: data.current.relative_humidity_2m,
        windSpeed: Math.round(data.current.wind_speed_10m),
      },
      forecast: data.daily.time.map((date: string, i: number) => ({
        date,
        tempHigh: Math.round(data.daily.temperature_2m_max[i]),
        tempLow: Math.round(data.daily.temperature_2m_min[i]),
        condition: wmoToCondition(data.daily.weather_code[i]),
      })),
    };
  });
}

export async function getPlaces(dest: string, type: string = "attractions") {
  return memo(`places:${dest}:${type}`, 30 * 60 * 1000, async () => {
    const coords = getDestinationCoords(dest);
    if (!coords) throw new Error(`Unknown destination: ${dest}`);
    const radius = 5000;
    const query = type === "food"
      ? `[out:json][timeout:20];(node["amenity"="restaurant"](around:${radius},${coords.lat},${coords.lon});node["amenity"="cafe"](around:${radius},${coords.lat},${coords.lon}););out body;`
      : `[out:json][timeout:20];(node["tourism"="attraction"](around:${radius},${coords.lat},${coords.lon});node["tourism"="museum"](around:${radius},${coords.lat},${coords.lon});node["historic"](around:${radius},${coords.lat},${coords.lon}););out body;`;
    try {
      const data = await fetchWithFallback(query);
      const elements: OsmElement[] = data.elements ?? [];
      if (type === "food") {
        return { items: osmToFoodItems(elements) };
      } else {
        return { attractions: osmToAttractions(elements) };
      }
    } catch {
      const destKey = dest.toLowerCase().trim();
      if (type === "food") {
        const fallback = FALLBACK_FOOD[destKey];
        if (fallback?.length) return { items: fallback };
      } else {
        const fallback = FALLBACK_ATTRACTIONS[destKey];
        if (fallback?.length) return { attractions: fallback };
      }
      throw new Error("Failed to fetch places");
    }
  });
}

export async function getTransport(dest: string) {
  return memo(`transport:${dest}`, 30 * 60 * 1000, async () => {
    const coords = getDestinationCoords(dest);
    if (!coords) throw new Error(`Unknown destination: ${dest}`);
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
    } catch { /* fall through */ }
    const displayName = dest.charAt(0).toUpperCase() + dest.slice(1);
    const localOptions = LOCAL_TRANSPORT_TEMPLATES[destType];
    const options: { mode: string; from: string; to: string; cost: number; duration: string; details: string }[] = [];
    if (airports.length > 0) {
      options.push({ mode: "Flight", from: "Major cities", to: airports[0], cost: 4000, duration: "1-2 hrs", details: `Direct flights to ${airports[0]}. Book in advance for best rates.` });
    }
    if (railwayStations.length > 0) {
      const nearest = railwayStations.slice(0, 2).join(" or ");
      options.push({ mode: "Train", from: "Major cities", to: nearest, cost: 1500, duration: "8-14 hrs", details: `Nearest station: ${nearest}. Book 2-3 months ahead in peak season.` });
    }
    if (busStops.length > 0) {
      options.push({ mode: "Bus", from: "Major cities", to: `${displayName} Bus Stand`, cost: 1000, duration: "12-14 hrs", details: `Overnight Volvo buses available. Book via RedBus.` });
    }
    for (const local of localOptions) {
      options.push({ mode: local.mode, from: "Local", to: `${displayName} area`, cost: local.cost, duration: "Per day", details: local.details });
    }
    return { options };
  });
}

export async function getSafety(dest: string) {
  return memo(`safety:${dest}`, 30 * 60 * 1000, async () => {
    const coords = getDestinationCoords(dest);
    if (!coords) throw new Error(`Unknown destination: ${dest}`);
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
    } catch { /* fall through */ }
    const helpline = STATE_TOURIST_HELPLINES[state] ?? DEFAULT_HELPLINE;
    const advisories = ADVISORIES[key] ?? [];
    return {
      advisories,
      emergency: {
        police: "100",
        ambulance: "108",
        fire: "101",
        nearestHospital: hospitals[0] ?? "Local hospital",
        touristHelpline: helpline,
      },
    };
  });
}

export async function getEvents(dest: string) {
  return memo(`events:${dest}`, 60 * 60 * 1000, async () => {
    const coords = getDestinationCoords(dest);
    const key = dest.toLowerCase().trim();
    const state = coords?.state ?? "";
    try {
      const searchRes = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(key + " festivals events")}&format=json&srlimit=3`,
        { headers: { "User-Agent": "VOYAQ/1.0" } },
      );
      const searchData = await searchRes.json();
      const pages = searchData?.query?.search ?? [];
      const eventPages = await Promise.all(
        pages.slice(0, 2).map(async (page: { title: string }) => {
          const res = await fetch(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(page.title)}`,
            { headers: { "User-Agent": "VOYAQ/1.0" } },
          );
          if (!res.ok) return null;
          return res.json();
        }),
      );
      const events = eventPages
        .filter(Boolean)
        .slice(0, 6)
        .map((page: Record<string, unknown>) => ({
          name: (page.titles as Record<string, string> | undefined)?.normalized ?? (page.title as string) ?? `Event in ${dest}`,
          date: (page.description as string | undefined)?.includes("festival") ? "Seasonal" : "Annual",
          description: ((page.extract as string | undefined)?.split("\n")[0]?.slice(0, 200)) ?? `Cultural event in ${dest}`,
          venue: key.charAt(0).toUpperCase() + key.slice(1),
          category: (page.description as string | undefined)?.includes("festival")
            ? "Cultural Festival"
            : (page.description as string | undefined)?.includes("music")
              ? "Music Festival"
              : "Local Event",
        }));
      if (events.length === 0) {
        events.push({
          name: `${dest.charAt(0).toUpperCase() + dest.slice(1)} Festival Season`,
          date: "Seasonal",
          description: `${dest} hosts various cultural festivals and events throughout the year. Check local listings for upcoming events during your visit.`,
          venue: key.charAt(0).toUpperCase() + key.slice(1),
          category: "Cultural Festival",
        });
      }
      return { events };
    } catch {
      return {
        events: [{ name: "Local Events", date: "Check locally", description: `Events and festivals in ${state || dest} area.`, venue: dest.charAt(0).toUpperCase() + dest.slice(1), category: "Local Event" }],
      };
    }
  });
}

export async function getOverview(dest: string) {
  return memo(`overview:${dest}`, 60 * 60 * 1000, async () => {
    const coords = getDestinationCoords(dest);
    const key = dest.toLowerCase().trim();
    const state = coords?.state ?? "";
    const facts = STATE_FACTS[state];
    const bestTime = DEST_BEST_TIME[key] ?? "Varies by season";
    const wiki = await fetchWikiSummary(key);
    return {
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
    };
  });
}

export async function getBudgetInsights(dest: string) {
  return memo(`budget:${dest}`, 30 * 60 * 1000, async () => {
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
      } catch { /* use default modifier */ }
    }
    const tier = getCostTier(amenityCount);
    const modifier = COST_MODIFIERS[tier];
    return {
      insights: categories.map((c) => ({
        ...c,
        estimatedCost: Math.round(c.baseCost * modifier),
      })),
      destinationType: destType,
      costTier: tier,
    };
  });
}

export async function getDestinations(params?: { type?: string; state?: string; q?: string; slug?: string }) {
  if (params?.slug) {
    const entry = getDestinationEntry(params.slug);
    if (!entry) throw new Error("Destination not found");
    return entry;
  }
  if (params?.type) return getDestinationsByType(params.type);
  if (params?.state) return getDestinationsByState(params.state);
  if (params?.q) return searchDestinations(params.q);
  return DESTINATION_CATALOG;
}
