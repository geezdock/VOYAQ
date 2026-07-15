import { LandingHeader } from "@/features/landing/components/LandingHeader";
import { SafetyContent } from "@/features/safety/components/SafetyContent";

export default function SafetyPage() {
  return (
    <>
      <div className="pt-4 px-4 max-w-[1200px] mx-auto w-full">
        <LandingHeader />
      </div>
      <SafetyContent />
    </>
  );
}
