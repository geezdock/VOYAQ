import { NextResponse } from "next/server";
import { getDestinationCoords } from "@/constants/destinations";

function getFallbackItinerary(destination: string, daysCount: number, budget: number) {
  const dayBudget = Math.round(budget / daysCount);
  const days: Array<{
    day: number;
    date: string;
    title: string;
    entries: Array<{
      time: string;
      activity: string;
      description: string;
      category: string;
      estimatedCost: number;
      location?: string;
    }>;
    dailyBudget: number;
    tips: string[];
  }> = [];

  const activities = [
    { time: "08:00", activity: "Breakfast at local café", description: `Start the day with a hearty breakfast at a nearby eatery in ${destination}.`, category: "food", cost: 200, location: "" },
    { time: "09:30", activity: "Explore local market", description: `Visit the main market area to experience local culture and shop for souvenirs.`, category: "activity", cost: 300, location: "" },
    { time: "12:30", activity: "Lunch break", description: "Enjoy a traditional lunch at a recommended restaurant.", category: "food", cost: 350, location: "" },
    { time: "14:00", activity: "Sightseeing", description: `Visit key attractions and landmarks around ${destination}.`, category: "sightseeing", cost: 500, location: "" },
    { time: "17:00", activity: "Evening walk", description: "Take a relaxed walk through scenic spots and capture photos.", category: "activity", cost: 100, location: "" },
    { time: "19:30", activity: "Group dinner", description: "End the day with a group dinner at a popular restaurant.", category: "food", cost: 400, location: "" },
    { time: "21:00", activity: "Back to stay", description: "Return to accommodation and rest for the next day.", category: "rest", cost: 0, location: "" },
  ];

  for (let i = 0; i < daysCount; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split("T")[0];
    const remaining = dayBudget - activities.reduce((s, a) => s + a.cost, 0);
    days.push({
      day: i + 1,
      date: dateStr,
      title: i === 0 ? "Arrival & Exploration" : i === daysCount - 1 ? "Final Day & Departure" : `Day ${i + 1} - Explore ${destination}`,
      entries: activities.map((a) => ({
        time: a.time,
        activity: a.activity,
        description: a.description,
        category: a.category,
        estimatedCost: a.cost,
        location: a.location,
      })),
      dailyBudget: dayBudget,
      tips: [`Carry water and stay hydrated`, `Wear comfortable shoes for walking`, remaining > 0 ? `You have ₹${remaining} spare for extras today` : `Stick to the budget today`],
    });
  }

  return days;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dest = searchParams.get("dest");
  const startDate = searchParams.get("start");
  const endDate = searchParams.get("end");
  const budgetRaw = searchParams.get("budget");

  if (!dest || !startDate || !endDate) {
    return NextResponse.json({ error: "Missing required parameters: dest, start, end" }, { status: 400 });
  }

  const budget = budgetRaw ? parseInt(budgetRaw, 10) : 5000;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const daysCount = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      destination: dest,
      totalBudget: budget,
      days: getFallbackItinerary(dest, daysCount, budget),
      totalEstimatedCost: budget,
      generatedAt: new Date().toISOString(),
    });
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

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4096,
          },
        }),
      },
    );

    if (!res.ok) {
      return NextResponse.json({
        destination: dest,
        totalBudget: budget,
        days: getFallbackItinerary(dest, daysCount, budget),
        totalEstimatedCost: budget,
        generatedAt: new Date().toISOString(),
      });
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    let itinerary;
    try {
      itinerary = JSON.parse(text.replace(/```json?/gi, "").replace(/```/g, "").trim());
    } catch {
      return NextResponse.json({
        destination: dest,
        totalBudget: budget,
        days: getFallbackItinerary(dest, daysCount, budget),
        totalEstimatedCost: budget,
        generatedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json(itinerary);
  } catch {
    return NextResponse.json({
      destination: dest,
      totalBudget: budget,
      days: getFallbackItinerary(dest, daysCount, budget),
      totalEstimatedCost: budget,
      generatedAt: new Date().toISOString(),
    });
  }
}
