import type { Metadata } from "next";
import type { ReactNode } from "react";

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  return {
    title: `Join Squad — VOYAQ`,
    description: `You've been invited to join a trip squad on VOYAQ. Accept the invite and start planning together.`,
    openGraph: {
      title: `Join Squad — VOYAQ`,
      description: `You've been invited to join a trip squad. Plan your group trip together — vote on destinations, align budgets, and build itineraries.`,
      type: "website",
      url: `https://voyaq.app/join/${code}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `Join Squad — VOYAQ`,
      description: `You've been invited to join a trip squad on VOYAQ. Plan your group trip together.`,
    },
  };
}

export default function JoinLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
