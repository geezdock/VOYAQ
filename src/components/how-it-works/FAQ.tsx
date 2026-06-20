"use client";

import { motion } from "framer-motion";

const faqs = [
  {
    q: "Is VOYAQ free?",
    a: "Yes — core planning features are free. Premium features will be added later.",
  },
  {
    q: "Can I invite friends without an account?",
    a: "Yes — they join via link, no signup required.",
  },
  {
    q: "What if plans change after booking?",
    a: "Edit anytime. Squad gets notified and the itinerary regenerates automatically.",
  },
  {
    q: "Can I export my itinerary?",
    a: "Yes — PDF, WhatsApp share, calendar sync, and public trip links.",
  },
  {
    q: "Does everyone need the app?",
    a: "No — only the organizer needs an account. Others vote via link.",
  },
  {
    q: "Can I use VOYAQ for family trips?",
    a: "Yes — age gates and parent consent flows are built in.",
  },
  {
    q: "Is my trip data private?",
    a: "Yes — your data is encrypted and never sold. You own it.",
  },
  {
    q: "Can I plan international trips?",
    a: "Yes — works anywhere. Currency auto-converts.",
  },
];

export function FAQ() {
  return (
    <div className="space-y-3 pt-4">
      {faqs.map((faq, i) => (
        <motion.div
          key={faq.q}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
          className="border border-ink/10 rounded-[10px] p-4 bg-white"
        >
          <p className="font-heading text-sm font-bold text-ink">{faq.q}</p>
          <p className="font-heading text-sm text-ink-light mt-1.5 leading-relaxed">{faq.a}</p>
        </motion.div>
      ))}
    </div>
  );
}
