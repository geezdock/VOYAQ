"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { AuthState, AuthStep } from "@/types/auth";

export function useAuthSteps() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") ?? "get-started";

  const [state, setState] = useState<AuthState>({
    step: "auth-method",
    authMethod: null,
    phone: "",
    email: "",
    otp: [],
    dob: "",
    parentContact: null,
    username: "",
  });

  const authMethodRef = useRef(state.authMethod);
  useEffect(() => {
    authMethodRef.current = state.authMethod;
  }, [state.authMethod]);

  const goTo = useCallback((step: AuthStep) => {
    setState((prev) => ({ ...prev, step }));
  }, []);

  const backMap: Record<AuthStep, (() => void) | null> = {
    "auth-method": () => router.push("/"),
    phone: () => goTo("auth-method"),
    email: () => goTo("auth-method"),
    otp: () => {
      if (authMethodRef.current === "phone") goTo("phone");
      else goTo("email");
    },
    "age-gate": () => {
      if (authMethodRef.current === "google") goTo("auth-method");
      else goTo("otp");
    },
    "parent-contact": () => goTo("age-gate"),
    "consent-sent": () => goTo("parent-contact"),
    username: () => goTo("age-gate"),
  };

  const stepLabel: Record<AuthStep, string> = {
    "auth-method": "Step 1",
    phone: "Step 2",
    email: "Step 2",
    otp: "Step 3",
    "age-gate": "Step 4",
    "parent-contact": "Step 5",
    "consent-sent": "Consent",
    username: "Step 5",
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

  function handleGoogleAuth() {
    if (mode === "login") {
      sessionStorage.setItem("voyaq_username", "You");
      window.location.href = "/dashboard";
    } else {
      goTo("age-gate");
    }
  }

  function handleOTPComplete() {
    if (mode === "login") {
      sessionStorage.setItem("voyaq_username", "You");
      window.location.href = "/dashboard";
    } else {
      goTo("age-gate");
    }
  }

  function handleUsernameComplete(username: string) {
    sessionStorage.setItem("voyaq_username", username);
    window.location.href = "/dashboard";
  }

  return {
    state,
    setState,
    mode,
    goTo,
    backMap,
    stepLabel,
    getOTPLabel,
    handleGoogleAuth,
    handleOTPComplete,
    handleUsernameComplete,
  };
}
