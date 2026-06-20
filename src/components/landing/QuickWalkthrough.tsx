"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const cards = [
  {
    step: "01",
    title: "Create Squad",
    sub: "One link. Squad joins instantly.",
    color: "bg-[#D4836A]",
  },
  {
    step: "02",
    title: "Decide Together",
    sub: "Vote destinations, budgets, dates.",
    color: "bg-accent",
  },
  {
    step: "03",
    title: "AI Plans It",
    sub: "Generates itinerary in seconds.",
    color: "bg-accent",
  },
  {
    step: "04",
    title: "Trip Ready",
    sub: "From chaos to confirmed trip.",
    color: "bg-success",
  },
];

function SquadCard({ active }: { active: boolean }) {
  const friends = [
    { initial: "R", color: "bg-[#D4836A]" },
    { initial: "A", color: "bg-[#E8C4B8]" },
    { initial: "S", color: "bg-[#C4A99A]" },
    { initial: "V", color: "bg-[#E09D88]" },
    { initial: "M", color: "bg-[#F0D5C9]" },
  ];

  return (
    <div className="flex items-center gap-1 flex-wrap justify-center h-10">
      {friends.map((f, i) => (
        <motion.div
          key={f.initial}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 + i * 0.06, type: "spring", stiffness: 500, damping: 18 }}
          className={`w-7 h-7 rounded-full ${f.color} flex items-center justify-center ring-2 ring-white`}
        >
          <span className="text-[8px] font-heading font-bold text-white">{f.initial}</span>
        </motion.div>
      ))}
      {active && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 400, damping: 15 }}
          className="w-7 h-7 rounded-full bg-success flex items-center justify-center ring-2 ring-white"
        >
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      )}
    </div>
  );
}

function VoteCard({ active }: { active: boolean }) {
  return (
    <div className="space-y-1.5 w-full">
      {[
        { name: "Goa", pct: 62 },
        { name: "Gokarna", pct: 25 },
        { name: "Pondicherry", pct: 13 },
      ].map((dest, i) => (
        <div key={dest.name} className="flex items-center gap-2">
          <span className="font-heading text-[10px] font-bold text-ink w-16 shrink-0 text-right">{dest.name}</span>
          <div className="flex-1 h-2.5 rounded-[3px] bg-ink/10 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={active ? { width: `${dest.pct}%` } : { width: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="h-full rounded-[3px] bg-gradient-to-r from-accent to-accent-dark"
            />
          </div>
          <span className="font-mono text-[9px] font-bold text-ink w-5 text-right">{dest.pct}%</span>
        </div>
      ))}
    </div>
  );
}

function AIProgressCard({ active }: { active: boolean }) {
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded bg-accent flex items-center justify-center shrink-0">
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div className="flex-1 h-2 rounded-[3px] bg-ink/10 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={active ? { width: "100%" } : { width: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            className="h-full rounded-[3px] bg-gradient-to-r from-accent to-accent-dark"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-1">
        {["Beach", "Budget", "Nightlife"].map((tag, i) => (
          <motion.span
            key={tag}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.4 + i * 0.08, duration: 0.3 }}
            className="font-mono text-[8px] font-bold text-ink border border-ink/20 rounded-full px-1.5 py-0.5 bg-[#F7F4EF]"
          >
            {tag}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

function TripReadyCard({ active }: { active: boolean }) {
  return (
    <div className="w-full text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        className="border-2 border-ink rounded-lg p-3 bg-white inline-block"
      >
        <div className="bg-accent text-white font-mono text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-ink mb-1 inline-block">
          Boarding Pass
        </div>
        <p className="font-display text-sm font-extrabold text-ink uppercase">Goa Weekend Trip</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
        animate={active ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.5, rotate: -30 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 12 }}
        className="mt-2 inline-block"
      >
        <span className="bg-success text-white font-mono text-[9px] font-bold uppercase px-2 py-1 rounded border-2 border-ink shadow-bruted-sm">
          STAMPED
        </span>
      </motion.div>
    </div>
  );
}

const stepComponents = [SquadCard, VoteCard, AIProgressCard, TripReadyCard];

export function QuickWalkthrough() {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  return (
    <section className="py-20 sm:py-28 lg:py-36 px-4 bg-surface">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <span className="font-mono text-xs font-bold text-ink-muted uppercase tracking-widest">
            How it works
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {cards.map((card, i) => {
            const StepComponent = stepComponents[i];
            return (
              <motion.div
                key={card.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                onHoverStart={() => setActiveCard(i)}
                onHoverEnd={() => setActiveCard(null)}
                onTap={() => setActiveCard(activeCard === i ? null : i)}
                className="border-[3px] border-ink rounded-[16px] bg-white p-5 sm:p-6 shadow-bruted-lg cursor-pointer hover:shadow-bruted hover:translate-x-[-2px] hover:translate-y-[-2px] transition-shadow"
              >
                <span className="font-mono text-[10px] font-bold text-accent uppercase tracking-widest">
                  STEP {card.step}
                </span>
                <h3 className="font-display text-lg sm:text-xl font-extrabold text-ink uppercase tracking-tight mt-2 mb-1">
                  {card.title}
                </h3>
                <p className="font-heading text-sm text-ink-light mb-4">
                  {card.sub}
                </p>
                <div className="h-16 flex items-center justify-center">
                  <StepComponent active={activeCard === i} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
