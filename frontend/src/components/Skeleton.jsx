import React from 'react';

export function SkeletonBlock({ className = '' }) {
  return <div className={`skeleton ${className}`} />;
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-golf-dark p-6">
      {/* Nav */}
      <div className="flex justify-between items-center max-w-7xl mx-auto mb-12">
        <SkeletonBlock className="h-8 w-48" />
        <SkeletonBlock className="h-8 w-24" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Scores card */}
        <div className="glass-card p-6 col-span-2 space-y-4">
          <SkeletonBlock className="h-6 w-1/3 mb-2" />
          <SkeletonBlock className="h-12 w-full" />
          {[...Array(3)].map((_, i) => (
            <SkeletonBlock key={i} className="h-14 w-full" />
          ))}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          <div className="glass-card p-6 space-y-4">
            <SkeletonBlock className="h-6 w-1/2" />
            {[...Array(3)].map((_, i) => (
              <SkeletonBlock key={i} className="h-16 w-full" />
            ))}
          </div>
          <div className="glass-card p-6 space-y-3">
            <SkeletonBlock className="h-6 w-1/3" />
            <SkeletonBlock className="h-10 w-2/3" />
            <SkeletonBlock className="h-2 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-3">
      {[...Array(rows)].map((_, i) => (
        <SkeletonBlock key={i} className={`h-14 w-full delay-${i * 100}`} />
      ))}
    </div>
  );
}
