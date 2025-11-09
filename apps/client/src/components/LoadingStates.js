import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
export function Skeleton({ className = '', width, height, variant = 'text', animation = 'both', 'data-testid': testId = 'skeleton', }) {
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
    return (_jsx("div", { className: `bg-gray-200 dark:bg-gray-700 ${variants[variant]} ${animations[animation]} ${className}`, style: style, role: "status", "aria-label": "Loading content", "aria-live": "polite", "data-testid": testId, children: (animation === 'shimmer' || animation === 'both') && (_jsx("div", { className: "absolute inset-0 -translate-x-full animate-[shimmer_1.8s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" })) }));
}
export function SkeletonWrapper({ loading, children, skeleton, 'data-testid': testId, }) {
    return (_jsx("div", { "data-testid": testId, children: loading ? skeleton : children }));
}
/**
 * =============================================================================
 * PATTERN LIBRARY - Reusable skeleton layouts for common UI patterns
 * =============================================================================
 */
/**
 * Card Skeleton - Standard content card
 */
export function SkeletonCard({ count = 1 }) {
    return (_jsx(_Fragment, { children: Array.from({ length: count }).map((_, i) => (_jsxs("div", { className: "border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-4 bg-white dark:bg-gray-800", "data-testid": `skeleton-card-${i}`, children: [_jsx(Skeleton, { width: "60%", height: 24 }), _jsx(Skeleton, { width: "100%", height: 16 }), _jsx(Skeleton, { width: "100%", height: 16 }), _jsx(Skeleton, { width: "80%", height: 16 }), _jsxs("div", { className: "flex gap-2 pt-2", children: [_jsx(Skeleton, { variant: "rounded", width: 100, height: 36 }), _jsx(Skeleton, { variant: "rounded", width: 100, height: 36 })] })] }, i))) }));
}
/**
 * List Skeleton - List items with avatar
 */
export function SkeletonList({ count = 5 }) {
    return (_jsx("div", { className: "space-y-3", "data-testid": "skeleton-list", children: Array.from({ length: count }).map((_, i) => (_jsxs("div", { className: "flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800", children: [_jsx(Skeleton, { variant: "circular", width: 48, height: 48 }), _jsxs("div", { className: "flex-1 space-y-2", children: [_jsx(Skeleton, { width: "70%", height: 16 }), _jsx(Skeleton, { width: "40%", height: 14 })] })] }, i))) }));
}
/**
 * Table Skeleton - Data table
 */
export function SkeletonTable({ rows = 5, cols = 4 }) {
    return (_jsx("div", { className: "overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg", "data-testid": "skeleton-table", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-50 dark:bg-gray-800", children: _jsx("tr", { children: Array.from({ length: cols }).map((_, i) => (_jsx("th", { className: "p-3 text-left", children: _jsx(Skeleton, { width: "80%", height: 16 }) }, i))) }) }), _jsx("tbody", { className: "bg-white dark:bg-gray-900", children: Array.from({ length: rows }).map((_, rowIdx) => (_jsx("tr", { className: "border-t border-gray-200 dark:border-gray-700", children: Array.from({ length: cols }).map((_, colIdx) => (_jsx("td", { className: "p-3", children: _jsx(Skeleton, { width: "90%", height: 14 }) }, colIdx))) }, rowIdx))) })] }) }));
}
/**
 * Stats Grid Skeleton - Dashboard statistics
 */
export function SkeletonStats({ count = 4 }) {
    return (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", "data-testid": "skeleton-stats", children: Array.from({ length: count }).map((_, i) => (_jsxs("div", { className: "p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 space-y-3", children: [_jsx(Skeleton, { width: "50%", height: 14 }), _jsx(Skeleton, { width: "70%", height: 32 }), _jsx(Skeleton, { width: "60%", height: 12 })] }, i))) }));
}
/**
 * Chart Skeleton - Graph/chart placeholder
 */
export function SkeletonChart() {
    return (_jsxs("div", { className: "p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800", "data-testid": "skeleton-chart", children: [_jsx(Skeleton, { width: "30%", height: 24, className: "mb-6" }), _jsx("div", { className: "flex items-end gap-2 h-48", children: Array.from({ length: 7 }).map((_, i) => (_jsx(Skeleton, { variant: "rectangular", className: "flex-1", height: `${Math.random() * 60 + 40}%` }, i))) }), _jsx("div", { className: "flex justify-between mt-2", children: Array.from({ length: 7 }).map((_, i) => (_jsx(Skeleton, { width: 40, height: 12 }, i))) })] }));
}
/**
 * Form Skeleton - Input form
 */
export function SkeletonForm({ fields = 4 }) {
    return (_jsxs("div", { className: "space-y-4", "data-testid": "skeleton-form", children: [Array.from({ length: fields }).map((_, i) => (_jsxs("div", { className: "space-y-2", children: [_jsx(Skeleton, { width: 120, height: 14 }), _jsx(Skeleton, { variant: "rounded", width: "100%", height: 40 })] }, i))), _jsx("div", { className: "pt-4", children: _jsx(Skeleton, { variant: "rounded", width: 120, height: 40 }) })] }));
}
/**
 * Avatar Skeleton - User avatar with text
 */
export function SkeletonAvatar({ size = 48, showText = true }) {
    return (_jsxs("div", { className: "flex items-center gap-3", "data-testid": "skeleton-avatar", children: [_jsx(Skeleton, { variant: "circular", width: size, height: size }), showText && (_jsxs("div", { className: "space-y-2 flex-1", children: [_jsx(Skeleton, { width: "120px", height: 16 }), _jsx(Skeleton, { width: "80px", height: 14 })] }))] }));
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
    return (_jsxs("div", { className: "container mx-auto p-6 space-y-8", "data-testid": "skeleton-dashboard", children: [_jsxs("div", { className: "space-y-3", children: [_jsx(Skeleton, { width: "40%", height: 40 }), _jsx(Skeleton, { width: "60%", height: 20 })] }), _jsx(SkeletonStats, {}), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: Array.from({ length: 4 }).map((_, i) => (_jsxs("div", { className: "p-4 border rounded-lg bg-white dark:bg-gray-800 text-center space-y-3", children: [_jsx(Skeleton, { variant: "circular", width: 48, height: 48, className: "mx-auto" }), _jsx(Skeleton, { width: "70%", className: "mx-auto" })] }, i))) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "lg:col-span-2 space-y-4", children: _jsx(SkeletonCard, { count: 2 }) }), _jsx("div", { children: _jsx(SkeletonList, { count: 4 }) })] })] }));
}
/**
 * Analytics Page Skeleton
 */
