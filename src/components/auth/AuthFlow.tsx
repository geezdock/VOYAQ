"use client";

import { AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { AuthMethodSelect } from "./AuthMethodSelect";
import { EmailStep } from "./EmailStep";
import { OTPStep } from "./OTPStep";
import { useAuthSteps } from "@/lib/useAuthSteps";
import type { AuthStep } from "@/types/auth";

export function AuthFlow() {
  const { state, setState, mode, loading, goTo, backMap, stepLabel, getOTPLabel, sendOTP, handleOTPComplete } = useAuthSteps();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="brut-card w-full max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {backMap[state.step] && (
              <button
                onClick={backMap[state.step]!}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center -ml-2 hover:bg-surface-alt rounded-bruted transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-ink" />
              </button>
            )}
            <span className="font-display text-xl font-bold text-ink">
              VOYAQ
            </span>
          </div>
          <span className="font-mono text-xs text-ink-muted uppercase tracking-wider">
            {stepLabel[state.step]}
          </span>
        </div>

        <AnimatePresence mode="wait">
          {state.step === "auth-method" && (
            <AuthMethodSelect
              key="auth-method"
              mode={mode}
              onSelect={(method) => {
                setState((prev) => ({ ...prev, authMethod: method, step: method as AuthStep }));
              }}
            />
          )}
          {state.step === "email" && (
            <EmailStep
              key="email"
              loading={loading}
              onNext={async (email) => {
                setState((prev) => ({ ...prev, email }));
                const ok = await sendOTP();
                if (ok) goTo("otp");
              }}
            />
          )}
          {state.step === "otp" && (
            <OTPStep
              key="otp"
              label={getOTPLabel().label}
              sublabel={getOTPLabel().sublabel}
              loading={loading}
              onNext={handleOTPComplete}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
