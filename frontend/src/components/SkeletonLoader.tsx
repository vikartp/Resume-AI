"use client";

interface SkeletonProps {
  className?: string;
}

function Skeleton({ className = "" }: SkeletonProps) {
  return <div className={`skeleton ${className}`} />;
}

export function CardSkeleton() {
  return (
    <div className="glass rounded-2xl p-5 space-y-4 animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
    </div>
  );
}

export function HistorySkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ResultSkeleton() {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex gap-2">
        <Skeleton className="h-10 w-32 rounded-xl" />
        <Skeleton className="h-10 w-32 rounded-xl" />
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>
      <div className="glass-strong rounded-2xl p-8 space-y-4">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
        <Skeleton className="h-20 w-full rounded-xl mt-4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="animate-fade-in grid lg:grid-cols-2 gap-6 flex-1 min-h-0">
      <div className="flex flex-col gap-5">
        <div className="glass rounded-2xl p-5 flex-1">
          <Skeleton className="h-5 w-32 mb-3" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
        <div className="glass rounded-2xl p-5">
          <Skeleton className="h-5 w-32 mb-3" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="glass rounded-2xl p-5 flex-1">
          <Skeleton className="h-5 w-32 mb-3" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
        <div className="glass rounded-2xl p-5 flex-1">
          <Skeleton className="h-5 w-32 mb-3" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
        <Skeleton className="h-14 w-full rounded-2xl" />
      </div>
    </div>
  );
}

export default Skeleton;
