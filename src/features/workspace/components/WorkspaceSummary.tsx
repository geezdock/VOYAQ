"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, MapPin, DollarSign, Calendar, Users, PartyPopper, Clock, XCircle } from "lucide-react";
import type { Squad } from "@/types/squad";

interface WorkspaceSummaryProps {
  squad: Squad;
  onClose: () => void;
  onUpdate: (squad: Squad) => void;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
}

function getDays(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  return Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

export function WorkspaceSummary({ squad, onClose, onUpdate }: WorkspaceSummaryProps) {
  const hasDest = !!squad.lockedDestination;
  const hasBudget = squad.lockedBudget !== undefined;
  const hasDates = !!squad.lockedDates;
  const allLocked = hasDest && hasBudget && hasDates;

  function handleBookTrip() {
    onUpdate({ ...squad, status: "booked" });
    onClose();
  }

  function handlePending() {
    onUpdate({ ...squad, status: "pending" });
    onClose();
  }

  function handleCancel() {
    onUpdate({
      ...squad,
      status: "cancelled",
      lockedDestination: undefined,
      lockedBudget: undefined,
      lockedDates: undefined,
    });
    onClose();
  }

  const formatRupee = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-ink/50"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto border-[3px] border-ink rounded-[16px] bg-white shadow-bruted-lg"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 pb-0">
          <div className="flex items-center gap-3">
            {allLocked && (
              <div className="w-10 h-10 rounded-[8px] bg-success flex items-center justify-center">
                <PartyPopper className="w-5 h-5 text-white" />
              </div>
            )}
            <div>
              <h2 className="font-display text-xl font-bold text-ink">
                {allLocked ? "Trip Ready!" : "Trip Summary"}
              </h2>
              <p className="font-heading text-xs text-ink-muted">
                {allLocked
                  ? "All decisions locked. Ready to book."
                  : `${[hasDest, hasBudget, hasDates].filter(Boolean).length}/3 decisions locked`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-surface-alt rounded-bruted transition-colors"
          >
            <X className="w-5 h-5 text-ink" />
          </button>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 py-4">
          {[
            { label: "Dest", locked: hasDest },
            { label: "Budget", locked: hasBudget },
            { label: "Dates", locked: hasDates },
          ].map((step) => (
            <div key={step.label} className="flex items-center gap-1.5">
              <div
                className={`w-3 h-3 rounded-full border-2 ${
                  step.locked
                    ? "bg-success border-success"
                    : "bg-white border-ink/20"
                }`}
              />
              <span
                className={`font-mono text-[10px] font-bold ${
                  step.locked ? "text-success" : "text-ink-muted"
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Decision cards */}
        <div className="px-5 space-y-3">
          {/* Destination */}
          <div
            className={`border-[2px] rounded-[12px] p-4 ${
              hasDest
                ? "border-success/30 bg-success/5"
                : "border-ink/10 bg-surface-alt"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-[8px] flex items-center justify-center ${
                  hasDest ? "bg-success" : "bg-ink/10"
                }`}
              >
                <MapPin
                  className={`w-4 h-4 ${hasDest ? "text-white" : "text-ink-muted"}`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading text-xs font-semibold text-ink-muted uppercase tracking-wider">
                  Destination
                </p>
                {hasDest ? (
                  <p className="font-display text-base font-bold text-ink truncate">
                    {squad.lockedDestination}
                  </p>
                ) : (
                  <p className="font-heading text-sm text-ink-muted italic">
                    Not decided yet
                  </p>
                )}
              </div>
              {hasDest && <Check className="w-5 h-5 text-success shrink-0" />}
            </div>
          </div>

          {/* Budget */}
          <div
            className={`border-[2px] rounded-[12px] p-4 ${
              hasBudget
                ? "border-success/30 bg-success/5"
                : "border-ink/10 bg-surface-alt"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-[8px] flex items-center justify-center ${
                  hasBudget ? "bg-success" : "bg-ink/10"
                }`}
              >
                <DollarSign
                  className={`w-4 h-4 ${hasBudget ? "text-white" : "text-ink-muted"}`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading text-xs font-semibold text-ink-muted uppercase tracking-wider">
                  Budget
                </p>
                {hasBudget ? (
                  <p className="font-display text-base font-bold text-ink">
                    {formatRupee(squad.lockedBudget ?? 0)}{" "}
                    <span className="font-heading text-xs text-ink-muted font-normal">
                      /person
                    </span>
                  </p>
                ) : (
                  <p className="font-heading text-sm text-ink-muted italic">
                    Not decided yet
                  </p>
                )}
              </div>
              {hasBudget && <Check className="w-5 h-5 text-success shrink-0" />}
            </div>
          </div>

          {/* Dates */}
          <div
            className={`border-[2px] rounded-[12px] p-4 ${
              hasDates
                ? "border-success/30 bg-success/5"
                : "border-ink/10 bg-surface-alt"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-[8px] flex items-center justify-center ${
                  hasDates ? "bg-success" : "bg-ink/10"
                }`}
              >
                <Calendar
                  className={`w-4 h-4 ${hasDates ? "text-white" : "text-ink-muted"}`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading text-xs font-semibold text-ink-muted uppercase tracking-wider">
                  Dates
                </p>
                {hasDates ? (
                  <p className="font-display text-base font-bold text-ink">
                    {formatDate(squad.lockedDates!.start)} – {formatDate(squad.lockedDates!.end)}
                    <span className="font-heading text-xs text-ink-muted font-normal ml-2">
                      ({getDays(squad.lockedDates!.start, squad.lockedDates!.end)} days)
                    </span>
                  </p>
                ) : (
                  <p className="font-heading text-sm text-ink-muted italic">
                    Not decided yet
                  </p>
                )}
              </div>
              {hasDates && <Check className="w-5 h-5 text-success shrink-0" />}
            </div>
          </div>

          {/* Squad */}
          <div className="border-[2px] border-ink/10 rounded-[12px] p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[8px] bg-accent flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading text-xs font-semibold text-ink-muted uppercase tracking-wider">
                  Squad
                </p>
                <p className="font-display text-base font-bold text-ink">
                  {squad.members.length} / {squad.memberLimit} members
                </p>
              </div>
              <div className="flex items-center gap-1">
                {squad.members.slice(0, 4).map((m) => (
                  <div
                    key={m.id}
                    className={`w-6 h-6 rounded-full ${m.color} flex items-center justify-center ring-1 ring-white`}
                  >
                    <span className="text-[8px] font-heading font-bold text-white">
                      {m.initial}
                    </span>
                  </div>
                ))}
                {squad.members.length > 4 && (
                  <span className="font-mono text-[10px] text-ink-muted">
                    +{squad.members.length - 4}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="p-5 pt-4">
          {allLocked ? (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="flex-1 brut-btn text-sm min-h-[44px] !bg-surface-card !text-error !border-error/30 hover:!bg-error/5"
              >
                <XCircle className="w-4 h-4 mr-1 inline" />
                Cancel
              </button>
              <button
                onClick={handlePending}
                className="flex-1 brut-btn text-sm min-h-[44px] !bg-surface-card !text-ink !shadow-bruted-sm hover:!shadow-bruted"
              >
                <Clock className="w-4 h-4 mr-1 inline" />
                Pending
              </button>
              <button
                onClick={handleBookTrip}
                className="flex-1 brut-btn text-sm min-h-[44px]"
              >
                Book Trip
              </button>
            </div>
          ) : (
            <p className="font-heading text-sm text-ink-muted text-center">
              Lock all decisions to enable booking
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
