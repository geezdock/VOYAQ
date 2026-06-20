"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Eye, Users, Flag, Check } from "lucide-react";
import { useRouter } from "next/navigation";

const sections = [
  {
    icon: Shield,
    title: "Age Gates & Parent Consent",
    desc: "Minors get a dedicated consent flow. Parent contact is verified before trip creation.",
    items: [
      "Automatic age detection during signup",
      "Parent/guardian contact required for under-18",
      "Consent verification before squad formation",
    ],
  },
  {
    icon: Lock,
    title: "Verified Profiles",
    desc: "Every user is verified via phone or email. No anonymous accounts.",
    items: [
      "Phone number or email verification",
      "Profile photos encouraged but optional",
      "Squad members can see who they're traveling with",
    ],
  },
  {
    icon: Eye,
    title: "Data Privacy & Encryption",
    desc: "Your trip data is encrypted. We never sell your information.",
    items: [
      "End-to-end encryption for trip data",
      "No third-party data sharing",
      "Delete your data anytime — no questions asked",
    ],
  },
  {
    icon: Users,
    title: "Trip Visibility Controls",
    desc: "Choose who sees your trip. Private, squad-only, or public.",
    items: [
      "Private: only you can see",
      "Squad-only: visible to confirmed members",
      "Public: discoverable by anyone with the link",
    ],
  },
  {
    icon: Flag,
    title: "Reporting & Moderation",
    desc: "Flag inappropriate behavior. We take action within 24 hours.",
    items: [
      "One-tap report for any user or trip",
      "Human review within 24 hours",
      "Permanent bans for severe violations",
    ],
  },
];

export function SafetyContent() {
  const router = useRouter();

  return (
    <section className="py-20 sm:py-28 px-4 bg-surface">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-ink uppercase tracking-tight leading-[1.1]">
            Safe trips start with trust.
          </h1>
          <p className="font-heading text-base sm:text-lg text-ink-light mt-4 max-w-md mx-auto">
            We built safety into every step of the planning process.
          </p>
        </motion.div>

        <div className="space-y-6">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="border-[2px] border-ink rounded-[16px] p-5 sm:p-8 bg-white shadow-bruted-lg"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-[10px] bg-accent/10 border-2 border-accent/20 flex items-center justify-center shrink-0">
                  <section.icon className="w-6 h-6 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-lg sm:text-xl font-extrabold text-ink uppercase tracking-tight">
                    {section.title}
                  </h3>
                  <p className="font-heading text-sm text-ink-light mt-1">{section.desc}</p>
                  <ul className="mt-4 space-y-2">
                    {section.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
                        <span className="font-heading text-sm text-ink">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-center mt-12"
        >
          <button
            onClick={() => router.push("/auth")}
            className="brut-btn text-sm font-display font-bold uppercase h-12 px-8 shadow-bruted bg-accent text-white"
          >
            Start a Squad
          </button>
        </motion.div>
      </div>
    </section>
  );
}
