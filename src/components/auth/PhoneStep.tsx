"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { phoneSchema } from "@/lib/schemas";

interface PhoneStepProps {
  onNext: (phone: string) => void;
}

export function PhoneStep({ onNext }: PhoneStepProps) {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const result = phoneSchema.safeParse(phone);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    onNext(phone);
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="font-heading text-sm font-semibold text-ink-light uppercase tracking-wider">
            Phone Number
          </label>
          <div className="flex items-stretch">
            <span className="brut-input inline-flex items-center px-3 border-r-0 rounded-r-none bg-clay-light text-ink font-mono text-lg shrink-0">
              +91
            </span>
            <input
              type="tel"
              inputMode="numeric"
              placeholder="98765 43210"
              value={phone}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                setPhone(val);
                setError(null);
              }}
              className="brut-input w-full rounded-l-none font-mono text-lg tracking-widest"
              autoFocus
            />
          </div>
          {error && (
            <p className="font-mono text-xs text-error mt-1">{error}</p>
          )}
        </div>

        <button type="submit" className="brut-btn w-full text-base">
          Send OTP
        </button>
      </form>
    </motion.div>
  );
}
