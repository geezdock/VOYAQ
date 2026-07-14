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
  Compass,
} from "lucide-react";
import type { Squad } from "@/types/squad";
import { useSquad } from "@/lib/SquadContext";
import { getCountdown, formatDate, getDays, formatRupee } from "@/lib/trip-utils";

interface TripViewProps {
  squad: Squad;
  onBack: () => void;
}

const statusConfig: Record<string, { label: string; icon: typeof CheckCircle; className: string }> = {
  booked: { label: "Booked", icon: CheckCircle, className: "bg-success/10 text-success" },
  pending: { label: "Pending", icon: Clock, className: "bg-amber-400/10 text-amber-600" },
  cancelled: { label: "Cancelled", icon: XCircle, className: "bg-error/10 text-error" },
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
      // silent
    }
  }

  if (!hasLocked) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="brut-card w-full max-w-md text-center space-y-4">
          <h1 className="font-display text-2xl font-bold text-ink">Trip not ready</h1>
          <p className="font-heading text-sm text-ink-muted">
            Lock destination, budget, and dates before viewing the trip.
          </p>
          <button onClick={onBack} className="brut-btn text-sm">Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-ink/10 bg-surface-card">
        <div className="max-w-3xl mx-auto px-4 flex items-center justify-between h-14">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 font-heading text-sm font-semibold text-ink-muted hover:text-ink transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </button>

          <div className="flex items-center gap-2">
            {cfg && StatusIcon && (
              <span className={`flex items-center gap-1 font-mono text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-bruted ${cfg.className}`}>
                <StatusIcon className="w-3 h-3" />
                {cfg.label}
              </span>
            )}
            <button
              onClick={handleShare}
              className="w-8 h-8 flex items-center justify-center rounded-bruted text-ink-muted hover:text-ink hover:bg-ink/5 transition-colors"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 sm:py-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-2 border-ink rounded-[14px] bg-white shadow-bruted-sm overflow-hidden"
        >
          {/* Countdown / Status bar */}
          {countdown && !countdown.expired && (
            <div className="bg-ink px-5 py-3 flex items-center justify-between">
              <span className="font-mono text-[10px] text-surface/50 uppercase tracking-widest">
                Departing in
              </span>
              <div className="flex items-center gap-3">
                <span className="font-display text-xl sm:text-2xl font-extrabold text-surface">
                  {countdown.days}<span className="font-mono text-[10px] text-surface/50 uppercase ml-0.5">d</span>
                </span>
                <span className="text-surface/20 text-lg">·</span>
                <span className="font-display text-xl sm:text-2xl font-extrabold text-surface">
                  {countdown.hours}<span className="font-mono text-[10px] text-surface/50 uppercase ml-0.5">h</span>
                </span>
                <span className="text-surface/20 text-lg">·</span>
                <span className="font-display text-xl sm:text-2xl font-extrabold text-surface">
                  {countdown.minutes}<span className="font-mono text-[10px] text-surface/50 uppercase ml-0.5">m</span>
                </span>
              </div>
            </div>
          )}

          {countdown?.expired && (
            <div className="bg-success px-5 py-3 flex items-center justify-center gap-2">
              <PartyPopper className="w-5 h-5 text-white shrink-0" />
              <span className="font-display text-base font-extrabold text-white uppercase tracking-tight">
                Trip time!
              </span>
            </div>
          )}

          {squad.status === "cancelled" && (
            <div className="bg-error px-5 py-3 flex items-center justify-center gap-2">
              <XCircle className="w-5 h-5 text-white shrink-0" />
              <span className="font-display text-base font-extrabold text-white uppercase tracking-tight">
                Trip cancelled
              </span>
            </div>
          )}

          {/* Content */}
          <div className="p-5 sm:p-7 space-y-5">
            {/* Title + destination */}
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-ink uppercase tracking-tight">
                {squad.name}
              </h1>
              {squad.lockedDestination && (
                <p className="font-heading text-sm text-ink-muted mt-1">{squad.lockedDestination}</p>
              )}
            </div>

            {/* Trip details row */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {squad.lockedDestination && (
                <span className="inline-flex items-center gap-1.5 font-mono text-xs text-ink-muted">
                  <MapPin className="w-3.5 h-3.5 text-accent" />
                  {squad.lockedDestination}
                </span>
              )}
              {squad.lockedDates && (
                <span className="inline-flex items-center gap-1.5 font-mono text-xs text-ink-muted">
                  <Calendar className="w-3.5 h-3.5 text-peach-dark" />
                  {formatDate(squad.lockedDates.start)} – {formatDate(squad.lockedDates.end)}
                  <span className="text-ink-muted/60">· {getDays(squad.lockedDates.start, squad.lockedDates.end)}d</span>
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 font-mono text-xs text-ink-muted">
                <DollarSign className="w-3.5 h-3.5 text-success" />
                {formatRupee(squad.lockedBudget ?? 0)}
                <span className="text-ink-muted/60">/person</span>
              </span>
              <span className="inline-flex items-center gap-1.5 font-mono text-xs text-ink-muted">
                <Users className="w-3.5 h-3.5 text-ink-muted" />
                {squad.members.length}/{squad.memberLimit}
              </span>
            </div>

            {/* Compact member avatars */}
            <div className="flex items-center gap-1.5">
              {squad.members.slice(0, 6).map((m) => (
                <div
                  key={m.id}
                  className={`w-7 h-7 rounded-full ${m.color} flex items-center justify-center ring-2 ring-white relative`}
                  title={isMe(m.id) ? "You" : m.name}
                >
                  <span className="text-[10px] font-heading font-bold text-white">{m.initial}</span>
                  {m.verified && (
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-success rounded-full border border-white" />
                  )}
                </div>
              ))}
              {squad.members.length > 6 && (
                <span className="font-mono text-[10px] text-ink-muted ml-0.5">
                  +{squad.members.length - 6}
                </span>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-ink/10">
              <button
                onClick={() => router.push(`/trip/${squad.id}/hub`)}
                className="brut-btn text-xs px-4 py-2"
              >
                <Compass className="w-3.5 h-3.5 mr-1.5 inline" />
                Destination Hub
              </button>
              <button onClick={handleShare} className="brut-btn text-xs px-4 py-2 !bg-surface-card !text-ink !shadow-bruted-sm hover:!shadow-bruted">
                <Share2 className="w-3.5 h-3.5 mr-1.5 inline" />
                Share
              </button>
              {squad.status === "cancelled" ? (
                <button onClick={handleRebook} className="brut-btn text-xs px-4 py-2">
                  Book Again
                </button>
              ) : (
                (squad.status === "booked" || squad.status === "pending") && (
                  <button
                    onClick={() => setShowCancel(true)}
                    className="brut-btn text-xs px-4 py-2 !bg-error !text-white !border-error"
                  >
                    <XCircle className="w-3.5 h-3.5 mr-1.5 inline" />
                    Cancel
                  </button>
                )
              )}
            </div>
          </div>
        </motion.div>
      </main>

      {/* Cancel modal */}
      {showCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="brut-card w-full max-w-sm"
          >
            <h3 className="font-display text-lg font-bold text-ink mb-2">Cancel Trip?</h3>
            <p className="font-heading text-sm text-ink-muted mb-5">
              This will cancel the trip for all squad members. You can re-book it later.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowCancel(false)} className="flex-1 brut-btn text-sm !bg-surface-card !text-ink !shadow-bruted-sm hover:!shadow-bruted">
                Keep Trip
              </button>
              <button onClick={handleCancel} className="flex-1 brut-btn text-sm !bg-error !text-white !border-error">
                Yes, Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
