"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Calendar,
  Users,
  Share2,
  CheckCircle,
  Clock,
  XCircle,
  PartyPopper,
  AlertTriangle,
} from "lucide-react";
import type { Squad } from "@/types/squad";
import { useSquad } from "@/lib/SquadContext";
import { getCountdown, formatDate, getDays, formatRupee } from "@/lib/trip-utils";

interface TripViewProps {
  squad: Squad;
  onBack: () => void;
}

const statusConfig: Record<
  string,
  { label: string; icon: typeof CheckCircle; className: string }
> = {
  booked: {
    label: "Booked",
    icon: CheckCircle,
    className: "bg-success/10 text-success border-success/30",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-amber-400/10 text-amber-600 border-amber-400/30",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    className: "bg-error/10 text-error border-error/30",
  },
};

export function TripView({ squad, onBack }: TripViewProps) {
  const router = useRouter();
  const { updateSquad, isMe } = useSquad();
  const [showCancel, setShowCancel] = useState(false);
  const hasLocked = !!squad.lockedDestination && squad.lockedBudget !== undefined && !!squad.lockedDates;

  const [countdown, setCountdown] = useState(
    squad.lockedDates ? getCountdown(squad.lockedDates.start) : null,
  );

  useEffect(() => {
    if (!squad.lockedDates) return;
    const timer = setInterval(() => {
      setCountdown(getCountdown(squad.lockedDates!.start));
    }, 60000);
    return () => clearInterval(timer);
  }, [squad.lockedDates]);

  function handleCancel() {
    updateSquad({ ...squad, status: "cancelled" });
    setShowCancel(false);
  }

  function handleRebook() {
    updateSquad({
      ...squad,
      status: "planning",
      lockedDestination: undefined,
      lockedBudget: undefined,
      lockedDates: undefined,
    });
    router.push(`/workspace/${squad.id}`);
  }

  const cfg = statusConfig[squad.status] || null;
  const StatusIcon = cfg?.icon;

  async function handleShare() {
    const url = `${window.location.origin}/trip/${squad.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: squad.name, url });
      } else {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      // Share declined or clipboard unavailable
    }
  }

  if (!hasLocked) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="brut-card w-full max-w-md text-center space-y-4">
          <h1 className="font-display text-2xl font-bold text-ink">
            Trip not ready
          </h1>
          <p className="font-heading text-sm text-ink-muted">
            Lock destination, budget, and dates before viewing the trip.
          </p>
          <button onClick={onBack} className="brut-btn text-sm">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b-2 border-ink bg-surface-card">
        <div className="max-w-6xl mx-auto px-4 py-0 flex items-center justify-between h-16">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 font-heading text-sm font-semibold text-ink-muted hover:text-ink transition-colors min-h-[44px] py-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 font-heading text-sm font-semibold text-ink-muted hover:text-ink transition-colors min-h-[44px] py-2"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Hero section */}
          <div className="border-[3px] border-ink rounded-[16px] bg-white shadow-bruted-lg overflow-hidden">
            {countdown && !countdown.expired && (
              <div className="bg-ink px-5 py-4 text-center">
                <p className="font-mono text-[10px] text-surface/50 uppercase tracking-widest mb-1">
                  Departing in
                </p>
                <div className="flex items-center justify-center gap-4">
                  <div>
                    <span className="font-display text-3xl sm:text-4xl font-extrabold text-surface">
                      {countdown.days}
                    </span>
                    <span className="font-mono text-[10px] text-surface/50 uppercase ml-1">
                      days
                    </span>
                  </div>
                  <span className="text-surface/20 text-2xl">|</span>
                  <div>
                    <span className="font-display text-3xl sm:text-4xl font-extrabold text-surface">
                      {countdown.hours}
                    </span>
                    <span className="font-mono text-[10px] text-surface/50 uppercase ml-1">
                      hrs
                    </span>
                  </div>
                  <span className="text-surface/20 text-2xl">|</span>
                  <div>
                    <span className="font-display text-3xl sm:text-4xl font-extrabold text-surface">
                      {countdown.minutes}
                    </span>
                    <span className="font-mono text-[10px] text-surface/50 uppercase ml-1">
                      min
                    </span>
                  </div>
                </div>
              </div>
            )}

            {countdown?.expired && (
              <div className="bg-success px-5 py-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <PartyPopper className="w-5 h-5 text-white" />
                  <span className="font-display text-lg font-extrabold text-white uppercase tracking-tight">
                    Trip time!
                  </span>
                </div>
              </div>
            )}

            {squad.status === "cancelled" && (
              <div className="bg-error px-5 py-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <XCircle className="w-5 h-5 text-white" />
                  <span className="font-display text-lg font-extrabold text-white uppercase tracking-tight">
                    Trip cancelled
                  </span>
                </div>
              </div>
            )}

            <div className="p-5 sm:p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-ink uppercase tracking-tight truncate">
                    {squad.name}
                  </h1>
                  {squad.lockedDestination && (
                    <p className="font-heading text-sm text-ink-muted mt-1">
                      {squad.lockedDestination}
                    </p>
                  )}
                </div>
                {cfg && StatusIcon && (
                  <span
                    className={`flex items-center gap-1 font-mono text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-bruted border-2 shrink-0 ${cfg.className}`}
                  >
                    <StatusIcon className="w-3.5 h-3.5" />
                    {cfg.label}
                  </span>
                )}
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="border-2 border-ink/10 rounded-[10px] p-3 text-center bg-surface-alt/50">
                  <MapPin className="w-4 h-4 text-accent mx-auto mb-1" />
                  <p className="font-mono text-[10px] text-ink-muted uppercase tracking-wider">
                    Destination
                  </p>
                  <p className="font-display text-sm font-bold text-ink mt-0.5 truncate">
                    {squad.lockedDestination}
                  </p>
                </div>
                <div className="border-2 border-ink/10 rounded-[10px] p-3 text-center bg-surface-alt/50">
                  <DollarSign className="w-4 h-4 text-success mx-auto mb-1" />
                  <p className="font-mono text-[10px] text-ink-muted uppercase tracking-wider">
                    Budget
                  </p>
                  <p className="font-display text-sm font-bold text-ink mt-0.5">
                    {formatRupee(squad.lockedBudget ?? 0)}
                    <span className="font-mono text-[9px] text-ink-muted font-normal">
                      /person
                    </span>
                  </p>
                </div>
                <div className="border-2 border-ink/10 rounded-[10px] p-3 text-center bg-surface-alt/50">
                  <Calendar className="w-4 h-4 text-peach-dark mx-auto mb-1" />
                  <p className="font-mono text-[10px] text-ink-muted uppercase tracking-wider">
                    Duration
                  </p>
                  <p className="font-display text-sm font-bold text-ink mt-0.5">
                    {squad.lockedDates
                      ? `${formatDate(squad.lockedDates.start)} – ${formatDate(squad.lockedDates.end)}`
                      : "—"}
                  </p>
                </div>
              </div>

              {squad.lockedDates && (
                <p className="font-mono text-[10px] text-ink-muted text-center">
                  {getDays(squad.lockedDates.start, squad.lockedDates.end)} day trip
                </p>
              )}
            </div>
          </div>

          {/* Squad Members */}
          <div className="border-[3px] border-ink rounded-[16px] bg-white shadow-bruted-sm overflow-hidden">
            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-ink-muted" />
                  <h2 className="font-display text-lg font-extrabold text-ink uppercase tracking-tight">
                    Squad
                  </h2>
                </div>
                <span className="font-mono text-xs text-ink-muted font-bold">
                  {squad.members.length} / {squad.memberLimit}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {squad.members.map((member, i) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.25 }}
                    className="flex items-center gap-3 border border-ink/10 rounded-[10px] p-3"
                  >
                    <div
                      className={`w-9 h-9 rounded-full ${member.color} flex items-center justify-center ring-2 ring-white shrink-0 relative`}
                    >
                      <span className="text-xs font-heading font-bold text-white">
                        {member.initial}
                      </span>
                      {member.verified && (
                        <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-success rounded-full border-2 border-white flex items-center justify-center">
                          <CheckCircle className="w-2.5 h-2.5 text-white" />
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-heading text-sm font-bold text-ink truncate">
                        {isMe(member.id) ? "You" : member.name}
                      </p>
                      <p className="font-mono text-[10px] text-ink-muted">
                        {member.verified ? "Verified" : "Unverified"}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={onBack}
              className="flex-1 brut-btn text-sm !bg-surface-card !text-ink !shadow-bruted-sm hover:!shadow-bruted"
            >
              Dashboard
            </button>
            {squad.status === "cancelled" ? (
              <button
                onClick={handleRebook}
                className="flex-1 brut-btn text-sm"
              >
                Book Again
              </button>
            ) : (
              <>
                <button
                  onClick={handleShare}
                  className="flex-1 brut-btn text-sm"
                >
                  <Share2 className="w-4 h-4 mr-1.5 inline" />
                  Share
                </button>
                {(squad.status === "booked" || squad.status === "pending") && (
                  <button
                    onClick={() => setShowCancel(true)}
                    className="flex-1 brut-btn text-sm !bg-error !text-white !border-error !shadow-bruted-sm hover:!shadow-bruted"
                  >
                    <XCircle className="w-4 h-4 mr-1.5 inline" />
                    Cancel
                  </button>
                )}
              </>
            )}
          </div>

          {/* Cancel confirmation modal */}
          {showCancel && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="brut-card w-full max-w-sm !shadow-bruted-lg"
              >
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-error" />
                  <h3 className="font-display text-xl font-bold text-ink">
                    Cancel Trip?
                  </h3>
                </div>
                <p className="font-heading text-sm text-ink-muted mb-6">
                  This will cancel the trip for all squad members. You can
                  re-book it later.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCancel(false)}
                    className="flex-1 brut-btn text-sm !bg-surface-card !text-ink !shadow-bruted-sm hover:!shadow-bruted"
                  >
                    Keep Trip
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 brut-btn text-sm !bg-error !text-white !border-error"
                  >
                    Yes, Cancel
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
