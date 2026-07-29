"use client";

import { Suspense, useEffect, type ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com";

function PostHogInit() {
  useEffect(() => {
    if (!POSTHOG_KEY) return;
    if (!posthog.__loaded) {
      posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        person_profiles: "identified_only",
        capture_pageview: false,
      });
    }
  }, []);
  return null;
}

function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!POSTHOG_KEY) return;
    if (posthog.__loaded) {
      posthog.capture("$pageview", { $current_url: pathname + searchParams.toString() });
    }
  }, [pathname, searchParams]);

  return null;
}

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  return (
    <>
      <PostHogInit />
      <Suspense>
        <PageViewTracker />
      </Suspense>
      {children}
    </>
  );
}

export function useAnalytics() {
  const track = (event: string, props?: Record<string, unknown>) => {
    if (typeof window === "undefined") return;
    try {
      const ph = (window as unknown as { posthog?: { capture: (e: string, p?: Record<string, unknown>) => void; __loaded: boolean } }).posthog;
      if (ph?.capture && ph.__loaded) {
        ph.capture(event, props);
      }
    } catch {
      // no-op
    }
  };

  return { track };
}
