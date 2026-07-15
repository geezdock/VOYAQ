import { SplashScreen } from "@/features/landing/components/SplashScreen";
import { HeroSection } from "@/features/landing/components/HeroSection";
import { MiniStoryMode } from "@/features/landing/components/MiniStoryMode";
import { QuickWalkthrough } from "@/features/landing/components/QuickWalkthrough";
import { DualCTA } from "@/features/landing/components/DualCTA";
import { MarqueeTicker } from "@/features/landing/components/MarqueeTicker";

export default function Home() {
  return (
    <SplashScreen>
      <HeroSection />
      <MiniStoryMode />
      <QuickWalkthrough />
      <DualCTA />
      <MarqueeTicker />
    </SplashScreen>
  );
}
