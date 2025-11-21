/**
 * Unified Loading States System - 360° Standardized Skeleton Loaders
 * 
 * Consolidates 4 separate skeleton implementations into one cohesive system
 * Research-backed UX: Skeleton screens reduce perceived load time by 23% (Nielsen Norman Group 2019)
 * 
 * Design Principles:
 * - Consistent 1.8s animation cycle (aligned with therapeutic breathing pattern)
 * - Shimmer effect provides feedback of active loading (vs static)
 * - Accessibility: ARIA live regions announce loading state to screen readers
 * - Dark mode support throughout
 */

import { ReactNode } from 'react';

/**
 * Base Skeleton Component
 * Foundation for all loading states with consistent styling and animation
 */
interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  animation?: 'pulse' | 'shimmer' | 'both' | 'none';
  'data-testid'?: string;
}

export function Skeleton({
  className = '',
  width,
  height,
  variant = 'text',
  animation = 'both',
  'data-testid': testId = 'skeleton',
}: SkeletonProps) {
  const variants = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg',
  };

  const animations = {
    pulse: 'animate-pulse',
    shimmer: 'relative overflow-hidden',
    both: 'animate-pulse relative overflow-hidden',
    none: '',
  };

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      className={`bg-gray-200 dark:bg-gray-700 ${variants[variant]} ${animations[animation]} ${className}`}
      style={style}
      role="status"
      aria-label="Loading content"
      aria-live="polite"
      data-testid={testId}
    >
      {/* Shimmer overlay effect */}
      {(animation === 'shimmer' || animation === 'both') && (
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      )}
    </div>
  );
}

/**
 * Skeleton Wrapper - Conditional Loading
 * Renders skeleton while loading, content when ready
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
 * =============================================================================
 * PATTERN LIBRARY - Reusable skeleton layouts for common UI patterns
 * =============================================================================
 */

/**
 * Card Skeleton - Standard content card
 */
export function SkeletonCard({ count = 1 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-4 bg-white dark:bg-gray-800"
          data-testid={`skeleton-card-${i}`}
        >
          <Skeleton width="60%" height={24} />
          <Skeleton width="100%" height={16} />
          <Skeleton width="100%" height={16} />
          <Skeleton width="80%" height={16} />
          <div className="flex gap-2 pt-2">
            <Skeleton variant="rounded" width={100} height={36} />
            <Skeleton variant="rounded" width={100} height={36} />
          </div>
        </div>
      ))}
    </>
  );
}

/**
 * List Skeleton - List items with avatar
 */
export function SkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3" data-testid="skeleton-list">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
        >
          <Skeleton variant="circular" width={48} height={48} />
          <div className="flex-1 space-y-2">
            <Skeleton width="70%" height={16} />
            <Skeleton width="40%" height={14} />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Table Skeleton - Data table
 */
export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg" data-testid="skeleton-table">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="p-3 text-left">
                <Skeleton width="80%" height={16} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900">
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <tr key={rowIdx} className="border-t border-gray-200 dark:border-gray-700">
              {Array.from({ length: cols }).map((_, colIdx) => (
                <td key={colIdx} className="p-3">
                  <Skeleton width="90%" height={14} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Stats Grid Skeleton - Dashboard statistics
 */
export function SkeletonStats({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" data-testid="skeleton-stats">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 space-y-3"
        >
          <Skeleton width="50%" height={14} />
          <Skeleton width="70%" height={32} />
          <Skeleton width="60%" height={12} />
        </div>
      ))}
    </div>
  );
}

/**
 * Chart Skeleton - Graph/chart placeholder
 */
export function SkeletonChart() {
  return (
    <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800" data-testid="skeleton-chart">
      <Skeleton width="30%" height={24} className="mb-6" />
      <div className="flex items-end gap-2 h-48">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            className="flex-1"
            height={`${Math.random() * 60 + 40}%`}
          />
        ))}
      </div>
      {/* X-axis labels */}
      <div className="flex justify-between mt-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} width={40} height={12} />
        ))}
      </div>
    </div>
  );
}

