"use client";

import { useState, useEffect } from "react";
import { CloudSun, CloudRain, CloudLightning } from "lucide-react";
import { DESTINATION_CATALOG } from "@/constants/destinations";
import type { WeatherAlertEvent } from "@/types/intel";

interface WeatherAlertsProps {
  state: string;
}

const alertIcon = {
  info: CloudSun,
  advisory: CloudRain,
  warning: CloudLightning,
};

const alertColor = {
  info: "text-blue-600",
  advisory: "text-amber-600",
  warning: "text-red-600",
};

export function WeatherAlerts({ state }: WeatherAlertsProps) {
  const [alerts, setAlerts] = useState<WeatherAlertEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const destsInState = DESTINATION_CATALOG.filter(
      (d) => d.state.toLowerCase() === state.toLowerCase(),
    );
    if (destsInState.length === 0) {
      Promise.resolve().then(() => setLoading(false));
      return;
    }

    Promise.allSettled(
      destsInState.slice(0, 5).map(async (dest) => {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${dest.lat}&longitude=${dest.lon}&current=weather_code&daily=weather_code&forecast_days=3&timezone=auto`,
        );
        if (!res.ok) return [];
        const data = await res.json();
        const codes: number[] = data.daily?.weather_code ?? [];
        const events: WeatherAlertEvent[] = [];
        for (let i = 0; i < codes.length; i++) {
          const code = codes[i];
          if (code >= 95) {
            events.push({
              title: "Thunderstorm Warning",
              description: `Thunderstorms expected in ${dest.name}`,
              severity: "warning",
              start: data.daily.time[i],
              end: data.daily.time[i],
              destination: dest.name,
            });
          } else if (code >= 61 && code <= 67) {
            events.push({
              title: "Heavy Rain Advisory",
              description: `Showers expected in ${dest.name}`,
              severity: "advisory",
              start: data.daily.time[i],
              end: data.daily.time[i],
              destination: dest.name,
            });
          }
        }
        return events;
      }),
    ).then((results) => {
      const all = results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
      setAlerts(all);
    }).finally(() => setLoading(false));
  }, [state]);

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-16 shimmer rounded-bruted" />
        ))}
      </div>
    );
  }

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-2">
      {alerts.map((alert, i) => {
        const Icon = alertIcon[alert.severity];
        return (
          <div
            key={i}
            className="flex items-start gap-3 rounded-bruted border-2 border-ink/10 bg-surface-card p-3"
          >
            <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${alertColor[alert.severity]}`} />
            <div className="min-w-0">
              <div className="text-sm font-bold">{alert.title}</div>
              <p className="text-xs text-ink-muted">{alert.description}</p>
              <div className="mt-1 text-xs text-ink-muted">{alert.start}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
