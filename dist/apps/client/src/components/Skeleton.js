import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function Skeleton({ width, height, variant = 'text', className = '', 'data-testid': testId, }) {
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
    return (_jsx("div", { className: `animate-pulse bg-gray-200 dark:bg-gray-700 ${variants[variant]} ${className}`, style: style, "data-testid": testId }));
}
export function SkeletonWrapper({ loading, children, skeleton, 'data-testid': testId, }) {
    return (_jsx("div", { "data-testid": testId, children: loading ? skeleton : children }));
}
/**
 * Pre-built skeleton layouts
 */
export const SkeletonLayouts = {
    Card: () => (_jsxs("div", { className: "border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-4", children: [_jsx(Skeleton, { width: "60%", height: 24 }), _jsx(Skeleton, { width: "100%", height: 16 }), _jsx(Skeleton, { width: "100%", height: 16 }), _jsx(Skeleton, { width: "80%", height: 16 })] })),
    Avatar: () => (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Skeleton, { variant: "circular", width: 40, height: 40 }), _jsxs("div", { className: "space-y-2 flex-1", children: [_jsx(Skeleton, { width: "120px", height: 16 }), _jsx(Skeleton, { width: "80px", height: 14 })] })] })),
    List: ({ items = 3 }) => (_jsx("div", { className: "space-y-3", children: Array.from({ length: items }).map((_, i) => (_jsxs("div", { className: "flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg", children: [_jsx(Skeleton, { variant: "circular", width: 48, height: 48 }), _jsxs("div", { className: "flex-1 space-y-2", children: [_jsx(Skeleton, { width: "40%", height: 16 }), _jsx(Skeleton, { width: "60%", height: 14 })] })] }, i))) })),
    Table: ({ rows = 5 }) => (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "grid grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg", children: [_jsx(Skeleton, { width: "80%", height: 16 }), _jsx(Skeleton, { width: "80%", height: 16 }), _jsx(Skeleton, { width: "80%", height: 16 }), _jsx(Skeleton, { width: "80%", height: 16 })] }), Array.from({ length: rows }).map((_, i) => (_jsxs("div", { className: "grid grid-cols-4 gap-4 p-4 border-t border-gray-200 dark:border-gray-700", children: [_jsx(Skeleton, { width: "70%", height: 14 }), _jsx(Skeleton, { width: "70%", height: 14 }), _jsx(Skeleton, { width: "70%", height: 14 }), _jsx(Skeleton, { width: "70%", height: 14 })] }, i)))] })),
    Form: () => (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Skeleton, { width: "100px", height: 14, className: "mb-2" }), _jsx(Skeleton, { width: "100%", height: 40, variant: "rounded" })] }), _jsxs("div", { children: [_jsx(Skeleton, { width: "120px", height: 14, className: "mb-2" }), _jsx(Skeleton, { width: "100%", height: 40, variant: "rounded" })] }), _jsxs("div", { children: [_jsx(Skeleton, { width: "80px", height: 14, className: "mb-2" }), _jsx(Skeleton, { width: "100%", height: 120, variant: "rounded" })] }), _jsx(Skeleton, { width: "120px", height: 40, variant: "rounded" })] })),
};
