import { LandingHeader } from "@/features/landing/components/LandingHeader";
import { InteractiveDemo } from "@/features/demo/components/InteractiveDemo";
import { ComparisonTable } from "@/features/how-it-works/components/ComparisonTable";
import { SharingExport } from "@/features/how-it-works/components/SharingExport";
import { RealScenarios } from "@/features/how-it-works/components/RealScenarios";
import { FAQ } from "@/features/how-it-works/components/FAQ";
import { SafetyLink } from "@/features/how-it-works/components/SafetyLink";
import { DualCTA } from "@/features/landing/components/DualCTA";

export default function HowItWorks() {
  return (
    <>
      <div className="pt-4 px-4 max-w-[1200px] mx-auto w-full">
        <LandingHeader />
      </div>
      <InteractiveDemo />
      <section className="py-20 sm:py-28 px-4 bg-surface">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="font-mono text-xs font-bold text-ink-muted uppercase tracking-widest">
              Deep Dive
            </span>
          </div>
          <div className="space-y-3">
            <div className="border-[2px] border-ink rounded-[12px] overflow-hidden bg-white">
              <div className="p-4 sm:p-5 border-b border-ink/10">
                <span className="font-display text-base sm:text-lg font-extrabold text-ink uppercase tracking-tight">
                  VOYAQ vs Manual Planning
                </span>
              </div>
              <div className="p-4 sm:p-5">
                <ComparisonTable />
              </div>
            </div>
            <div className="border-[2px] border-ink rounded-[12px] overflow-hidden bg-white">
              <div className="p-4 sm:p-5 border-b border-ink/10">
                <span className="font-display text-base sm:text-lg font-extrabold text-ink uppercase tracking-tight">
                  Sharing & Export
                </span>
              </div>
              <div className="p-4 sm:p-5">
                <SharingExport />
              </div>
            </div>
            <div className="border-[2px] border-ink rounded-[12px] overflow-hidden bg-white">
              <div className="p-4 sm:p-5 border-b border-ink/10">
                <span className="font-display text-base sm:text-lg font-extrabold text-ink uppercase tracking-tight">
                  Real Trip Scenarios
                </span>
              </div>
              <div className="p-4 sm:p-5">
                <RealScenarios />
              </div>
            </div>
            <div className="border-[2px] border-ink rounded-[12px] overflow-hidden bg-white">
              <div className="p-4 sm:p-5 border-b border-ink/10">
                <span className="font-display text-base sm:text-lg font-extrabold text-ink uppercase tracking-tight">
                  FAQ
                </span>
              </div>
              <div className="p-4 sm:p-5">
                <FAQ />
              </div>
            </div>
          </div>
          <div className="mt-8">
            <SafetyLink />
          </div>
        </div>
      </section>
      <DualCTA />
    </>
  );
}
