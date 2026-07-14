"use client";

import { motion } from "framer-motion";
import { ShieldAlert, Phone, Hospital, AlertTriangle, ShieldCheck } from "lucide-react";
import type { Advisory, EmergencyInfo } from "@/types/destination";

interface HubSafetyProps {
  advisories: Advisory[];
  emergency: EmergencyInfo;
}

const severityConfig = {
  low: { label: "Info", className: "bg-blue-100 text-blue-700 border-blue-300" },
  medium: { label: "Caution", className: "bg-amber-100 text-amber-700 border-amber-300" },
  high: { label: "Warning", className: "bg-error/10 text-error border-error/30" },
};

export function HubSafety({ advisories, emergency }: HubSafetyProps) {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-[3px] border-ink rounded-[16px] bg-white shadow-bruted-sm overflow-hidden"
      >
        <div className="p-5 border-b border-ink/10 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-ink" />
          <h2 className="font-heading text-sm font-bold text-ink uppercase tracking-wider">Travel Advisories</h2>
        </div>
        {advisories.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <ShieldCheck className="w-8 h-8 text-success mx-auto" />
            <p className="font-heading text-sm font-bold text-success">No Active Advisories</p>
            <p className="font-mono text-xs text-ink-muted">No government travel advisories for this destination</p>
          </div>
        ) : (
          <div className="divide-y divide-ink/10">
            {advisories.map((advisory, i) => {
              const cfg = severityConfig[advisory.severity];
              return (
                <motion.div
                  key={advisory.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="p-4 space-y-2"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-heading text-sm font-bold text-ink">{advisory.title}</h3>
                    <span className={`font-mono text-[10px] font-bold px-2 py-1 rounded-bruted border ${cfg.className} shrink-0`}>
                      {cfg.label}
                    </span>
                  </div>
                  <p className="font-heading text-xs text-ink-muted leading-relaxed">{advisory.description}</p>
                  <div className="flex items-center gap-3 font-mono text-[10px] text-ink-muted">
                    <span>Source: {advisory.source}</span>
                    <span>Updated: {new Date(advisory.date).toLocaleDateString("en-IN")}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="border-2 border-ink/10 rounded-[12px] bg-surface-card overflow-hidden"
      >
        <div className="p-4 border-b border-ink/10 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-error" />
          <h2 className="font-heading text-sm font-bold text-ink uppercase tracking-wider">Emergency Contacts</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-ink/10">
          <div className="bg-surface-card p-4 flex items-center gap-3">
            <Phone className="w-5 h-5 text-error shrink-0" />
            <div>
              <p className="font-mono text-[10px] text-ink-muted uppercase">Police</p>
              <p className="font-heading text-sm font-bold text-ink">{emergency.police}</p>
            </div>
          </div>
          <div className="bg-surface-card p-4 flex items-center gap-3">
            <Phone className="w-5 h-5 text-error shrink-0" />
            <div>
              <p className="font-mono text-[10px] text-ink-muted uppercase">Ambulance</p>
              <p className="font-heading text-sm font-bold text-ink">{emergency.ambulance}</p>
            </div>
          </div>
          <div className="bg-surface-card p-4 flex items-center gap-3">
            <Phone className="w-5 h-5 text-error shrink-0" />
            <div>
              <p className="font-mono text-[10px] text-ink-muted uppercase">Fire</p>
              <p className="font-heading text-sm font-bold text-ink">{emergency.fire}</p>
            </div>
          </div>
          <div className="bg-surface-card p-4 flex items-center gap-3">
            <Hospital className="w-5 h-5 text-error shrink-0" />
            <div>
              <p className="font-mono text-[10px] text-ink-muted uppercase">Hospital</p>
              <p className="font-heading text-sm font-bold text-ink truncate">{emergency.nearestHospital}</p>
            </div>
          </div>
          <div className="bg-surface-card p-4 flex items-center gap-3 sm:col-span-2">
            <Phone className="w-5 h-5 text-accent shrink-0" />
            <div>
              <p className="font-mono text-[10px] text-ink-muted uppercase">Tourist Helpline</p>
              <p className="font-heading text-sm font-bold text-ink">{emergency.touristHelpline}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
