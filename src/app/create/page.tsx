"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Users,
  MapPin,
  DollarSign,
  Calendar,
  PartyPopper,
} from "lucide-react";
import { useSquad } from "@/lib/SquadContext";
import type { Squad } from "@/types/squad";

type Step = "name" | "members" | "budget" | "dates" | "review";

interface FormData {
  name: string;
  destination: string;
  memberLimit: number;
  budgetPerPerson: number;
  startDate: string;
  endDate: string;
}

const steps: { id: Step; label: string; icon: typeof Users }[] = [
  { id: "name", label: "Name", icon: MapPin },
  { id: "members", label: "Members", icon: Users },
  { id: "budget", label: "Budget", icon: DollarSign },
  { id: "dates", label: "Dates", icon: Calendar },
  { id: "review", label: "Review", icon: PartyPopper },
];

export default function CreateSquadPage() {
  const router = useRouter();
  const { addSquad } = useSquad();
  const [step, setStep] = useState<Step>("name");
  const stepIndex = steps.findIndex((s) => s.id === step);

  const [form, setForm] = useState<FormData>({
    name: "",
    destination: "",
    memberLimit: 8,
    budgetPerPerson: 5000,
    startDate: "",
    endDate: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [animDir, setAnimDir] = useState<1 | -1>(1);

  function update(field: keyof FormData, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validateStep(s: Step): boolean {
    const next: Partial<Record<keyof FormData, string>> = {};
    if (s === "name") {
      if (!form.name.trim()) next.name = "Enter a squad name";
    }
    if (s === "members") {
      if (form.memberLimit < 2) next.memberLimit = "At least 2 members needed";
    }
    if (s === "budget") {
      if (form.budgetPerPerson < 100) next.budgetPerPerson = "Budget must be at least ₹100";
    }
    if (s === "dates") {
      if (!form.startDate) next.startDate = "Pick a start date";
      if (!form.endDate) next.endDate = "Pick an end date";
      if (form.startDate && form.endDate && new Date(form.endDate) <= new Date(form.startDate)) {
        next.endDate = "End must be after start";
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function goNext() {
    if (!validateStep(step)) return;
    const idx = steps.findIndex((s) => s.id === step);
    if (idx < steps.length - 1) {
      setAnimDir(1);
      setStep(steps[idx + 1].id);
    }
  }

  function goBack() {
    const idx = steps.findIndex((s) => s.id === step);
    if (idx > 0) {
      setAnimDir(-1);
      setStep(steps[idx - 1].id);
    } else {
      router.push("/dashboard");
    }
  }

  function handleCreate() {
    if (!validateStep(step)) return;

    const inviteCode = form.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const newSquad: Squad = {
      id: `squad-${Date.now()}`,
      name: form.name.trim(),
      inviteCode: `${inviteCode}-${Math.random().toString(36).slice(2, 6)}`,
      createdBy: "me",
      destination: form.destination.trim() || undefined,
      destinations: form.destination.trim() ? [form.destination.trim()] : [],
      members: [
        {
          id: "me",
          name: "You",
          initial: "Y",
          color: "bg-accent",
          verified: true,
          joinedAt: new Date().toISOString(),
        },
      ],
      memberLimit: form.memberLimit,
      votes: [],
      budgetPerPerson: form.budgetPerPerson,
      budgetPreferences: [],
      dateProposals: form.startDate && form.endDate
        ? [
            {
              id: `dp-${Date.now()}`,
              startDate: form.startDate,
              endDate: form.endDate,
              proposedBy: "me",
              votes: ["me"],
              createdAt: new Date().toISOString(),
            },
          ]
        : [],
      polls: [],
      status: "planning",
      createdAt: new Date().toISOString(),
    };

    addSquad(newSquad);
    router.push(`/workspace/${newSquad.id}`);
  }

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir * 40 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir * -40 }),
  };

  return (
    <div className="min-h-screen">
      <header className="border-b-2 border-ink bg-surface-card">
        <div className="max-w-2xl mx-auto px-4 py-0 flex items-center h-16">
          <button
            onClick={goBack}
            className="flex items-center gap-1.5 font-heading text-sm font-semibold text-ink-muted hover:text-ink transition-colors min-h-[44px] py-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {stepIndex === 0 ? "Dashboard" : "Back"}
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {steps.map((s, i) => {
            const isActive = step === s.id;
            const isDone = stepIndex > i;
            const Icon = s.icon;
            return (
              <div key={s.id} className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-bruted border-2 transition-all ${
                    isActive
                      ? "border-accent bg-accent/10 text-accent"
                      : isDone
                      ? "border-success bg-success/10 text-success"
                      : "border-ink/15 text-ink-muted"
                  }`}
                >
                  {isDone ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Icon className="w-3.5 h-3.5" />
                  )}
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider hidden sm:inline">
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`w-6 h-[2px] ${
                      isDone ? "bg-success" : "bg-ink/10"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        <AnimatePresence mode="wait" custom={animDir}>
          <motion.div
            key={step}
            custom={animDir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {/* Step: Name */}
            {step === "name" && (
              <div className="space-y-6">
                <div className="text-center">
                  <h1 className="font-display text-3xl font-bold text-ink">
                    Name Your Squad
                  </h1>
                  <p className="font-heading text-sm text-ink-muted mt-2">
                    Give your trip crew a name to rally around
                  </p>
                </div>

                <div className="brut-card space-y-4">
                  <div className="space-y-1">
                    <label className="font-heading text-xs font-semibold text-ink-light uppercase tracking-wider">
                      Squad Name
                    </label>
                    <input
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      className="brut-input w-full text-sm"
                      placeholder="Goa Crew 2026"
                      autoFocus
                    />
                    {errors.name && (
                      <p className="font-mono text-xs text-error">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="font-heading text-xs font-semibold text-ink-light uppercase tracking-wider">
                      Destination <span className="text-ink-muted">(optional)</span>
                    </label>
                    <input
                      value={form.destination}
                      onChange={(e) => update("destination", e.target.value)}
                      className="brut-input w-full text-sm"
                      placeholder="Goa, Manali, Pondicherry..."
                    />
                  </div>

                  <button onClick={goNext} className="brut-btn w-full text-base mt-2">
                    Next — Members
                    <ArrowRight className="w-4 h-4 ml-2 inline" />
                  </button>
                </div>
              </div>
            )}

            {/* Step: Members */}
            {step === "members" && (
              <div className="space-y-6">
                <div className="text-center">
                  <h1 className="font-display text-3xl font-bold text-ink">
                    Set Member Limit
                  </h1>
                  <p className="font-heading text-sm text-ink-muted mt-2">
                    How many people can join this squad?
                  </p>
                </div>

                <div className="brut-card space-y-6">
                  <div className="flex items-center justify-center gap-6">
                    <button
                      onClick={() => update("memberLimit", Math.max(2, form.memberLimit - 1))}
                      className="w-12 h-12 rounded-bruted border-2 border-ink flex items-center justify-center font-display text-2xl font-bold text-ink hover:bg-surface-alt transition-colors"
                    >
                      −
                    </button>
                    <div className="text-center">
                      <span className="font-display text-5xl font-extrabold text-ink tabular-nums">
                        {form.memberLimit}
                      </span>
                      <p className="font-mono text-xs text-ink-muted mt-1">members</p>
                    </div>
                    <button
                      onClick={() => update("memberLimit", Math.min(20, form.memberLimit + 1))}
                      className="w-12 h-12 rounded-bruted border-2 border-ink flex items-center justify-center font-display text-2xl font-bold text-ink hover:bg-surface-alt transition-colors"
                    >
                      +
                    </button>
                  </div>

                  {errors.memberLimit && (
                    <p className="font-mono text-xs text-error text-center">{errors.memberLimit}</p>
                  )}

                  <div className="flex justify-between font-mono text-xs text-ink-muted">
                    <span>Min: 2</span>
                    <span>Max: 20</span>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={goBack} className="flex-1 brut-btn text-sm !bg-surface-card !text-ink !shadow-bruted-sm hover:!shadow-bruted">
                      Back
                    </button>
                    <button onClick={goNext} className="flex-1 brut-btn text-sm">
                      Next — Budget
                      <ArrowRight className="w-4 h-4 ml-2 inline" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step: Budget */}
            {step === "budget" && (
              <div className="space-y-6">
                <div className="text-center">
                  <h1 className="font-display text-3xl font-bold text-ink">
                    Set a Budget
                  </h1>
                  <p className="font-heading text-sm text-ink-muted mt-2">
                    Approximate per-person budget for this trip
                  </p>
                </div>

                <div className="brut-card space-y-6">
                  <div className="text-center">
                    <span className="font-display text-5xl font-extrabold text-ink tabular-nums">
                      ₹{form.budgetPerPerson.toLocaleString("en-IN")}
                    </span>
                    <p className="font-mono text-xs text-ink-muted mt-1">per person</p>
                  </div>

                  <input
                    type="range"
                    min={500}
                    max={100000}
                    step={500}
                    value={form.budgetPerPerson}
                    onChange={(e) => update("budgetPerPerson", Number(e.target.value))}
                    className="w-full accent-accent"
                  />

                  <div className="flex justify-between font-mono text-xs text-ink-muted">
                    <span>₹500</span>
                    <span>₹1L</span>
                  </div>

                  {errors.budgetPerPerson && (
                    <p className="font-mono text-xs text-error text-center">{errors.budgetPerPerson}</p>
                  )}

                  <div className="flex gap-3">
                    <button onClick={goBack} className="flex-1 brut-btn text-sm !bg-surface-card !text-ink !shadow-bruted-sm hover:!shadow-bruted">
                      Back
                    </button>
                    <button onClick={goNext} className="flex-1 brut-btn text-sm">
                      Next — Dates
                      <ArrowRight className="w-4 h-4 ml-2 inline" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step: Dates */}
            {step === "dates" && (
              <div className="space-y-6">
                <div className="text-center">
                  <h1 className="font-display text-3xl font-bold text-ink">
                    Pick Dates
                  </h1>
                  <p className="font-heading text-sm text-ink-muted mt-2">
                    When are you planning to go?
                  </p>
                </div>

                <div className="brut-card space-y-4">
                  <div className="space-y-1">
                    <label className="font-heading text-xs font-semibold text-ink-light uppercase tracking-wider">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={form.startDate}
                      onChange={(e) => update("startDate", e.target.value)}
                      className="brut-input w-full text-sm"
                    />
                    {errors.startDate && (
                      <p className="font-mono text-xs text-error">{errors.startDate}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="font-heading text-xs font-semibold text-ink-light uppercase tracking-wider">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={form.endDate}
                      onChange={(e) => update("endDate", e.target.value)}
                      className="brut-input w-full text-sm"
                    />
                    {errors.endDate && (
                      <p className="font-mono text-xs text-error">{errors.endDate}</p>
                    )}
                  </div>

                  {form.startDate && form.endDate && new Date(form.endDate) > new Date(form.startDate) && (
                    <p className="font-mono text-xs text-ink-muted text-center">
                      {Math.round((new Date(form.endDate).getTime() - new Date(form.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} day trip
                    </p>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button onClick={goBack} className="flex-1 brut-btn text-sm !bg-surface-card !text-ink !shadow-bruted-sm hover:!shadow-bruted">
                      Back
                    </button>
                    <button onClick={goNext} className="flex-1 brut-btn text-sm">
                      Review Squad
                      <ArrowRight className="w-4 h-4 ml-2 inline" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step: Review */}
            {step === "review" && (
              <div className="space-y-6">
                <div className="text-center">
                  <h1 className="font-display text-3xl font-bold text-ink">
                    Ready to Launch
                  </h1>
                  <p className="font-heading text-sm text-ink-muted mt-2">
                    Here&apos;s your squad setup — tweak or launch it
                  </p>
                </div>

                <div className="brut-card space-y-4">
                  {[
                    { label: "Squad Name", value: form.name },
                    { label: "Destination", value: form.destination || "Not set" },
                    { label: "Member Limit", value: `${form.memberLimit}` },
                    { label: "Budget", value: `₹${form.budgetPerPerson.toLocaleString("en-IN")}/person` },
                    { label: "Dates", value: form.startDate && form.endDate ? `${form.startDate} → ${form.endDate}` : "Not set" },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between border-b border-ink/10 pb-3 last:border-0 last:pb-0">
                      <span className="font-heading text-xs font-semibold text-ink-muted uppercase tracking-wider">
                        {row.label}
                      </span>
                      <span className="font-heading text-sm font-bold text-ink text-right">
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button onClick={goBack} className="flex-1 brut-btn text-sm !bg-surface-card !text-ink !shadow-bruted-sm hover:!shadow-bruted">
                    Edit
                  </button>
                  <button onClick={handleCreate} className="flex-1 brut-btn text-sm flex items-center justify-center gap-2">
                    <PartyPopper className="w-4 h-4" />
                    Launch Squad
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
