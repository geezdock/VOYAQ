import { NextResponse } from "next/server";
import { getDestinationCoords } from "@/lib/destinations";

interface SuggestRequest {
  destination: string;
  budget?: number;
  dates?: { start: string; end: string };
  preferences?: string[];
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 503 });
  }

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
      return NextResponse.json({ error: "Gemini API error" }, { status: 502 });
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    let suggestions;
    try {
      suggestions = JSON.parse(text.replace(/```json?/gi, "").replace(/```/g, "").trim());
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI response", raw: text },
        { status: 502 },
      );
    }

    return NextResponse.json({ suggestions });
  } catch {
    return NextResponse.json({ error: "Failed to fetch AI suggestions" }, { status: 502 });
  }
}
