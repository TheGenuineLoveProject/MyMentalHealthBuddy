/**
 * Enhanced Skeleton Loading States
 * Beautiful skeleton screens with pulse animation
 */

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700';
  
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  };

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
      role="status"
      aria-label="Loading content"
      aria-live="polite"
    />
  );
}

/**
 * Pre-built skeleton patterns
 */
export function SkeletonCard() {
  return (
    <div className="p-6 border rounded-lg bg-white dark:bg-gray-800 space-y-4" data-testid="skeleton-card">
      <Skeleton variant="text" width="60%" height={24} />
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width="80%" />
      <div className="flex gap-2 mt-4">
        <Skeleton variant="rounded" width={80} height={32} />
        <Skeleton variant="rounded" width={80} height={32} />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3" data-testid="skeleton-list">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-4 border rounded-lg">
          <Skeleton variant="circular" width={48} height={48} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="70%" />
            <Skeleton variant="text" width="50%" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="overflow-x-auto" data-testid="skeleton-table">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="p-3 text-left">
                <Skeleton variant="text" width="80%" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <tr key={rowIdx} className="border-b">
              {Array.from({ length: cols }).map((_, colIdx) => (
                <td key={colIdx} className="p-3">
                  <Skeleton variant="text" width="90%" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SkeletonStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" data-testid="skeleton-stats">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="p-6 border rounded-lg bg-white dark:bg-gray-800">
          <Skeleton variant="text" width="50%" height={16} className="mb-2" />
          <Skeleton variant="text" width="70%" height={32} />
        </div>
      ))}
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="p-6 border rounded-lg bg-white dark:bg-gray-800" data-testid="skeleton-chart">
      <Skeleton variant="text" width="40%" height={24} className="mb-4" />
      <div className="flex items-end gap-2 h-48">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            width="100%"
            height={`${Math.random() * 80 + 20}%`}
          />
        ))}
      </div>
    </div>
  );
}

export function SkeletonAvatar({ size = 48 }: { size?: number }) {
  return (
    <Skeleton
      variant="circular"
      width={size}
      height={size}
      data-testid="skeleton-avatar"
    />
  );
}

export function SkeletonPage() {
  return (
    <div className="space-y-6" data-testid="skeleton-page">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton variant="text" width="30%" height={32} />
        <Skeleton variant="text" width="50%" height={20} />
      </div>
      
      {/* Stats */}
      <SkeletonStats />
      
      {/* Chart */}
      <SkeletonChart />
      
      {/* List */}
      <SkeletonList count={5} />
    </div>
  );
}
