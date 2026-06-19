"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { SocialProofTicker } from "./SocialProofTicker";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
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
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-12 left-12 w-24 h-1 bg-clay" />
        <div className="absolute top-12 right-12 w-24 h-1 bg-clay" />
        <div className="absolute bottom-32 left-12 w-1 h-24 bg-clay" />
        <div className="absolute bottom-32 right-12 w-1 h-24 bg-clay" />
      </div>

      <motion.div
        className="flex flex-col items-center gap-8 px-4 max-w-4xl mx-auto text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="font-display text-[clamp(4rem,15vw,9rem)] font-bold leading-none tracking-tighter text-ink"
          variants={itemVariants}
        >
          TRAVO
        </motion.h1>

        <motion.p
          className="font-heading text-lg md:text-xl text-ink-light max-w-xl leading-relaxed"
          variants={itemVariants}
        >
          Stop planning in group chats.
          <br />
          <span className="font-semibold text-ink">
            Start building trips with your squad.
          </span>
        </motion.p>

        <motion.div variants={itemVariants}>
          <button
            onClick={() => router.push("/auth")}
            className="brut-btn text-lg px-10 py-4 inline-flex items-center gap-3 group"
          >
            <span>Start a Squad</span>
            <span
              className="inline-block transition-transform duration-150 group-hover:translate-x-1"
              aria-hidden="true"
            >
              →
            </span>
          </button>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-0 w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
      >
        <SocialProofTicker />
      </motion.div>
    </section>
  );
}
