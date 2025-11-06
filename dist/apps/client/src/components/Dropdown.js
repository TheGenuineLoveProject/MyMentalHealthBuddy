import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Dropdown Component
 * Accessible dropdown menu with keyboard navigation
 */
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
export function Dropdown({ options, value, onChange, placeholder = 'Select an option', disabled = false, 'data-testid': testId, }) {
    const [isOpen, setIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const dropdownRef = useRef(null);
    const selectedOption = options.find((opt) => opt.value === value);
    useEffect(() => {
        if (!isOpen)
            return;
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
                setFocusedIndex(-1);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);
    const handleKeyDown = (e) => {
        if (disabled)
            return;
        const enabledOptions = options.filter((opt) => !opt.disabled && !opt.divider);
        // Guard against empty options
        if (enabledOptions.length === 0) {
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
            return;
        }
        switch (e.key) {
            case 'Enter':
            case ' ':
                e.preventDefault();
                if (isOpen && focusedIndex >= 0 && focusedIndex < enabledOptions.length) {
                    const option = enabledOptions[focusedIndex];
                    if (option) {
                        onChange(option.value);
                        setIsOpen(false);
                        setFocusedIndex(-1);
                    }
                }
                else {
                    setIsOpen(!isOpen);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                setFocusedIndex(-1);
                break;
            case 'ArrowDown':
                e.preventDefault();
                if (!isOpen) {
                    setIsOpen(true);
                    setFocusedIndex(0);
                }
                else {
                    setFocusedIndex((prev) => {
                        const next = (prev + 1) % enabledOptions.length;
                        return next;
                    });
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (isOpen) {
                    setFocusedIndex((prev) => {
                        const next = (prev - 1 + enabledOptions.length) % enabledOptions.length;
                        return next;
                    });
                }
                break;
            case 'Home':
                e.preventDefault();
                if (isOpen) {
                    setFocusedIndex(0);
                }
                break;
            case 'End':
                e.preventDefault();
                if (isOpen) {
                    setFocusedIndex(enabledOptions.length - 1);
                }
                break;
        }
    };
    const handleSelect = (option) => {
        if (option.disabled || option.divider)
            return;
        onChange(option.value);
        setIsOpen(false);
        setFocusedIndex(-1);
    };
    const enabledOptions = options.filter((opt) => !opt.disabled && !opt.divider);
    const activedescendantId = focusedIndex >= 0 && focusedIndex < enabledOptions.length
        ? `option-${enabledOptions[focusedIndex].value}`
        : undefined;
    return (_jsxs("div", { ref: dropdownRef, className: "relative", ...(testId && { 'data-testid': testId }), children: [_jsxs("button", { type: "button", onClick: () => !disabled && setIsOpen(!isOpen), onKeyDown: handleKeyDown, disabled: disabled, className: `
          w-full flex items-center justify-between px-4 py-2 
          bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 
          rounded-lg shadow-sm transition-all
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400 dark:hover:border-gray-500 cursor-pointer'}
          ${isOpen ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-200 dark:ring-blue-900' : ''}
        `, "aria-haspopup": "listbox", "aria-expanded": isOpen, "aria-activedescendant": isOpen ? activedescendantId : undefined, ...(testId && { 'data-testid': `${testId}-trigger` }), children: [_jsxs("span", { className: "flex items-center gap-2", children: [selectedOption?.icon, _jsx("span", { className: selectedOption ? '' : 'text-gray-500', children: selectedOption?.label || placeholder })] }), _jsx(ChevronDown, { className: `h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}` })] }), isOpen && (_jsx("div", { role: "listbox", className: "absolute z-50 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg animate-scale-in", ...(testId && { 'data-testid': `${testId}-menu` }), children: _jsx("div", { className: "py-1 max-h-60 overflow-y-auto", children: options.length === 0 ? (_jsx("div", { className: "px-4 py-2 text-sm text-gray-500", children: "No options available" })) : (options.map((option, index) => {
                        if (option.divider) {
                            return (_jsx("div", { className: "my-1 border-t border-gray-200 dark:border-gray-700" }, `divider-${index}`));
                        }
                        const isSelected = option.value === value;
                        const isFocused = enabledOptions.indexOf(option) === focusedIndex;
                        return (_jsxs("button", { id: `option-${option.value}`, role: "option", "aria-selected": isSelected, onClick: () => handleSelect(option), disabled: option.disabled, className: `
                      w-full flex items-center justify-between px-4 py-2 text-left transition-colors
                      ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      ${isFocused ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}
                      ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''}
                    `, ...(testId && { 'data-testid': `${testId}-option-${option.value}` }), children: [_jsxs("span", { className: "flex items-center gap-2", children: [option.icon, option.label] }), isSelected && _jsx(Check, { className: "h-4 w-4" })] }, option.value));
                    })) }) }))] }));
}
export function Select({ options, value, onChange, placeholder, disabled = false, 'data-testid': testId, }) {
    return (_jsxs("select", { value: value || '', onChange: (e) => onChange(e.target.value), disabled: disabled, className: "w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 disabled:opacity-50 disabled:cursor-not-allowed", "data-testid": testId, children: [placeholder && (_jsx("option", { value: "", disabled: true, children: placeholder })), options.map((option) => (_jsx("option", { value: option.value, children: option.label }, option.value)))] }));
}
