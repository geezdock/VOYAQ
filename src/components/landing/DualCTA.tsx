"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export function DualCTA() {
  const router = useRouter();

  return (
    <section className="py-20 sm:py-28 lg:py-36 px-4 bg-surface">
      <div className="max-w-[1200px] mx-auto text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
        >
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink uppercase tracking-tight leading-[1.1]">
            Ready to plan your first trip?
          </h2>
          <p className="font-heading text-base sm:text-lg text-ink-light mt-4 max-w-md mx-auto">
            Create a squad. Vote. Plan. Go.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            visible: { transition: { delayChildren: 0.2 } },
          }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8"
        >
          <motion.button
            variants={fadeUp}
            onClick={() => router.push("/auth")}
            className="brut-btn text-sm font-display font-bold uppercase h-12 px-8 shadow-bruted flex items-center justify-center gap-2 w-full sm:w-auto bg-accent text-white"
          >
            Start a Squad
          </motion.button>
          <motion.button
            variants={fadeUp}
            onClick={() => router.push("/how-it-works")}
            className="border-[2px] border-ink text-ink font-display text-sm font-bold uppercase h-12 px-8 rounded-bruted hover:bg-ink/5 transition-colors w-full sm:w-auto flex items-center justify-center gap-2"
          >
            See How It Works
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
