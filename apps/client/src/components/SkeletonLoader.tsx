/**
 * Skeleton Loader Components
 * Provide visual feedback while content is loading
 */

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export function Skeleton({
  className = '',
  width,
  height,
  variant = 'rectangular',
}: SkeletonProps) {
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const style = {
    ...(width && { width }),
    ...(height && { height }),
  };

  return (
    <div
      className={`bg-gray-200 dark:bg-gray-700 animate-pulse ${variantClasses[variant]} ${className}`}
      style={style}
      data-testid="skeleton-loader"
    />
  );
}

// Card Skeleton
export function SkeletonCard({ count = 1 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-4">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="40%" />
        </div>
      ))}
    </>
  );
}

// List Skeleton
export function SkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton variant="circular" width="48px" height="48px" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="70%" />
            <Skeleton variant="text" width="40%" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Table Skeleton
export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} variant="text" height="40px" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton key={colIndex} variant="text" height="24px" />
          ))}
        </div>
      ))}
    </div>
  );
}

// Stats Dashboard Skeleton
export function SkeletonStats({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-3">
          <Skeleton variant="text" width="50%" height="16px" />
          <Skeleton variant="text" width="70%" height="32px" />
          <Skeleton variant="text" width="40%" height="12px" />
        </div>
      ))}
    </div>
  );
}

// Chart Skeleton
export function SkeletonChart() {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <Skeleton variant="text" width="30%" height="24px" className="mb-4" />
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-end gap-2" style={{ height: '200px' }}>
            {Array.from({ length: 7 }).map((_, j) => (
              <Skeleton
                key={j}
                variant="rectangular"
                className="flex-1"
                height={`${Math.random() * 60 + 40}%`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Page Skeleton
export function SkeletonPage() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <Skeleton variant="text" width="40%" height="48px" />
        <Skeleton variant="text" width="60%" height="24px" />
      </div>

      {/* Stats */}
      <SkeletonStats />

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SkeletonCard count={3} />
        </div>
        <div>
          <SkeletonList count={5} />
        </div>
      </div>
    </div>
  );
}
