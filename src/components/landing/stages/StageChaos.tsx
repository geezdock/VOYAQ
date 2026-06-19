"use client";

import { MotionValue, motion, useTransform } from "framer-motion";
import { chaosMessages } from "./chatData";

function MessageItem({
  msg,
  index,
  localProgress,
}: {
  msg: { sender: string; text: string; time: string; color: string };
  index: number;
  localProgress: MotionValue<number>;
}) {
  const total = chaosMessages.length;
  const start = 0.05 + index * (0.50 / total);
  const end = Math.min(start + 0.04, 0.98);
  const opacity = useTransform(localProgress, [start, end], [0, 1]);
  const y = useTransform(localProgress, [start, end], [16, 0]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="flex items-start gap-2.5 px-4 py-1"
    >
      <div
        className={`w-7 h-7 rounded-full ${msg.color} flex items-center justify-center shrink-0 mt-0.5 ring-2 ring-white`}
      >
        <span className="text-[10px] font-heading font-bold text-white leading-none">
          {msg.sender[0]}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="font-heading text-xs font-bold text-ink">
            {msg.sender}
          </span>
          <span className="font-mono text-[9px] text-ink-muted">{msg.time}</span>
        </div>
        <p className="font-heading text-sm text-ink-light leading-snug">
          {msg.text}
        </p>
      </div>
    </motion.div>
  );
}

export function StageChaos({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  const start = 0;
  const end = 0.20;

  const stageOpacity = useTransform(
    scrollYProgress,
    [start - 0.02, start, end, end + 0.02],
    [0, 1, 1, 0]
  );

  const localProgress = useTransform(scrollYProgress, [start, end], [0, 1]);

  const headlineOpacity = useTransform(localProgress, [0, 0.06], [0, 1]);
  const headlineY = useTransform(localProgress, [0, 0.06], [24, 0]);
  const subheadOpacity = useTransform(localProgress, [0.03, 0.08], [0, 1]);

  const badgeOpacity = useTransform(localProgress, [0.60, 0.63], [0, 1]);
  const badgeScale = useTransform(localProgress, [0.60, 0.63], [0.8, 1]);

  const endTextOpacity = useTransform(localProgress, [0.72, 0.76], [0, 1]);

  return (
    <motion.div
      style={{ opacity: stageOpacity }}
      className="absolute inset-0 flex items-center justify-center"
    >
      <div className="w-full max-w-6xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
        <div className="flex-1 max-w-lg">
          <motion.h2
            style={{ opacity: headlineOpacity, y: headlineY }}
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink uppercase tracking-tight leading-[1.1]"
          >
            Every trip starts
            <br />
            the same way.
          </motion.h2>
          <motion.p
            style={{ opacity: subheadOpacity }}
            className="font-heading text-base sm:text-lg text-ink-light mt-3 max-w-md"
          >
            One idea. A hundred messages.
          </motion.p>
        </div>

        <motion.div
          style={{ opacity: headlineOpacity, y: headlineY }}
          className="w-full max-w-sm"
        >
          <div className="border-[3px] border-ink rounded-[20px] overflow-hidden bg-white shadow-bruted-lg">
            <div className="bg-accent px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <span className="font-heading text-sm font-bold text-white">
                  WT
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading text-sm font-bold text-white leading-tight">
                  Weekend Trip
                </p>
                <p className="font-mono text-[10px] text-white/70">
                  8 participants
                </p>
              </div>
            </div>

            <div className="bg-[#e5ddd5] p-3 space-y-0.5 min-h-[380px] flex flex-col">
              <div className="flex-1 space-y-1">
                {chaosMessages.map((msg, i) => (
                  <MessageItem
                    key={`${msg.sender}-${i}`}
                    msg={msg}
                    index={i}
                    localProgress={localProgress}
                  />
                ))}
              </div>

              <motion.div
                style={{ opacity: badgeOpacity, scale: badgeScale }}
                className="self-center bg-error text-white font-heading text-xs font-bold px-4 py-1.5 rounded-full"
              >
                127 unread messages
              </motion.div>

              <motion.p
                style={{ opacity: endTextOpacity }}
                className="font-heading text-center text-sm text-ink-light italic mt-2"
              >
                Group chats aren&apos;t trip planners.
              </motion.p>
            </div>

            <div className="bg-ink px-4 py-2.5 flex items-center gap-2">
              <div className="flex-1 h-8 rounded-[6px] bg-ink-light/30 border border-ink-muted/30" />
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 12h14M12 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
