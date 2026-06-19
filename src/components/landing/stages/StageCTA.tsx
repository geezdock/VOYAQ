"use client";

import { MotionValue, motion, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";

export function StageCTA({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  const router = useRouter();

  const start = 0.90;
  const end = 1.0;

  const stageOpacity = useTransform(
    scrollYProgress,
    [start - 0.02, start, end, end + 1],
    [0, 1, 1, 1]
  );

  const localProgress = useTransform(scrollYProgress, [start, end], [0, 1]);

  const headlineOpacity = useTransform(localProgress, [0, 0.12], [0, 1]);
  const headlineY = useTransform(localProgress, [0, 0.12], [30, 0]);

  const subheadOpacity = useTransform(localProgress, [0.08, 0.16], [0, 1]);

  const buttonsOpacity = useTransform(localProgress, [0.16, 0.24], [0, 1]);
  const buttonsY = useTransform(localProgress, [0.16, 0.24], [20, 0]);

  return (
    <motion.div
      style={{ opacity: stageOpacity }}
      className="absolute inset-0 flex items-center justify-center bg-ink"
    >
      <div className="w-full max-w-lg mx-auto px-4 text-center">
        <motion.h2
          style={{ opacity: headlineOpacity, y: headlineY }}
          className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-surface uppercase tracking-tight leading-[1.1]"
        >
          Stop planning trips
          <br />
          in group chats.
        </motion.h2>

        <motion.p
          style={{ opacity: subheadOpacity }}
          className="font-heading text-base sm:text-lg text-surface/60 mt-4"
        >
          Create a squad. Vote. Plan. Go.
        </motion.p>

        <motion.div
          style={{ opacity: buttonsOpacity, y: buttonsY }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8"
        >
          <button
            onClick={() => router.push("/auth")}
            className="brut-btn bg-accent hover:bg-accent-dark text-white font-display font-bold uppercase text-sm h-12 px-8 shadow-bruted w-full sm:w-auto"
          >
            Start a Squad
          </button>
          <button className="border-[2px] border-surface/30 text-surface font-display font-bold uppercase text-sm h-12 px-8 rounded-bruted hover:bg-surface/10 transition-colors w-full sm:w-auto">
            See How It Works
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
