"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { dobSchema, calculateAge } from "@/lib/schemas";

interface AgeGateModalProps {
  onAdult: () => void;
  onMinor: () => void;
}

export function AgeGateModal({ onAdult, onMinor }: AgeGateModalProps) {
  const [dob, setDob] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const result = dobSchema.safeParse(dob);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    const age = calculateAge(dob);
    if (age >= 18) {
      onAdult();
    } else {
      onMinor();
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <p className="font-heading text-lg font-bold text-ink">
          Verify your age
        </p>
        <p className="font-heading text-sm text-ink-muted">
          Indian regulations require age verification for group travel planning.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="font-heading text-sm font-semibold text-ink-light uppercase tracking-wider">
            Date of Birth
          </label>
          <input
            type="date"
            value={dob}
            onChange={(e) => {
              setDob(e.target.value);
              setError(null);
            }}
            className="brut-input w-full font-mono text-base"
            max={new Date().toISOString().split("T")[0]}
            autoFocus
          />
          {error && (
            <p className="font-mono text-xs text-error mt-1">{error}</p>
          )}
        </div>

        <button type="submit" className="brut-btn w-full text-base">
          Continue
        </button>
      </form>
    </motion.div>
  );
}
