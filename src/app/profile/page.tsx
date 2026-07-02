"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, User } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const [username] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("voyaq_username") || "";
    }
    return "";
  });

  return (
    <div className="min-h-screen">
      <header className="border-b-2 border-ink bg-surface-card">
        <div className="max-w-6xl mx-auto px-4 py-0 flex items-center h-16">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 font-heading text-sm font-semibold text-ink-muted hover:text-ink transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h1 className="font-display text-2xl font-bold text-ink">
            Profile
          </h1>

          <div className="brut-card space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-bruted-lg border-2 border-ink bg-peach flex items-center justify-center">
                <span className="font-display text-2xl font-bold text-ink">
                  {username ? username[0].toUpperCase() : "U"}
                </span>
              </div>
              <div>
                <p className="font-display text-xl font-bold text-ink">
                  @{username || "unknown"}
                </p>
                <p className="font-heading text-sm text-ink-muted">
                  Member since {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                </p>
              </div>
            </div>

            <div className="border-t border-ink/10 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-heading text-sm text-ink-muted">Username</span>
                <span className="font-mono text-sm text-ink">@{username || "unknown"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-heading text-sm text-ink-muted">Status</span>
                <span className="font-mono text-sm text-success font-bold">Active</span>
              </div>
            </div>
          </div>

          <Link
            href="/settings"
            className="brut-card !p-4 flex items-center justify-between hover:shadow-bruted-lg transition-shadow block"
          >
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-ink-muted" />
              <span className="font-heading text-sm font-bold text-ink">Settings</span>
            </div>
            <span className="font-mono text-xs text-ink-muted">→</span>
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
