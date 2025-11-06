import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function Skeleton({ className = '', width, height, variant = 'text' }) {
    const variantClasses = {
        text: 'h-4 rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-md'
    };
    const style = {
        width: width || (variant === 'circular' ? height : '100%'),
        height: height || (variant === 'text' ? '1rem' : '100%')
    };
    return (_jsx("div", { className: `animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 ${variantClasses[variant]} ${className}`, style: style, "aria-hidden": "true", "data-testid": "skeleton", children: _jsx("div", { className: "h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" }) }));
}
// Dashboard Skeleton
export function DashboardSkeleton() {
    return (_jsxs("div", { className: "space-y-6", "data-testid": "dashboard-skeleton", children: [_jsx("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [...Array(4)].map((_, i) => (_jsxs("div", { className: "bg-white dark:bg-gray-800 p-6 rounded-lg shadow", children: [_jsx(Skeleton, { width: "60%", height: "1rem", className: "mb-2" }), _jsx(Skeleton, { width: "40%", height: "2rem" })] }, i))) }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [...Array(4)].map((_, i) => (_jsxs("div", { className: "bg-white dark:bg-gray-800 p-4 rounded-lg shadow", children: [_jsx(Skeleton, { variant: "circular", height: "48px", width: "48px", className: "mx-auto mb-3" }), _jsx(Skeleton, { width: "80%", className: "mx-auto mb-2" }), _jsx(Skeleton, { width: "60%", height: "0.75rem", className: "mx-auto" })] }, i))) }), _jsxs("div", { className: "bg-white dark:bg-gray-800 p-6 rounded-lg shadow", children: [_jsx(Skeleton, { width: "200px", height: "1.5rem", className: "mb-4" }), _jsx("div", { className: "space-y-3", children: [...Array(5)].map((_, i) => (_jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Skeleton, { variant: "circular", height: "40px", width: "40px" }), _jsxs("div", { className: "flex-1", children: [_jsx(Skeleton, { width: "70%", className: "mb-2" }), _jsx(Skeleton, { width: "40%", height: "0.75rem" })] })] }, i))) })] })] }));
}
// Content List Skeleton
export function ContentListSkeleton({ count = 3 }) {
    return (_jsx("div", { className: "space-y-4", "data-testid": "content-list-skeleton", children: [...Array(count)].map((_, i) => (_jsxs("div", { className: "bg-white dark:bg-gray-800 p-6 rounded-lg shadow", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { className: "flex-1", children: [_jsx(Skeleton, { width: "70%", height: "1.5rem", className: "mb-2" }), _jsx(Skeleton, { width: "40%", height: "0.875rem" })] }), _jsx(Skeleton, { variant: "rectangular", width: "80px", height: "24px" })] }), _jsx(Skeleton, { width: "100%", className: "mb-2" }), _jsx(Skeleton, { width: "90%", className: "mb-4" }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Skeleton, { variant: "rectangular", width: "100px", height: "32px" }), _jsx(Skeleton, { variant: "rectangular", width: "100px", height: "32px" })] })] }, i))) }));
}
// Analytics Skeleton
export function AnalyticsSkeleton() {
    return (_jsxs("div", { className: "space-y-6", "data-testid": "analytics-skeleton", children: [_jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [...Array(3)].map((_, i) => (_jsxs("div", { className: "bg-white dark:bg-gray-800 p-6 rounded-lg shadow", children: [_jsx(Skeleton, { width: "50%", className: "mb-2" }), _jsx(Skeleton, { width: "40%", height: "2rem", className: "mb-1" }), _jsx(Skeleton, { width: "60%", height: "0.75rem" })] }, i))) }), _jsxs("div", { className: "bg-white dark:bg-gray-800 p-6 rounded-lg shadow", children: [_jsx(Skeleton, { width: "200px", height: "1.5rem", className: "mb-6" }), _jsx(Skeleton, { variant: "rectangular", width: "100%", height: "300px" })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 p-6 rounded-lg shadow", children: [_jsx(Skeleton, { width: "150px", height: "1.5rem", className: "mb-4" }), _jsx("div", { className: "space-y-3", children: [...Array(5)].map((_, i) => (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx(Skeleton, { width: "30%" }), _jsx(Skeleton, { width: "20%" }), _jsx(Skeleton, { width: "15%" }), _jsx(Skeleton, { width: "25%" })] }, i))) })] })] }));
}
// Chat Skeleton
export function ChatSkeleton() {
    return (_jsxs("div", { className: "flex flex-col h-full", "data-testid": "chat-skeleton", children: [_jsx("div", { className: "flex-1 p-4 space-y-4 overflow-y-auto", children: [...Array(4)].map((_, i) => (_jsx("div", { className: `flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`, children: _jsxs("div", { className: `max-w-[80%] p-4 rounded-lg ${i % 2 === 0 ? 'bg-gray-100 dark:bg-gray-800' : 'bg-blue-100 dark:bg-blue-900'}`, children: [_jsx(Skeleton, { width: "100%", className: "mb-2" }), _jsx(Skeleton, { width: "80%" })] }) }, i))) }), _jsx("div", { className: "p-4 border-t", children: _jsx(Skeleton, { variant: "rectangular", width: "100%", height: "48px" }) })] }));
}
// Form Skeleton
export function FormSkeleton({ fields = 4 }) {
    return (_jsxs("div", { className: "space-y-4", "data-testid": "form-skeleton", children: [[...Array(fields)].map((_, i) => (_jsxs("div", { children: [_jsx(Skeleton, { width: "120px", height: "1rem", className: "mb-2" }), _jsx(Skeleton, { variant: "rectangular", width: "100%", height: "40px" })] }, i))), _jsx(Skeleton, { variant: "rectangular", width: "120px", height: "40px", className: "mt-6" })] }));
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
