"use client";

import { ReactNode } from "react";
import { DashboardNav } from "./DashboardNav";
import { UserAvatarDropdown } from "./UserAvatarDropdown";

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b-2 border-ink bg-surface-card">
        <div className="max-w-6xl mx-auto px-4 py-0 flex items-center justify-between h-16">
          <span className="font-display text-xl font-bold text-ink">VOYAQ</span>
          <UserAvatarDropdown />
        </div>
      </header>

      <DashboardNav />

      <main className="max-w-6xl mx-auto px-4 py-8 pb-24 md:pb-8">
        {children}
      </main>
    </div>
  );
}
