import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Checkbox Component
 * Accessible checkbox input with indeterminate support
 */
import { useEffect, useRef } from 'react';
export function Checkbox({ checked, onChange, indeterminate = false, disabled = false, 'aria-label': ariaLabel, 'data-testid': testId, onClick, }) {
    const inputRef = useRef(null);
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.indeterminate = indeterminate;
        }
    }, [indeterminate]);
    return (_jsx("input", { ref: inputRef, type: "checkbox", checked: checked, onChange: (e) => onChange(e.target.checked), disabled: disabled, "aria-label": ariaLabel, "data-testid": testId, onClick: onClick, className: "h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50" }));
}
