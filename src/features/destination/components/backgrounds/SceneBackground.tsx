import type { ReactNode } from "react";

export function SceneBackground({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMax slice"
      className="w-full h-full"
      fill="none"
    >
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </g>
    </svg>
  );
}
