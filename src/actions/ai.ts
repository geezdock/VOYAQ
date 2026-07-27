"use server";

import { getDestinationCoords } from "@/constants/destinations";

// ─── Gemini helper ─────────────────────────────────────

function getGeminiEndpoint(): string | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
}

async function callGemini(prompt: string, maxTokens: number = 1024): Promise<string | null> {
  const endpoint = getGeminiEndpoint();
  if (!endpoint) return null;
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: maxTokens },
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
  } catch {
    return null;
  }
}

function parseJSON<T>(text: string): T | null {
  try {
    return JSON.parse(text.replace(/```json?/gi, "").replace(/```/g, "").trim()) as T;
  } catch {
    return null;
  }
}

// ─── Suggest ───────────────────────────────────────────

function getFallbackSuggestions(destination: string, budget?: number) {
  const budgetStr = budget ? ` ₹${budget.toLocaleString("en-IN")}` : "";
  return [
    { type: "budget", tip: `Book group stays and local transport in advance for ${destination} to keep costs within your target budget${budgetStr}.`, priority: "high" },
    { type: "transport", tip: `Rent shared scooters or book local cabs in ${destination} to split transit costs seamlessly across the squad.`, priority: "high" },
    { type: "food", tip: `Explore popular local eateries and street food spots near ${destination}'s main market for authentic meals under ₹250/person.`, priority: "medium" },
    { type: "weather", tip: `Keep an eye on daily weather updates before planning beach/trek activities around ${destination}.`, priority: "medium" },
    { type: "general", tip: `Maintain a shared squad wallet or log expenses on VOYAQ to settle bills without post-trip awkwardness.`, priority: "low" },
  ];
}

export async function getAISuggestions(options: {
  destination: string;
  budget?: number;
  dates?: { start: string; end: string };
  preferences?: string[];
}) {
  const { destination, budget, dates, preferences } = options;
  if (!destination) throw new Error("Missing 'destination'");

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { suggestions: getFallbackSuggestions(destination, budget), isFallback: true };
  }

  const coords = getDestinationCoords(destination);
  const state = coords?.state ?? "";

  const prompt = `You are a travel AI for a group trip planning app used by Indian college students. 
Generate 5 concise, actionable travel tips for a group trip to ${destination}${state ? ", " + state : ""} in India.
${budget ? `The group's budget is ₹${budget}/person.` : ""}
${dates ? `Trip dates: ${dates.start} to ${dates.end}.` : ""}
${preferences?.length ? `Group preferences: ${preferences.join(", ")}.` : ""}

Return exactly 5 tips as a JSON array with objects having these fields:
- "type": one of "weather", "budget", "transport", "food", "general"
- "tip": a specific, actionable tip (1-2 sentences, Indian context)
- "priority": "high", "medium", or "low"

Rules:
- Tips must be specific to ${destination} and relevant to Indian student travelers
- Include real neighborhood names, landmarks, and local transport options
- Consider budget constraints, weather, and group dynamics
- Return ONLY the JSON array, no markdown, no explanation`;

  const text = await callGemini(prompt, 1024);
  if (!text) return { suggestions: getFallbackSuggestions(destination, budget), isFallback: true };

  const suggestions = parseJSON<unknown[]>(text);
  if (!suggestions) return { suggestions: getFallbackSuggestions(destination, budget), isFallback: true };

  return { suggestions };
}

// ─── Itinerary ─────────────────────────────────────────

function getFallbackItinerary(destination: string, daysCount: number, budget: number) {
  const dayBudget = Math.round(budget / daysCount);
  const activities = [
    { time: "08:00", activity: "Breakfast at local café", description: `Start the day with a hearty breakfast at a nearby eatery in ${destination}.`, category: "food", cost: 200, location: "" },
    { time: "09:30", activity: "Explore local market", description: "Visit the main market area to experience local culture and shop for souvenirs.", category: "activity", cost: 300, location: "" },
    { time: "12:30", activity: "Lunch break", description: "Enjoy a traditional lunch at a recommended restaurant.", category: "food", cost: 350, location: "" },
    { time: "14:00", activity: "Sightseeing", description: `Visit key attractions and landmarks around ${destination}.`, category: "sightseeing", cost: 500, location: "" },
    { time: "17:00", activity: "Evening walk", description: "Take a relaxed walk through scenic spots and capture photos.", category: "activity", cost: 100, location: "" },
    { time: "19:30", activity: "Group dinner", description: "End the day with a group dinner at a popular restaurant.", category: "food", cost: 400, location: "" },
    { time: "21:00", activity: "Back to stay", description: "Return to accommodation and rest for the next day.", category: "rest", cost: 0, location: "" },
  ];
  const days = [];
  for (let i = 0; i < daysCount; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split("T")[0];
    const remaining = dayBudget - activities.reduce((s, a) => s + a.cost, 0);
    days.push({
      day: i + 1,
      date: dateStr,
      title: i === 0 ? "Arrival & Exploration" : i === daysCount - 1 ? "Final Day & Departure" : `Day ${i + 1} - Explore ${destination}`,
      entries: activities.map((a) => ({ time: a.time, activity: a.activity, description: a.description, category: a.category, estimatedCost: a.cost, location: a.location })),
      dailyBudget: dayBudget,
      tips: ["Carry water and stay hydrated", "Wear comfortable shoes for walking", remaining > 0 ? `You have ₹${remaining} spare for extras today` : "Stick to the budget today"],
    });
  }
  return days;
}

export async function getItinerary(dest: string, startDate: string, endDate: string, budgetRaw?: string) {
  if (!dest || !startDate || !endDate) throw new Error("Missing required parameters: dest, start, end");
  const budget = budgetRaw ? parseInt(budgetRaw, 10) : 5000;
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) throw new Error("Invalid date format");
  const daysCount = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { destination: dest, totalBudget: budget, days: getFallbackItinerary(dest, daysCount, budget), totalEstimatedCost: budget, generatedAt: new Date().toISOString() };
  }

  const coords = getDestinationCoords(dest);
  const state = coords?.state ?? "";

  const prompt = `You are a travel AI for VOYAQ, a group trip planning app for Indian college students (ages 18-25).
