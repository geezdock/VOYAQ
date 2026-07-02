"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Users, ArrowRight, AlertCircle, CheckCircle } from "lucide-react";
import { useSquad } from "@/lib/SquadContext";
import type { Squad } from "@/types/squad";

export default function JoinPage() {
  const params = useParams();
  const router = useRouter();
  const { squads, updateSquad } = useSquad();
  const [joining, setJoining] = useState(false);

  const code = params.code as string;

  const squad = useMemo(
    () => squads.find((s) => s.inviteCode === code),
    [code, squads],
  );

  const alreadyJoined = squad?.members.some((m) => m.id === "me");
  const squadFull = squad ? squad.members.length >= squad.memberLimit : false;

  function handleJoin() {
    if (!squad || alreadyJoined || squadFull || joining) return;
    setJoining(true);

    const updated: Squad = {
      ...squad,
      members: [
        ...squad.members,
        {
          id: "me",
          name: "You",
          initial: "Y",
          color: "bg-accent",
          verified: true,
          joinedAt: new Date().toISOString(),
        },
      ],
    };
    updateSquad(updated);
    router.push(`/workspace/${updated.id}`);
  }

  if (!squad) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="brut-card w-full max-w-md text-center space-y-6"
        >
          <div className="mx-auto w-14 h-14 rounded-bruted-lg border-2 border-error/30 flex items-center justify-center bg-error/5">
            <AlertCircle className="w-7 h-7 text-error" />
          </div>

          <div className="space-y-2">
            <p className="font-display text-2xl font-bold text-ink">
              Invalid Invite Code
            </p>
            <p className="font-heading text-sm text-ink-muted">
              This invite link doesn&apos;t match any squad. The code may have
              expired or been typed incorrectly.
            </p>
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="brut-btn w-full text-sm"
          >
            Back to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  if (alreadyJoined || squadFull) {
    const destination = router.push(`/workspace/${squad.id}`);
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="brut-card w-full max-w-md relative z-10 text-center space-y-6"
      >
        <div className="mx-auto w-14 h-14 rounded-bruted-lg border-2 border-accent/20 flex items-center justify-center bg-accent/5">
          <Users className="w-7 h-7 text-accent" />
        </div>

        <div className="space-y-2">
          <p className="font-display text-2xl font-bold text-ink">
            Join {squad.name}
          </p>
          {squad.destination && (
            <p className="font-mono text-sm text-ink-muted">
              {squad.destination}
            </p>
          )}
        </div>

        <div className="brut-card !p-4 !shadow-bruted-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-heading text-sm text-ink-muted">Members</span>
            <span className="font-mono text-sm font-bold text-ink">
              {squad.members.length} / {squad.memberLimit}
            </span>
          </div>
          <div className="flex items-center justify-center gap-1">
            {squad.members.slice(0, 8).map((m) => (
              <div
                key={m.id}
                className={`w-7 h-7 rounded-full ${m.color} flex items-center justify-center ring-2 ring-white`}
              >
                <span className="text-xs font-heading font-bold text-white">
                  {m.initial}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex-1 brut-btn text-sm !bg-surface-card !text-ink !shadow-bruted-sm hover:!shadow-bruted"
          >
            Cancel
          </button>
          <button
            onClick={handleJoin}
            disabled={joining}
            className="flex-1 brut-btn text-sm flex items-center justify-center gap-2"
          >
            {joining ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Joining...
              </>
            ) : (
              <>
                Join Squad
                <ArrowRight className="w-4 h-4 inline" />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}