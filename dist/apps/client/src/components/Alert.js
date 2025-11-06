import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';
export function Alert({ type = 'info', title, message, onClose, className = '', testId }) {
    const config = {
        success: {
            bg: 'bg-green-50',
            border: 'border-green-500',
            text: 'text-green-800',
            icon: _jsx(CheckCircle, { className: "w-5 h-5 text-green-600" }),
        },
        error: {
            bg: 'bg-red-50',
            border: 'border-red-500',
            text: 'text-red-800',
            icon: _jsx(XCircle, { className: "w-5 h-5 text-red-600" }),
        },
        warning: {
            bg: 'bg-yellow-50',
            border: 'border-yellow-500',
            text: 'text-yellow-800',
            icon: _jsx(AlertTriangle, { className: "w-5 h-5 text-yellow-600" }),
        },
        info: {
            bg: 'bg-blue-50',
            border: 'border-blue-500',
            text: 'text-blue-800',
            icon: _jsx(Info, { className: "w-5 h-5 text-blue-600" }),
        },
    };
    const { bg, border, text, icon } = config[type];
    return (_jsx("div", { className: `${bg} ${border} border-l-4 p-4 rounded-lg animate-slide-in-down ${className}`, role: "alert", "data-testid": testId, children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "flex-shrink-0 mt-0.5", children: icon }), _jsxs("div", { className: "flex-1", children: [title && (_jsx("h4", { className: `font-semibold mb-1 ${text}`, "data-testid": `${testId}-title`, children: title })), _jsx("div", { className: text, "data-testid": `${testId}-message`, children: message })] }), onClose && (_jsx("button", { onClick: onClose, className: "flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors", "aria-label": "Close alert", "data-testid": `${testId}-close`, children: _jsx(X, { className: "w-5 h-5" }) }))] }) }));
}
