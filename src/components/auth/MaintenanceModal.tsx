"use client";

import { motion } from "framer-motion";
import { Wrench } from "lucide-react";

interface MaintenanceModalProps {
  method: "google" | "phone";
  onClose: () => void;
}

export function MaintenanceModal({ method, onClose }: MaintenanceModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="brut-card w-full max-w-sm !shadow-bruted-lg text-center"
      >
        <div className="mx-auto w-14 h-14 rounded-bruted bg-clay-light border-2 border-ink flex items-center justify-center mb-4">
          <Wrench className="w-7 h-7 text-ink" />
        </div>

        <h3 className="font-display text-xl font-extrabold text-ink uppercase tracking-tight mb-2">
          Under Maintenance
        </h3>

        <p className="font-heading text-sm text-ink-muted mb-1">
          {method === "google"
            ? "Sign in with Google is temporarily unavailable."
            : "Phone number sign in is temporarily unavailable."}
        </p>

        <p className="font-heading text-sm text-ink-muted mb-6">
          Please use <span className="font-bold text-ink">Email</span> to sign in.
        </p>

        <button
          onClick={onClose}
          className="brut-btn w-full text-sm"
        >
          Got it
        </button>
      </motion.div>
    </div>
  );
}
