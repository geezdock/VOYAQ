import { Suspense } from "react";
import { DashboardView } from "@/components/dashboard/DashboardView";

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <DashboardView />
    </Suspense>
  );
}
