"use client";

import Link from "next/link";

export default function TripError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="brut-card w-full max-w-md text-center space-y-6">
        <div className="space-y-2">
          <p className="font-display text-2xl font-bold text-ink">Trip Error</p>
          <p className="font-heading text-sm text-ink-muted">
            {error.message || "Something went wrong loading this trip."}
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={reset} className="flex-1 brut-btn text-sm">Try Again</button>
          <Link href="/dashboard" className="flex-1 brut-btn text-sm !bg-surface-card !text-ink !shadow-bruted-sm hover:!shadow-bruted text-center">Dashboard</Link>
        </div>
      </div>
    </div>
  );
}
