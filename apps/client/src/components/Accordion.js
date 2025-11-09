import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Accordion Component
 * Collapsible content sections
 */
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
export function Accordion({ items, allowMultiple = false, defaultOpen = [], 'data-testid': testId, }) {
    const [openItems, setOpenItems] = useState(new Set(defaultOpen));
    const toggleItem = (itemId) => {
        const item = items.find((i) => i.id === itemId);
        if (item?.disabled)
            return;
        setOpenItems((prev) => {
            const next = new Set(prev);
            if (next.has(itemId)) {
                next.delete(itemId);
            }
            else {
                if (!allowMultiple) {
                    next.clear();
                }
                next.add(itemId);
            }
            return next;
        });
    };
    return (_jsx("div", { className: "divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg", "data-testid": testId, children: items.map((item) => {
            const isOpen = openItems.has(item.id);
            return (_jsxs("div", { "data-testid": `accordion-item-${item.id}`, children: [_jsxs("button", { onClick: () => toggleItem(item.id), disabled: item.disabled, className: `
                w-full flex items-center justify-between px-6 py-4 text-left transition-colors
                ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer'}
              `, "aria-expanded": isOpen, "aria-controls": `accordion-content-${item.id}`, "data-testid": `accordion-trigger-${item.id}`, children: [_jsxs("div", { className: "flex items-center gap-3", children: [item.icon && _jsx("span", { className: "h-5 w-5", children: item.icon }), _jsx("span", { className: "font-medium", children: item.title })] }), _jsx(ChevronDown, { className: `h-5 w-5 text-gray-500 transition-transform ${isOpen ? 'transform rotate-180' : ''}` })] }), isOpen && (_jsx("div", { id: `accordion-content-${item.id}`, className: "px-6 py-4 bg-gray-50 dark:bg-gray-900 animate-slide-down", "data-testid": `accordion-content-${item.id}`, children: item.content }))] }, item.id));
        }) }));
}
export function SimpleAccordion({ title, children, defaultOpen = false, icon, 'data-testid': testId, }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (_jsxs("div", { className: "border border-gray-200 dark:border-gray-700 rounded-lg", "data-testid": testId, children: [_jsxs("button", { onClick: () => setIsOpen(!isOpen), className: "w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors", "aria-expanded": isOpen, "data-testid": `${testId}-trigger`, children: [_jsxs("div", { className: "flex items-center gap-3", children: [icon && _jsx("span", { className: "h-5 w-5", children: icon }), _jsx("span", { className: "font-medium", children: title })] }), _jsx(ChevronDown, { className: `h-5 w-5 text-gray-500 transition-transform ${isOpen ? 'transform rotate-180' : ''}` })] }), isOpen && (_jsx("div", { className: "px-6 py-4 border-t border-gray-200 dark:border-gray-700 animate-slide-down", "data-testid": `${testId}-content`, children: children }))] }));
}
