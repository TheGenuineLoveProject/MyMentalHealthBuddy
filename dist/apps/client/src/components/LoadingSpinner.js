import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
export function LoadingSpinner({ size = 'md', className = '' }) {
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4',
    };
    return (_jsx("div", { className: `spinner inline-block border-blue-200 border-t-blue-600 rounded-full animate-spin ${sizeClasses[size]} ${className}`, role: "status", "aria-label": "Loading", "data-testid": "loading-spinner", children: _jsx("span", { className: "sr-only", children: "Loading..." }) }));
}
export function LoadingOverlay({ message = 'Loading...' }) {
    return (_jsx("div", { className: "fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 animate-fade-in", "data-testid": "loading-overlay", children: _jsxs("div", { className: "bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4 animate-scale-in", children: [_jsx(LoadingSpinner, { size: "lg" }), _jsx("p", { className: "text-gray-700 font-medium", children: message })] }) }));
}
export function Skeleton({ className = '', count = 1 }) {
    return (_jsx(_Fragment, { children: Array.from({ length: count }).map((_, i) => (_jsx("div", { className: `skeleton h-4 mb-2 ${className}`, "aria-hidden": "true", "data-testid": `skeleton-${i}` }, i))) }));
}
export function SkeletonCard({ rows = 3 }) {
    return (_jsxs("div", { className: "card animate-pulse", "data-testid": "skeleton-card", children: [_jsx("div", { className: "skeleton h-6 w-3/4 mb-4" }), Array.from({ length: rows }).map((_, i) => (_jsx("div", { className: "skeleton h-4 mb-2" }, i))), _jsx("div", { className: "skeleton h-10 w-24 mt-4" })] }));
}
