"use client";

import dynamic from "next/dynamic";

const CurrencyConverter = dynamic(
  () => import("@/features/toolkit/CurrencyConverter"),
  { ssr: false },
);

export default function CurrencyConverterPage() {
  return <CurrencyConverter />;
}
