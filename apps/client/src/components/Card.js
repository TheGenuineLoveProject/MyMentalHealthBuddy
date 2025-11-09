import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function Card({ children, className = '', interactive = false, onClick, testId, role, 'aria-live': ariaLive, 'data-testid': dataTestId }) {
    const baseClasses = 'card';
    const interactiveClasses = interactive ? 'card-interactive' : '';
    const handleKeyDown = (e) => {
        if (interactive && onClick && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onClick(e);
        }
    };
    return (_jsx("div", { className: `${baseClasses} ${interactiveClasses} ${className}`, onClick: onClick, onKeyDown: handleKeyDown, role: role || (interactive ? 'button' : undefined), "aria-live": ariaLive, tabIndex: interactive ? 0 : undefined, "data-testid": dataTestId || testId, children: children }));
}
export function StatCard({ title, value, subtitle, icon, trend, trendValue, color = 'blue', testId }) {
    const colorClasses = {
        blue: 'text-blue-600 bg-blue-50',
        green: 'text-green-600 bg-green-50',
        purple: 'text-purple-600 bg-purple-50',
        orange: 'text-yellow-600 bg-yellow-50',
    };
    const trendClasses = {
        up: 'text-green-600',
        down: 'text-red-600',
        neutral: 'text-gray-600',
    };
    return (_jsxs("div", { className: "stat-card", "data-testid": testId, children: [_jsxs("div", { className: "flex items-start justify-between mb-3", children: [_jsx("h3", { className: "text-gray-600 text-sm font-medium", children: title }), icon && (_jsx("div", { className: `p-2 rounded-lg ${colorClasses[color]}`, children: icon }))] }), _jsx("div", { className: "mb-2", children: _jsx("p", { className: "text-3xl font-bold text-gray-900", "data-testid": `${testId}-value`, children: value }) }), (subtitle || trendValue) && (_jsxs("div", { className: "flex items-center gap-2 text-sm", children: [trendValue && trend && (_jsxs("span", { className: `font-medium ${trendClasses[trend]}`, "data-testid": `${testId}-trend`, children: [trend === 'up' && '↑', trend === 'down' && '↓', trendValue] })), subtitle && (_jsx("span", { className: "text-gray-500", "data-testid": `${testId}-subtitle`, children: subtitle }))] }))] }));
}
