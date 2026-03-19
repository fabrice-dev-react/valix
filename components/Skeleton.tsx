export default function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-slate-200 rounded ${className}`} />
  );
}

export function SkeletonCard() {
  return (
    <div className="p-3 md:p-4 rounded-lg border border-slate-200">
      <div className="flex items-center gap-2 mb-3">
        <div className="animate-pulse bg-slate-200 rounded w-16 h-5" />
        <div className="animate-pulse bg-slate-200 rounded w-20 h-5" />
        <div className="animate-pulse bg-slate-200 rounded w-20 h-5" />
      </div>
      <div className="space-y-2 mb-3">
        <div className="animate-pulse bg-slate-200 rounded h-4 w-full" />
        <div className="animate-pulse bg-slate-200 rounded h-4 w-3/4" />
      </div>
      <div className="animate-pulse bg-slate-200 rounded h-16 w-full" />
    </div>
  );
}

export function SkeletonMetricCard() {
  return (
    <div className="bg-white rounded-xl p-4 md:p-6 border border-slate-200">
      <div className="animate-pulse bg-slate-200 rounded h-8 w-16 mb-2" />
      <div className="animate-pulse bg-slate-200 rounded h-4 w-full" />
    </div>
  );
}