export function SkeletonAnalytics() {
    return (_jsxs("div", { className: "container mx-auto p-6 space-y-8", "data-testid": "skeleton-analytics", children: [_jsxs("div", { className: "space-y-3", children: [_jsx(Skeleton, { width: "35%", height: 40 }), _jsx(Skeleton, { width: "55%", height: 20 })] }), _jsx(SkeletonStats, { count: 3 }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsx(SkeletonChart, {}), _jsx(SkeletonChart, {})] }), _jsx(SkeletonTable, { rows: 6, cols: 5 })] }));
}
/**
 * Chat Page Skeleton
 */
export function SkeletonChat() {
    return (_jsxs("div", { className: "flex flex-col h-full", "data-testid": "skeleton-chat", children: [_jsx("div", { className: "border-b p-4", children: _jsx(SkeletonAvatar, { size: 40 }) }), _jsx("div", { className: "flex-1 p-4 space-y-4 overflow-y-auto", children: Array.from({ length: 5 }).map((_, i) => (_jsx("div", { className: `flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`, children: _jsxs("div", { className: `max-w-[80%] p-4 rounded-lg space-y-2 ${i % 2 === 0
                            ? 'bg-gray-100 dark:bg-gray-800'
                            : 'bg-primary/10 dark:bg-primary/20'}`, children: [_jsx(Skeleton, { width: "100%", height: 14 }), _jsx(Skeleton, { width: "80%", height: 14 })] }) }, i))) }), _jsx("div", { className: "border-t p-4", children: _jsx(Skeleton, { variant: "rounded", width: "100%", height: 48 }) })] }));
}
/**
 * Content List Skeleton - Blog posts, articles, journal entries
 */
export function SkeletonContentList({ count = 3 }) {
    return (_jsx("div", { className: "space-y-4", "data-testid": "skeleton-content-list", children: Array.from({ length: count }).map((_, i) => (_jsxs("div", { className: "bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { className: "flex-1 space-y-2", children: [_jsx(Skeleton, { width: "70%", height: 24 }), _jsx(Skeleton, { width: "40%", height: 14 })] }), _jsx(Skeleton, { variant: "rounded", width: 80, height: 24 })] }), _jsx(Skeleton, { width: "100%", className: "mb-2" }), _jsx(Skeleton, { width: "90%", className: "mb-4" }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Skeleton, { variant: "rounded", width: 100, height: 32 }), _jsx(Skeleton, { variant: "rounded", width: 100, height: 32 })] })] }, i))) }));
}
/**
 * Generic Page Skeleton - Fallback for any page
 */
export function SkeletonPage() {
    return (_jsxs("div", { className: "container mx-auto p-6 space-y-8", "data-testid": "skeleton-page", children: [_jsxs("div", { className: "space-y-3", children: [_jsx(Skeleton, { width: "40%", height: 40 }), _jsx(Skeleton, { width: "60%", height: 20 })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "lg:col-span-2", children: _jsx(SkeletonCard, { count: 3 }) }), _jsx("div", { children: _jsx(SkeletonList, { count: 5 }) })] })] }));
}
