"use client";

interface HubSkeletonProps {
  count?: number;
}

export function HubSkeleton({ count = 3 }: HubSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="border-2 border-ink/10 rounded-[12px] bg-surface-card p-4 sm:p-5 space-y-3"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2 flex-1">
              <div className="h-5 w-1/3 shimmer rounded-bruted" />
              <div className="h-3 w-1/4 shimmer rounded-bruted" />
            </div>
            <div className="h-4 w-12 shimmer rounded-bruted" />
          </div>
          <div className="h-4 w-full shimmer rounded-bruted" />
          <div className="h-4 w-4/5 shimmer rounded-bruted" />
          <div className="flex items-center gap-2 pt-1">
            <div className="h-6 w-16 shimmer rounded-bruted" />
            <div className="h-6 w-20 shimmer rounded-bruted" />
            <div className="h-6 w-14 shimmer rounded-bruted" />
          </div>
        </div>
      ))}
    </div>
  );
}
