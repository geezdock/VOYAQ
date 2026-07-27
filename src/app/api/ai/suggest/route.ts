import { NextResponse } from "next/server";
import { getDestinationCoords } from "@/constants/destinations";

interface SuggestRequest {
  destination: string;
  budget?: number;
  dates?: { start: string; end: string };
  preferences?: string[];
}

function getFallbackSuggestions(destination: string, budget?: number) {
  const budgetStr = budget ? ` ₹${budget.toLocaleString("en-IN")}` : "";
  return [
    {
      type: "budget",
      tip: `Book group stays and local transport in advance for ${destination} to keep costs within your target budget${budgetStr}.`,
      priority: "high",
    },
    {
      type: "transport",
      tip: `Rent shared scooters or book local cabs in ${destination} to split transit costs seamlessly across the squad.`,
      priority: "high",
    },
    {
      type: "food",
      tip: `Explore popular local eateries and street food spots near ${destination}'s main market for authentic meals under ₹250/person.`,
      priority: "medium",
    },
    {
      type: "weather",
      tip: `Keep an eye on daily weather updates before planning beach/trek activities around ${destination}.`,
      priority: "medium",
    },
    {
      type: "general",
      tip: `Maintain a shared squad wallet or log expenses on VOYAQ to settle bills without post-trip awkwardness.`,
      priority: "low",
    },
  ];
}

export async function POST(request: Request) {
  let body: SuggestRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { destination, budget, dates, preferences } = body;
  if (!destination) {
    return NextResponse.json({ error: "Missing 'destination'" }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Return smart fallback suggestions if API key is not configured
    return NextResponse.json({ suggestions: getFallbackSuggestions(destination, budget), isFallback: true });
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
            maxOutputTokens: 1024,
          },
        }),
      },
    );

    if (!res.ok) {
      return NextResponse.json({ suggestions: getFallbackSuggestions(destination, budget), isFallback: true });
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    let suggestions;
    try {
      suggestions = JSON.parse(text.replace(/```json?/gi, "").replace(/```/g, "").trim());
    } catch {
      return NextResponse.json({ suggestions: getFallbackSuggestions(destination, budget), isFallback: true });
    }

    return NextResponse.json({ suggestions });
  } catch {
    return NextResponse.json({ suggestions: getFallbackSuggestions(destination, budget), isFallback: true });
  }
}
