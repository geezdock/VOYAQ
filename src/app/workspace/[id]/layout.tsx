import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createClient } from "@/services/supabase/server";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  let squadName = "Workspace";

  try {
    const supabase = await createClient();
    const { data } = await supabase.from("squads").select("name").eq("id", id).single();
    if (data?.name) squadName = data.name;
  } catch {
    // fallback to generic title
  }

  const title = `${squadName} — Workspace | VOYAQ`;
  const description = `Collaborate with your squad to plan destinations, set budgets, and lock dates for ${squadName}.`;

  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary", title, description },
  };
}

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
