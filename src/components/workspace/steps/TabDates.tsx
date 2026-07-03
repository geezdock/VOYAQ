"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Plus, Calendar, Trash2 } from "lucide-react";
import type { Squad, DateProposal } from "@/types/squad";
import { useSquad } from "@/lib/SquadContext";

interface TabDatesProps {
  squad: Squad;
  onUpdate: (squad: Squad) => void;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
}

function formatDateFull(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
}

function getDays(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  return Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

export function TabDates({ squad, onUpdate }: TabDatesProps) {
  const { isMe, currentUserId } = useSquad();
  const [showForm, setShowForm] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [formError, setFormError] = useState("");

  const totalMembers = squad.members.length;

  function handlePropose() {
    setFormError("");
    if (!startDate || !endDate) {
      setFormError("Select both start and end dates");
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setFormError("End date must be after start date");
      return;
    }

    const uid = currentUserId || "me";
    const newProposal: DateProposal = {
      id: `dp-${Date.now()}`,
      startDate,
      endDate,
      proposedBy: uid,
      votes: [uid],
      createdAt: new Date().toISOString(),
    };

    onUpdate({ ...squad, dateProposals: [...squad.dateProposals, newProposal] });
    setStartDate("");
    setEndDate("");
    setShowForm(false);
  }

  function handleVote(proposalId: string) {
    const uid = currentUserId || "me";
    const updated = squad.dateProposals.map((p) => {
      if (p.id !== proposalId) return p;
      const hasVoted = p.votes.some((v) => isMe(v));
      return {
        ...p,
        votes: hasVoted ? p.votes.filter((v) => !isMe(v)) : [...p.votes, uid],
      };
    });
    onUpdate({ ...squad, dateProposals: updated });
  }

  function handleLock(proposal: DateProposal) {
    onUpdate({
      ...squad,
      lockedDates: { start: proposal.startDate, end: proposal.endDate },
    });
  }

  function handleDelete(proposalId: string) {
    onUpdate({
      ...squad,
      dateProposals: squad.dateProposals.filter((p) => p.id !== proposalId),
    });
  }

  function handleUnlock() {
    onUpdate({ ...squad, lockedDates: undefined });
  }

  const sortedProposals = [...squad.dateProposals].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs font-bold text-ink-muted uppercase tracking-wider">
          Date Proposals
        </span>
        {!squad.lockedDates && (
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="brut-btn text-sm px-4 py-3 min-h-[44px]"
                >
            <Plus className="w-4 h-4 mr-1 inline" />
            Propose Dates
          </button>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="border-[3px] border-ink rounded-[16px] bg-white p-5 sm:p-6 shadow-bruted-lg space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-ink-muted shrink-0" />
                <span className="font-heading text-sm font-bold text-ink">
                  Propose a date range
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-heading text-xs font-semibold text-ink-light uppercase tracking-wider">
                    From
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setFormError("");
                    }}
                    className="brut-input w-full font-mono text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-heading text-xs font-semibold text-ink-light uppercase tracking-wider">
                    To
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setFormError("");
                    }}
                    min={startDate}
                    className="brut-input w-full font-mono text-sm"
                  />
                </div>
              </div>

              {formError && (
                <p className="font-mono text-xs text-error">{formError}</p>
              )}

              {startDate && endDate && new Date(startDate) <= new Date(endDate) && (
                <div className="brut-card !p-3 !shadow-bruted-sm bg-surface-alt text-center">
                  <p className="font-mono text-sm text-ink">
                    <span className="font-bold">{formatDateFull(startDate)}</span>
                    {" → "}
                    <span className="font-bold">{formatDateFull(endDate)}</span>
                    {" · "}
                    <span className="font-bold">{getDays(startDate, endDate)} days</span>
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 brut-btn text-sm !bg-surface-card !text-ink hover:!bg-surface-alt"
                >
                  Cancel
                </button>
                <button onClick={handlePropose} className="flex-1 brut-btn text-sm">
                  Propose
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {squad.lockedDates && (
        <div className="border-[3px] border-success/30 rounded-[16px] bg-success/5 p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[8px] bg-success flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-heading text-sm font-bold text-ink">
                  Dates Locked
                </p>
                <p className="font-mono text-xs text-ink-muted">
                  {formatDateFull(squad.lockedDates.start)} → {formatDateFull(squad.lockedDates.end)} · {getDays(squad.lockedDates.start, squad.lockedDates.end)} days
                </p>
              </div>
            </div>
            <button
              onClick={handleUnlock}
              className="font-heading text-xs font-bold text-ink-muted hover:text-error transition-colors min-h-[44px] py-2"
            >
              Unlock
            </button>
          </div>
        </div>
      )}

      {sortedProposals.length === 0 && !showForm && (
        <div className="border-[3px] border-dashed border-ink/20 rounded-[16px] p-8 text-center">
          <Calendar className="w-8 h-8 text-ink-muted mx-auto mb-3" />
          <p className="font-heading text-sm text-ink-muted">
            No date proposals yet. Propose a timeline to get started.
          </p>
        </div>
      )}

      {sortedProposals.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedProposals.map((proposal) => {
            const myVoted = proposal.votes.some((v) => isMe(v));
            const approvalPct =
              totalMembers > 0 ? Math.round((proposal.votes.length / totalMembers) * 100) : 0;
            const proposer = squad.members.find((m) => m.id === proposal.proposedBy);
            const isLocked =
              squad.lockedDates?.start === proposal.startDate &&
              squad.lockedDates?.end === proposal.endDate;

            return (
              <motion.div
                key={proposal.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className={`border-[3px] rounded-[16px] bg-white p-5 shadow-bruted-lg ${
                  isLocked ? "border-success/30" : "border-ink"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-display text-lg font-extrabold text-ink">
                      {formatDate(proposal.startDate)} → {formatDate(proposal.endDate)}
                    </p>
                    <p className="font-mono text-[11px] text-ink-muted mt-1">
                      {getDays(proposal.startDate, proposal.endDate)} days · By {proposer?.name || "Unknown"}
                    </p>
                  </div>
                  {isLocked && (
                    <div className="flex items-center gap-1 bg-success/10 border border-success/30 rounded-full px-2 py-0.5">
                      <Check className="w-3 h-3 text-success" />
                      <span className="font-heading text-[10px] font-bold text-success">Locked</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-ink-muted">
                    <span className="font-heading text-xs">
                      {proposal.votes.length}/{totalMembers} voted
                    </span>
                    <span className="font-mono text-[10px] font-bold">
                      {approvalPct}%
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-[3px] bg-ink/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${approvalPct}%` }}
                      transition={{ duration: 0.5 }}
                      className={`h-full rounded-[3px] ${
                        approvalPct >= 50 ? "bg-success" : "bg-ink/30"
                      }`}
                    />
                  </div>

                  <div className="flex items-center gap-1">
                    {proposal.votes.slice(0, 5).map((memberId) => {
                      const member = squad.members.find((m) => m.id === memberId);
                      return (
                        <div
                          key={memberId}
                          className={`w-5 h-5 rounded-full ${member?.color || "bg-ink-muted"} flex items-center justify-center ring-[1.5px] ring-white -ml-1 first:ml-0`}
                        >
                          <span className="text-[6px] font-heading font-bold text-white leading-none">
                            {member?.initial}
                          </span>
                        </div>
                      );
                    })}
                    {proposal.votes.length > 5 && (
                      <span className="font-mono text-[8px] text-ink-muted ml-0.5">
                        +{proposal.votes.length - 5}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-ink/10 flex items-center gap-1.5">
                  <button
                    onClick={() => handleVote(proposal.id)}
                    className={`flex-1 py-2.5 min-h-[40px] rounded-[6px] border-[2px] font-heading text-xs font-bold transition-all ${
                      myVoted
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-ink/20 text-ink hover:border-ink/40"
                    }`}
                  >
                    {myVoted ? "Voted ✓" : "Vote Yes"}
                  </button>

                  {!isLocked && approvalPct >= 50 && (
                    <button
                      onClick={() => handleLock(proposal)}
                      className="flex-1 brut-btn text-xs py-2.5 min-h-[40px]"
                    >
                      Lock
                    </button>
                  )}

                  {(isMe(proposal.proposedBy) || isMe(squad.createdBy)) && !isLocked && (
                    <button
                      onClick={() => handleDelete(proposal.id)}
                      className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-[6px] border-[2px] border-ink/20 hover:border-error/40 hover:bg-error/5 transition-all"
                    >
                      <Trash2 className="w-4 h-4 text-ink-muted hover:text-error" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
