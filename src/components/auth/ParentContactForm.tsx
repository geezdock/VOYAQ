"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Smartphone, Mail } from "lucide-react";
import { phoneSchema, emailSchema } from "@/lib/schemas";

interface ParentContactFormProps {
  onSent: (contact: { type: "phone" | "email"; value: string }) => void;
}

export function ParentContactForm({ onSent }: ParentContactFormProps) {
  const [contactType, setContactType] = useState<"phone" | "email">("phone");
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const schema = contactType === "phone" ? phoneSchema : emailSchema;
    const result = schema.safeParse(value);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    onSent({ type: contactType, value });
  }

  const label =
    contactType === "phone"
      ? "Parent's Phone Number"
      : "Parent's Email Address";

  const placeholder =
    contactType === "phone" ? "98765 43210" : "parent@example.com";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <p className="font-heading text-lg font-bold text-ink">
          Parent/Guardian Consent
        </p>
        <p className="font-heading text-sm text-ink-muted">
          Since you&apos;re under 18, we need a guardian to approve your trip.
          Enter their contact details to send a consent request.
        </p>
      </div>

      <div className="flex gap-2 max-sm:flex-col">
        <button
          type="button"
          onClick={() => {
            setContactType("phone");
            setValue("");
            setError(null);
          }}
          className={`flex-1 brut-card !p-3 flex items-center justify-center gap-2 cursor-pointer ${
            contactType === "phone"
              ? "!bg-ink !text-surface-card !border-ink"
              : "!bg-surface-card !text-ink hover:!bg-surface-alt"
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span className="font-heading text-sm font-semibold">Phone</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setContactType("email");
            setValue("");
            setError(null);
          }}
          className={`flex-1 brut-card !p-3 flex items-center justify-center gap-2 cursor-pointer ${
            contactType === "email"
              ? "!bg-ink !text-surface-card !border-ink"
              : "!bg-surface-card !text-ink hover:!bg-surface-alt"
          }`}
        >
          <Mail className="w-4 h-4" />
          <span className="font-heading text-sm font-semibold">Email</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="font-heading text-sm font-semibold text-ink-light uppercase tracking-wider">
            {label}
          </label>
          {contactType === "phone" ? (
            <div className="flex items-stretch">
              <span className="brut-input inline-flex items-center px-3 border-r-0 rounded-r-none bg-clay-light text-ink font-mono text-lg shrink-0">
                +91
              </span>
              <input
                type="tel"
                inputMode="numeric"
                placeholder={placeholder}
                value={value}
                onChange={(e) => {
                  setValue(e.target.value.replace(/\D/g, "").slice(0, 10));
                  setError(null);
                }}
                className="brut-input w-full rounded-l-none font-mono text-lg tracking-widest"
                autoFocus
              />
            </div>
          ) : (
            <input
              type="email"
              placeholder={placeholder}
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError(null);
              }}
              className="brut-input w-full font-mono text-base"
              autoFocus
            />
          )}
          {error && (
            <p className="font-mono text-xs text-error mt-1">{error}</p>
          )}
        </div>

        <button type="submit" className="brut-btn w-full text-base">
          Send Consent Request
        </button>
      </form>
    </motion.div>
  );
}
