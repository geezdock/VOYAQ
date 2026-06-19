"use client";

import { motion } from "framer-motion";
import { CheckCircle, ExternalLink } from "lucide-react";

interface ConsentSentProps {
  contact: { type: "phone" | "email"; value: string };
}

export function ConsentSent({ contact }: ConsentSentProps) {
  const displayValue =
    contact.type === "phone"
      ? `+91 ${contact.value.slice(0, 5)} ${contact.value.slice(5)}`
      : contact.value;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6 text-center"
    >
      <div className="mx-auto w-16 h-16 rounded-bruted-lg border-2 border-ink flex items-center justify-center bg-peach">
        <CheckCircle className="w-8 h-8 text-ink" />
      </div>

      <div className="space-y-2">
        <p className="font-display text-xl font-bold text-ink">
          Consent request sent
        </p>
        <p className="font-heading text-sm text-ink-muted leading-relaxed max-w-sm mx-auto">
          We&apos;ve sent a consent request to your guardian. They can review
          and approve the trip from their phone.
        </p>
      </div>

      <div className="brut-card !p-4 !shadow-bruted-sm text-left space-y-2">
        <p className="font-mono text-xs text-ink-muted uppercase tracking-wider">
          Sent to
        </p>
        <p className="font-mono text-base text-ink">{displayValue}</p>
        <div className="flex items-center gap-2 pt-1">
          <div className="w-2 h-2 rounded-full bg-clay" />
          <span className="font-mono text-xs text-ink-muted">
            Waiting for approval...
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-clay" />
          <span className="font-mono text-xs text-ink-muted">
            Once approved, you&apos;ll get a green badge on your profile
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          const url = `${window.location.origin}/consent?ref=${contact.value}`;
          const text =
            contact.type === "phone"
              ? `Please approve my trip on TRAVO: ${url}`
              : `Please approve my trip on TRAVO: ${url}`;
          window.open(
            `https://wa.me/?text=${encodeURIComponent(text)}`,
            "_blank"
          );
        }}
        className="brut-btn w-full text-sm inline-flex items-center justify-center gap-2"
      >
        <ExternalLink className="w-4 h-4" />
        Share via WhatsApp
      </button>
    </motion.div>
  );
}
