import dynamic from "next/dynamic";

const DashboardViewLazy = dynamic(() => import("@/features/dashboard/components/DashboardView").then(m => ({ default: m.DashboardView })), {
  loading: () => <div className="min-h-[60vh]" />,
});

export default function DashboardPage() {
  return <DashboardViewLazy />;
}
