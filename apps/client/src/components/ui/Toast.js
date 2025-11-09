import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";
export function Toast({ type, message, onClose, duration = 5000 }) {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);
    const icons = {
        success: _jsx(CheckCircle, { className: "text-green-500", size: 24 }),
        error: _jsx(XCircle, { className: "text-red-500", size: 24 }),
        info: _jsx(Info, { className: "text-blue-500", size: 24 })
    };
    const colors = {
        success: "bg-green-50 border-green-200",
        error: "bg-red-50 border-red-200",
        info: "bg-blue-50 border-blue-200"
    };
    return (_jsxs("div", { className: `fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${colors[type]} animate-slide-in`, "data-testid": `toast-${type}`, children: [icons[type], _jsx("p", { className: "text-gray-900 font-medium", children: message }), _jsx("button", { onClick: onClose, className: "ml-2 text-gray-500 hover:text-gray-700", "data-testid": "toast-close", children: _jsx(X, { size: 18 }) })] }));
}
