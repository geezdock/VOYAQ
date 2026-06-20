import { HeroSection } from "@/components/landing/HeroSection";
import { MiniStoryMode } from "@/components/landing/MiniStoryMode";
import { QuickWalkthrough } from "@/components/landing/QuickWalkthrough";
import { DualCTA } from "@/components/landing/DualCTA";
import { MarqueeTicker } from "@/components/landing/MarqueeTicker";

export default function Home() {
  return (
    <>
      <HeroSection />
      <MiniStoryMode />
      <QuickWalkthrough />
      <DualCTA />
      <MarqueeTicker />
    </>
  );
}
