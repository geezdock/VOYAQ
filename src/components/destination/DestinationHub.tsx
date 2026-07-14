"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  CloudSun,
  UtensilsCrossed,
  Mountain,
  CalendarDays,
  ShieldAlert,
  Bus,
  Wallet,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { HubOverview } from "./Overview/HubOverview";
import { HubWeather } from "./Weather/HubWeather";
import { HubFood } from "./Food/HubFood";
import { HubPlaces } from "./Places/HubPlaces";
import { HubEvents } from "./Events/HubEvents";
import { HubSafety } from "./Safety/HubSafety";
import { HubTransport } from "./Transport/HubTransport";
import { HubBudget } from "./Budget/HubBudget";
import { HubAISuggestions } from "./AISuggestions/HubAISuggestions";
import { useDestination } from "@/lib/hooks/useDestination";
import type { HubTab } from "@/types/destination";
import type { Squad } from "@/types/squad";

interface DestinationHubProps {
  squad: Squad;
  onBack: () => void;
}

const tabs: { id: HubTab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "weather", label: "Weather", icon: CloudSun },
  { id: "food", label: "Food", icon: UtensilsCrossed },
  { id: "places", label: "Places", icon: Mountain },
  { id: "events", label: "Events", icon: CalendarDays },
  { id: "safety", label: "Safety", icon: ShieldAlert },
  { id: "transport", label: "Transport", icon: Bus },
  { id: "budget", label: "Budget", icon: Wallet },
  { id: "ai", label: "AI Tips", icon: Sparkles },
];

const tabIds: HubTab[] = tabs.map((t) => t.id);

export function DestinationHub({ squad, onBack }: DestinationHubProps) {
  const [activeTab, setActiveTab] = useState<HubTab>("overview");
  const { data, loading, error } = useDestination(squad.lockedDestination);
  const scrollRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

  const currentIndex = tabIds.indexOf(activeTab);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < tabIds.length - 1;

  function goToTab(tab: HubTab) {
    setActiveTab(tab);
  }

  const goPrev = useCallback(() => {
    setActiveTab((prev) => {
      const idx = tabIds.indexOf(prev);
      return idx > 0 ? tabIds[idx - 1] : prev;
    });
  }, []);

  const goNext = useCallback(() => {
    setActiveTab((prev) => {
      const idx = tabIds.indexOf(prev);
      return idx < tabIds.length - 1 ? tabIds[idx + 1] : prev;
    });
  }, []);

  useEffect(() => {
    const btn = btnRefs.current.get(activeTab);
    if (btn && scrollRef.current) {
      btn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [activeTab]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        goNext();
      }
    }
    el.addEventListener("keydown", onKeyDown);
    return () => el.removeEventListener("keydown", onKeyDown);
  }, [goPrev, goNext]);

  const setBtnRef = useCallback((tabId: HubTab) => {
    return (el: HTMLButtonElement | null) => {
      if (el) btnRefs.current.set(tabId, el);
      else btnRefs.current.delete(tabId);
    };
  }, []);

  function renderContent() {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-20">
          <p className="font-heading text-sm text-ink-muted">Loading destination info...</p>
        </div>
      );
    }
    if (error || !data) {
      return (
        <div className="text-center py-20 space-y-3">
          <p className="font-heading text-sm text-ink-muted">{error || "No destination data"}</p>
          <p className="font-mono text-xs text-ink-muted/60">Mock data will be added as destinations are onboarded</p>
        </div>
      );
    }
    switch (activeTab) {
      case "overview":
        return <HubOverview data={data} squad={squad} />;
      case "weather":
        return <HubWeather data={data.weather} />;
      case "food":
        return <HubFood items={data.food} />;
      case "places":
        return <HubPlaces attractions={data.attractions} />;
      case "events":
        return <HubEvents events={data.events} />;
      case "safety":
        return <HubSafety advisories={data.advisories} emergency={data.emergency} />;
      case "transport":
        return <HubTransport options={data.transport} />;
      case "budget":
        return <HubBudget insights={data.budgetInsights} squad={squad} />;
      case "ai":
        return <HubAISuggestions suggestions={data.aiSuggestions} />;
    }
  }

  return (
    <div ref={containerRef} tabIndex={-1} className="outline-none">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 font-heading text-sm font-semibold text-ink-muted hover:text-ink transition-colors min-h-[44px] py-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Trip
        </button>
        <h1 className="font-display text-2xl font-bold text-ink flex-1 min-w-0 truncate">
          {squad.lockedDestination}
        </h1>
      </div>

      <div
        ref={scrollRef}
        className="overflow-x-auto scrollbar-hide -mx-4 px-4 mb-6"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="flex gap-1.5 min-w-max pb-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                ref={setBtnRef(tab.id)}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] font-heading text-sm font-semibold transition-all whitespace-nowrap rounded-bruted border-2 ${
                  isActive
                    ? "bg-accent text-surface border-accent"
                    : "bg-surface-card text-ink-muted border-ink/10 hover:border-ink/30 hover:text-ink"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>

      {/* Tab navigation arrows */}
      <div className="flex items-center justify-between mt-8 pt-4 border-t border-ink/10">
        <button
          onClick={goPrev}
          disabled={!hasPrev}
          className="flex items-center gap-1.5 font-heading text-sm font-semibold text-ink-muted hover:text-ink transition-colors disabled:opacity-20 disabled:pointer-events-none min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          {hasPrev && <span className="hidden sm:inline capitalize">{tabIds[currentIndex - 1]}</span>}
        </button>

        <span className="font-mono text-xs text-ink-muted/60">
          {currentIndex + 1} / {tabIds.length}
        </span>

        <button
          onClick={goNext}
          disabled={!hasNext}
          className="flex items-center gap-1.5 font-heading text-sm font-semibold text-ink-muted hover:text-ink transition-colors disabled:opacity-20 disabled:pointer-events-none min-h-[44px]"
        >
          {hasNext && <span className="hidden sm:inline capitalize">{tabIds[currentIndex + 1]}</span>}
          <ArrowLeft className="w-4 h-4 rotate-180" />
        </button>
      </div>
    </div>
  );
}
