"use client";

import { MotionValue, motion, useTransform } from "framer-motion";
import { useMemo } from "react";

interface ConfettiParticle {
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
}

function generateConfetti(): ConfettiParticle[] {
  const colors = ["bg-accent", "bg-accent-light", "bg-peach", "bg-clay", "bg-success", "bg-warning"];
  return Array.from({ length: 60 }, (_, i) => ({
    x: Math.random() * 100,
    y: -10 - Math.random() * 20,
    rotation: Math.random() * 360,
    color: colors[i % colors.length],
    size: 6 + Math.random() * 8,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 2,
  }));
}

function CheckItem({
  label,
  delay,
  localProgress,
}: {
  label: string;
  delay: number;
  localProgress: MotionValue<number>;
}) {
  const itemOpacity = useTransform(localProgress, [delay, delay + 0.04], [0, 1]);
  const itemX = useTransform(localProgress, [delay, delay + 0.04], [-12, 0]);

  return (
    <motion.div
      style={{ opacity: itemOpacity, x: itemX }}
      className="flex items-center gap-2"
    >
      <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center shrink-0">
        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <span className="font-heading text-sm text-ink-light">{label}</span>
    </motion.div>
  );
}

export function StageCelebration({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  const start = 0.78;
  const end = 0.90;

  const confetti = useMemo(() => generateConfetti(), []);

  const stageOpacity = useTransform(
    scrollYProgress,
    [start - 0.02, start, end, end + 0.02],
    [0, 1, 1, 0]
  );

  const localProgress = useTransform(scrollYProgress, [start, end], [0, 1]);

  const cardOpacity = useTransform(localProgress, [0.05, 0.15], [0, 1]);
  const cardScale = useTransform(localProgress, [0.05, 0.20], [0.85, 1]);

  const headlineOpacity = useTransform(localProgress, [0.40, 0.50], [0, 1]);
  const headlineScale = useTransform(localProgress, [0.40, 0.50], [0.8, 1]);

  const subtextOpacity = useTransform(localProgress, [0.50, 0.55], [0, 1]);

  const checkItems = [
    { label: "Destination Chosen", delay: 0.22 },
    { label: "Budget Locked", delay: 0.28 },
    { label: "Dates Finalized", delay: 0.34 },
    { label: "Itinerary Generated", delay: 0.40 },
  ];

  return (
    <motion.div
      style={{ opacity: stageOpacity }}
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
    >
      {confetti.map((particle, i) => (
        <motion.div
          key={i}
          className={`absolute ${particle.color} rounded-sm`}
          style={{
            left: `${particle.x}%`,
            width: particle.size,
            height: particle.size * 0.6,
            rotate: particle.rotation,
          }}
          animate={{
            y: ["-10vh", "110vh"],
            rotate: [particle.rotation, particle.rotation + 360],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      <div className="w-full max-w-lg mx-auto px-4 text-center">
        <motion.div
          style={{ opacity: cardOpacity, scale: cardScale }}
          className="border-[3px] border-ink rounded-[20px] bg-white p-8 shadow-bruted-lg relative"
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white font-mono text-[10px] font-bold uppercase tracking-wider px-4 py-1 rounded-full border-[2px] border-ink">
            Boarding Pass
          </div>

          <div className="pt-4 pb-6 border-b-[2px] border-ink/20">
            <p className="font-display text-2xl sm:text-3xl font-extrabold text-ink uppercase tracking-tight">
              Goa Weekend Trip
            </p>
          </div>

          <div className="py-6 flex justify-center gap-8">
            <div className="text-center">
              <p className="font-mono text-[10px] font-bold text-ink-muted uppercase tracking-wider">Friends</p>
              <p className="font-display text-2xl font-extrabold text-ink mt-1">8</p>
            </div>
            <div className="w-[2px] bg-ink/10" />
            <div className="text-center">
              <p className="font-mono text-[10px] font-bold text-ink-muted uppercase tracking-wider">Days</p>
              <p className="font-display text-2xl font-extrabold text-ink mt-1">3</p>
            </div>
            <div className="w-[2px] bg-ink/10" />
            <div className="text-center">
              <p className="font-mono text-[10px] font-bold text-ink-muted uppercase tracking-wider">Budget</p>
              <p className="font-display text-2xl font-extrabold text-ink mt-1">₹4,850</p>
            </div>
          </div>

          <div className="space-y-2">
            {checkItems.map((item) => (
              <CheckItem
                key={item.label}
                label={item.label}
                delay={item.delay}
                localProgress={localProgress}
              />
            ))}
          </div>
        </motion.div>

        <motion.h2
          style={{ opacity: headlineOpacity, scale: headlineScale }}
          className="font-display text-4xl sm:text-5xl lg:text-7xl font-extrabold text-ink uppercase tracking-tight mt-8 leading-[1.1]"
        >
          GOA IS
          <br />
          HAPPENING.
        </motion.h2>

        <motion.p
          style={{ opacity: subtextOpacity }}
          className="font-heading text-base sm:text-lg text-ink-light mt-3"
        >
          From 127 messages to one plan.
        </motion.p>
      </div>
    </motion.div>
  );
}
