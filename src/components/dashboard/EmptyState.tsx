"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Compass, MapPin, ArrowRight } from "lucide-react";

export function EmptyState() {
  const router = useRouter();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
    >
      {/* Illustration */}
      <div className="relative w-28 h-28 mb-8">
        {/* Background circle */}
        <div className="absolute inset-0 rounded-full bg-surface-alt border-2 border-ink/10" />

        {/* Map pin */}
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [-4, 4, -4] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-3 left-1/2 -translate-x-1/2"
        >
          <div className="w-10 h-10 rounded-bruted bg-accent border-2 border-ink flex items-center justify-center shadow-bruted-sm">
            <MapPin className="w-5 h-5 text-white" />
          </div>
        </motion.div>

        {/* Compass */}
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-2 left-1/2 -translate-x-1/2"
        >
          <div className="w-12 h-12 rounded-full bg-ink border-2 border-ink flex items-center justify-center shadow-bruted">
            <Compass className="w-6 h-6 text-surface" />
          </div>
        </motion.div>

        {/* Route line */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 112 112"
          fill="none"
        >
          <motion.path
            d="M56 40 Q 40 60 56 80"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="4 4"
            className="text-ink/20"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </svg>
      </div>

      <p className="font-display text-3xl md:text-4xl font-bold text-ink mb-2">
        No trips yet
      </p>
      <p className="font-heading text-lg text-ink-muted mb-8 max-w-sm">
        Create a squad, invite your friends, and plan your next adventure together.
      </p>

      <button onClick={() => router.push("/create")} className="brut-btn text-base px-8 py-4 flex items-center gap-2">
        Create a Squad
        <ArrowRight className="w-5 h-5" />
      </button>
    </motion.div>
  );
}
