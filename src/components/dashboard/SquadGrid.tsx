"use client";

import { SquadCard } from "./SquadCard";
import type { Squad } from "@/types/squad";

interface SquadGridProps {
  squads: Squad[];
  onSelect: (id: string) => void;
}

export function SquadGrid({ squads, onSelect }: SquadGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {squads.map((squad) => (
        <SquadCard
          key={squad.id}
          squad={squad}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
