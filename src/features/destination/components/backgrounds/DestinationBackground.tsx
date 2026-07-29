"use client";

import { useMemo } from "react";
import { DESTINATION_CATALOG } from "@/constants/destinations";
import { MountainsBackground } from "./MountainsBackground";
import { BeachBackground } from "./BeachBackground";
import { DesertBackground } from "./DesertBackground";
import { CityBackground } from "./CityBackground";
import { AdventureBackground } from "./AdventureBackground";
import { PilgrimageBackground } from "./PilgrimageBackground";

type DestinationType = "hill" | "beach" | "desert" | "city" | "adventure" | "pilgrimage";

const backgroundMap: Record<DestinationType, React.ComponentType> = {
  hill: MountainsBackground,
  beach: BeachBackground,
  desert: DesertBackground,
  city: CityBackground,
  adventure: AdventureBackground,
  pilgrimage: PilgrimageBackground,
};

function getDestinationType(name: string): DestinationType | null {
  const normalized = name.toLowerCase().trim();
  const entry = DESTINATION_CATALOG.find(
    (d) => d.name.toLowerCase() === normalized || d.slug === normalized || d.id === normalized
  );
  if (entry && entry.type in backgroundMap) {
    return entry.type as DestinationType;
  }
  return null;
}

export function DestinationBackground({ destinationName }: { destinationName: string }) {
  const BackgroundComponent = useMemo(() => {
    const type = getDestinationType(destinationName);
    if (!type) return null;
    return backgroundMap[type];
  }, [destinationName]);

  if (!BackgroundComponent) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 text-ink opacity-[0.12] sm:opacity-[0.18] lg:opacity-[0.25] select-none">
      <BackgroundComponent />
    </div>
  );
}
