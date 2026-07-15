import { NextResponse } from "next/server";
import { getDestinationCoords } from "@/lib/destinations";

function wmoToCondition(code: number): string {
  if (code === 0) return "Sunny";
  if (code === 1) return "Sunny";
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

  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${coords.lat}` +
        `&longitude=${coords.lon}` +
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m` +
        `&daily=temperature_2m_max,temperature_2m_min,weather_code` +
        `&forecast_days=5` +
        `&timezone=auto`,
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Open-Meteo request failed" }, { status: 502 });
    }

    const data = await res.json();

    const weather = {
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

    return NextResponse.json(weather);
  } catch {
    return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 502 });
  }
}
