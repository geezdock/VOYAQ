"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Check, X, Loader2 } from "lucide-react";
import { usernameSchema, isUsernameAvailable } from "@/lib/schemas";

interface UsernameStepProps {
  onNext: (username: string) => void;
  loading?: boolean;
}

export function UsernameStep({ onNext, loading }: UsernameStepProps) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingCheckRef = useRef<string>("");
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const checkAvailability = useCallback(async (value: string) => {
    pendingCheckRef.current = value;
    const result = usernameSchema.safeParse(value);
    if (!result.success) {
      setError(result.error.issues[0].message);
      setStatus("idle");
      return;
    }
    setError(null);
    setStatus("checking");
    const available = await isUsernameAvailable(value);
    if (!mountedRef.current) return;
    if (pendingCheckRef.current !== value) return;
    setStatus(available ? "available" : "taken");
    if (!available) {
      setError("This username is taken");
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!username) return;
    debounceRef.current = setTimeout(() => checkAvailability(username), 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [username, checkAvailability]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status !== "available") return;
    onNext(username);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <p className="font-heading text-lg font-bold text-ink">
          Pick your username
        </p>
        <p className="font-heading text-sm text-ink-muted">
          This is how your squad will see you. You can change it later.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="font-heading text-sm font-semibold text-ink-light uppercase tracking-wider">
            Username
          </label>
          <div className="flex items-stretch">
            <span className="brut-input inline-flex items-center px-3 border-r-0 rounded-r-none bg-clay-light text-ink font-mono text-lg shrink-0">
              @
            </span>
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="yourname"
                value={username}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^a-zA-Z0-9_]/g, "").slice(0, 20);
                    setUsername(val);
                    setError(null);
                    if (!val) setStatus("idle");
                  }}
                className="brut-input w-full rounded-l-none font-mono text-lg"
                autoFocus
                autoComplete="off"
                spellCheck={false}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {status === "checking" && (
                  <Loader2 className="w-4 h-4 text-ink-muted animate-spin" />
                )}
                {status === "available" && (
                  <Check className="w-4 h-4 text-green-600" />
                )}
                {status === "taken" && (
                  <X className="w-4 h-4 text-error" />
                )}
              </div>
            </div>
          </div>
          {error && (
            <p className="font-mono text-xs text-error mt-1">{error}</p>
          )}
          {!error && status === "available" && (
            <p className="font-mono text-xs text-green-600 mt-1">
              @{username} is available
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={status !== "available" || loading}
          className="brut-btn w-full text-base disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "Creating account..." : "Continue"}
        </button>
      </form>

      <div className="brut-card !p-3 text-left">
        <p className="font-mono text-xs text-ink-muted leading-relaxed">
          <span className="font-semibold text-ink-light">Tip:</span> Keep it short and memorable. Your squad members will use this to identify you.
        </p>
      </div>
    </motion.div>
  );
}
