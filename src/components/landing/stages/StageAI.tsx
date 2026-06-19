"use client";

import { MotionValue, motion, useTransform } from "framer-motion";
import { Umbrella, Wallet, Music, Sun, MapPin } from "lucide-react";

const tags = [
  { label: "Beach", icon: Umbrella },
  { label: "Budget Friendly", icon: Wallet },
  { label: "Nightlife", icon: Music },
  { label: "Sunset Spots", icon: Sun },
  { label: "Road Trip Stops", icon: MapPin },
];

function TagItem({
  tag,
  index,
  localProgress,
}: {
  tag: { label: string; icon: React.ComponentType<{ className?: string }> };
  index: number;
  localProgress: MotionValue<number>;
}) {
  const tagDelay = 0.42 + index * 0.04;
  const tagOpacity = useTransform(localProgress, [tagDelay, tagDelay + 0.03], [0, 1]);
  const tagScale = useTransform(localProgress, [tagDelay, tagDelay + 0.03], [0.85, 1]);
  const TagIcon = tag.icon;

  return (
    <motion.div
      style={{ opacity: tagOpacity, scale: tagScale }}
      className="flex items-center gap-1.5 border-[2px] border-ink rounded-full px-3 py-1.5 bg-peach-light"
    >
      <TagIcon className="w-3.5 h-3.5 text-accent" />
      <span className="font-mono text-[11px] font-bold text-ink leading-none">{tag.label}</span>
    </motion.div>
  );
}

export function StageAI({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  const start = 0.65;
  const end = 0.78;

  const stageOpacity = useTransform(
    scrollYProgress,
    [start - 0.02, start, end, end + 0.02],
    [0, 1, 1, 0]
  );

  const localProgress = useTransform(scrollYProgress, [start, end], [0, 1]);

  const headlineOpacity = useTransform(localProgress, [0, 0.06], [0, 1]);
  const headlineY = useTransform(localProgress, [0, 0.06], [24, 0]);

  const cardOpacity = useTransform(localProgress, [0.05, 0.12], [0, 1]);
  const cardY = useTransform(localProgress, [0.05, 0.12], [30, 0]);

  const progressFill = useTransform(localProgress, [0.12, 0.35], [0, 100]);
  const progressText = useTransform(localProgress, [0.12, 0.35], [0, 100]);

  const tagsContainerOpacity = useTransform(localProgress, [0.40, 0.48], [0, 1]);

  const progressTextValue = useTransform(progressText, (v) => `${Math.round(v)}%`);

  const summaryOpacity = useTransform(localProgress, [0.60, 0.68], [0, 1]);
  const summaryY = useTransform(localProgress, [0.60, 0.68], [20, 0]);

  const checkOpacity = useTransform(localProgress, [0.80, 0.85], [0, 1]);
  const checkScale = useTransform(localProgress, [0.80, 0.85], [0.8, 1]);

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
            Let AI handle the planning.
          </h2>
        </motion.div>

        <motion.div
          style={{ opacity: cardOpacity, y: cardY }}
          className="border-[3px] border-ink rounded-[16px] bg-white p-6 sm:p-8 shadow-bruted-lg"
        >
          <div className="flex items-center gap-3 mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 rounded-[8px] bg-accent border-[2px] border-ink flex items-center justify-center shrink-0"
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </motion.div>
            <div className="flex-1">
              <p className="font-heading text-sm font-bold text-ink">Generating itinerary</p>
              <div className="w-full h-2 rounded-[3px] bg-ink/10 overflow-hidden mt-1.5">
                <motion.div
                  style={{ width: progressFill }}
                  className="h-full rounded-[3px] bg-gradient-to-r from-accent to-accent-dark"
                />
              </div>
            </div>
            <motion.span className="font-mono text-xs font-bold text-ink-muted tabular-nums">
              <motion.span>{progressTextValue}</motion.span>
            </motion.span>
          </div>

          <motion.div
            style={{ opacity: tagsContainerOpacity }}
            className="mb-6"
          >
            <p className="font-mono text-[10px] font-bold text-ink-muted uppercase tracking-wider mb-2">
              AI Suggestions
            </p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, i) => (
                <TagItem key={tag.label} tag={tag} index={i} localProgress={localProgress} />
              ))}
            </div>
          </motion.div>

          <motion.div
            style={{ opacity: summaryOpacity, y: summaryY }}
            className="border-[2px] border-ink rounded-[12px] bg-peach-light/50 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display text-xl font-extrabold text-ink">3 Days</p>
                <p className="font-heading text-sm text-ink-light">
                  <span>12 Stops</span>
                  <span className="mx-1.5 text-clay">·</span>
                  <span>₹4,850/person</span>
                </p>
              </div>
              <motion.div
                style={{ opacity: checkOpacity, scale: checkScale }}
                className="flex items-center gap-1.5 bg-success/10 border border-success/30 rounded-full px-3 py-1"
              >
                <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-heading text-xs font-bold text-success">Itinerary Ready</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
