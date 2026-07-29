"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LandingHeader } from "./LandingHeader";
import { TripBoardPreview } from "./TripBoardPreview";
import { MarqueeTicker } from "./MarqueeTicker";

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export function HeroSection() {
  const router = useRouter();

  return (
    <section className="relative h-dvh flex flex-col overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-0 w-96 h-96 bg-accent/3 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-clay/5 rounded-full blur-3xl" />
      </div>
      <div className="flex-1 flex flex-col px-4 max-md:px-2 pt-3 max-w-[1200px] mx-auto w-full min-h-0 relative z-10">
        <LandingHeader />

        <motion.main
          className="flex-1 flex flex-col lg:flex-row gap-2 sm:gap-4 lg:gap-6 items-stretch mt-2 sm:mt-3 lg:mt-4 pb-0 min-h-0"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="flex-1 flex flex-col justify-center gap-3 lg:gap-4 lg:pr-6"
            variants={fadeUp}
          >
            <h1 className="font-display text-[24px] max-sm:text-[20px] sm:text-[36px] md:text-[48px] lg:text-[52px] font-extrabold leading-[1.1] tracking-tight uppercase text-ink">
              Plan Trips.
              <br />
              Survive the Group Chat.
            </h1>

            <p className="font-heading text-sm sm:text-base md:text-lg text-ink-light max-w-md leading-relaxed">
              Ditch the endless scrolling. Align budgets, lock dates, and turn
              &ldquo;we should go somewhere&rdquo; into an actual trip.
            </p>

            <div className="mt-1">
              <button
                onClick={() => router.push("/auth?mode=get-started")}
                className="brut-btn text-base font-display font-bold uppercase h-11 px-6 shadow-bruted flex items-center justify-center gap-2 w-full sm:w-fit"
              >
                Start a Squad
              </button>
            </div>
          </motion.div>

          <motion.div
            className="flex-1 flex items-center justify-center relative min-h-[200px] sm:min-h-[240px] md:min-h-[280px] lg:min-h-[340px]"
            variants={fadeUp}
          >
            <div className="w-full h-full border-[3px] border-ink rounded-[18px] bg-[#F7F4EF] overflow-hidden relative">
              <TripBoardPreview />
            </div>
          </motion.div>
        </motion.main>
      </div>

      <MarqueeTicker />
    </section>
  );
}
