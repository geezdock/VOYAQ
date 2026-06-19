"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { AuthMethodSelect } from "./AuthMethodSelect";
import { PhoneStep } from "./PhoneStep";
import { EmailStep } from "./EmailStep";
import { OTPStep } from "./OTPStep";
import { AgeGateModal } from "./AgeGateModal";
import { ParentContactForm } from "./ParentContactForm";
import { ConsentSent } from "./ConsentSent";
import type { AuthState, AuthStep } from "@/types/auth";

export function AuthFlow() {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    step: "auth-method",
    authMethod: null,
    phone: "",
    email: "",
    otp: [],
    dob: "",
    parentContact: null,
  });

  const goTo = useCallback((step: AuthStep) => {
    setState((prev) => ({ ...prev, step }));
  }, []);

  const backMap: Record<AuthStep, (() => void) | null> = {
    "auth-method": () => router.push("/"),
    phone: () => goTo("auth-method"),
    email: () => goTo("auth-method"),
    otp: () => {
      if (state.authMethod === "phone") goTo("phone");
      else goTo("email");
    },
    "age-gate": () => {
      if (state.authMethod === "google") goTo("auth-method");
      else goTo("otp");
    },
    "parent-contact": () => goTo("age-gate"),
    "consent-sent": () => goTo("parent-contact"),
  };

  const stepLabel: Record<AuthStep, string> = {
    "auth-method": "Step 1",
    phone: "Step 2",
    email: "Step 2",
    otp: "Step 3",
    "age-gate": "Step 4",
    "parent-contact": "Step 5",
    "consent-sent": "Consent",
  };

  function getOTPLabel(): { label: string; sublabel: string } {
    if (state.authMethod === "phone") {
      const p = state.phone;
      return {
        label: `+91 ${p.slice(0, 5)} ${p.slice(5)}`,
        sublabel: "Enter the code sent to",
      };
    }
    return {
      label: state.email,
      sublabel: "Enter the code sent to",
    };
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="brut-card w-full max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {backMap[state.step] && (
              <button
                onClick={backMap[state.step]!}
                className="p-1 -ml-1 hover:bg-surface-alt rounded-bruted transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-ink" />
              </button>
            )}
            <span className="font-display text-xl font-bold text-ink">
              TRAVO
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
              onSelect={(method) => {
                if (method === "google") {
                  setState((prev) => ({ ...prev, authMethod: method }));
                  goTo("age-gate");
                } else {
                  setState((prev) => ({ ...prev, authMethod: method }));
                  goTo(method);
                }
              }}
            />
          )}

          {state.step === "phone" && (
            <PhoneStep
              key="phone"
              onNext={(phone) => {
                setState((prev) => ({ ...prev, phone }));
                goTo("otp");
              }}
            />
          )}

          {state.step === "email" && (
            <EmailStep
              key="email"
              onNext={(email) => {
                setState((prev) => ({ ...prev, email }));
                goTo("otp");
              }}
            />
          )}

          {state.step === "otp" && (
            <OTPStep
              key="otp"
              {...getOTPLabel()}
              onNext={() => goTo("age-gate")}
            />
          )}

          {state.step === "age-gate" && (
            <AgeGateModal
              key="age-gate"
              onAdult={() => {
                window.location.href = "/dashboard";
              }}
              onMinor={() => goTo("parent-contact")}
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
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
