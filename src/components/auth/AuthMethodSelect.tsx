"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, Mail, Construction } from "lucide-react";
import type { AuthMethod } from "@/types/auth";

interface AuthMethodSelectProps {
  onSelect?: (method: AuthMethod) => void;
  mode: string;
}

export function AuthMethodSelect({ onSelect, mode }: AuthMethodSelectProps) {
  const [showNotice, setShowNotice] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="space-y-6"
      >
        <div className="text-center space-y-2">
          <p className="font-display text-2xl font-bold text-ink">
            {mode === "login" ? "Welcome back" : "Get started"}
          </p>
          <p className="font-heading text-sm text-ink-muted">
            {mode === "login"
              ? "Sign in to your account."
              : "Join your squad and start planning trips."}
          </p>
        </div>

        <button
          onClick={() => setShowNotice(true)}
          className="brut-btn w-full text-base inline-flex items-center justify-center gap-3 !bg-surface-card !text-ink hover:!bg-surface-alt"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-clay" />
          <span className="font-mono text-xs text-ink-muted uppercase">or</span>
          <div className="flex-1 h-px bg-clay" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowNotice(true)}
            className="brut-card !p-4 flex flex-col items-center gap-2 hover:shadow-bruted transition-shadow cursor-pointer !border-ink"
          >
            <Smartphone className="w-6 h-6 text-ink" />
            <span className="font-heading text-sm font-semibold text-ink">
              Phone
            </span>
            <span className="font-mono text-xs text-ink-muted">OTP via SMS</span>
          </button>

          <button
            onClick={() => onSelect?.("email")}
            className="brut-card !p-4 flex flex-col items-center gap-2 hover:shadow-bruted transition-shadow cursor-pointer !border-ink"
          >
            <Mail className="w-6 h-6 text-ink" />
            <span className="font-heading text-sm font-semibold text-ink">
              Email
            </span>
            <span className="font-mono text-xs text-ink-muted">OTP via email</span>
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showNotice && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="brut-card mt-6 !border-accent !shadow-bruted text-center space-y-4"
          >
            <div className="mx-auto w-14 h-14 rounded-bruted-lg border-2 border-ink flex items-center justify-center bg-peach">
              <Construction className="w-7 h-7 text-ink" />
            </div>
            <div className="space-y-1">
              <p className="font-display text-lg font-bold text-ink">
                Under Construction
              </p>
              <p className="font-heading text-sm text-ink-muted">
                This login method is being built. It&apos;ll be ready soon!
              </p>
            </div>
            <button
              onClick={() => setShowNotice(false)}
              className="brut-btn text-sm w-full"
            >
              Got it
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
