"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { PartyPopper, Mail } from "lucide-react";
import { createClient } from "@/services/supabase/client";
import { useAuth } from "@/shared/providers/AuthContext";

const DEV_MODE = process.env.NEXT_PUBLIC_DEV_AUTH === "true";

export function AuthFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signInWithGoogle, signInWithMagicLink } = useAuth();
  const mode = searchParams.get("mode") ?? "get-started";
  const redirectParam = searchParams.get("redirect") || "/dashboard";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [useEmailAuth, setUseEmailAuth] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function navigateAfterAuth() {
    router.push(redirectParam);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    if (useEmailAuth) {
      if (!email.trim()) return;
      setLoading(true);
      setError(null);
      const { error: magicLinkError } = await signInWithMagicLink(email.trim(), redirectParam);
      setLoading(false);
      if (magicLinkError) {
        setError(magicLinkError.message);
      } else {
        setMagicLinkSent(true);
      }
      return;
    }

    if (!name.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInAnonymously();

      if (signInError) {
        if (DEV_MODE) {
          localStorage.setItem(
            "voyaq_dev_user",
            JSON.stringify({
              id: "me",
              display_name: name.trim(),
            }),
          );
          navigateAfterAuth();
          return;
        }
        throw signInError;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        data: { display_name: name.trim() },
      });

      if (updateError) throw updateError;

      navigateAfterAuth();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      if (message.includes("422") || message.includes("anonymous")) {
        setError(
          "Anonymous sign-ins are disabled in your Supabase project. " +
          "Set NEXT_PUBLIC_DEV_AUTH=true in .env.local to bypass or sign in with Google/Email below.",
        );
      } else {
        setError(message);
      }
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center p-4 max-sm:p-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="brut-card w-full max-w-md text-center space-y-4"
      >
        <div className="mx-auto w-14 h-14 rounded-bruted bg-ink flex items-center justify-center mb-2">
          <PartyPopper className="w-7 h-7 text-surface" />
        </div>

        <h1 className="font-display text-2xl font-extrabold text-ink uppercase tracking-tight mb-1">
          {mode === "login" ? "Welcome back" : "Get started"}
        </h1>

        <p className="font-heading text-sm text-ink-muted">
          {mode === "login"
            ? "Sign in to your squad account."
            : "Join your squad and start planning trips."}
        </p>

        {magicLinkSent ? (
          <div className="bg-success/10 border-2 border-success rounded-bruted p-4 text-center space-y-2">
            <Mail className="w-8 h-8 text-success mx-auto" />
            <p className="font-heading text-sm font-bold text-success">Magic link sent!</p>
            <p className="font-mono text-xs text-ink-muted">
              Check <strong>{email}</strong> to sign in automatically.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {!useEmailAuth ? (
              <div className="space-y-1">
                <label className="font-heading text-xs font-semibold text-ink-light uppercase tracking-wider">
                  What should we call you?
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="brut-input w-full text-base"
                  placeholder="Enter your name"
                  autoFocus
                  disabled={loading}
                />
              </div>
            ) : (
              <div className="space-y-1">
                <label className="font-heading text-xs font-semibold text-ink-light uppercase tracking-wider">
                  Your Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="brut-input w-full text-base"
                  placeholder="name@college.edu"
                  autoFocus
                  disabled={loading}
                />
              </div>
            )}

            {error && (
              <p className="font-heading text-xs text-error leading-relaxed">{error}</p>
            )}

            <button
              type="submit"
              disabled={(!useEmailAuth && !name.trim()) || (useEmailAuth && !email.trim()) || loading}
              className="brut-btn w-full text-base disabled:opacity-40"
            >
              {loading
                ? "Processing..."
                : useEmailAuth
                ? "Send Magic Link"
                : mode === "login"
                ? "Sign in"
                : "Let's go"}
            </button>
          </form>
        )}

        <div className="relative py-2 flex items-center justify-center">
          <div className="border-t border-ink/10 w-full" />
          <span className="bg-surface-card px-3 font-mono text-xs text-ink-muted uppercase shrink-0">
            or continue with
          </span>
          <div className="border-t border-ink/10 w-full" />
        </div>

        <div className="space-y-2">
          <button
            onClick={() => signInWithGoogle(redirectParam)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border-2 border-ink rounded-bruted bg-white font-heading text-sm font-semibold text-ink hover:bg-surface-alt transition-colors shadow-bruted-sm"
          >
            <span>Google Login</span>
          </button>

          <button
            onClick={() => setUseEmailAuth(!useEmailAuth)}
            className="font-heading text-xs font-semibold text-ink-muted hover:text-ink transition-colors py-1"
          >
            {useEmailAuth ? "← Sign in with Name" : "Sign in with Email Magic Link →"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
