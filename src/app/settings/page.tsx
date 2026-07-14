"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, LogOut, User, Bell, MapPin, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const router = useRouter();

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
          <h1 className="font-display text-2xl font-bold text-ink">Settings</h1>

          <div className="space-y-4">
            <div className="brut-card space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-ink-muted" />
                <span className="font-heading text-sm font-bold text-ink">Account</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-heading text-sm text-ink-muted">Username</span>
                  <span className="font-mono text-sm text-ink">@You</span>
                </div>
              </div>
            </div>

            <div className="brut-card space-y-4">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-ink-muted" />
                <span className="font-heading text-sm font-bold text-ink">Notifications</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-heading text-sm text-ink-muted">Squad updates</p>
                    <p className="font-mono text-xs text-ink-muted">Ping the squad when a decision is waiting.</p>
                  </div>
                  <div className="w-10 h-5 rounded-full bg-accent border-2 border-ink relative shrink-0">
                    <div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-white" />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-heading text-sm text-ink-muted">Destination changes</p>
                    <p className="font-mono text-xs text-ink-muted">Get notified when the trip plan updates.</p>
                  </div>
                  <div className="w-10 h-5 rounded-full bg-accent border-2 border-ink relative shrink-0">
                    <div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-white" />
                  </div>
                </div>
              </div>

              <div className="rounded-[12px] border-2 border-dashed border-ink/15 bg-surface-alt/50 p-4 space-y-2">
                <div className="flex items-center gap-2 font-heading text-sm font-bold text-ink">
                  <MapPin className="w-4 h-4 text-ink-muted" />
                  Travel Alerts
                </div>
                <p className="text-sm text-ink-muted">
                  Travel intelligence alerts will appear here once a trip is ready.
                </p>
                <div className="flex items-center gap-2 text-xs font-mono text-ink-muted">
                  <AlertTriangle className="w-4 h-4" />
                  Empty until destination intelligence is connected.
                </div>
              </div>
            </div>

            <button
              onClick={() => router.push("/")}
              className="w-full brut-card !p-4 flex items-center justify-center gap-2 hover:bg-error/5 hover:border-error/30 transition-colors"
            >
              <LogOut className="w-4 h-4 text-error" />
              <span className="font-heading text-sm font-bold text-error">Sign Out</span>
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
