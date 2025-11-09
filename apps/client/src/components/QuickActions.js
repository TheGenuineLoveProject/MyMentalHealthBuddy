import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'wouter';
import { quickActions } from '@/lib/navigationStructure';
import { Card } from '@/components/Card';
/**
 * Quick Actions Component
 * Persona-based shortcuts for common workflows
 */
export function QuickActions() {
    return (_jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 h-[196px]", "data-testid": "quick-actions-grid", style: { contain: 'layout' }, children: quickActions.map((action) => {
            const Icon = action.icon;
            return (_jsx(Link, { href: action.path, children: _jsx(Card, { className: `p-4 hover:shadow-lg transition-all duration-200 cursor-pointer group ${action.color} bg-opacity-5 hover:bg-opacity-10 border-2 border-transparent hover:border-current action-card h-[180px] [contain:layout_strict]`, "data-testid": `quick-action-${action.id}`, children: _jsxs("div", { className: "flex flex-col items-center text-center gap-3 h-full", children: [_jsx("div", { className: `p-3 rounded-full ${action.color} bg-opacity-10 group-hover:scale-110 transition-transform flex-shrink-0`, children: _jsx(Icon, { className: "h-6 w-6", "aria-hidden": "true" }) }), _jsxs("div", { className: "flex-1 min-h-0", children: [_jsx("h3", { className: "font-semibold text-sm text-foreground line-clamp-1", children: action.label }), _jsx("p", { className: "text-xs text-muted-foreground mt-1 line-clamp-2", children: action.description })] })] }) }) }, action.id));
        }) }));
}
