"use client";

import { motion } from "framer-motion";

const scenarios = [
  {
    title: "Goa Weekend",
    tagline: "8 friends, 3 days, zero chaos",
    stats: ["4 destinations voted", "₹4,850 pp", "Aug 15–17 locked"],
    accent: "bg-accent",
  },
  {
    title: "Manali Trek",
    tagline: "5 friends, 5 days, altitude sorted",
    stats: ["Budget aligned", "Dates synced", "Offline map cached"],
    accent: "bg-clay",
  },
  {
    title: "Kerala Family",
    tagline: "6 adults + 2 kids, stress-free",
    stats: ["Parent consent done", "PDF shared", "Calendar synced"],
    accent: "bg-success",
  },
];

export function RealScenarios() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
      {scenarios.map((s, i) => (
        <motion.div
          key={s.title}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
          className="border-[2px] border-ink rounded-[12px] p-4 sm:p-5 bg-white shadow-bruted-sm"
        >
          <div className={`w-8 h-1 rounded-full ${s.accent} mb-3`} />
          <h4 className="font-display text-base font-extrabold text-ink uppercase tracking-tight">
            {s.title}
          </h4>
          <p className="font-heading text-sm text-ink-light mt-1 mb-3">{s.tagline}</p>
          <div className="space-y-1">
            {s.stats.map((stat) => (
              <p key={stat} className="font-mono text-[11px] font-bold text-ink-muted">{stat}</p>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