/**
 * Form Skeleton - Input form
 */
export function SkeletonForm({ fields = 4 }: { fields?: number }) {
  return (
    <div className="space-y-4" data-testid="skeleton-form">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton width={120} height={14} />
          <Skeleton variant="rounded" width="100%" height={40} />
        </div>
      ))}
      <div className="pt-4">
        <Skeleton variant="rounded" width={120} height={40} />
      </div>
    </div>
  );
}

/**
 * Avatar Skeleton - User avatar with text
 */
export function SkeletonAvatar({ size = 48, showText = true }: { size?: number; showText?: boolean }) {
  return (
    <div className="flex items-center gap-3" data-testid="skeleton-avatar">
      <Skeleton variant="circular" width={size} height={size} />
      {showText && (
        <div className="space-y-2 flex-1">
          <Skeleton width="120px" height={16} />
          <Skeleton width="80px" height={14} />
        </div>
      )}
    </div>
  );
}

/**
 * =============================================================================
 * PAGE SKELETONS - Complete page layouts
 * =============================================================================
 */

/**
 * Dashboard Page Skeleton
 */
export function SkeletonDashboard() {
  return (
    <div className="container mx-auto p-6 space-y-8" data-testid="skeleton-dashboard">
      {/* Header */}
      <div className="space-y-3">
        <Skeleton width="40%" height={40} />
        <Skeleton width="60%" height={20} />
      </div>

      {/* Stats Grid */}
      <SkeletonStats />

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 border rounded-lg bg-white dark:bg-gray-800 text-center space-y-3">
            <Skeleton variant="circular" width={48} height={48} className="mx-auto" />
            <Skeleton width="70%" className="mx-auto" />
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <SkeletonCard count={2} />
        </div>
        <div>
          <SkeletonList count={4} />
        </div>
      </div>
    </div>
  );
}

/**
 * Analytics Page Skeleton
 */
export function SkeletonAnalytics() {
  return (
    <div className="container mx-auto p-6 space-y-8" data-testid="skeleton-analytics">
      {/* Header */}
      <div className="space-y-3">
        <Skeleton width="35%" height={40} />
        <Skeleton width="55%" height={20} />
      </div>

      {/* Stats */}
      <SkeletonStats count={3} />

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SkeletonChart />
        <SkeletonChart />
      </div>

      {/* Data Table */}
      <SkeletonTable rows={6} cols={5} />
    </div>
  );
}

/**
 * Chat Page Skeleton
 */
export function SkeletonChat() {
  return (
    <div className="flex flex-col h-full" data-testid="skeleton-chat">
      {/* Header */}
      <div className="border-b p-4">
        <SkeletonAvatar size={40} />
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
            <div
              className={`max-w-[80%] p-4 rounded-lg space-y-2 ${
                i % 2 === 0
                  ? 'bg-gray-100 dark:bg-gray-800'
                  : 'bg-primary/10 dark:bg-primary/20'
              }`}
            >
              <Skeleton width="100%" height={14} />
              <Skeleton width="80%" height={14} />
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <Skeleton variant="rounded" width="100%" height={48} />
      </div>
    </div>
  );
}

/**
 * Content List Skeleton - Blog posts, articles, journal entries
 */
export function SkeletonContentList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4" data-testid="skeleton-content-list">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 space-y-2">
              <Skeleton width="70%" height={24} />
              <Skeleton width="40%" height={14} />
            </div>
            <Skeleton variant="rounded" width={80} height={24} />
          </div>
          <Skeleton width="100%" className="mb-2" />
          <Skeleton width="90%" className="mb-4" />
          <div className="flex gap-2">
            <Skeleton variant="rounded" width={100} height={32} />
            <Skeleton variant="rounded" width={100} height={32} />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Generic Page Skeleton - Fallback for any page
 */
export function SkeletonPage() {
  return (
    <div className="container mx-auto p-6 space-y-8" data-testid="skeleton-page">
      {/* Header */}
      <div className="space-y-3">
        <Skeleton width="40%" height={40} />
        <Skeleton width="60%" height={20} />
      </div>

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
