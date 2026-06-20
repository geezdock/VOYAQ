import { LandingHeader } from "@/components/landing/LandingHeader";
import { SafetyContent } from "@/components/safety/SafetyContent";

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
