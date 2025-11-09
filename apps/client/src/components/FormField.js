import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Enhanced Form Field Component
 * Provides inline validation, success states, and better UX
 */
import { useState, useId } from 'react';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
export function FormField({ label, name, type = 'text', value, onChange, onBlur, error, success, hint, required, disabled, placeholder, maxLength, minLength, pattern, rows = 4, autoComplete, 'data-testid': testId, }) {
    const [isFocused, setIsFocused] = useState(false);
    const [hasBeenTouched, setHasBeenTouched] = useState(false);
    const id = useId();
    const handleBlur = () => {
        setIsFocused(false);
        setHasBeenTouched(true);
        onBlur?.();
    };
    const handleFocus = () => {
        setIsFocused(true);
    };
    const showError = error && hasBeenTouched && !isFocused;
    const showSuccess = success && hasBeenTouched && !isFocused && !error;
    const characterCount = value.length;
    const isNearLimit = maxLength && characterCount > maxLength * 0.8;
    const baseInputClasses = `
    w-full px-4 py-2 rounded-lg border transition-all
    focus:outline-none focus:ring-2
    disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500
    dark:bg-gray-800 dark:disabled:bg-gray-900
  `;
    const stateClasses = showError
        ? 'border-red-300 focus:border-red-500 focus:ring-red-200 dark:border-red-700 dark:focus:ring-red-900'
        : showSuccess
            ? 'border-green-300 focus:border-green-500 focus:ring-green-200 dark:border-green-700 dark:focus:ring-green-900'
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200 dark:border-gray-600 dark:focus:ring-blue-900';
    return (_jsxs("div", { className: "space-y-2", "data-testid": testId, children: [_jsxs("label", { htmlFor: id, className: "block text-sm font-medium text-gray-700 dark:text-gray-300", children: [label, required && _jsx("span", { className: "text-red-500 ml-1", children: "*" })] }), _jsxs("div", { className: "relative", children: [type === 'textarea' ? (_jsx("textarea", { id: id, name: name, value: value, onChange: (e) => onChange(e.target.value), onFocus: handleFocus, onBlur: handleBlur, disabled: disabled, required: required, placeholder: placeholder, maxLength: maxLength, minLength: minLength, rows: rows, className: `${baseInputClasses} ${stateClasses} ${showSuccess || showError ? 'pr-10' : ''}`, "aria-invalid": showError ? 'true' : 'false', "aria-describedby": `${id}-hint ${id}-error`, "data-testid": `input-${name}` })) : (_jsx("input", { id: id, name: name, type: type, value: value, onChange: (e) => onChange(e.target.value), onFocus: handleFocus, onBlur: handleBlur, disabled: disabled, required: required, placeholder: placeholder, maxLength: maxLength, minLength: minLength, pattern: pattern, autoComplete: autoComplete, className: `${baseInputClasses} ${stateClasses} ${showSuccess || showError ? 'pr-10' : ''}`, "aria-invalid": showError ? 'true' : 'false', "aria-describedby": `${id}-hint ${id}-error`, "data-testid": `input-${name}` })), (showSuccess || showError) && (_jsxs("div", { className: "absolute right-3 top-2 pointer-events-none", children: [showSuccess && (_jsx(CheckCircle, { className: "h-5 w-5 text-green-500", "aria-label": "Valid input" })), showError && (_jsx(AlertCircle, { className: "h-5 w-5 text-red-500", "aria-label": "Invalid input" }))] }))] }), hint && !showError && (_jsxs("p", { id: `${id}-hint`, className: "text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1", children: [_jsx(Info, { className: "h-3 w-3" }), hint] })), showError && (_jsxs("p", { id: `${id}-error`, className: "text-sm text-red-600 dark:text-red-400 flex items-center gap-1 animate-slide-in-left", role: "alert", "data-testid": `error-${name}`, children: [_jsx(AlertCircle, { className: "h-4 w-4" }), error] })), showSuccess && (_jsxs("p", { className: "text-sm text-green-600 dark:text-green-400 flex items-center gap-1 animate-slide-in-left", "data-testid": `success-${name}`, children: [_jsx(CheckCircle, { className: "h-4 w-4" }), "Looks good!"] })), maxLength && (_jsx("div", { className: "flex justify-end", children: _jsxs("span", { className: `text-xs ${isNearLimit ? 'text-orange-500 font-medium' : 'text-gray-500'}`, children: [characterCount, " / ", maxLength] }) }))] }));
}
export function FormFieldGroup({ legend, children, error, 'data-testid': testId }) {
    return (_jsxs("fieldset", { className: "space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg", "data-testid": testId, children: [_jsx("legend", { className: "text-lg font-semibold px-2", children: legend }), children, error && (_jsxs("p", { className: "text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-2", role: "alert", children: [_jsx(AlertCircle, { className: "h-4 w-4" }), error] }))] }));
}
/**
 * Validation Helpers
 */
export const validators = {
    required: (value) => (!value.trim() ? 'This field is required' : ''),
    email: (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return value && !emailRegex.test(value) ? 'Please enter a valid email address' : '';
    },
    minLength: (min) => (value) => value && value.length < min ? `Must be at least ${min} characters` : '',
    maxLength: (max) => (value) => value && value.length > max ? `Must be no more than ${max} characters` : '',
    pattern: (regex, message) => (value) => value && !regex.test(value) ? message : '',
    url: (value) => {
        try {
            if (value)
                new URL(value);
            return '';
        }
        catch {
            return 'Please enter a valid URL';
        }
    },
    phone: (value) => {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        return value && !phoneRegex.test(value) ? 'Please enter a valid phone number' : '';
    },
    combine: (...validators) => (value) => {
        for (const validator of validators) {
            const error = validator(value);
            if (error)
                return error;
        }
        return '';
    },
};
