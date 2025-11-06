import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function Skeleton({ className = '', variant = 'text', width, height, animation = 'pulse', }) {
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
    return (_jsx("div", { className: `${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`, style: style, role: "status", "aria-label": "Loading content", "aria-live": "polite" }));
}
/**
 * Pre-built skeleton patterns
 */
export function SkeletonCard() {
    return (_jsxs("div", { className: "p-6 border rounded-lg bg-white dark:bg-gray-800 space-y-4", "data-testid": "skeleton-card", children: [_jsx(Skeleton, { variant: "text", width: "60%", height: 24 }), _jsx(Skeleton, { variant: "text", width: "100%" }), _jsx(Skeleton, { variant: "text", width: "100%" }), _jsx(Skeleton, { variant: "text", width: "80%" }), _jsxs("div", { className: "flex gap-2 mt-4", children: [_jsx(Skeleton, { variant: "rounded", width: 80, height: 32 }), _jsx(Skeleton, { variant: "rounded", width: 80, height: 32 })] })] }));
}
export function SkeletonList({ count = 3 }) {
    return (_jsx("div", { className: "space-y-3", "data-testid": "skeleton-list", children: Array.from({ length: count }).map((_, i) => (_jsxs("div", { className: "flex items-center gap-3 p-4 border rounded-lg", children: [_jsx(Skeleton, { variant: "circular", width: 48, height: 48 }), _jsxs("div", { className: "flex-1 space-y-2", children: [_jsx(Skeleton, { variant: "text", width: "70%" }), _jsx(Skeleton, { variant: "text", width: "50%" })] })] }, i))) }));
}
export function SkeletonTable({ rows = 5, cols = 4 }) {
    return (_jsx("div", { className: "overflow-x-auto", "data-testid": "skeleton-table", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsx("tr", { className: "border-b", children: Array.from({ length: cols }).map((_, i) => (_jsx("th", { className: "p-3 text-left", children: _jsx(Skeleton, { variant: "text", width: "80%" }) }, i))) }) }), _jsx("tbody", { children: Array.from({ length: rows }).map((_, rowIdx) => (_jsx("tr", { className: "border-b", children: Array.from({ length: cols }).map((_, colIdx) => (_jsx("td", { className: "p-3", children: _jsx(Skeleton, { variant: "text", width: "90%" }) }, colIdx))) }, rowIdx))) })] }) }));
}
export function SkeletonStats() {
    return (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", "data-testid": "skeleton-stats", children: Array.from({ length: 4 }).map((_, i) => (_jsxs("div", { className: "p-6 border rounded-lg bg-white dark:bg-gray-800", children: [_jsx(Skeleton, { variant: "text", width: "50%", height: 16, className: "mb-2" }), _jsx(Skeleton, { variant: "text", width: "70%", height: 32 })] }, i))) }));
}
export function SkeletonChart() {
    return (_jsxs("div", { className: "p-6 border rounded-lg bg-white dark:bg-gray-800", "data-testid": "skeleton-chart", children: [_jsx(Skeleton, { variant: "text", width: "40%", height: 24, className: "mb-4" }), _jsx("div", { className: "flex items-end gap-2 h-48", children: Array.from({ length: 7 }).map((_, i) => (_jsx(Skeleton, { variant: "rectangular", width: "100%", height: `${Math.random() * 80 + 20}%` }, i))) })] }));
}
export function SkeletonAvatar({ size = 48 }) {
    return (_jsx(Skeleton, { variant: "circular", width: size, height: size, "data-testid": "skeleton-avatar" }));
}
export function SkeletonPage() {
    return (_jsxs("div", { className: "space-y-6", "data-testid": "skeleton-page", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Skeleton, { variant: "text", width: "30%", height: 32 }), _jsx(Skeleton, { variant: "text", width: "50%", height: 20 })] }), _jsx(SkeletonStats, {}), _jsx(SkeletonChart, {}), _jsx(SkeletonList, { count: 5 })] }));
}
