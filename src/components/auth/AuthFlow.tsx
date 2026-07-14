"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { PartyPopper } from "lucide-react";

export function AuthFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") ?? "get-started";
  const [name, setName] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    router.push("/dashboard");
  }

  return (
    <div className="min-h-dvh flex items-center justify-center p-4 max-sm:p-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="brut-card w-full max-w-md text-center"
      >
        <div className="mx-auto w-14 h-14 rounded-bruted bg-ink flex items-center justify-center mb-4">
          <PartyPopper className="w-7 h-7 text-surface" />
        </div>

        <h1 className="font-display text-2xl font-extrabold text-ink uppercase tracking-tight mb-1">
          {mode === "login" ? "Welcome back" : "Get started"}
        </h1>

        <p className="font-heading text-sm text-ink-muted mb-6">
          {mode === "login"
            ? "Sign in to your account."
            : "Join your squad and start planning trips."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-left space-y-1">
            <label className="font-heading text-xs font-semibold text-ink-light uppercase tracking-wider">
              What should we call you?
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="brut-input w-full text-base"
              placeholder="Enter your name"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="brut-btn w-full text-base disabled:opacity-40"
          >
            {mode === "login" ? "Sign in" : "Let&apos;s go"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
