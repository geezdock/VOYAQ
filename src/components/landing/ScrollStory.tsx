"use client";

import { useRef } from "react";
import { useScroll } from "framer-motion";
import { StageChaos } from "./stages/StageChaos";
import { StageVoting } from "./stages/StageVoting";
import { StageBudget } from "./stages/StageBudget";
import { StageDates } from "./stages/StageDates";
import { StageAI } from "./stages/StageAI";
import { StageCelebration } from "./stages/StageCelebration";
import { StageCTA } from "./stages/StageCTA";

export function ScrollStory() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={containerRef} className="relative h-[700vh]">
      <div className="sticky top-0 h-dvh overflow-hidden bg-surface">
        <StageChaos scrollYProgress={scrollYProgress} />
        <StageVoting scrollYProgress={scrollYProgress} />
        <StageBudget scrollYProgress={scrollYProgress} />
        <StageDates scrollYProgress={scrollYProgress} />
        <StageAI scrollYProgress={scrollYProgress} />
        <StageCelebration scrollYProgress={scrollYProgress} />
        <StageCTA scrollYProgress={scrollYProgress} />
      </div>
    </div>
  );
}
