import { NextResponse } from "next/server";
import { getDestinationCoords } from "@/constants/destinations";

function getFallbackAllocation(totalBudget: number) {
  return {
    stay: Math.round(totalBudget * 0.35),
    stayPct: 35,
    food: Math.round(totalBudget * 0.25),
    foodPct: 25,
    transport: Math.round(totalBudget * 0.25),
    transportPct: 25,
    activities: Math.round(totalBudget * 0.10),
    activitiesPct: 10,
    buffer: Math.round(totalBudget * 0.05),
    bufferPct: 5,
    total: totalBudget,
    reasoning: `Smart allocation for student travelers: 35% on budget hostels, 25% on local food, 25% on shared transport, 10% on activities, 5% buffer.`,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dest = searchParams.get("dest");
  const budgetRaw = searchParams.get("budget");

  if (!dest || !budgetRaw) {
    return NextResponse.json({ error: "Missing required parameters: dest, budget" }, { status: 400 });
  }

  const totalBudget = parseInt(budgetRaw, 10);
  if (isNaN(totalBudget) || totalBudget <= 0) {
    return NextResponse.json({ error: "Invalid budget value" }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(getFallbackAllocation(totalBudget));
  }

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

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 1024,
          },
        }),
      },
    );

    if (!res.ok) {
      return NextResponse.json(getFallbackAllocation(totalBudget));
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    let allocation;
    try {
      allocation = JSON.parse(text.replace(/```json?/gi, "").replace(/```/g, "").trim());
    } catch {
      return NextResponse.json(getFallbackAllocation(totalBudget));
    }

    return NextResponse.json(allocation);
  } catch {
    return NextResponse.json(getFallbackAllocation(totalBudget));
  }
}
