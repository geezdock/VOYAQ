"use client";

import { MotionValue, motion, useTransform } from "framer-motion";

const destinations = [
  { name: "Goa", votes: 5, pct: 62 },
  { name: "Gokarna", votes: 2, pct: 25 },
  { name: "Pondicherry", votes: 1, pct: 13 },
];

const friendVotes = [
  { name: "Rahul", initial: "R", color: "bg-accent", vote: "Goa" },
  { name: "Ananya", initial: "A", color: "bg-peach-dark", vote: "Goa" },
  { name: "Siddharth", initial: "S", color: "bg-clay", vote: "Goa" },
  { name: "Vivek", initial: "V", color: "bg-accent-light", vote: "Goa" },
  { name: "Mrunal", initial: "M", color: "bg-peach", vote: "Goa" },
  { name: "Karthik", initial: "K", color: "bg-clay-light", vote: "Gokarna" },
  { name: "Priya", initial: "P", color: "bg-peach-dark", vote: "Gokarna" },
  { name: "Arjun", initial: "A", color: "bg-accent", vote: "Pondicherry" },
];

function VoteBar({
  name,
  votes,
  pct,
  localProgress,
  index,
}: {
  name: string;
  votes: number;
  pct: number;
  localProgress: MotionValue<number>;
  index: number;
}) {
  const barDelay = 0.15 + index * 0.15;
  const barOpacity = useTransform(localProgress, [barDelay, barDelay + 0.05], [0, 1]);
  const barWidth = useTransform(localProgress, [barDelay + 0.05, barDelay + 0.40], [0, pct]);
  const countOpacity = useTransform(localProgress, [barDelay + 0.02, barDelay + 0.07], [0, 1]);

  const relevantFriends = friendVotes.filter((f) => f.vote === name);

  return (
    <motion.div
      style={{ opacity: barOpacity }}
      className="space-y-1.5"
    >
      <div className="flex items-center gap-3">
        <span className="font-heading text-base sm:text-lg font-bold text-ink w-28 shrink-0">
          {name}
        </span>
        <div className="flex-1 relative h-8">
          <div className="absolute inset-0 bg-clay-light/30 rounded-[6px] overflow-hidden">
            <motion.div
              style={{ width: barWidth }}
              className="h-full rounded-[6px] bg-gradient-to-r from-accent to-accent-dark"
            />
          </div>
          <div className="absolute inset-0 flex items-center px-3">
            <div className="flex items-center gap-1">
              {relevantFriends.slice(0, 5).map((f, i) => (
                <motion.div
                  key={f.name}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + index * 0.15 + i * 0.05, type: "spring", stiffness: 400, damping: 16 }}
                  className={`w-6 h-6 rounded-full ${f.color} flex items-center justify-center ring-2 ring-white -ml-1 first:ml-0`}
                >
                  <span className="text-[8px] font-heading font-bold text-white leading-none">
                    {f.initial}
                  </span>
                </motion.div>
              ))}
              {relevantFriends.length > 5 && (
                <span className="font-mono text-[10px] text-white font-bold ml-1">
                  +{relevantFriends.length - 5}
                </span>
              )}
            </div>
          </div>
        </div>
        <motion.span
          style={{ opacity: countOpacity }}
          className="font-mono text-sm font-bold text-ink w-8 text-right tabular-nums"
        >
          {votes}
        </motion.span>
      </div>
    </motion.div>
  );
}

export function StageVoting({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  const start = 0.20;
  const end = 0.37;

  const stageOpacity = useTransform(
    scrollYProgress,
    [start - 0.02, start, end, end + 0.02],
    [0, 1, 1, 0]
  );

  const localProgress = useTransform(scrollYProgress, [start, end], [0, 1]);

  const cardOpacity = useTransform(localProgress, [0, 0.08], [0, 1]);
  const cardY = useTransform(localProgress, [0, 0.08], [40, 0]);

  const headlineOpacity = useTransform(localProgress, [0, 0.06], [0, 1]);
  const headlineY = useTransform(localProgress, [0, 0.06], [24, 0]);

  const resultOpacity = useTransform(localProgress, [0.70, 0.75], [0, 1]);
  const resultScale = useTransform(localProgress, [0.70, 0.75], [0.8, 1]);

  const footerOpacity = useTransform(localProgress, [0.60, 0.65], [0, 1]);

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
            Let everyone have a say.
          </h2>
        </motion.div>

        <motion.div
          style={{ opacity: cardOpacity, y: cardY }}
          className="border-[3px] border-ink rounded-[16px] bg-white p-6 sm:p-8 shadow-bruted-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <span className="font-mono text-xs font-bold text-ink-muted uppercase tracking-wider">
              Destination Vote
            </span>
            <motion.div
              style={{ opacity: resultOpacity, scale: resultScale }}
              className="flex items-center gap-1.5 bg-success/10 border border-success/30 rounded-full px-3 py-1"
            >
              <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-heading text-xs font-bold text-success">Goa Leading</span>
            </motion.div>
          </div>

          <div className="space-y-4">
            {destinations.map((dest, i) => (
              <VoteBar
                key={dest.name}
                name={dest.name}
                votes={dest.votes}
                pct={dest.pct}
                localProgress={localProgress}
                index={i}
              />
            ))}
          </div>

          <motion.div
            style={{ opacity: footerOpacity }}
            className="mt-6 pt-4 border-t border-ink/10 flex items-center gap-2 text-ink-muted"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-heading text-sm">8 friends voted</span>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
