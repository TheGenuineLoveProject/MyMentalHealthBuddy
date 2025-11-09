import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AlertCircle } from "lucide-react";
export function ErrorState({ title = "Something went wrong", message, retry }) {
    return (_jsxs("div", { className: "text-center py-12 px-4", "data-testid": "error-state", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4", children: _jsx(AlertCircle, { className: "text-red-500", size: 32 }) }), _jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: title }), _jsx("p", { className: "text-gray-600 mb-4 max-w-sm mx-auto", children: message }), retry && (_jsx("button", { onClick: retry, className: "px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition", "data-testid": "error-state-retry", children: "Try Again" }))] }));
}
