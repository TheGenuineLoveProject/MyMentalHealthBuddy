import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { HelpCircle } from 'lucide-react';
import { useState } from 'react';
export function HelpTooltip({ content, position = 'top' }) {
    const [isVisible, setIsVisible] = useState(false);
    const positionClasses = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    };
    return (_jsxs("div", { className: "relative inline-block", children: [_jsx("button", { className: "text-muted-foreground hover:text-foreground transition-colors", onMouseEnter: () => setIsVisible(true), onMouseLeave: () => setIsVisible(false), onFocus: () => setIsVisible(true), onBlur: () => setIsVisible(false), "aria-label": "Help", "data-testid": "help-tooltip-trigger", children: _jsx(HelpCircle, { className: "h-4 w-4" }) }), isVisible && (_jsx("div", { className: `absolute z-50 ${positionClasses[position]} w-64 p-3 bg-popover border border-border rounded-lg shadow-lg text-sm text-popover-foreground`, role: "tooltip", "data-testid": "help-tooltip-content", children: _jsxs("div", { className: "relative", children: [content, _jsx("div", { className: `absolute w-2 h-2 bg-popover border-border rotate-45 ${position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1 border-r border-b' :
                                position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1 border-l border-t' :
                                    position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1 border-t border-r' :
                                        'right-full top-1/2 -translate-y-1/2 -mr-1 border-b border-l'}` })] }) }))] }));
}
