import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * Workspace route group layout — server component.
 * Provides default metadata for all /workspace/[id] routes.
 * Individual squad names are known only at runtime so we set a sensible
 * default title that renders correctly even before the client loads squad data.
 */
export const metadata: Metadata = {
  title: "Squad Workspace",
  description: "Plan your group trip — vote on destinations, align budgets, and lock dates with your squad.",
  robots: { index: false, follow: false },
};

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
