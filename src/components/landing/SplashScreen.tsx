"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SplashScreenProps {
  children: React.ReactNode;
}

const dotColors = ["#D4836A", "#C4A99A", "#F0D5C9", "#4A7C59", "#E09D88"];

const dots = [
  { id: 0, color: dotColors[0], typingX: 44, typingY: 90, vX: 20, vY: 20 },
  { id: 1, color: dotColors[1], typingX: 62, typingY: 90, vX: 50, vY: 60 },
  { id: 2, color: dotColors[2], typingX: 80, typingY: 90, vX: 80, vY: 100 },
  { id: 3, color: dotColors[3], typingX: 98, typingY: 90, vX: 110, vY: 60 },
  { id: 4, color: dotColors[4], typingX: 116, typingY: 90, vX: 140, vY: 20 },
];

const labels = [
  { text: "DESTINATION", x: 36, y: 38, color: dotColors[0] },
  { text: "BUDGET", x: 80, y: 115, color: dotColors[1] },
  { text: "DATES", x: 124, y: 38, color: dotColors[3] },
];

const splashState = { seen: false };

export function SplashScreen({ children }: SplashScreenProps) {
  const [showSplash, setShowSplash] = useState(() => {
    if (splashState.seen) return false;
    splashState.seen = true;
    return true;
  });
  const [phase, setPhase] = useState<"typing" | "converging" | "locking" | "done">("typing");
  const [showBoldV, setShowBoldV] = useState(false);

  useEffect(() => {
    if (!showSplash) return;

    const t1 = setTimeout(() => setPhase("converging"), 1400);
    const t2 = setTimeout(() => setPhase("locking"), 2000);
    const t3 = setTimeout(() => { setPhase("done"); setShowBoldV(true); }, 2500);
    const t4 = setTimeout(() => setShowSplash(false), 3500);
    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
    };
  }, [showSplash]);

  const isConverged = phase !== "typing";
  const isLocked = phase === "locking" || phase === "done";
  const isDone = phase === "done";

  return (
    <div className="relative">
      <div
        className={`transition-opacity duration-500 ${
          showSplash ? "opacity-0" : "opacity-100"
        }`}
      >
        {children}
      </div>

      <AnimatePresence>
        {showSplash && (
          <motion.div
            className="fixed inset-0 z-[9999] bg-ink flex items-center justify-center"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <div className="text-center px-4">
              <div className="mb-3">
                <svg
                  viewBox="0 0 160 120"
                  className="w-32 sm:w-40 mx-auto"
                  fill="none"
                >
                  {/* Map grid */}
                  <motion.g
                    stroke="#F5F0EB"
                    strokeWidth="0.3"
                    strokeOpacity="0.06"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                  >
                    {[0, 20, 40, 60, 80, 100, 120, 140, 160].map((x) => (
                      <line key={`v${x}`} x1={x} y1="0" x2={x} y2="120" />
                    ))}
                    {[0, 20, 40, 60, 80, 100, 120].map((y) => (
                      <line key={`h${y}`} x1="0" y1={y} x2="160" y2={y} />
                    ))}
                  </motion.g>

                  {/* Thin dashed V route — draws during locking phase */}
                  {isLocked && (
                    <motion.path
                      d="M 20 20 L 80 100 L 140 20"
                      stroke="#F5F0EB"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray="6 4"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                    />
                  )}

                  {/* Bold V overlay + shadow — stamps in during done phase */}
                  {showBoldV && (
                    <>
                      <motion.path
                        d="M 20 20 L 80 100 L 140 20"
                        stroke="#F5F0EB"
                        strokeWidth="7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                      />
                      <motion.path
                        d="M 23 23 L 83 103 L 143 23"
                        stroke="rgba(245,240,235,0.12)"
                        strokeWidth="7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.1, duration: 0.2, ease: "easeOut" }}
                      />
                    </>
                  )}

                  {/* Squad dots */}
                  {dots.map((dot, i) => (
                    <motion.circle
                      key={dot.id}
                      r="5"
                      fill={dot.color}
                      initial={{ cx: dot.typingX, cy: dot.typingY, scale: 0, opacity: 0 }}
                      animate={
                        !isConverged
                          ? {
                              cx: dot.typingX,
                              cy: [dot.typingY, dot.typingY - 8, dot.typingY],
                              scale: 1,
                              opacity: 1,
                            }
                          : {
                              cx: dot.vX,
                              cy: dot.vY,
                              scale: 1,
                              opacity: 1,
                            }
                      }
                      transition={
                        !isConverged
                          ? {
                              scale: { delay: i * 0.08, duration: 0.3 },
                              opacity: { delay: i * 0.08, duration: 0.3 },
                              cy: {
                                repeat: Infinity,
                                duration: 0.45,
                                delay: i * 0.1,
                                ease: "easeInOut",
                                repeatType: "reverse",
                              },
                            }
                          : {
                              duration: 0.5,
                              delay: i * 0.03,
                              ease: "easeInOut",
                            }
                      }
                    />
                  ))}

                  {/* Decision labels — appear during locking phase */}
                  {labels.map((label, i) => (
                    <motion.text
                      key={label.text}
                      x={label.x}
                      y={label.y}
                      textAnchor="middle"
                      fill={label.color}
                      fontSize="7"
                      fontFamily="Space_Grotesk, sans-serif"
                      fontWeight="700"
                      initial={{ opacity: 0, y: label.y + 6 }}
                      animate={
                        isLocked
                          ? { opacity: 1, y: label.y }
                          : { opacity: 0, y: label.y + 6 }
                      }
                      transition={{
                        delay: isLocked ? 0.1 + i * 0.08 : 0,
                        duration: 0.3,
                        ease: "easeOut",
                      }}
                    >
                      {label.text}
                    </motion.text>
                  ))}
                </svg>
              </div>

              {/* VOYAQ letters */}
              <div className="flex items-center justify-center gap-0.5 mb-1">
                {"VOYAQ".split("").map((letter, i) => (
                  <motion.span
                    key={i}
                    className="font-display text-2xl sm:text-3xl font-extrabold text-surface tracking-tight"
                    initial={{ opacity: 0, y: 24 }}
                    animate={
                      isDone
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: 24 }
                    }
                    transition={{
                      delay: isDone ? 0.1 + i * 0.1 : 0,
                      duration: 0.35,
                      ease: "easeOut",
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>

              {/* Tagline */}
              <motion.p
                className="font-heading text-[10px] sm:text-xs text-surface/50 tracking-[0.2em] uppercase"
                initial={{ opacity: 0, y: 8 }}
                animate={
                  isDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }
                }
                transition={{
                  delay: isDone ? 0.6 : 0,
                  duration: 0.5,
                }}
              >
                Plan Trips. Together.
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
