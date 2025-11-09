import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AlertTriangle } from "lucide-react";
export function ConfirmDialog({ isOpen, title, message, confirmLabel = "Confirm", cancelLabel = "Cancel", onConfirm, onCancel, variant = "warning" }) {
    if (!isOpen)
        return null;
    const colors = {
        danger: "bg-red-600 hover:bg-red-700",
        warning: "bg-yellow-600 hover:bg-yellow-700",
        info: "bg-blue-600 hover:bg-blue-700"
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50", "data-testid": "confirm-dialog", children: _jsxs("div", { className: "bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4", children: [_jsxs("div", { className: "flex items-start gap-4 mb-4", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx(AlertTriangle, { className: "text-yellow-500", size: 24 }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: title }), _jsx("p", { className: "text-gray-600", children: message })] })] }), _jsxs("div", { className: "flex gap-3 justify-end", children: [_jsx("button", { onClick: onCancel, className: "px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition", "data-testid": "confirm-dialog-cancel", children: cancelLabel }), _jsx("button", { onClick: onConfirm, className: `px-4 py-2 text-white rounded-lg transition ${colors[variant]}`, "data-testid": "confirm-dialog-confirm", children: confirmLabel })] })] }) }));
}
