export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-white/[0.06] ${className}`}
      aria-hidden
    />
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative min-h-[420px] w-full overflow-hidden rounded-2xl md:min-h-[480px]">
      <Skeleton className="absolute inset-0 rounded-2xl" />
      <div className="relative z-10 flex h-full flex-col justify-end p-6 md:p-10 lg:w-2/3">
        <Skeleton className="mb-3 h-10 w-3/4 max-w-md" />
        <Skeleton className="mb-6 h-4 w-full max-w-lg" />
        <Skeleton className="h-12 w-40" />
      </div>
    </div>
  );
}

export function TrendingPanelSkeleton() {
  return (
    <div className="glass rounded-2xl p-4">
      <Skeleton className="mb-4 h-5 w-32" />
      <ul className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <li key={i} className="flex gap-3">
            <Skeleton className="h-8 w-6 shrink-0" />
            <Skeleton className="h-4 flex-1" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CardRowSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="flex gap-4 overflow-hidden px-1">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-[200px] w-[320px] shrink-0 md:h-[220px] md:w-[360px]" />
      ))}
    </div>
  );
}

export function MangaCardSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="flex gap-3 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="w-[140px] shrink-0 space-y-2 md:w-[160px]">
          <Skeleton className="aspect-[2/3] w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      ))}
    </div>
  );
}