Generate a day-by-day itinerary for a group trip to ${dest}${state ? ", " + state : ""}, India.

Trip details:
- Destination: ${dest}
- Total days: ${daysCount}
- Dates: ${startDate} to ${endDate}
- Per-person budget: ₹${budget} total (₹${Math.round(budget / daysCount)}/day)

Return a JSON object with this exact structure:
{
  "destination": "${dest}",
  "totalBudget": ${budget},
  "days": [
    {
      "day": 1,
      "date": "${startDate}",
      "title": "string — catchy day title",
      "entries": [
        {
          "time": "HH:MM (24hr)",
          "activity": "short activity name",
          "description": "1 sentence description in Indian context",
          "category": "food|transport|activity|sightseeing|rest|travel",
          "estimatedCost": number (₹ per person),
          "location": "real landmark or neighborhood name or null"
        }
      ],
      "dailyBudget": number (₹ per person for this day),
      "tips": ["2-3 concise tips for the day"]
    }
  ],
  "totalEstimatedCost": number,
  "generatedAt": "${new Date().toISOString()}"
}

Rules:
- Return EXACTLY ${daysCount} days, starting ${startDate}
- 4-7 entries per day
- Use REAL ${dest}-specific landmarks, restaurants, neighborhoods
- Budget must total close to ₹${budget} across all days
- Activities must be realistic for Indian student travelers (hostels, street food, local transport, etc.)
- Time entries must be chronological within each day
- Return ONLY the JSON object, no markdown, no explanation`;

  const text = await callGemini(prompt, 4096);
  if (!text) {
    return { destination: dest, totalBudget: budget, days: getFallbackItinerary(dest, daysCount, budget), totalEstimatedCost: budget, generatedAt: new Date().toISOString() };
  }
  const itinerary = parseJSON<Record<string, unknown>>(text);
  if (!itinerary) {
    return { destination: dest, totalBudget: budget, days: getFallbackItinerary(dest, daysCount, budget), totalEstimatedCost: budget, generatedAt: new Date().toISOString() };
  }
  return itinerary;
}

// ─── Budget Allocator ──────────────────────────────────

function getFallbackAllocation(totalBudget: number) {
  return {
    stay: Math.round(totalBudget * 0.35), stayPct: 35,
    food: Math.round(totalBudget * 0.25), foodPct: 25,
    transport: Math.round(totalBudget * 0.25), transportPct: 25,
    activities: Math.round(totalBudget * 0.10), activitiesPct: 10,
    buffer: Math.round(totalBudget * 0.05), bufferPct: 5,
    total: totalBudget,
    reasoning: `Smart allocation for student travelers: 35% on budget hostels, 25% on local food, 25% on shared transport, 10% on activities, 5% buffer.`,
  };
}

export async function getBudgetAllocation(dest: string, budgetRaw: string) {
  if (!dest || !budgetRaw) throw new Error("Missing required parameters: dest, budget");
  const totalBudget = parseInt(budgetRaw, 10);
  if (isNaN(totalBudget) || totalBudget <= 0) throw new Error("Invalid budget value");

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return getFallbackAllocation(totalBudget);

  const coords = getDestinationCoords(dest);
  const state = coords?.state ?? "";

  const prompt = `You are a travel budget AI for VOYAQ, a group trip planner for Indian college students.
Given a destination and total per-person budget, allocate the budget optimally for a group of students.

Destination: ${dest}${state ? ", " + state : ""}
Total Budget: ₹${totalBudget} per person

