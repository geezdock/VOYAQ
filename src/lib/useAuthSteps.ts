"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import type { AuthState, AuthStep } from "@/types/auth";

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

  const goTo = useCallback((step: AuthStep) => {
    setState((prev) => ({ ...prev, step }));
    setError(null);
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

  async function handleGoogleAuth() {
    setLoading(true);
    setError(null);
    const { error: authError } = await getSupabase().auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (authError) {
      setError(authError.message);
      setLoading(false);
    }
  }

  async function sendOTP() {
    setLoading(true);
    setError(null);
    if (state.authMethod === "phone") {
      const { error: authError } = await getSupabase().auth.signInWithOtp({
        phone: `+91${state.phone}`,
      });
      if (authError) {
        setError(authError.message);
        setLoading(false);
        return false;
      }
    } else {
      const { error: authError } = await getSupabase().auth.signInWithOtp({
        email: state.email,
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
    const otp = state.otp.join("");

    let authResult;
    if (state.authMethod === "phone") {
      authResult = await getSupabase().auth.verifyOtp({
        phone: `+91${state.phone}`,
        token: otp,
        type: "sms",
      });
    } else {
      authResult = await getSupabase().auth.verifyOtp({
        email: state.email,
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
