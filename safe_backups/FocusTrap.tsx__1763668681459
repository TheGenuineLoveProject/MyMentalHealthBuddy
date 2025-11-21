/**
 * Focus Trap Component
 * Traps keyboard focus within a container (for modals/dialogs)
 */

import { useEffect, useRef, ReactNode } from 'react';
import { trapFocus, KeyboardKeys } from '@/lib/accessibility';

interface FocusTrapProps {
  children: ReactNode;
  active?: boolean;
  onEscape?: () => void;
}

export function FocusTrap({ children, active = true, onEscape }: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    // Save currently focused element
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Focus first focusable element in container
    const focusableElements = containerRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

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

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!active || !containerRef.current) return;

    if (event.key === KeyboardKeys.Escape && onEscape) {
      event.preventDefault();
      onEscape();
      return;
    }

    if (event.key === KeyboardKeys.Tab) {
      trapFocus(containerRef.current, event);
    }
  };

  return (
    <div ref={containerRef} onKeyDown={handleKeyDown}>
      {children}
    </div>
  );
}
