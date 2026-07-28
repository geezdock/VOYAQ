import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Trip — VOYAQ",
  description: "View your trip details, destination hub, expenses, and share with your squad.",
  openGraph: {
    title: "Trip — VOYAQ",
    description: "View your trip details, destination hub, expenses, and share with your squad.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Trip — VOYAQ",
    description: "View your trip details, destination hub, expenses, and share with your squad.",
  },
};

export default function TripLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
