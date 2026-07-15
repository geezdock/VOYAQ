"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { StepCreateSquad } from "./StepCreateSquad";
import { StepVoteDestination } from "./StepVoteDestination";
import { StepAlignBudget } from "./StepAlignBudget";
import { StepLockDates } from "./StepLockDates";
import { StepGenerateItinerary } from "./StepGenerateItinerary";
import { StepCelebration } from "./StepCelebration";

const steps = [
  { label: "Squad", step: "01" },
  { label: "Vote", step: "02" },
  { label: "Budget", step: "03" },
  { label: "Dates", step: "04" },
  { label: "Itinerary", step: "05" },
  { label: "Go", step: "06" },
];

const stepComponents = [
  StepCreateSquad,
  StepVoteDestination,
  StepAlignBudget,
  StepLockDates,
  StepGenerateItinerary,
  StepCelebration,
];

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 200 : -200,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -200 : 200,
    opacity: 0,
  }),
};

export function InteractiveDemo() {
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);
  const total = steps.length;

  const goTo = (index: number) => {
    setDir(index > current ? 1 : -1);
    setCurrent(index);
  };

  const isLast = current === total - 1;

  return (
    <section className="min-h-dvh bg-surface py-12 sm:py-16 lg:py-20 px-4 flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
        {/* Progress bar */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-0.5 sm:gap-1">
            {steps.map((step, i) => (
              <div key={step.label} className="flex-1 flex items-center gap-0.5 sm:gap-1">
                <button
                  onClick={() => goTo(i)}
                  className={`flex items-center justify-center w-full py-2.5 min-h-[44px] px-1 rounded-[6px] border-[2px] transition-all ${
                    i <= current
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-ink/10 bg-white text-ink-muted hover:border-ink/30"
                  }`}
                >
                  <span className="font-mono text-[10px] sm:text-xs font-bold uppercase leading-none">
                    {step.step}
                  </span>
                  <span className="font-mono text-[9px] sm:text-[10px] font-bold uppercase leading-none ml-1 hidden sm:inline">
                    {step.label}
                  </span>
                </button>
                {i < total - 1 && (
                  <div className={`h-[2px] flex-1 mx-0.5 sm:mx-1 transition-colors ${
                    i < current ? "bg-accent" : "bg-ink/10"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={current}
                custom={dir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className="w-full"
              >
                {(() => {
                  const Component = stepComponents[current];
                  return <Component />;
                })()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 sm:mt-10 pt-6 border-t border-ink/10">
            <button
              onClick={() => goTo(current - 1)}
              disabled={current === 0}
              className="flex items-center gap-1.5 font-heading text-sm font-bold text-ink-muted hover:text-ink transition-colors disabled:opacity-30 disabled:cursor-not-allowed min-h-[44px] py-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <button
              onClick={() => goTo(current + 1)}
              className={`flex items-center gap-1.5 font-display text-sm font-bold uppercase tracking-wide px-5 py-3 min-h-[44px] rounded-bruted border-[2px] border-ink shadow-bruted-sm hover:shadow-bruted hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all ${
                isLast
                  ? "bg-accent text-white"
                  : "bg-white text-ink"
              }`}
            >
              {isLast ? "Start a Squad" : "Next"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
