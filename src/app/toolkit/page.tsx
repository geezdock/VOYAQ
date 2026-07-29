"use client";

import Link from "next/link";
import { ClipboardList, Calculator, DollarSign, ArrowLeft } from "lucide-react";

const tools = [
  {
    title: "Packing Checklist",
    desc: "Build a trip-specific packing list with categories, progress tracking, and custom items.",
    href: "/toolkit/packing",
    icon: ClipboardList,
  },
  {
    title: "Budget Calculator",
    desc: "Estimate trip costs by category. Track estimated vs actual spending.",
    href: "/toolkit/budget-calculator",
    icon: Calculator,
  },
  {
    title: "Currency Converter",
    desc: "Convert INR to common travel currencies using live exchange rates.",
    href: "/toolkit/currency-converter",
    icon: DollarSign,
  },
];

export default function ToolkitPage() {
  return (
    <main className="mx-auto max-w-2xl space-y-8 p-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="flex h-10 w-10 items-center justify-center rounded-bruted border-2 border-ink/10 transition-colors hover:bg-ink/5"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Toolkit</h1>
          <p className="text-ink-muted text-sm">
            Handy utilities for your trip
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group flex items-start gap-5 rounded-bruted border-2 border-ink/10 bg-surface-card p-5 transition-all hover:border-accent hover:shadow-bruted"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-bruted bg-accent/10">
              <tool.icon className="h-6 w-6 text-accent" />
            </div>
            <div className="min-w-0 space-y-1">
              <h2 className="font-bold group-hover:text-accent">{tool.title}</h2>
              <p className="text-ink-muted text-sm leading-snug">{tool.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
