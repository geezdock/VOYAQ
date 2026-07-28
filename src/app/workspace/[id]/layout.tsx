import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Workspace — VOYAQ",
  description: "Collaborate with your squad to plan destinations, set budgets, and lock dates for your trip.",
  openGraph: {
    title: "Workspace — VOYAQ",
    description: "Collaborate with your squad to plan destinations, set budgets, and lock dates for your trip.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Workspace — VOYAQ",
    description: "Collaborate with your squad to plan destinations, set budgets, and lock dates for your trip.",
  },
};

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
