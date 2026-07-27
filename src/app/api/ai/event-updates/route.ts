import { NextResponse } from "next/server";
import { getDestinationCoords } from "@/constants/destinations";

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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dest = searchParams.get("dest");
  const startDate = searchParams.get("start");
  const endDate = searchParams.get("end");

  if (!dest) {
    return NextResponse.json({ error: "Missing required parameter: dest" }, { status: 400 });
  }

  let weatherData: { current?: { temp: number; condition: string }; forecast?: Array<{ date: string; condition: string; tempHigh: number; tempLow: number }> } = {};
  let eventsData: Array<{ name: string; date: string; category: string; description: string }> = [];

  const coords = getDestinationCoords(dest);

  if (coords) {
    try {
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast` +
          `?latitude=${coords.lat}&longitude=${coords.lon}` +
          `&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code` +
          `&forecast_days=5&timezone=auto`
      );
      if (weatherRes.ok) {
        const wd = await weatherRes.json();
        weatherData.forecast = wd.daily?.time?.map((date: string, i: number) => ({
          date,
          condition: wdToCondition(wd.daily.weather_code[i]),
          tempHigh: Math.round(wd.daily.temperature_2m_max[i]),
          tempLow: Math.round(wd.daily.temperature_2m_min[i]),
        }));
        weatherData.current = wd.current ? {
          temp: Math.round(wd.current.temperature_2m),
          condition: wdToCondition(wd.current.weather_code),
        } : undefined;
      }
    } catch {
      // continue with empty weather
    }

    try {
      const eventsRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(dest)}`);
      if (eventsRes.ok) {
        const ed = await eventsRes.json();
        if (ed.extract) {
          eventsData = [{
            name: `Events in ${dest}`,
            date: startDate || "ongoing",
            category: "local",
            description: ed.extract.substring(0, 300),
          }];
        }
      }
    } catch {
      // continue with empty events
    }
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(getFallbackEventUpdates(dest));
  }

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
            maxOutputTokens: 2048,
          },
        }),
      },
    );

    if (!res.ok) {
      return NextResponse.json(getFallbackEventUpdates(dest));
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    let result;
    try {
      result = JSON.parse(text.replace(/```json?/gi, "").replace(/```/g, "").trim());
    } catch {
      return NextResponse.json(getFallbackEventUpdates(dest));
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(getFallbackEventUpdates(dest));
  }
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
