import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * Trip route group layout — server component.
 * Provides default metadata for all /trip/[id] routes.
 * The trip view is auth-gated so we set noindex to prevent crawlers
 * from indexing individual trip pages.
 */
export const metadata: Metadata = {
  title: "Trip View",
  description: "Your VOYAQ trip is locked and ready. View your itinerary, budget breakdown, and team details.",
  robots: { index: false, follow: false },
};

export default function TripLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
