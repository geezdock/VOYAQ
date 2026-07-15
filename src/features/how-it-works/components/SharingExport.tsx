"use client";

import { motion } from "framer-motion";
import { Share2, Link, FileText, Calendar } from "lucide-react";

const features = [
  {
    icon: Share2,
    title: "WhatsApp Share",
    desc: "Send your itinerary directly to WhatsApp with a rich preview.",
  },
  {
    icon: Link,
    title: "Public Trip Link",
    desc: "Share a read-only link with anyone — no account required.",
  },
  {
    icon: FileText,
    title: "PDF Export",
    desc: "Download a clean PDF with itinerary, budget, and contacts.",
  },
  {
    icon: Calendar,
    title: "Calendar Sync",
    desc: "Add to Google, Apple, or Outlook calendar with one tap.",
  },
];

export function SharingExport() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
      {features.map((f, i) => (
        <motion.div
          key={f.title}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08, duration: 0.4 }}
          className="flex items-start gap-3 p-4 rounded-[12px] border border-ink/10 bg-surface-alt/50"
        >
          <div className="w-9 h-9 rounded-[8px] bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
            <f.icon className="w-4 h-4 text-accent" />
          </div>
          <div>
            <p className="font-heading text-sm font-bold text-ink">{f.title}</p>
            <p className="font-heading text-sm text-ink-light mt-0.5">{f.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
