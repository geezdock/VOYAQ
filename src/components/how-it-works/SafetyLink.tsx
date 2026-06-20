"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";

export function SafetyLink() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="border-[2px] border-ink rounded-[16px] p-5 sm:p-6 bg-surface-alt/50 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left"
    >
      <div className="w-12 h-12 rounded-[10px] bg-success/10 border-2 border-success/30 flex items-center justify-center shrink-0">
        <Shield className="w-6 h-6 text-success" />
      </div>
      <div className="flex-1">
        <p className="font-heading text-sm font-bold text-ink">
          Planning with friends?
        </p>
        <p className="font-heading text-sm text-ink-light mt-0.5">
          Wondering how we keep trips safe?
        </p>
      </div>
      <button
        onClick={() => router.push("/safety")}
        className="brut-btn text-xs font-display font-bold uppercase h-10 px-5 shadow-bruted-sm shrink-0"
      >
        Learn About Safety
      </button>
    </motion.div>
  );
}
