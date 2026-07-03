"use client";

import { useRef } from "react";
import { useScroll } from "framer-motion";
import { StageChaos } from "./stages/StageChaos";
import { StageVoting } from "./stages/StageVoting";
import { StageAI } from "./stages/StageAI";
import { StageCelebration } from "./stages/StageCelebration";

export function MiniStoryMode() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={containerRef} className="relative h-[500vh]">
      <div className="sticky top-0 h-dvh overflow-hidden bg-surface">
        <StageChaos scrollYProgress={scrollYProgress} />
        <StageVoting scrollYProgress={scrollYProgress} />
        <StageAI scrollYProgress={scrollYProgress} />
        <StageCelebration scrollYProgress={scrollYProgress} />
      </div>
    </div>
  );
}
