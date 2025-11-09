import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function LoadingSkeleton({ className = "" }) {
    return (_jsx("div", { className: `animate-pulse ${className}`, children: _jsx("div", { className: "h-4 bg-gray-200 rounded w-full" }) }));
}
export function CardSkeleton() {
    return (_jsxs("div", { className: "bg-white rounded-lg shadow p-6 animate-pulse", children: [_jsx("div", { className: "h-6 bg-gray-200 rounded w-1/3 mb-4" }), _jsxs("div", { className: "space-y-3", children: [_jsx("div", { className: "h-4 bg-gray-200 rounded w-full" }), _jsx("div", { className: "h-4 bg-gray-200 rounded w-5/6" }), _jsx("div", { className: "h-4 bg-gray-200 rounded w-4/6" })] })] }));
}
export function ListSkeleton({ count = 3 }) {
    return (_jsx("div", { className: "space-y-3", children: Array.from({ length: count }).map((_, i) => (_jsxs("div", { className: "p-4 border border-gray-200 rounded-lg animate-pulse", children: [_jsx("div", { className: "h-4 bg-gray-200 rounded w-1/4 mb-2" }), _jsx("div", { className: "h-3 bg-gray-200 rounded w-full" })] }, i))) }));
}
