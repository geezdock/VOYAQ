"use client";

import { motion } from "framer-motion";
import { CloudSun, Droplets, Wind, RefreshCw } from "lucide-react";
import { useFetch } from "@/lib/hooks/useFetch";
import { fetchLiveWeather } from "@/lib/services/weather";
import type { WeatherData } from "@/types/destination";

interface HubWeatherProps {
  destinationName: string;
}

const conditionIcon: Record<string, string> = {
  Sunny: "☀️",
  "Partly Cloudy": "⛅",
  Cloudy: "☁️",
  Thunderstorms: "⛈️",
  Showers: "🌦️",
  "Light Rain": "🌧️",
  Foggy: "🌫️",
  Snow: "❄️",
};

export function HubWeather({ destinationName }: HubWeatherProps) {
  const { data, loading, error, retry } = useFetch<WeatherData>(
    () => fetchLiveWeather(destinationName),
    [destinationName],
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="font-heading text-sm text-ink-muted">Loading live weather...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-16 space-y-4">
        <CloudSun className="w-10 h-10 text-ink-muted/40 mx-auto" />
        <p className="font-heading text-sm text-ink-muted">
          {error ? "Failed to load weather" : "Weather data unavailable"}
        </p>
        <p className="font-mono text-xs text-ink-muted/60">
          {error ? "Check your connection and try again" : `Could not fetch weather for ${destinationName}`}
        </p>
        {error && (
          <button
            onClick={retry}
            className="inline-flex items-center gap-1.5 font-heading text-sm font-semibold text-accent hover:text-accent/80 transition-colors min-h-[44px] px-4"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="inline-block w-2 h-2 rounded-full bg-success" />
        <span className="font-mono text-[10px] text-success font-bold uppercase tracking-wider">Live</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-[3px] border-ink rounded-[16px] bg-white shadow-bruted-sm overflow-hidden"
      >
        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-xs text-ink-muted uppercase tracking-wider">Current</p>
              <p className="font-display text-5xl sm:text-6xl font-extrabold text-ink mt-1">
                {data.current.temp}°
              </p>
              <p className="font-heading text-base text-ink-muted mt-1">{data.current.condition}</p>
            </div>
            <span className="text-6xl sm:text-7xl">{conditionIcon[data.current.condition] || "🌡️"}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
            <div className="border border-ink/10 rounded-[10px] p-3 flex items-center gap-2 bg-surface-alt/50">
              <Droplets className="w-4 h-4 text-accent shrink-0" />
              <div>
                <p className="font-mono text-[10px] text-ink-muted uppercase">Humidity</p>
                <p className="font-heading text-sm font-bold text-ink">{data.current.humidity}%</p>
              </div>
            </div>
            <div className="border border-ink/10 rounded-[10px] p-3 flex items-center gap-2 bg-surface-alt/50">
              <Wind className="w-4 h-4 text-peach-dark shrink-0" />
              <div>
                <p className="font-mono text-[10px] text-ink-muted uppercase">Wind</p>
                <p className="font-heading text-sm font-bold text-ink">{data.current.windSpeed} km/h</p>
              </div>
            </div>
            <div className="border border-ink/10 rounded-[10px] p-3 flex items-center gap-2 bg-surface-alt/50 col-span-2 sm:col-span-1">
              <CloudSun className="w-4 h-4 text-ink-muted shrink-0" />
              <div>
                <p className="font-mono text-[10px] text-ink-muted uppercase">Feels like</p>
                <p className="font-heading text-sm font-bold text-ink">{data.current.temp}°C</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="border-2 border-ink/10 rounded-[12px] bg-surface-card overflow-hidden">
        <div className="p-4 border-b border-ink/10">
          <p className="font-heading text-sm font-bold text-ink">5-Day Forecast</p>
        </div>
        <div className="divide-y divide-ink/10">
          {data.forecast.map((day, i) => (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{conditionIcon[day.condition] || "🌡️"}</span>
                <span className="font-heading text-sm font-semibold text-ink w-12">
                  {new Date(day.date).toLocaleDateString("en-IN", { weekday: "short" })}
                </span>
              </div>
              <span className="font-mono text-xs text-ink-muted">{day.condition}</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-ink">{day.tempHigh}°</span>
                <span className="font-mono text-xs text-ink-muted">|</span>
                <span className="font-mono text-sm text-ink-muted">{day.tempLow}°</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}