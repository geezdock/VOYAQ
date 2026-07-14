"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { dashboardNavItems } from "./nav-config";

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <>
      <nav className="hidden md:block border-b-2 border-ink bg-surface-card">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2 overflow-x-auto">
          {dashboardNavItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-bruted border-2 font-heading text-sm font-semibold transition-all whitespace-nowrap",
                  active
                    ? "bg-accent text-surface border-ink shadow-bruted-sm"
                    : "bg-surface-card text-ink-muted border-ink/15 hover:text-ink hover:border-ink/40 hover:bg-surface-alt",
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t-2 border-ink bg-surface-card/95 backdrop-blur-sm">
        <div className="grid grid-cols-3 gap-1 px-2 py-2 pb-[calc(env(safe-area-inset-bottom,0px)+0.5rem)]">
          {dashboardNavItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-h-[44px] flex-col items-center justify-center gap-1 rounded-[12px] border-2 px-1 py-2 font-mono text-[10px] uppercase tracking-wider transition-all",
                  active
                    ? "bg-accent text-surface border-ink"
                    : "bg-surface-card text-ink-muted border-transparent hover:text-ink hover:border-ink/20",
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="w-4 h-4" />
                <span className="truncate max-w-full">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
