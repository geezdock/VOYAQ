"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import type { AuthState, AuthStep } from "@/types/auth";

const validTransitions: Record<AuthStep, AuthStep[]> = {
  "auth-method": ["phone", "email", "age-gate"],
  phone: ["otp"],
  email: ["otp"],
  otp: ["age-gate"],
  "age-gate": ["username", "parent-contact"],
  "parent-contact": ["consent-sent"],
  "consent-sent": ["username"],
  username: [],
};

export function useAuthSteps() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") ?? "get-started";
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);
  function getSupabase() {
    if (!supabaseRef.current) supabaseRef.current = createClient();
    return supabaseRef.current;
  }

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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authMethodRef = useRef(state.authMethod);
  useEffect(() => {
    authMethodRef.current = state.authMethod;
  }, [state.authMethod]);

  const goTo = useCallback((step: AuthStep, skipValidation?: boolean) => {
    setState((prev) => {
      if (!skipValidation) {
        const allowed = validTransitions[prev.step];
        if (allowed && allowed.length > 0 && !allowed.includes(step)) {
          console.warn(`Invalid transition: ${prev.step} → ${step}`);
          return prev;
        }
      }
      return { ...prev, step };
    });
    setError(null);
  }, []);

  const backMap: Record<AuthStep, (() => void) | null> = {
    "auth-method": () => router.push("/"),
    phone: () => goTo("auth-method", true),
    email: () => goTo("auth-method", true),
    otp: () => {
      if (authMethodRef.current === "phone") goTo("phone", true);
      else goTo("email", true);
    },
    "age-gate": () => {
      if (authMethodRef.current === "google") goTo("auth-method", true);
      else goTo("otp", true);
    },
    "parent-contact": () => goTo("age-gate", true),
    "consent-sent": () => goTo("parent-contact", true),
    username: () => goTo("age-gate", true),
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

  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  async function handleGoogleAuth() {
    setLoading(true);
    setError(null);
    try {
      const { error: authError } = await getSupabase().auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (authError) {
        setError(authError.message);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to sign in with Google");
    } finally {
      setLoading(false);
    }
  }

  async function sendOTP() {
    setLoading(true);
    setError(null);
    const { authMethod, phone, email } = stateRef.current;
    if (authMethod === "phone") {
      const { error: authError } = await getSupabase().auth.signInWithOtp({
        phone: `+91${phone}`,
      });
      if (authError) {
        setError(authError.message);
        setLoading(false);
        return false;
      }
    } else {
      const { error: authError } = await getSupabase().auth.signInWithOtp({
        email,
      });
      if (authError) {
        setError(authError.message);
        setLoading(false);
        return false;
      }
    }
    setLoading(false);
    return true;
  }

  async function handleOTPComplete() {
    setLoading(true);
    setError(null);
    const current = stateRef.current;
    const otp = current.otp.join("");

    let authResult;
    if (current.authMethod === "phone") {
      authResult = await getSupabase().auth.verifyOtp({
        phone: `+91${current.phone}`,
        token: otp,
        type: "sms",
      });
    } else {
      authResult = await getSupabase().auth.verifyOtp({
        email: current.email,
        token: otp,
        type: "email",
      });
    }

    if (authResult.error) {
      setError(authResult.error.message);
      setLoading(false);
      return;
    }

    setLoading(false);

    if (mode === "login") {
      router.push("/dashboard");
    } else {
      goTo("age-gate");
    }
  }

  async function handleUsernameComplete(username: string) {
    setLoading(true);
    const { createProfile } = await import("@/lib/actions");
    const result = await createProfile({
      username,
      displayName: username,
      dob: state.dob,
      parentContact: state.parentContact,
    });
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    setLoading(false);
    router.push("/dashboard");
  }

  return {
    state,
    setState,
    mode,
    loading,
    error,
    goTo,
    backMap,
    stepLabel,
    getOTPLabel,
    sendOTP,
    handleGoogleAuth,
    handleOTPComplete,
    handleUsernameComplete,
  };
}
