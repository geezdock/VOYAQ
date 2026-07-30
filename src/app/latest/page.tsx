"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
import { DESTINATION_CATALOG } from "@/constants/destinations";
import { StateNews } from "@/features/intel/StateNews";
import { GovAdvisories } from "@/features/intel/GovAdvisories";
import { WeatherAlerts } from "@/features/intel/WeatherAlerts";

const STATES = Array.from(
  new Set(DESTINATION_CATALOG.map((d) => d.state)),
).sort();

export default function LatestPage() {
  const [selectedState, setSelectedState] = useState(STATES[0] ?? "");

  const destCount = useMemo(
    () => DESTINATION_CATALOG.filter((d) => d.state === selectedState).length,
    [selectedState],
  );

  return (
    <main className="mx-auto max-w-4xl space-y-8 p-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="flex h-10 w-10 items-center justify-center rounded-bruted border-2 border-ink/10 transition-colors hover:bg-ink/5"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold">Latest & Intel</h1>
          <p className="text-sm text-ink-muted">
            Travel news, advisories & alerts by state
          </p>
        </div>
      </div>

      <label className="block">
        <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-ink-muted">
          <MapPin className="h-3.5 w-3.5" />
          Select a state
        </span>
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="w-full rounded-bruted border-2 border-ink/10 bg-surface-card px-4 py-3 text-sm font-bold outline-none focus:border-accent"
        >
          {STATES.map((s) => (
            <option key={s} value={s}>
              {s} ({DESTINATION_CATALOG.filter((d) => d.state === s).length} destinations)
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="flex items-center gap-2 font-bold">
            <span className="h-2 w-2 rounded-full bg-accent" />
            News & Updates
          </h2>
          <StateNews state={selectedState} />
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="flex items-center gap-2 font-bold">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Advisories
            </h2>
            <GovAdvisories state={selectedState} />
            <GovAdvisoriesEmpty state={selectedState} />
          </div>

          <div className="space-y-4">
            <h2 className="flex items-center gap-2 font-bold">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              Weather Alerts
            </h2>
            <WeatherAlerts state={selectedState} />
            <WeatherAlertsEmpty state={selectedState} />
          </div>
        </div>
      </div>
    </main>
  );
}

function GovAdvisoriesEmpty({ state }: { state: string }) {
  return (
    <p className="text-center text-sm text-ink-muted">
      No active advisories for {state}
    </p>
  );
}

function WeatherAlertsEmpty({ state }: { state: string }) {
  return (
    <p className="text-center text-sm text-ink-muted">
      No weather alerts for {state}
    </p>
  );
}
