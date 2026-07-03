"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, LogOut, User, Bell } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

export default function SettingsPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .maybeSingle();
      if (data?.username) setUsername(data.username);
    })();
  }, []);

  async function handleSignOut() {
    try {
      await createClient().auth.signOut();
      router.push("/");
    } catch {
      // Sign out failed — page will still navigate away
      router.push("/");
    }
  }

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
            Settings
          </h1>

          <div className="space-y-4">
            <div className="brut-card space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-ink-muted" />
                <span className="font-heading text-sm font-bold text-ink">Account</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-heading text-sm text-ink-muted">Username</span>
                  <span className="font-mono text-sm text-ink">@{username || "unknown"}</span>
                </div>
              </div>
            </div>

            <div className="brut-card space-y-4">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-ink-muted" />
                <span className="font-heading text-sm font-bold text-ink">Notifications</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-heading text-sm text-ink-muted">Squad updates</span>
                  <div className="w-10 h-5 rounded-full bg-accent border-2 border-ink relative">
                    <div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-white" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-heading text-sm text-ink-muted">Vote reminders</span>
                  <div className="w-10 h-5 rounded-full bg-accent border-2 border-ink relative">
                    <div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-white" />
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="w-full brut-card !p-4 flex items-center justify-center gap-2 hover:bg-error/5 hover:border-error/30 transition-colors"
            >
              <LogOut className="w-4 h-4 text-error" />
              <span className="font-heading text-sm font-bold text-error">
                Sign Out
              </span>
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
