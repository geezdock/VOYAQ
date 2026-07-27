"use client";

import { useState, useRef, useEffect, useCallback, type ReactNode } from "react";
import dynamic from "next/dynamic";
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
  Train,
  Building2,
} from "lucide-react";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";
import type { HubTab } from "@/types/destination";
import type { Squad } from "@/types/squad";

const skeleton = () => <div className="animate-pulse space-y-4"><div className="h-6 w-1/3 bg-ink/10 rounded-bruted" /><div className="h-24 bg-ink/10 rounded-bruted" /><div className="h-24 bg-ink/10 rounded-bruted" /></div>;

const HubOverviewLazy = dynamic(() => import("./Overview/HubOverview").then(m => ({ default: m.HubOverview })), { loading: skeleton });
const HubWeatherLazy = dynamic(() => import("./Weather/HubWeather").then(m => ({ default: m.HubWeather })), { loading: skeleton });
const HubFoodLazy = dynamic(() => import("./Food/HubFood").then(m => ({ default: m.HubFood })), { loading: skeleton });
const HubPlacesLazy = dynamic(() => import("./Places/HubPlaces").then(m => ({ default: m.HubPlaces })), { loading: skeleton });
const HubEventsLazy = dynamic(() => import("./Events/HubEvents").then(m => ({ default: m.HubEvents })), { loading: skeleton });
const HubSafetyLazy = dynamic(() => import("./Safety/HubSafety").then(m => ({ default: m.HubSafety })), { loading: skeleton });
const HubTransportLazy = dynamic(() => import("./Transport/HubTransport").then(m => ({ default: m.HubTransport })), { loading: skeleton });
const HubBudgetLazy = dynamic(() => import("./Budget/HubBudget").then(m => ({ default: m.HubBudget })), { loading: skeleton });
const HubAISuggestionsLazy = dynamic(() => import("./AISuggestions/HubAISuggestions").then(m => ({ default: m.HubAISuggestions })), { loading: skeleton });
const HubItineraryLazy = dynamic(() => import("./Itinerary/HubItinerary").then(m => ({ default: m.HubItinerary })), { loading: skeleton });
const AIBudgetAllocatorLazy = dynamic(() => import("./BudgetAllocator/AIBudgetAllocator").then(m => ({ default: m.AIBudgetAllocator })), { loading: skeleton });
const EventDrivenUpdatesLazy = dynamic(() => import("./EventUpdates/EventDrivenUpdates").then(m => ({ default: m.EventDrivenUpdates })), { loading: skeleton });
const HubMapLazy = dynamic(() => import("./Map/HubMap").then(m => ({ default: m.HubMap })), { ssr: false, loading: skeleton });
const HubTransportBookingLazy = dynamic(() => import("./TransportBooking/HubTransportBooking").then(m => ({ default: m.HubTransportBooking })), { loading: skeleton });
const HubHostelsLazy = dynamic(() => import("./Hostels/HubHostels").then(m => ({ default: m.HubHostels })), { loading: skeleton });

interface DestinationHubProps {
  squad: Squad;
  onBack: () => void;
}

const tabs: { id: HubTab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "weather", label: "Weather", icon: CloudSun },
  { id: "food", label: "Food", icon: UtensilsCrossed },
  { id: "places", label: "Places", icon: Mountain },
  { id: "map", label: "Map", icon: Mountain },
  { id: "events", label: "Events", icon: CalendarDays },
  { id: "safety", label: "Safety", icon: ShieldAlert },
  { id: "transport", label: "Transport", icon: Bus },
  { id: "budget", label: "Budget", icon: Wallet },
  { id: "ai", label: "AI Tips", icon: Sparkles },
  { id: "itinerary", label: "Itinerary", icon: CalendarDays },
  { id: "budget-allocator", label: "AI Budget", icon: Wallet },
  { id: "event-updates", label: "Alerts", icon: ShieldAlert },
  { id: "transport-booking", label: "Book Travel", icon: Train },
  { id: "hostels", label: "Stay", icon: Building2 },
];

const tabIds: HubTab[] = tabs.map((t) => t.id);

export function DestinationHub({ squad, onBack }: DestinationHubProps) {
  const [activeTab, setActiveTab] = useState<HubTab>("overview");
  const destinationName = squad.lockedDestination ?? squad.destination;
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
    if (!destinationName) {
      return (
        <div className="text-center py-20 space-y-3">
          <p className="font-heading text-sm text-ink-muted">No destination selected</p>
          <p className="font-mono text-xs text-ink-muted/60">Lock a destination to see hub details</p>
        </div>
      );
    }
    const wrap = (node: ReactNode) => <ErrorBoundary>{node}</ErrorBoundary>;
    switch (activeTab) {
      case "overview":
        return wrap(<HubOverviewLazy squad={squad} destinationName={destinationName} />);
      case "weather":
        return wrap(<HubWeatherLazy destinationName={destinationName} />);
      case "food":
        return wrap(<HubFoodLazy destinationName={destinationName} />);
      case "places":
        return wrap(<HubPlacesLazy destinationName={destinationName} />);
      case "map":
        return wrap(<HubMapLazy destinationName={destinationName} />);
      case "events":
        return wrap(<HubEventsLazy destinationName={destinationName} />);
      case "safety":
        return wrap(<HubSafetyLazy destinationName={destinationName} />);
      case "transport":
        return wrap(<HubTransportLazy destinationName={destinationName} />);
      case "budget":
        return wrap(<HubBudgetLazy destinationName={destinationName} squad={squad} />);
      case "ai":
        return wrap(
          <HubAISuggestionsLazy
            destinationName={destinationName}
            budget={squad.lockedBudget ?? squad.budgetPerPerson}
            dates={squad.lockedDates ?? undefined}
          />
        );
      case "itinerary":
        return wrap(
          squad.lockedDates ? (
            <HubItineraryLazy
              destinationName={destinationName}
              startDate={squad.lockedDates.start}
              endDate={squad.lockedDates.end}
              budget={squad.lockedBudget ?? squad.budgetPerPerson}
            />
          ) : (
            <div className="text-center py-16 space-y-3">
              <CalendarDays className="w-10 h-10 text-ink-muted/40 mx-auto" />
              <p className="font-heading text-sm text-ink-muted">Lock your trip dates to generate an itinerary</p>
            </div>
          )
        );
      case "budget-allocator":
        return wrap(
          <AIBudgetAllocatorLazy
            destinationName={destinationName}
            totalBudget={squad.lockedBudget ?? squad.budgetPerPerson}
          />
        );
      case "event-updates":
        return wrap(
          <EventDrivenUpdatesLazy
            destinationName={destinationName}
            startDate={squad.lockedDates?.start}
            endDate={squad.lockedDates?.end}
          />
        );
      case "transport-booking":
        return wrap(<HubTransportBookingLazy destinationName={destinationName} />);
      case "hostels":
        return wrap(<HubHostelsLazy destinationName={destinationName} />);
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