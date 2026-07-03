"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { AuthMethodSelect } from "./AuthMethodSelect";
import { EmailStep } from "./EmailStep";
import { PhoneStep } from "./PhoneStep";
import { OTPStep } from "./OTPStep";
import { AgeGateModal } from "./AgeGateModal";
import { ParentContactForm } from "./ParentContactForm";
import { ConsentSent } from "./ConsentSent";
import { UsernameStep } from "./UsernameStep";
import { useAuthSteps } from "@/lib/useAuthSteps";
import type { AuthStep } from "@/types/auth";

export function AuthFlow() {
  const router = useRouter();
  const { state, setState, mode, loading, error, goTo, backMap, stepLabel, getOTPLabel, sendOTP, handleOTPComplete, handleGoogleAuth, handleUsernameComplete } = useAuthSteps();

  useEffect(() => {
    if (mode === "setup") {
      setState((prev) => ({ ...prev, authMethod: "google" }));
      goTo("age-gate");
      router.replace("/auth");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-dvh flex items-center justify-center p-4 max-sm:p-2">
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
                if (method === "google") {
                  handleGoogleAuth();
                } else {
                  setState((prev) => ({ ...prev, authMethod: method, step: method as AuthStep }));
                }
              }}
            />
          )}
          {state.step === "phone" && (
            <PhoneStep
              key="phone"
              loading={loading}
              onNext={async (phone) => {
                setState((prev) => ({ ...prev, phone }));
                const ok = await sendOTP();
                if (ok) goTo("otp");
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
          {state.step === "age-gate" && (
            <AgeGateModal
              key="age-gate"
              onAdult={(dob) => {
                setState((prev) => ({ ...prev, dob }));
                goTo("username");
              }}
              onMinor={(dob) => {
                setState((prev) => ({ ...prev, dob }));
                goTo("parent-contact");
              }}
            />
          )}
          {state.step === "parent-contact" && (
            <ParentContactForm
              key="parent-contact"
              onSent={(contact) => {
                setState((prev) => ({ ...prev, parentContact: contact }));
                goTo("consent-sent");
              }}
            />
          )}
          {state.step === "consent-sent" && state.parentContact && (
            <ConsentSent
              key="consent-sent"
              contact={state.parentContact}
              onNext={() => goTo("username")}
            />
          )}
          {state.step === "username" && (
            <UsernameStep
              key="username"
              loading={loading}
              onNext={async (username) => {
                await handleUsernameComplete(username);
              }}
            />
          )}
        </AnimatePresence>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-xs text-error text-center mt-4"
          >
            {error}
          </motion.p>
        )}
      </div>
    </div>
  );
}
