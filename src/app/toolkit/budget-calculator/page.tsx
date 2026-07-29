"use client";

import dynamic from "next/dynamic";

const BudgetCalculator = dynamic(
  () => import("@/features/toolkit/BudgetCalculator"),
  { ssr: false },
);

export default function BudgetCalculatorPage() {
  return <BudgetCalculator />;
}
