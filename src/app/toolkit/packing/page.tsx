"use client";

import dynamic from "next/dynamic";

const PackingList = dynamic(
  () => import("@/features/toolkit/PackingList"),
  { ssr: false },
);

export default function PackingPage() {
  return <PackingList />;
}
