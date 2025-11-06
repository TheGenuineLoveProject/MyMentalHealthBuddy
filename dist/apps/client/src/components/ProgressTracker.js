import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Progress Tracker Component
 * Visual progress indicators for goals and achievements
 */
import { CheckCircle, Circle, Lock } from 'lucide-react';
export function ProgressTracker({ steps, orientation = 'horizontal', showDescriptions = true, 'data-testid': testId, }) {
    const isHorizontal = orientation === 'horizontal';
    return (_jsx("div", { className: `${isHorizontal
            ? 'flex items-start gap-4'
            : 'flex flex-col gap-4'}`, "data-testid": testId, children: steps.map((step, index) => {
            const isLast = index === steps.length - 1;
            return (_jsxs("div", { className: `flex ${isHorizontal ? 'flex-col items-center flex-1' : 'gap-4'}`, "data-testid": `progress-step-${step.id}`, children: [_jsxs("div", { className: `flex items-center ${isHorizontal ? 'w-full' : ''}`, children: [_jsx(StepIcon, { status: step.status }), !isLast && (_jsx("div", { className: `${isHorizontal ? 'flex-1 h-0.5' : 'w-0.5 h-12 ml-4'} ${step.status === 'completed'
                                    ? 'bg-green-500'
                                    : 'bg-gray-300 dark:bg-gray-600'}` }))] }), _jsxs("div", { className: `${isHorizontal ? 'text-center mt-3' : 'flex-1'}`, children: [_jsx("h4", { className: `font-medium ${step.status === 'locked'
                                    ? 'text-gray-400'
                                    : step.status === 'current'
                                        ? 'text-blue-600 dark:text-blue-400'
                                        : 'text-gray-900 dark:text-white'}`, children: step.label }), showDescriptions && step.description && (_jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400 mt-1", children: step.description }))] })] }, step.id));
        }) }));
}
function StepIcon({ status }) {
    const baseClasses = 'flex items-center justify-center w-8 h-8 rounded-full';
    if (status === 'completed') {
        return (_jsx("div", { className: `${baseClasses} bg-green-500`, children: _jsx(CheckCircle, { className: "h-5 w-5 text-white" }) }));
    }
    if (status === 'current') {
        return (_jsx("div", { className: `${baseClasses} bg-blue-500 ring-4 ring-blue-200 dark:ring-blue-900`, children: _jsx(Circle, { className: "h-5 w-5 text-white fill-current" }) }));
    }
    if (status === 'locked') {
        return (_jsx("div", { className: `${baseClasses} bg-gray-300 dark:bg-gray-600`, children: _jsx(Lock, { className: "h-4 w-4 text-gray-500" }) }));
    }
    return (_jsx("div", { className: `${baseClasses} border-2 border-gray-300 dark:border-gray-600`, children: _jsx(Circle, { className: "h-5 w-5 text-gray-400" }) }));
}
export function CircularProgress({ percentage, size = 120, strokeWidth = 8, color = '#3b82f6', label, 'data-testid': testId, }) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;
    return (_jsxs("div", { className: "relative inline-flex items-center justify-center", "data-testid": testId, children: [_jsxs("svg", { width: size, height: size, className: "transform -rotate-90", children: [_jsx("circle", { cx: size / 2, cy: size / 2, r: radius, stroke: "currentColor", strokeWidth: strokeWidth, fill: "none", className: "text-gray-200 dark:text-gray-700" }), _jsx("circle", { cx: size / 2, cy: size / 2, r: radius, stroke: color, strokeWidth: strokeWidth, fill: "none", strokeDasharray: circumference, strokeDashoffset: offset, strokeLinecap: "round", className: "transition-all duration-500" })] }), _jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center", children: [_jsxs("span", { className: "text-2xl font-bold", children: [Math.round(percentage), "%"] }), label && (_jsx("span", { className: "text-xs text-gray-500 mt-1", children: label }))] })] }));
}
export function LinearProgress({ percentage, label, showPercentage = true, variant = 'default', size = 'md', animated = false, 'data-testid': testId, }) {
    const colors = {
        default: 'bg-blue-500',
        success: 'bg-green-500',
        warning: 'bg-orange-500',
        danger: 'bg-red-500',
    };
    const sizes = {
        sm: 'h-2',
        md: 'h-3',
        lg: 'h-4',
    };
    return (_jsxs("div", { className: "w-full", "data-testid": testId, children: [label && (_jsxs("div", { className: "flex justify-between items-center mb-2", children: [_jsx("span", { className: "text-sm font-medium", children: label }), showPercentage && (_jsxs("span", { className: "text-sm text-gray-500", children: [Math.round(percentage), "%"] }))] })), _jsx("div", { className: `w-full ${sizes[size]} bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden`, children: _jsx("div", { className: `${sizes[size]} ${colors[variant]} rounded-full transition-all duration-500 ${animated ? 'animate-pulse' : ''}`, style: { width: `${Math.min(percentage, 100)}%` }, role: "progressbar", "aria-valuenow": percentage, "aria-valuemin": 0, "aria-valuemax": 100 }) })] }));
}
