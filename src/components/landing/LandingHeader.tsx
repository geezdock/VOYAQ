"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "How it Works", href: "/how-it-works" },
  { label: "Safety", href: "/safety" },
];

export function LandingHeader() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="relative flex items-center justify-between border-2 border-ink rounded-bruted-lg bg-surface-card px-3 sm:px-6 py-2 sm:py-3 shadow-bruted max-w-[1200px] mx-auto w-full">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-6 h-6 sm:w-7 sm:h-7 bg-ink rounded-bruted flex items-center justify-center shrink-0">
          <svg viewBox="0 0 48 48" fill="none" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-surface">
            <path
              d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <h2 className="font-display text-base sm:text-xl font-extrabold tracking-tight text-ink">
          VOYAQ
        </h2>
      </div>

      <nav className="hidden md:flex items-center gap-6">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="font-heading text-sm font-semibold text-ink-muted hover:text-ink transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="hidden md:flex items-center gap-1 sm:gap-3">
        <button
          onClick={() => router.push("/auth?mode=login")}
          className="font-heading text-[12px] sm:text-sm font-semibold text-ink-muted hover:text-ink transition-colors px-2 sm:px-4 py-1.5 sm:py-2"
        >
          Login
        </button>

        <button
          onClick={() => router.push("/auth?mode=get-started")}
          className="rounded-bruted border-2 border-ink bg-gradient-to-r from-accent to-accent-dark text-surface font-display text-[11px] sm:text-sm font-bold uppercase tracking-wide px-3 sm:px-5 py-1.5 sm:py-2 shadow-bruted-sm hover:shadow-bruted hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
        >
          Get Started
        </button>
      </div>

      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label="Toggle menu"
      >
        {mobileOpen ? (
          <X className="w-5 h-5 text-ink" />
        ) : (
          <Menu className="w-5 h-5 text-ink" />
        )}
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 border-2 border-ink rounded-bruted-lg bg-surface-card shadow-bruted-lg p-4 z-50 md:hidden"
          >
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-heading text-sm font-semibold text-ink-muted hover:text-ink transition-colors py-3 border-b border-ink/10 last:border-0"
                >
                  {link.label}
                </Link>
              ))}

              <div className="flex flex-col gap-2 pt-2 border-t border-ink/10">
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    router.push("/auth?mode=login");
                  }}
                  className="font-heading text-sm font-semibold text-ink-muted hover:text-ink transition-colors py-3"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    router.push("/auth?mode=get-started");
                  }}
                  className="rounded-bruted border-2 border-ink bg-gradient-to-r from-accent to-accent-dark text-surface font-display text-sm font-bold uppercase tracking-wide px-5 py-3 shadow-bruted-sm"
                >
                  Get Started
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
}
