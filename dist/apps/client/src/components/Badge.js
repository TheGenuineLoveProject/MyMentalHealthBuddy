import { jsx as _jsx } from "react/jsx-runtime";
export function Badge({ children, variant = 'primary', size = 'md', className = '', testId }) {
    const variantClasses = {
        primary: 'bg-blue-50 text-blue-700',
        success: 'bg-green-50 text-green-700',
        warning: 'bg-yellow-50 text-yellow-700',
        danger: 'bg-red-50 text-red-700',
        gray: 'bg-gray-100 text-gray-700',
    };
    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-sm',
    };
    return (_jsx("span", { className: `badge inline-flex items-center font-medium rounded-full ${variantClasses[variant]} ${sizeClasses[size]} ${className}`, "data-testid": testId, children: children }));
}
