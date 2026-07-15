"use client";

import { motion } from "framer-motion";
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

function seededRandom(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function generateConfetti(): ConfettiParticle[] {
  const colors = ["bg-accent", "bg-accent-light", "bg-peach", "bg-clay", "bg-success", "bg-warning"];
  return Array.from({ length: 40 }, (_, i) => ({
    x: Math.round(seededRandom(i * 7) * 100 * 100) / 100,
    y: -10 - Math.round(seededRandom(i * 13) * 20 * 100) / 100,
    rotation: Math.round(seededRandom(i * 3) * 360 * 100) / 100,
    color: colors[i % colors.length],
    size: Math.round((6 + seededRandom(i * 11) * 8) * 100) / 100,
    delay: Math.round(seededRandom(i * 5) * 0.5 * 100) / 100,
    duration: Math.round((2 + seededRandom(i * 17) * 2) * 100) / 100,
  }));
}

function CheckItem({ label, delay }: { label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
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

export function StepCelebration() {
  const confetti = useMemo(() => generateConfetti(), []);

  const checkItems = [
    { label: "Destination Chosen", delay: 0.2 },
    { label: "Budget Locked", delay: 0.28 },
    { label: "Dates Finalized", delay: 0.36 },
    { label: "Itinerary Generated", delay: 0.44 },
  ];

  return (
    <div className="flex flex-col items-center gap-8 relative overflow-hidden">
      {/* Confetti */}
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
            opacity: [1, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear",
            times: [0, 1],
          }}
        />
      ))}

      {/* Content */}
      <div className="w-full max-w-md text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="border-[3px] border-ink rounded-[20px] bg-white p-4 sm:p-6 shadow-bruted-lg flex flex-col items-center"
        >
          <div className="-mt-8 mb-2 bg-accent text-white font-mono text-[10px] font-bold uppercase tracking-wider px-4 py-1 rounded-full border-[2px] border-ink">
            Boarding Pass
          </div>

          <div className="pt-4 pb-5 border-b-[2px] border-ink/20 w-full">
            <p className="font-display text-2xl sm:text-3xl font-extrabold text-ink uppercase tracking-tight">
              Goa Weekend Trip
            </p>
          </div>

          <div className="py-4 sm:py-5 flex justify-center gap-4 sm:gap-8 w-full">
            <div className="text-center">
              <p className="font-mono text-[10px] font-bold text-ink-muted uppercase tracking-wider">Friends</p>
              <p className="font-display text-xl sm:text-2xl font-extrabold text-ink mt-1">8</p>
            </div>
            <div className="w-[2px] bg-ink/10" />
            <div className="text-center">
              <p className="font-mono text-[10px] font-bold text-ink-muted uppercase tracking-wider">Days</p>
              <p className="font-display text-xl sm:text-2xl font-extrabold text-ink mt-1">3</p>
            </div>
            <div className="w-[2px] bg-ink/10" />
            <div className="text-center">
              <p className="font-mono text-[10px] font-bold text-ink-muted uppercase tracking-wider">Budget</p>
              <p className="font-display text-xl sm:text-2xl font-extrabold text-ink mt-1">₹4,850</p>
            </div>
          </div>

          <div className="space-y-2">
            {checkItems.map((item) => (
              <CheckItem key={item.label} label={item.label} delay={item.delay} />
            ))}
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-ink uppercase tracking-tight mt-8 leading-[1.1]"
        >
          GOA IS HAPPENING.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="font-heading text-base sm:text-lg text-ink-light mt-3"
        >
          From 127 messages to one plan.
        </motion.p>
      </div>
    </div>
  );
}
