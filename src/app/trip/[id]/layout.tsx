import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createClient } from "@/services/supabase/server";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  let squadName = "Trip";
  let destination: string | null = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("squads")
      .select("name, locked_destination")
      .eq("id", id)
      .single();
    if (data?.name) squadName = data.name;
    if (data?.locked_destination) destination = data.locked_destination;
  } catch {
    // fallback to generic title
  }

  const destSuffix = destination ? ` to ${destination}` : "";
  const title = `${squadName} — Trip${destSuffix} | VOYAQ`;
  const description = destination
    ? `View your trip to ${destination}, check the itinerary, manage expenses, and share with your squad.`
    : `View your trip details, destination hub, expenses, and share with your squad.`;

  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary", title, description },
  };
}

export default function TripLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
