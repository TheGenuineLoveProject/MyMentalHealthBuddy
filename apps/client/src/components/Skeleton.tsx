/**
 * Skeleton Component
 * Loading placeholder skeletons
 */

import { ReactNode } from 'react';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  className?: string;
  'data-testid'?: string;
}

export function Skeleton({
  width,
  height,
  variant = 'text',
  className = '',
  'data-testid': testId,
}: SkeletonProps) {
  const variants = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg',
  };

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 ${variants[variant]} ${className}`}
      style={style}
      data-testid={testId}
    />
  );
}

/**
 * Skeleton wrapper for content
 */
interface SkeletonWrapperProps {
  loading: boolean;
  children: ReactNode;
  skeleton: ReactNode;
  'data-testid'?: string;
}

export function SkeletonWrapper({
  loading,
  children,
  skeleton,
  'data-testid': testId,
}: SkeletonWrapperProps) {
  return (
    <div data-testid={testId}>
      {loading ? skeleton : children}
    </div>
  );
}

/**
 * Pre-built skeleton layouts
 */
export const SkeletonLayouts = {
  Card: () => (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-4">
      <Skeleton width="60%" height={24} />
      <Skeleton width="100%" height={16} />
      <Skeleton width="100%" height={16} />
      <Skeleton width="80%" height={16} />
    </div>
  ),

  Avatar: () => (
    <div className="flex items-center gap-3">
      <Skeleton variant="circular" width={40} height={40} />
      <div className="space-y-2 flex-1">
        <Skeleton width="120px" height={16} />
        <Skeleton width="80px" height={14} />
      </div>
    </div>
  ),

  List: ({ items = 3 }: { items?: number }) => (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <Skeleton variant="circular" width={48} height={48} />
          <div className="flex-1 space-y-2">
            <Skeleton width="40%" height={16} />
            <Skeleton width="60%" height={14} />
          </div>
        </div>
      ))}
    </div>
  ),

  Table: ({ rows = 5 }: { rows?: number }) => (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <Skeleton width="80%" height={16} />
        <Skeleton width="80%" height={16} />
        <Skeleton width="80%" height={16} />
        <Skeleton width="80%" height={16} />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="grid grid-cols-4 gap-4 p-4 border-t border-gray-200 dark:border-gray-700">
          <Skeleton width="70%" height={14} />
          <Skeleton width="70%" height={14} />
          <Skeleton width="70%" height={14} />
          <Skeleton width="70%" height={14} />
        </div>
      ))}
    </div>
  ),

  Form: () => (
    <div className="space-y-4">
      <div>
        <Skeleton width="100px" height={14} className="mb-2" />
        <Skeleton width="100%" height={40} variant="rounded" />
      </div>
      <div>
        <Skeleton width="120px" height={14} className="mb-2" />
        <Skeleton width="100%" height={40} variant="rounded" />
      </div>
      <div>
        <Skeleton width="80px" height={14} className="mb-2" />
        <Skeleton width="100%" height={120} variant="rounded" />
      </div>
      <Skeleton width="120px" height={40} variant="rounded" />
    </div>
  ),
};
