import { useEffect } from 'react';
/**
 * Custom hook for detecting clicks outside of a specified element
 * Useful for closing modals, dropdowns, etc.
 */
export function useOnClickOutside(ref, handler, enabled = true) {
    useEffect(() => {
        if (!enabled)
            return;
        const listener = (event) => {
            const el = ref?.current;
            // Do nothing if clicking ref's element or descendent elements
            if (!el || el.contains(event.target)) {
                return;
            }
            handler(event);
        };
        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);
        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler, enabled]);
}
