import { Suspense } from "react";
import { DashboardView } from "@/features/dashboard/components/DashboardView";

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <DashboardView />
    </Suspense>
  );
}
