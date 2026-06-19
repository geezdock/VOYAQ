"use client";

import { MotionValue, motion, useTransform } from "framer-motion";
import { useMemo } from "react";

interface DateSlot {
  date: number;
  day: string;
  available: number;
  friends: { initial: string; color: string }[];
}

function generateDateSlots(): DateSlot[] {
  const friendColors = [
    { initial: "R", color: "bg-accent" },
    { initial: "A", color: "bg-peach-dark" },
    { initial: "V", color: "bg-clay" },
    { initial: "S", color: "bg-accent-light" },
    { initial: "M", color: "bg-peach" },
    { initial: "K", color: "bg-clay-light" },
    { initial: "P", color: "bg-peach-dark" },
    { initial: "Ar", color: "bg-accent" },
  ];

  const avails = [3, 6, 7, 5, 2, 0, 4];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const baseDate = 12;

  return avails.map((count, i) => {
    const shuffled = [...friendColors].sort(() => Math.random() - 0.5);
    return {
      date: baseDate + i,
      day: days[i],
      available: count,
      friends: shuffled.slice(0, count),
    };
  });
}

function DateCell({
  slot,
  index,
  localProgress,
}: {
  slot: DateSlot;
  index: number;
  localProgress: MotionValue<number>;
}) {
  const appearDelay = 0.10 + index * 0.07;
  const opacity = useTransform(localProgress, [appearDelay, appearDelay + 0.04], [0, 1]);
  const y = useTransform(localProgress, [appearDelay, appearDelay + 0.04], [20, 0]);

  const selectedRange = [2, 3, 4];

  return (
    <motion.div
      style={{ opacity, y }}
      className={`rounded-[12px] border-[2px] p-3 text-center ${
        selectedRange.includes(index)
          ? "border-accent bg-accent/5"
          : "border-ink/10 bg-white"
      }`}
    >
      <span className="font-mono text-[10px] font-bold text-ink-muted uppercase">
        {slot.day}
      </span>
      <p className="font-display text-lg font-extrabold text-ink mt-0.5">
        Aug {slot.date}
      </p>
      <div className="flex items-center justify-center gap-0.5 mt-2 flex-wrap">
        {slot.friends.slice(0, 4).map((f, i) => (
          <motion.div
            key={f.initial + i}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              delay: appearDelay + 0.05 + i * 0.03,
              type: "spring",
              stiffness: 400,
              damping: 16,
            }}
            className={`w-5 h-5 rounded-full ${f.color} flex items-center justify-center ring-[1.5px] ring-white -ml-1 first:ml-0`}
          >
            <span className="text-[7px] font-heading font-bold text-white leading-none">
              {f.initial}
            </span>
          </motion.div>
        ))}
      </div>
      <span className="font-mono text-[10px] font-bold text-ink-muted mt-1.5 block">
        {slot.available} available
      </span>
    </motion.div>
  );
}

export function StageDates({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  const start = 0.52;
  const end = 0.65;

  const slots = useMemo(() => generateDateSlots(), []);

  const stageOpacity = useTransform(
    scrollYProgress,
    [start - 0.02, start, end, end + 0.02],
    [0, 1, 1, 0]
  );

  const localProgress = useTransform(scrollYProgress, [start, end], [0, 1]);

  const headlineOpacity = useTransform(localProgress, [0, 0.06], [0, 1]);
  const headlineY = useTransform(localProgress, [0, 0.06], [24, 0]);

  const cardOpacity = useTransform(localProgress, [0, 0.08], [0, 1]);
  const cardY = useTransform(localProgress, [0, 0.08], [30, 0]);

  const lockedOpacity = useTransform(localProgress, [0.75, 0.80], [0, 1]);
  const lockedScale = useTransform(localProgress, [0.75, 0.80], [0.8, 1]);

  const footerOpacity = useTransform(localProgress, [0.65, 0.70], [0, 1]);

  return (
    <motion.div
      style={{ opacity: stageOpacity }}
      className="absolute inset-0 flex items-center justify-center"
    >
      <div className="w-full max-w-3xl mx-auto px-4">
        <motion.div
          style={{ opacity: headlineOpacity, y: headlineY }}
          className="text-center mb-8"
        >
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink uppercase tracking-tight">
            Find dates that actually work.
          </h2>
        </motion.div>

        <motion.div
          style={{ opacity: cardOpacity, y: cardY }}
          className="border-[3px] border-ink rounded-[16px] bg-white p-6 sm:p-8 shadow-bruted-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <span className="font-mono text-xs font-bold text-ink-muted uppercase tracking-wider">
              August 2026
            </span>
            <motion.div
              style={{ opacity: lockedOpacity, scale: lockedScale }}
              className="flex items-center gap-1.5 bg-success/10 border border-success/30 rounded-full px-3 py-1"
            >
              <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-heading text-xs font-bold text-success">Aug 15–17 Locked</span>
            </motion.div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {slots.map((slot, i) => (
              <DateCell
                key={slot.date}
                slot={slot}
                index={i}
                localProgress={localProgress}
              />
            ))}
          </div>

          <motion.div
            style={{ opacity: footerOpacity }}
            className="mt-6 pt-4 border-t border-ink/10 flex items-center gap-2 text-ink-muted"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-heading text-sm">Best overlap: Aug 15–17 (7/8 available)</span>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
