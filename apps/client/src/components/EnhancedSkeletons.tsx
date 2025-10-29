/**
 * Enhanced Skeleton Loaders - 360° Optimization
 * Provides smooth, content-aware loading states for better UX
 */

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export function Skeleton({ className = '', width, height, variant = 'text' }: SkeletonProps) {
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md'
  };

  const style = {
    width: width || (variant === 'circular' ? height : '100%'),
    height: height || (variant === 'text' ? '1rem' : '100%')
  };

  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 ${variantClasses[variant]} ${className}`}
      style={style}
      aria-hidden="true"
      data-testid="skeleton"
    >
      <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
    </div>
  );
}

// Dashboard Skeleton
export function DashboardSkeleton() {
  return (
    <div className="space-y-6" data-testid="dashboard-skeleton">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <Skeleton width="60%" height="1rem" className="mb-2" />
            <Skeleton width="40%" height="2rem" />
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <Skeleton variant="circular" height="48px" width="48px" className="mx-auto mb-3" />
            <Skeleton width="80%" className="mx-auto mb-2" />
            <Skeleton width="60%" height="0.75rem" className="mx-auto" />
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <Skeleton width="200px" height="1.5rem" className="mb-4" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton variant="circular" height="40px" width="40px" />
              <div className="flex-1">
                <Skeleton width="70%" className="mb-2" />
                <Skeleton width="40%" height="0.75rem" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Content List Skeleton
export function ContentListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4" data-testid="content-list-skeleton">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <Skeleton width="70%" height="1.5rem" className="mb-2" />
              <Skeleton width="40%" height="0.875rem" />
            </div>
            <Skeleton variant="rectangular" width="80px" height="24px" />
          </div>
          <Skeleton width="100%" className="mb-2" />
          <Skeleton width="90%" className="mb-4" />
          <div className="flex gap-2">
            <Skeleton variant="rectangular" width="100px" height="32px" />
            <Skeleton variant="rectangular" width="100px" height="32px" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Analytics Skeleton
export function AnalyticsSkeleton() {
  return (
    <div className="space-y-6" data-testid="analytics-skeleton">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <Skeleton width="50%" className="mb-2" />
            <Skeleton width="40%" height="2rem" className="mb-1" />
            <Skeleton width="60%" height="0.75rem" />
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <Skeleton width="200px" height="1.5rem" className="mb-6" />
        <Skeleton variant="rectangular" width="100%" height="300px" />
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <Skeleton width="150px" height="1.5rem" className="mb-4" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton width="30%" />
              <Skeleton width="20%" />
              <Skeleton width="15%" />
              <Skeleton width="25%" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Chat Skeleton
export function ChatSkeleton() {
  return (
    <div className="flex flex-col h-full" data-testid="chat-skeleton">
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {[...Array(4)].map((_, i) => (
          <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[80%] p-4 rounded-lg ${i % 2 === 0 ? 'bg-gray-100 dark:bg-gray-800' : 'bg-blue-100 dark:bg-blue-900'}`}>
              <Skeleton width="100%" className="mb-2" />
              <Skeleton width="80%" />
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t">
        <Skeleton variant="rectangular" width="100%" height="48px" />
      </div>
    </div>
  );
}

// Form Skeleton
export function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <div className="space-y-4" data-testid="form-skeleton">
      {[...Array(fields)].map((_, i) => (
        <div key={i}>
          <Skeleton width="120px" height="1rem" className="mb-2" />
          <Skeleton variant="rectangular" width="100%" height="40px" />
        </div>
      ))}
      <Skeleton variant="rectangular" width="120px" height="40px" className="mt-6" />
    </div>
  );
}

// Add shimmer animation to global CSS
export const skeletonStyles = `
  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }

  .animate-shimmer {
    animation: shimmer 2s infinite;
  }
`;
