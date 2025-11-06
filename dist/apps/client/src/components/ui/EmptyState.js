import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function EmptyState({ icon: Icon, title, description, action }) {
    return (_jsxs("div", { className: "text-center py-12", "data-testid": "empty-state", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4", children: _jsx(Icon, { className: "text-gray-400", size: 32 }) }), _jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: title }), _jsx("p", { className: "text-gray-600 mb-4 max-w-sm mx-auto", children: description }), action && (_jsx("button", { onClick: action.onClick, className: "px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition", "data-testid": "empty-state-action", children: action.label }))] }));
}
