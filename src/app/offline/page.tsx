import Link from "next/link";

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <div className="max-w-md space-y-6">
        <div className="text-6xl">📡</div>
        <h1 className="text-2xl font-bold">You are offline</h1>
        <p className="text-ink-muted">
          VOYAQ needs an internet connection to load trip data, weather, and
          destination info. Check your connection and try again.
        </p>
        <Link
          href="/"
          className="inline-block rounded-bruted bg-ink px-6 py-3 text-sm font-semibold text-surface transition-colors hover:bg-ink/80"
        >
          Try again
        </Link>
      </div>
    </main>
  );
}
