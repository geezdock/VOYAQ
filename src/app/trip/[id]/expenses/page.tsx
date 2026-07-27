"use client";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSquad } from "@/shared/providers/SquadContext";
import { ExpenseTracker } from "@/features/expense/components/ExpenseTracker";

export default function ExpensesPage() {
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
          <p className="font-heading text-sm text-ink-muted">Loading expenses...</p>
        </div>
      </div>
    );
  }

  return (
    <ExpenseTracker
      squad={squad}
      onBack={() => router.push(`/trip/${squad.id}`)}
    />
  );
}
