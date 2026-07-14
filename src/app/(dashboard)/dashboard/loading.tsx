export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="w-48 h-8 shimmer rounded" />
        <div className="w-40 h-12 shimmer rounded-bruted" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="border-[3px] border-ink/10 rounded-[16px] bg-white p-5 space-y-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="w-3/4 h-5 shimmer rounded" />
                <div className="w-1/2 h-4 shimmer rounded" />
              </div>
              <div className="w-16 h-6 shimmer rounded-full shrink-0" />
            </div>

            <div className="flex items-center gap-2">
              <div className="w-4 h-4 shimmer rounded" />
              <div className="w-24 h-4 shimmer rounded" />
            </div>

            <div className="space-y-1.5">
              <div className="w-full h-2 shimmer rounded-full" />
              <div className="w-16 h-3 shimmer rounded" />
            </div>

            <div className="flex items-center gap-1.5 pt-1">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="w-7 h-7 shimmer rounded-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