Return a JSON object with exactly this structure (no markdown, no explanation):
{
  "stay": number (rupees, 30-40% typically),
  "stayPct": number (percentage),
  "food": number (rupees, 20-30% typically),
  "foodPct": number,
  "transport": number (rupees, 20-30% typically),
  "transportPct": number,
  "activities": number (rupees, 8-15% typically),
  "activitiesPct": number,
  "buffer": number (rupees, 3-8% typically),
  "bufferPct": number,
  "reasoning": "1-2 sentence explanation tailored to ${dest} and Indian student travel"
}

Rules:
- All categories must sum to ₹${totalBudget}
- Percentages must sum to 100
- Consider that ${dest} is in India and students use hostels/budget hotels, local transport, street food
- Make it specific to ${dest}'s cost of living
- Return ONLY the JSON object`;

  const text = await callGemini(prompt, 1024);
  if (!text) return getFallbackAllocation(totalBudget);
  const allocation = parseJSON<Record<string, unknown>>(text);
  if (!allocation) return getFallbackAllocation(totalBudget);
  return allocation;
}

// ─── Event Updates ─────────────────────────────────────

function getFallbackEventUpdates(destination: string) {
  return {
    destination,
    updates: [
      {
        type: "weather_alert",
        title: "Seasonal Weather Pattern",
        description: `Typical weather for ${destination} this time of year.`,
        originalPlan: "Outdoor activities and sightseeing",
        adjustedSuggestion: "Keep a flexible schedule and check daily forecasts. Plan indoor backups for afternoon.",
        severity: "info",
      },
    ],
  };
}

function wdToCondition(code: number): string {
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

export async function getEventUpdates(dest: string, startDate?: string, endDate?: string) {
  if (!dest) throw new Error("Missing required parameter: dest");

  let weatherData: { current?: { temp: number; condition: string }; forecast?: Array<{ date: string; condition: string; tempHigh: number; tempLow: number }> } = {};
  let eventsData: Array<{ name: string; date: string; category: string; description: string }> = [];
  const coords = getDestinationCoords(dest);

  if (coords) {
    try {
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&forecast_days=5&timezone=auto`,
      );
      if (weatherRes.ok) {
        const wd = await weatherRes.json();
        weatherData.forecast = wd.daily?.time?.map((date: string, i: number) => ({
          date,
          condition: wdToCondition(wd.daily.weather_code?.[i] ?? 0),
          tempHigh: Math.round(wd.daily.temperature_2m_max[i]),
          tempLow: Math.round(wd.daily.temperature_2m_min[i]),
        }));
        weatherData.current = wd.current ? { temp: Math.round(wd.current.temperature_2m), condition: wdToCondition(wd.current?.weather_code ?? 0) } : undefined;
      }
    } catch { /* continue */ }
    try {
      const eventsRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(dest)}`);
      if (eventsRes.ok) {
        const ed = await eventsRes.json();
        if (ed.extract) {
          eventsData = [{ name: `About ${dest}`, date: startDate || "ongoing", category: "local", description: ed.extract.substring(0, 300) }];
        }
      }
    } catch { /* continue */ }
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return getFallbackEventUpdates(dest);

  const forecastStr = weatherData.forecast?.length
    ? weatherData.forecast.map((f) => `${f.date}: ${f.condition}, ${f.tempLow}-${f.tempHigh}°C`).join("\n")
    : "No forecast available";
  const eventsStr = eventsData.length
    ? eventsData.map((e) => `${e.name} (${e.date}): ${e.description.substring(0, 100)}`).join("\n")
    : "No events detected";

  const prompt = `You are a reactive travel AI for VOYAQ, monitoring live conditions for a student group trip.

Destination: ${dest}
${startDate ? `Trip dates: ${startDate} to ${endDate || startDate}` : ""}

Current Weather: ${weatherData.current ? `${weatherData.current.condition}, ${weatherData.current.temp}°C` : "Unknown"}
Forecast:
${forecastStr}

Local Events/Info:
${eventsStr}

Analyze if weather or events require itinerary adjustments. Return a JSON object:
{
  "destination": "${dest}",
  "updates": [
    {
      "type": "weather_alert" | "festival_alert" | "advisory",
      "title": "short alert title",
      "description": "what's happening (1 sentence)",
      "originalPlan": "what was likely planned",
      "adjustedSuggestion": "what to do instead (specific to ${dest})",
      "severity": "info" | "warning" | "critical"
    }
  ]
}

Rules:
- 1-3 updates maximum
- Be specific to ${dest} and Indian travel context
- If conditions are normal, return empty updates array
- Consider monsoon, heat, cold, festivals, holidays
- Return ONLY the JSON, no markdown`;

  const text = await callGemini(prompt, 2048);
  if (!text) return getFallbackEventUpdates(dest);
  const result = parseJSON<Record<string, unknown>>(text);
  if (!result) return getFallbackEventUpdates(dest);
  return result;
}
