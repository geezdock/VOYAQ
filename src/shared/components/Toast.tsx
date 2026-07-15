"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ToastProps {
  message: string | null;
  onDismiss: () => void;
  duration?: number;
}

export function Toast({ message, onDismiss, duration = 4000 }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [message, onDismiss, duration]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="brut-card !p-3 !shadow-bruted-lg flex items-center gap-3 max-w-md">
            <span className="font-heading text-sm text-ink flex-1">{message}</span>
            <button
              onClick={onDismiss}
              className="min-h-[32px] min-w-[32px] flex items-center justify-center hover:bg-surface-alt rounded-bruted transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4 text-ink-muted" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
