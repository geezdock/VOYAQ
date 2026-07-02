"use client";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSquad } from "@/lib/SquadContext";
import { WorkspaceView } from "@/components/workspace/WorkspaceView";

export default function WorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const { squads, getSquad, updateSquad } = useSquad();

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
          <p className="font-heading text-sm text-ink-muted">Loading squad...</p>
        </div>
      </div>
    );
  }

  return (
    <WorkspaceView
      squad={squad}
      onBack={() => router.push("/dashboard")}
      onUpdate={updateSquad}
    />
  );
}