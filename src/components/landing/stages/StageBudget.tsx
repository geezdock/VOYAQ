"use client";

import { MotionValue, motion, useTransform } from "framer-motion";

const budgetGroups = [
  { label: "₹3,500", friends: 2, pct: 25 },
  { label: "₹5,000", friends: 4, pct: 50 },
  { label: "₹6,500", friends: 2, pct: 25 },
];

function AnimatedSavings({
  localProgress,
}: {
  localProgress: MotionValue<number>;
}) {
  const value = useTransform(localProgress, [0.50, 0.65], [0, 650]);
  const formatted = useTransform(value, (v) => `₹${Math.round(v).toLocaleString("en-IN")}`);

  return <motion.span>{formatted}</motion.span>;
}

export function StageBudget({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  const start = 0.37;
  const end = 0.52;

  const stageOpacity = useTransform(
    scrollYProgress,
    [start - 0.02, start, end, end + 0.02],
    [0, 1, 1, 0]
  );

  const localProgress = useTransform(scrollYProgress, [start, end], [0, 1]);

  const headlineOpacity = useTransform(localProgress, [0, 0.06], [0, 1]);
  const headlineY = useTransform(localProgress, [0, 0.06], [24, 0]);

  const conflictCardOpacity = useTransform(localProgress, [0.05, 0.12], [0, 1]);
  const conflictCardY = useTransform(localProgress, [0.05, 0.12], [30, 0]);

  const conflictBadgeOpacity = useTransform(localProgress, [0.08, 0.11], [0, 1]);
  const conflictBadgeScale = useTransform(localProgress, [0.08, 0.11], [0.8, 1]);

  const aiCardOpacity = useTransform(localProgress, [0.35, 0.42], [0, 1]);
  const aiCardY = useTransform(localProgress, [0.35, 0.42], [30, 0]);

  const lockedOpacity = useTransform(localProgress, [0.75, 0.80], [0, 1]);
  const lockedScale = useTransform(localProgress, [0.75, 0.80], [0.8, 1]);

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
            Agree before anyone books.
          </h2>
        </motion.div>

        <div className="space-y-4">
          <motion.div
            style={{ opacity: conflictCardOpacity, y: conflictCardY }}
            className="border-[3px] border-ink rounded-[16px] bg-white p-6 sm:p-8 shadow-bruted-lg"
          >
            <div className="flex items-center justify-between mb-5">
              <span className="font-mono text-xs font-bold text-ink-muted uppercase tracking-wider">
                Budget Preferences
              </span>
              <motion.div
                style={{ opacity: conflictBadgeOpacity, scale: conflictBadgeScale }}
                className="flex items-center gap-1.5 bg-error/10 border border-error/30 rounded-full px-3 py-1"
              >
                <svg className="w-4 h-4 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="font-heading text-xs font-bold text-error">Budget Conflict Detected</span>
              </motion.div>
            </div>

            <div className="space-y-3">
              <div className="flex h-12 rounded-[8px] overflow-hidden border-[2px] border-ink">
                {budgetGroups.map((group) => (
                  <div
                    key={group.label}
                    style={{ width: `${group.pct}%` }}
                    className="flex items-center justify-center bg-gradient-to-b from-peach-light to-peach-dark border-r last:border-r-0 border-ink"
                  >
                    <span className="font-heading text-xs font-bold text-ink">{group.label}</span>
                  </div>
                ))}
              </div>
              {budgetGroups.map((group) => (
                <div key={group.label} className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-ink-muted w-16">{group.label}</span>
                  <div className="flex-1 h-2 rounded-[3px] bg-ink/10 overflow-hidden">
                    <div
                      className="h-full rounded-[3px] bg-ink/30"
                      style={{ width: `${(group.friends / 8) * 100}%` }}
                    />
                  </div>
                  <span className="font-heading text-xs text-ink-light">
                    {group.friends} {group.friends === 1 ? "friend" : "friends"}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            style={{ opacity: aiCardOpacity, y: aiCardY }}
            className="border-[3px] border-ink rounded-[16px] bg-white p-6 sm:p-8 shadow-bruted-lg"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-[8px] bg-accent border-[2px] border-ink flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <p className="font-heading text-sm font-bold text-ink">AI Recommended Budget</p>
                <p className="font-mono text-[10px] text-ink-muted">Based on group preferences</p>
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-display text-4xl font-extrabold text-ink">₹5,000</span>
              <span className="font-heading text-sm text-ink-muted">/person</span>
            </div>

            <div className="flex items-center gap-2 text-success mb-4">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
              <span className="font-heading text-sm font-bold">
                Save{" "}
                <AnimatedSavings localProgress={localProgress} />
                {" "}per person
              </span>
            </div>

            <motion.div
              style={{ opacity: lockedOpacity, scale: lockedScale }}
              className="flex items-center gap-2 bg-success/10 border border-success/30 rounded-[8px] px-4 py-2.5"
            >
              <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="font-heading text-sm font-bold text-success">Budget Locked</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
