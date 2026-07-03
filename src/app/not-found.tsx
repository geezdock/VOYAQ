"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="brut-card w-full max-w-md text-center space-y-6"
      >
        <div className="space-y-2">
          <p className="font-mono text-6xl font-bold text-ink leading-none">
            404
          </p>
          <p className="font-display text-xl font-bold text-ink">
            You&apos;re lost
          </p>
          <p className="font-heading text-sm text-ink-muted">
            This page doesn&apos;t exist or has been moved.
          </p>
        </div>

        <Link href="/dashboard" className="brut-btn inline-flex text-sm w-full justify-center">
          Back to Dashboard
        </Link>
      </motion.div>
    </div>
  );
}
