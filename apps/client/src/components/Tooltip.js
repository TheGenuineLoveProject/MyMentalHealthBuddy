import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Tooltip Component
 * Accessible tooltips with positioning
 */
import { useState, useRef, useEffect } from 'react';
export function Tooltip({ content, children, position = 'top', delay = 200, 'data-testid': testId, }) {
    const [isVisible, setIsVisible] = useState(false);
    const [coords, setCoords] = useState({ x: 0, y: 0 });
    const timeoutRef = useRef();
    const triggerRef = useRef(null);
    const tooltipRef = useRef(null);
    const showTooltip = () => {
        timeoutRef.current = setTimeout(() => {
            setIsVisible(true);
            updatePosition();
        }, delay);
    };
    const hideTooltip = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsVisible(false);
    };
    const updatePosition = () => {
        if (!triggerRef.current || !tooltipRef.current)
            return;
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        let x = 0;
        let y = 0;
        switch (position) {
            case 'top':
                x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
                y = triggerRect.top - tooltipRect.height - 8;
                break;
            case 'bottom':
                x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
                y = triggerRect.bottom + 8;
                break;
            case 'left':
                x = triggerRect.left - tooltipRect.width - 8;
                y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
                break;
            case 'right':
                x = triggerRect.right + 8;
                y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
                break;
        }
        setCoords({ x, y });
    };
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);
    return (_jsxs(_Fragment, { children: [_jsx("div", { ref: triggerRef, onMouseEnter: showTooltip, onMouseLeave: hideTooltip, onFocus: showTooltip, onBlur: hideTooltip, className: "inline-block", "data-testid": testId, children: children }), isVisible && (_jsxs("div", { ref: tooltipRef, role: "tooltip", className: "fixed z-[9999] px-3 py-2 text-sm text-white bg-gray-900 dark:bg-gray-700 rounded-lg shadow-lg animate-fade-in pointer-events-none", style: {
                    left: `${coords.x}px`,
                    top: `${coords.y}px`,
                }, "data-testid": `${testId}-content`, children: [content, _jsx("div", { className: `absolute w-2 h-2 bg-gray-900 dark:bg-gray-700 transform rotate-45 ${position === 'top' ? 'bottom-[-4px] left-1/2 -translate-x-1/2' :
                            position === 'bottom' ? 'top-[-4px] left-1/2 -translate-x-1/2' :
                                position === 'left' ? 'right-[-4px] top-1/2 -translate-y-1/2' :
                                    'left-[-4px] top-1/2 -translate-y-1/2'}` })] }))] }));
}
export function SimpleTooltip({ text, children, 'data-testid': testId }) {
    return (_jsxs("div", { className: "group relative inline-block", "data-testid": testId, children: [children, _jsxs("div", { className: "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-sm text-white bg-gray-900 dark:bg-gray-700 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap pointer-events-none z-50", children: [text, _jsx("div", { className: "absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-700 transform rotate-45 -mt-1" })] })] }));
}
