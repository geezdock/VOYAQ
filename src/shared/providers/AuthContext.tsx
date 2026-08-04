"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { createClient } from "@/services/supabase/client";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: (redirectTo?: string) => Promise<void>;
  signInWithMagicLink: (email: string, redirectTo?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

interface DevUser {
  id: string;
  display_name: string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function getDevUser(): DevUser | null {
  try {
    const raw = localStorage.getItem("voyaq_dev_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function clearDevUser() {
  try {
    localStorage.removeItem("voyaq_dev_user");
  } catch {
    // localStorage not available
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (!mounted) return;
        if (session) {
          setSession(session);
          setUser(session.user);
        } else {
          const devUser = getDevUser();
          if (devUser) {
            setUser({ id: devUser.id } as User);
          }
        }
        setLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        const devUser = getDevUser();
        if (devUser) {
          setUser({ id: devUser.id } as User);
        }
        setLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      if (session) {
        setSession(session);
        setUser(session.user);
        clearDevUser();
      } else if (_event !== "INITIAL_SESSION") {
        // SIGNED_OUT / TOKEN_REFRESHED with a null session — clear stale state.
        setSession(null);
        setUser(null);
      }
      setLoading(false);
    });

    // DEV_MODE: AuthFlow writes the dev user after the initial effect has resolved.
    function handleDevAuth() {
      const devUser = getDevUser();
      if (devUser) {
        setUser({ id: devUser.id } as User);
        setSession(null);
        setLoading(false);
      }
    }
    window.addEventListener("voyaq:dev-auth", handleDevAuth);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      window.removeEventListener("voyaq:dev-auth", handleDevAuth);
    };
  }, []);

  const signInWithGoogle = async (redirectTo?: string) => {
    const supabase = createClient();
    const base = `${window.location.origin}/auth/callback`;
    const url = redirectTo ? `${base}?redirect=${encodeURIComponent(redirectTo)}` : base;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: url },
    });
  };

  const signInWithMagicLink = async (email: string, redirectTo?: string) => {
    const supabase = createClient();
    const base = `${window.location.origin}/auth/callback`;
    const url = redirectTo ? `${base}?redirect=${encodeURIComponent(redirectTo)}` : base;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: url },
    });
    return { error };
  };

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    clearDevUser();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signInWithGoogle,
        signInWithMagicLink,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
