"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  AlertTriangle,
  Calendar,
  Sparkles,
  Users,
  Umbrella,
  Wallet,
  Music,
} from "lucide-react";

function AnimatedNumber({
  target,
  delay = 0,
  duration,
}: {
  target: number;
  delay?: number;
  duration?: number;
}) {
  const [value, setValue] = useState(0);
  const d = duration ?? Math.max(800, target * 300);

  useEffect(() => {
    let start: number | null = null;
    let raf: number;
    const delayMs = delay * 1000;

    function step(timestamp: number) {
      if (!start) start = timestamp;
      const elapsed = timestamp - start - delayMs;
      if (elapsed < 0) {
        raf = requestAnimationFrame(step);
        return;
      }
      const progress = Math.min(elapsed / d, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, delay, d]);

  return <span>{value}</span>;
}

function AnimatedBar({
  targetPct,
  delay,
}: {
  targetPct: number;
  delay: number;
}) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let start: number | null = null;
    let raf: number;
    const delayMs = delay * 1000;
    function step(timestamp: number) {
      if (!start) start = timestamp;
      const elapsed = timestamp - start - delayMs;
      if (elapsed < 0) {
        raf = requestAnimationFrame(step);
        return;
      }
      const progress = Math.min(elapsed / 1000, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setPct(Math.min(eased * targetPct, 100));
      if (progress < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [targetPct, delay]);

  return (
    <div className="w-full h-2 max-sm:h-1.5 rounded-[3px] bg-ink/10 overflow-hidden">
      <div
        className="h-full rounded-[3px] transition-none"
        style={{
          width: `${pct}%`,
          backgroundColor: pct > 50 ? "#D4836A" : "#C4A99A",
        }}
      />
    </div>
  );
}

const destinations = [
  { name: "Goa", votes: 4, pct: 57 },
  { name: "Gokarna", votes: 2, pct: 29 },
  { name: "Pondicherry", votes: 1, pct: 14 },
];

const friends = [
  { name: "Rahul", initial: "R", color: "bg-[#D4836A]" },
  { name: "Ananya", initial: "A", color: "bg-[#E8C4B8]" },
  { name: "Siddharth", initial: "S", color: "bg-[#C4A99A]" },
  { name: "Vivek", initial: "V", color: "bg-[#E09D88]" },
  { name: "Mrunal", initial: "M", color: "bg-[#F0D5C9]" },
  { name: "Karthik", initial: "K", color: "bg-[#D4BFB2]" },
];

export function TripBoardPreview() {
  const [budgetPct, setBudgetPct] = useState(0);

  useEffect(() => {
    let start: number | null = null;
    let raf: number;
    function step(timestamp: number) {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / 2000, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setBudgetPct(eased * 72);
      if (progress < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="w-full h-full p-2 max-sm:p-1.5 sm:p-3 md:p-4 flex flex-col gap-1 max-sm:gap-0.5 sm:gap-2 md:gap-3 overflow-hidden">
      {/* Header */}
      <motion.h2
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="font-display text-xs max-sm:text-[11px] sm:text-base md:text-xl font-extrabold text-[#2D2A24] uppercase tracking-tight leading-tight"
      >
        Goa Weekend Trip
      </motion.h2>

      {/* Section 1: Group Confirmation Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="border-[2px] border-[#2D2A24] rounded-[8px] p-1.5 max-sm:p-1 sm:p-3 bg-white"
      >
        <div className="flex items-center justify-between mb-1 max-sm:mb-0.5 sm:mb-2">
          <div className="flex items-baseline gap-1">
            <span className="font-display text-lg max-sm:text-base sm:text-2xl font-extrabold text-[#2D2A24] leading-none">
              <AnimatedNumber target={6} delay={0.15} duration={1200} />
            </span>
            <span className="font-heading text-[10px] max-sm:text-[9px] sm:text-xs font-semibold text-[#8B7D72]">
              /8
            </span>
            <span className="font-mono text-[9px] max-sm:text-[8px] sm:text-[10px] font-bold text-[#2D2A24] uppercase tracking-wider ml-1 sm:ml-2">
              Confirmed
            </span>
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.8, type: "spring", stiffness: 400, damping: 15 }}
          >
            <Users className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#D4836A]" />
          </motion.div>
        </div>

        <div className="flex flex-wrap gap-1 max-sm:gap-0.5">
          {friends.map((f, i) => (
            <motion.div
              key={f.name}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.8 + i * 0.08,
                type: "spring",
                stiffness: 500,
                damping: 18,
              }}
              className="flex items-center gap-0.5 border-[1.5px] border-[#2D2A24] rounded-full pr-1 max-sm:pr-0.5 sm:pr-2 overflow-hidden"
            >
              <div
                className={`w-3.5 h-3.5 max-sm:w-3 max-sm:h-3 sm:w-5 sm:h-5 ${f.color} flex items-center justify-center text-[8px] max-sm:text-[7px] sm:text-[10px] font-heading font-bold text-white shrink-0`}
              >
                {f.initial}
              </div>
              <span className="font-heading text-[9px] max-sm:text-[7px] sm:text-[10px] font-semibold text-[#2D2A24] leading-none pt-px">
                {f.name}
              </span>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, type: "spring", stiffness: 400, damping: 16 }}
            className="flex items-center gap-0.5 border-[1.5px] border-dashed border-[#2D2A24] rounded-full pr-1 max-sm:pr-0.5 sm:pr-2 overflow-hidden bg-[#F7F4EF]"
          >
            <div className="w-3.5 h-3.5 max-sm:w-3 max-sm:h-3 sm:w-5 sm:h-5 bg-[#EDE6DF] flex items-center justify-center text-[9px] max-sm:text-[8px] sm:text-xs font-heading font-bold text-[#8B7D72]">
              +
            </div>
            <span className="font-heading text-[9px] max-sm:text-[7px] sm:text-[10px] font-semibold text-[#8B7D72] leading-none pt-px">
              Invite
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Section 2: Destination Voting */}
      <div className="min-h-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex items-center justify-between mb-1 max-sm:mb-0.5 sm:mb-2"
        >
          <span className="font-mono text-[9px] max-sm:text-[8px] sm:text-[11px] font-bold text-[#8B7D72] uppercase tracking-wider">
            Destination
          </span>
          <motion.span
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2.0, duration: 0.3 }}
            className="font-mono text-[9px] max-sm:text-[8px] sm:text-[10px] text-[#4A7C59] font-bold flex items-center gap-0.5 sm:gap-1"
          >
            <Check className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5" />
            Goa Leading
          </motion.span>
        </motion.div>

        <div className="space-y-0.5 max-sm:space-y-0.5 sm:space-y-2">
          {destinations.map((dest, i) => (
            <motion.div
              key={dest.name}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.12, duration: 0.4 }}
            >
              <div className="flex items-center gap-0.5 sm:gap-1.5 mb-0.5">
                <span className="font-heading text-[10px] max-sm:text-[9px] sm:text-[11px] font-semibold text-[#2D2A24] shrink-0">
                  {dest.name}
                </span>
                <div className="flex-1" />
                <span className="font-mono text-[9px] max-sm:text-[8px] sm:text-[10px] text-[#8B7D72]">
                  <AnimatedNumber target={dest.votes} delay={0.4 + i * 0.12} duration={600} />v
                </span>
                <span className="font-mono text-[9px] max-sm:text-[8px] sm:text-[10px] font-bold text-[#2D2A24] w-4 sm:w-7 text-right">
                  {dest.pct}%
                </span>
              </div>
              <AnimatedBar targetPct={dest.pct} delay={0.5 + i * 0.15} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Section 3: Budget + Dates */}
      <div className="flex flex-col sm:flex-row gap-1 max-sm:gap-0.5 sm:gap-4 min-h-0">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.4 }}
          className="flex-1 border-[2px] border-[#2D2A24] rounded-[8px] p-1 max-sm:p-0.5 sm:p-2.5 bg-white"
        >
          <div className="flex items-center justify-between mb-0.5 sm:mb-1.5">
            <span className="font-mono text-[8px] max-sm:text-[7px] sm:text-[10px] font-bold text-[#8B7D72] uppercase tracking-wider">
              Budget
            </span>
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.5, type: "spring", stiffness: 400, damping: 15 }}
              className="font-mono text-[8px] max-sm:text-[7px] sm:text-[10px] text-[#B84A4A] font-bold flex items-center gap-0.5"
            >
              <AlertTriangle className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5" />
              2 over
            </motion.span>
          </div>
          <span className="font-heading text-[10px] max-sm:text-[9px] sm:text-xs font-bold text-[#2D2A24]">
            ₹5,000 <span className="font-normal text-[#8B7D72]">/pp</span>
          </span>
          <div className="w-full h-1 max-sm:h-0.5 sm:h-1.5 rounded-[3px] bg-ink/10 overflow-hidden mt-0.5 sm:mt-1.5">
            <div
              className="h-full rounded-[3px] bg-[#B84A4A]"
              style={{ width: `${budgetPct}%` }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.4 }}
          className="flex-1 border-[2px] border-[#2D2A24] rounded-[8px] p-1 max-sm:p-0.5 sm:p-2.5 bg-white"
        >
          <div className="flex items-center justify-between mb-0.5 sm:mb-1.5">
            <span className="font-mono text-[8px] max-sm:text-[7px] sm:text-[10px] font-bold text-[#8B7D72] uppercase tracking-wider">
              Dates
            </span>
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.8, type: "spring", stiffness: 400, damping: 15 }}
              className="font-mono text-[8px] max-sm:text-[7px] sm:text-[10px] text-[#4A7C59] font-bold flex items-center gap-0.5"
            >
              <Check className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5" />
              Locked
            </motion.span>
          </div>
          <div className="flex items-center gap-0.5 sm:gap-1.5">
            <Calendar className="w-2 h-2 sm:w-3 sm:h-3 text-[#D4836A]" />
            <span className="font-heading text-[10px] max-sm:text-[9px] sm:text-xs font-bold text-[#2D2A24]">
              Aug 15 – 17
            </span>
          </div>
        </motion.div>
      </div>

      {/* Section 4: AI Itinerary Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="border-[2px] border-[#2D2A24] rounded-[8px] p-1.5 max-sm:p-1 sm:p-3 bg-white"
      >
        <div className="flex items-start gap-1 sm:gap-2">
          <motion.div
            initial={{ rotate: -30, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ delay: 2.6, type: "spring", stiffness: 400, damping: 14 }}
            className="w-4 h-4 max-sm:w-3 max-sm:h-3 sm:w-7 sm:h-7 rounded-[3px] sm:rounded-[6px] border-[2px] border-[#2D2A24] bg-[#D4836A] flex items-center justify-center shrink-0 mt-0.5"
          >
            <Sparkles className="w-2 h-2 max-sm:w-1.5 max-sm:h-1.5 sm:w-3 sm:h-3 text-white" />
          </motion.div>
          <div className="flex-1 min-w-0">
            <p className="font-mono text-[9px] max-sm:text-[8px] sm:text-[11px] font-bold text-[#2D2A24] uppercase tracking-wider leading-tight">
              AI Itinerary Generated
            </p>
            <p className="font-heading text-[9px] max-sm:text-[8px] sm:text-[11px] text-[#8B7D72] mb-0.5 sm:mb-1.5">
              3 Days
              <span className="mx-0.5 sm:mx-1.5 text-[#C4A99A]">·</span>
              12 Stops
              <span className="mx-0.5 sm:mx-1.5 text-[#C4A99A]">·</span>
              ₹4,850/person
            </p>
            <div className="flex flex-wrap gap-0.5 sm:gap-1">
              {[
                { label: "Beach", icon: Umbrella },
                { label: "Budget Friendly", icon: Wallet },
                { label: "Nightlife", icon: Music },
              ].map((tag, i) => (
                <motion.div
                  key={tag.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 3.0 + i * 0.1, type: "spring", stiffness: 400, damping: 14 }}
                  className="flex items-center gap-0.5 border-[1.5px] border-[#2D2A24] rounded-full px-0.5 sm:px-1.5 py-[1px] max-sm:py-0 bg-[#F7F4EF]"
                >
                  <tag.icon className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-[#D4836A]" />
                  <span className="font-mono text-[7px] max-sm:text-[6px] sm:text-[9px] font-semibold text-[#2D2A24] leading-none">
                    {tag.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
