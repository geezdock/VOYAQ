"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { Squad } from "@/types/squad";
import { useSquad } from "@/lib/SquadContext";

interface CreateSquadModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (squad: Squad) => void;
}

export function CreateSquadModal({
  open,
  onClose,
  onCreated,
}: CreateSquadModalProps) {
  const { currentUserId } = useSquad();
  const [name, setName] = useState("");
  const [destination, setDestination] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Enter a squad name");
      return;
    }

    const inviteCode = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const uid = currentUserId || "me";
    const newSquad: Squad = {
      id: `squad-${Date.now()}`,
      name: name.trim(),
      inviteCode: `${inviteCode}-${Math.random().toString(36).slice(2, 6)}`,
      createdBy: uid,
      destination: destination.trim() || undefined,
      destinations: destination.trim() ? [destination.trim()] : [],
      members: [
        {
          id: uid,
          name: "You",
          initial: "Y",
          color: "bg-accent",
          verified: true,
          joinedAt: new Date().toISOString(),
        },
      ],
      memberLimit: 8,
      votes: [],
      budgetPerPerson: 0,
      budgetPreferences: [],
      dateProposals: [],
      polls: [],
      status: "planning",
      createdAt: new Date().toISOString(),
    };

    onCreated(newSquad);
    onClose();
    setName("");
    setDestination("");
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-ink/40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="brut-card w-full max-w-md relative z-10"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="font-heading text-lg font-bold text-ink">
                Create a Squad
              </span>
              <button
                onClick={onClose}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-surface-alt rounded-bruted transition-colors"
              >
                <X className="w-5 h-5 text-ink" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="font-heading text-xs font-semibold text-ink-light uppercase tracking-wider">
                  Squad Name
                </label>
                <input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError("");
                  }}
                  className="brut-input w-full text-sm"
                  placeholder="Goa Crew 2026"
                  autoFocus
                />
                {error && (
                  <p className="font-mono text-xs text-error">{error}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="font-heading text-xs font-semibold text-ink-light uppercase tracking-wider">
                  Destination{" "}
                  <span className="text-ink-muted">(optional)</span>
                </label>
                <input
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="brut-input w-full text-sm"
                  placeholder="Goa, Manali, Pondicherry..."
                />
                <p className="font-mono text-[10px] text-ink-muted">
                  Leave blank if the group is still deciding
                </p>
              </div>

              <button type="submit" className="brut-btn w-full text-base mt-2">
                Launch Squad
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
