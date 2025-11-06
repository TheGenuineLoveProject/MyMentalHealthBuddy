import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
export function Skeleton({ className = '', width, height, variant = 'rectangular', }) {
    const variantClasses = {
        text: 'h-4 rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-lg',
    };
    const style = {
        ...(width && { width }),
        ...(height && { height }),
    };
    return (_jsx("div", { className: `bg-gray-200 dark:bg-gray-700 animate-pulse ${variantClasses[variant]} ${className}`, style: style, "data-testid": "skeleton-loader" }));
}
// Card Skeleton
export function SkeletonCard({ count = 1 }) {
    return (_jsx(_Fragment, { children: Array.from({ length: count }).map((_, i) => (_jsxs("div", { className: "border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-4", children: [_jsx(Skeleton, { variant: "text", width: "60%" }), _jsx(Skeleton, { variant: "text", width: "80%" }), _jsx(Skeleton, { variant: "text", width: "40%" })] }, i))) }));
}
// List Skeleton
export function SkeletonList({ count = 5 }) {
    return (_jsx("div", { className: "space-y-3", children: Array.from({ length: count }).map((_, i) => (_jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Skeleton, { variant: "circular", width: "48px", height: "48px" }), _jsxs("div", { className: "flex-1 space-y-2", children: [_jsx(Skeleton, { variant: "text", width: "70%" }), _jsx(Skeleton, { variant: "text", width: "40%" })] })] }, i))) }));
}
// Table Skeleton
export function SkeletonTable({ rows = 5, cols = 4 }) {
    return (_jsxs("div", { className: "space-y-3", children: [_jsx("div", { className: "grid gap-4", style: { gridTemplateColumns: `repeat(${cols}, 1fr)` }, children: Array.from({ length: cols }).map((_, i) => (_jsx(Skeleton, { variant: "text", height: "40px" }, i))) }), Array.from({ length: rows }).map((_, rowIndex) => (_jsx("div", { className: "grid gap-4", style: { gridTemplateColumns: `repeat(${cols}, 1fr)` }, children: Array.from({ length: cols }).map((_, colIndex) => (_jsx(Skeleton, { variant: "text", height: "24px" }, colIndex))) }, rowIndex)))] }));
}
// Stats Dashboard Skeleton
export function SkeletonStats({ count = 4 }) {
    return (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: Array.from({ length: count }).map((_, i) => (_jsxs("div", { className: "border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-3", children: [_jsx(Skeleton, { variant: "text", width: "50%", height: "16px" }), _jsx(Skeleton, { variant: "text", width: "70%", height: "32px" }), _jsx(Skeleton, { variant: "text", width: "40%", height: "12px" })] }, i))) }));
}
// Chart Skeleton
export function SkeletonChart() {
    return (_jsxs("div", { className: "border border-gray-200 dark:border-gray-700 rounded-lg p-6", children: [_jsx(Skeleton, { variant: "text", width: "30%", height: "24px", className: "mb-4" }), _jsx("div", { className: "space-y-2", children: Array.from({ length: 6 }).map((_, i) => (_jsx("div", { className: "flex items-end gap-2", style: { height: '200px' }, children: Array.from({ length: 7 }).map((_, j) => (_jsx(Skeleton, { variant: "rectangular", className: "flex-1", height: `${Math.random() * 60 + 40}%` }, j))) }, i))) })] }));
}
// Page Skeleton
export function SkeletonPage() {
    return (_jsxs("div", { className: "container mx-auto p-6 space-y-8", children: [_jsxs("div", { className: "space-y-4", children: [_jsx(Skeleton, { variant: "text", width: "40%", height: "48px" }), _jsx(Skeleton, { variant: "text", width: "60%", height: "24px" })] }), _jsx(SkeletonStats, {}), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "lg:col-span-2", children: _jsx(SkeletonCard, { count: 3 }) }), _jsx("div", { children: _jsx(SkeletonList, { count: 5 }) })] })] }));
}
