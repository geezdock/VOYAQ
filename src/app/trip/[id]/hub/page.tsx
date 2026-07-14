"use client";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSquad } from "@/lib/SquadContext";
import { DestinationHub } from "@/components/destination/DestinationHub";

export default function DestinationHubPage() {
  const params = useParams();
  const router = useRouter();
  const { squads, getSquad } = useSquad();

  const id = params.id as string;
  const squad = getSquad(id);

  useEffect(() => {
    if (squads.length > 0 && !squad) {
      router.replace("/dashboard");
    }
  }, [squad, squads.length, router]);

  if (!squad) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="brut-card w-full max-w-md text-center">
          <p className="font-heading text-sm text-ink-muted">Loading destination...</p>
        </div>
      </div>
    );
  }

  if (!squad.lockedDestination) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="brut-card w-full max-w-md text-center space-y-4">
          <h1 className="font-display text-2xl font-bold text-ink">No Destination Set</h1>
          <p className="font-heading text-sm text-ink-muted">
            Lock a destination in the workspace before exploring the hub.
          </p>
          <button onClick={() => router.push(`/workspace/${squad.id}`)} className="brut-btn text-sm">
            Go to Workspace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <DestinationHub
          squad={squad}
          onBack={() => router.push(`/trip/${squad.id}`)}
        />
      </main>
    </div>
  );
}
