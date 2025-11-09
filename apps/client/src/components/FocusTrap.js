import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Focus Trap Component
 * Traps keyboard focus within a container (for modals/dialogs)
 */
import { useEffect, useRef } from 'react';
import { trapFocus, KeyboardKeys } from '@/lib/accessibility';
export function FocusTrap({ children, active = true, onEscape }) {
    const containerRef = useRef(null);
    const previousActiveElement = useRef(null);
    useEffect(() => {
        if (!active || !containerRef.current)
            return;
        // Save currently focused element
        previousActiveElement.current = document.activeElement;
        // Focus first focusable element in container
        const focusableElements = containerRef.current.querySelectorAll('a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])');
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
        // Restore focus on cleanup
        return () => {
            if (previousActiveElement.current) {
                previousActiveElement.current.focus();
            }
        };
    }, [active]);
    const handleKeyDown = (event) => {
        if (!active || !containerRef.current)
            return;
        if (event.key === KeyboardKeys.Escape && onEscape) {
            event.preventDefault();
            onEscape();
            return;
        }
        if (event.key === KeyboardKeys.Tab) {
            trapFocus(containerRef.current, event);
        }
    };
    return (_jsx("div", { ref: containerRef, onKeyDown: handleKeyDown, children: children }));
}
