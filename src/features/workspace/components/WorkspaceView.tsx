"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  BarChart3,
  Users,
  MapPin,
  Calendar,
  DollarSign,
  Zap,
} from "lucide-react";
import { TabSquad } from "./steps/TabSquad";
import { TabDestinations } from "./steps/TabDestinations";
import { TabDates } from "./steps/TabDates";
import { TabBudget } from "./steps/TabBudget";
import { TabPolls } from "./steps/TabPolls";
import { WorkspaceSummary } from "./WorkspaceSummary";
import { ConsensusCelebration } from "./ConsensusCelebration";
import { useSquad } from "@/shared/providers/SquadContext";
import type { Squad, WorkspaceTab } from "@/types/squad";

interface WorkspaceViewProps {
  squad: Squad;
  onBack: () => void;
  onUpdate: (squad: Squad) => void;
}

const tabs: { id: WorkspaceTab; label: string; icon: typeof Users }[] = [
  { id: "squad", label: "Squad", icon: Users },
  { id: "destinations", label: "Destinations", icon: MapPin },
  { id: "dates", label: "Dates", icon: Calendar },
  { id: "budget", label: "Budget", icon: DollarSign },
  { id: "polls", label: "Polls", icon: BarChart3 },
];

export function WorkspaceView({ squad, onBack, onUpdate }: WorkspaceViewProps) {
  const router = useRouter();
  const { isRealtimeConnected } = useSquad();
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("squad");
  const [showSummary, setShowSummary] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const hasDest = !!squad.lockedDestination;
  const hasBudget = squad.lockedBudget !== undefined;
  const hasDates = !!squad.lockedDates;
  const allLocked = hasDest && hasBudget && hasDates;
  const lockCount = [hasDest, hasBudget, hasDates].filter(Boolean).length;

  useEffect(() => {
    if (allLocked) {
      const timer = setTimeout(() => setShowCelebration(true), 400);
      return () => clearTimeout(timer);
    }
  }, [allLocked]);

  function renderTab() {
    switch (activeTab) {
      case "squad":
        return <TabSquad squad={squad} onUpdate={onUpdate} />;
      case "destinations":
        return <TabDestinations squad={squad} onUpdate={onUpdate} />;
      case "dates":
        return <TabDates squad={squad} onUpdate={onUpdate} />;
      case "budget":
        return <TabBudget squad={squad} onUpdate={onUpdate} />;
      case "polls":
        return <TabPolls squad={squad} onUpdate={onUpdate} />;
    }
  }

  function getTabStatus(tabId: WorkspaceTab) {
    switch (tabId) {
      case "destinations":
        return hasDest;
      case "dates":
        return hasDates;
      case "budget":
        return hasBudget;
      default:
        return false;
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 font-heading text-sm font-semibold text-ink-muted hover:text-ink transition-colors min-h-[44px] py-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Dashboard
        </button>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <h1 className="font-display text-2xl font-bold text-ink truncate">
            {squad.name}
          </h1>
          {isRealtimeConnected && (
            <span className="hidden md:inline-flex items-center gap-1 font-mono text-[10px] text-success bg-success/10 px-2 py-0.5 rounded-full border border-success/30 shrink-0">
              <Zap className="w-3 h-3 fill-current" />
              Live Sync
            </span>
          )}
        </div>
        <button
          onClick={() => (allLocked ? setShowCelebration(true) : setShowSummary(true))}
          className={`flex items-center gap-2 text-sm font-bold min-h-[44px] px-4 py-2 rounded-bruted border-2 transition-all ${
            allLocked
              ? "border-success bg-success/10 text-success hover:bg-success/20"
              : "border-ink/20 text-ink-muted hover:border-ink/40 hover:text-ink"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span className="hidden sm:inline">
            {allLocked ? "Trip Ready" : `${lockCount}/3`}
          </span>
          <span className="sm:hidden">
            {lockCount}/3
          </span>
        </button>
      </div>

      {/* Tab navigation */}
      <div className="border-b border-ink/10 mb-6 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {tabs.map((tab) => {
            const locked = getTabStatus(tab.id);
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] font-heading text-sm font-semibold transition-all whitespace-nowrap rounded-lg ${
                  isActive
                    ? "bg-accent/10 text-accent"
                    : "text-ink-muted hover:text-ink hover:bg-ink/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {locked && (
                  <span className="w-1.5 h-1.5 rounded-full bg-success ml-0.5" />
                )}
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
          {renderTab()}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {showCelebration && (
          <ConsensusCelebration
            squad={squad}
            onExploreHub={() => router.push(`/trip/${squad.id}/hub`)}
            onDismiss={() => setShowCelebration(false)}
          />
        )}

        {showSummary && !showCelebration && (
          <WorkspaceSummary
            squad={squad}
            onClose={() => setShowSummary(false)}
            onUpdate={onUpdate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
