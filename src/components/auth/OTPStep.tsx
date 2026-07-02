"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { otpSchema } from "@/lib/schemas";

interface OTPStepProps {
  label: string;
  sublabel: string;
  onNext: () => void;
  loading?: boolean;
}

const DIGITS = 6;

export function OTPStep({ label, sublabel, onNext, loading }: OTPStepProps) {
  const [otp, setOtp] = useState<string[]>(Array(DIGITS).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(30);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [resendTimer]);

  function handleChange(index: number, value: string) {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    setError(null);

    if (value && index < DIGITS - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    const full = next.join("");
    if (full.length === DIGITS && !loading) {
      const result = otpSchema.safeParse(full);
      if (result.success) {
        onNext();
      } else {
        setError(result.error.issues[0].message);
      }
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const text = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, DIGITS);
    const next = Array(DIGITS).fill("");
    for (let i = 0; i < text.length; i++) next[i] = text[i];
    setOtp(next);
    const focusIdx = Math.min(text.length, DIGITS - 1);
    inputsRef.current[focusIdx]?.focus();
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <p className="font-heading text-sm text-ink-muted">{sublabel}</p>
        <p className="font-mono text-lg text-ink">{label}</p>
      </div>

      <div className="flex justify-center gap-1.5 max-sm:gap-1" onPaste={handlePaste}>
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="brut-input w-11 h-13 max-sm:w-10 max-sm:h-12 text-center font-mono text-xl tracking-widest"
            autoComplete="one-time-code"
          />
        ))}
      </div>

      {error && (
        <p className="font-mono text-xs text-error text-center">{error}</p>
      )}

      <div className="text-center">
        {resendTimer > 0 ? (
          <p className="font-mono text-xs text-ink-muted">
            Resend in {resendTimer}s
          </p>
        ) : (
          <button
            type="button"
            onClick={() => {
              setResendTimer(30);
              setOtp(Array(DIGITS).fill(""));
              inputsRef.current[0]?.focus();
            }}
            className="font-heading text-sm text-accent underline underline-offset-2 hover:text-accent-dark transition-colors min-h-[44px] py-2.5 inline-flex items-center"
          >
            Resend OTP
          </button>
        )}
      </div>
    </motion.div>
  );
}
