"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { emailSchema } from "@/lib/schemas";

interface EmailStepProps {
  onNext: (email: string) => void;
}

export function EmailStep({ onNext }: EmailStepProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    onNext(email);
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
            Email Address
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            className="brut-input w-full font-mono text-base"
            autoFocus
          />
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
