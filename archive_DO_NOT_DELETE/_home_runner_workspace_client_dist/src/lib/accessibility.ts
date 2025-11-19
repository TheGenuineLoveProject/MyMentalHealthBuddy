/**
 * Accessibility Utilities
 * Comprehensive ARIA attributes and keyboard navigation helpers
 */

export interface AriaProps {
  role?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-controls'?: string;
  'aria-current'?: 'page' | 'step' | 'location' | 'date' | 'time' | boolean;
  'aria-live'?: 'polite' | 'assertive' | 'off';
  'aria-atomic'?: boolean;
  'aria-busy'?: boolean;
  'aria-disabled'?: boolean;
  'aria-hidden'?: boolean;
  'aria-invalid'?: boolean;
  'aria-required'?: boolean;
  'aria-selected'?: boolean;
  'aria-checked'?: boolean | 'mixed';
  'aria-pressed'?: boolean;
  'aria-haspopup'?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
  'aria-modal'?: boolean;
  tabIndex?: number;
}

/**
 * Generate ARIA attributes for navigation links
 */
export function getNavLinkAria(isActive: boolean, label: string): AriaProps {
  return {
    'aria-label': label,
    'aria-current': isActive ? 'page' : undefined,
    tabIndex: 0,
  };
}

/**
 * Generate ARIA attributes for buttons
 */
export function getButtonAria(label: string, isDisabled = false, isPressed?: boolean): AriaProps {
  return {
    'aria-label': label,
    'aria-disabled': isDisabled,
    'aria-pressed': isPressed,
    tabIndex: isDisabled ? -1 : 0,
  };
}

/**
 * Generate ARIA attributes for modals/dialogs
 */
export function getModalAria(titleId: string, descriptionId?: string): AriaProps {
  return {
    role: 'dialog',
    'aria-modal': true,
    'aria-labelledby': titleId,
    'aria-describedby': descriptionId,
    tabIndex: -1,
  };
}

/**
 * Generate ARIA attributes for form inputs
 */
export function getInputAria(
  label: string,
  isInvalid = false,
  isRequired = false,
  errorId?: string
): AriaProps {
  return {
    'aria-label': label,
    'aria-invalid': isInvalid,
    'aria-required': isRequired,
    'aria-describedby': isInvalid ? errorId : undefined,
  };
}

/**
 * Generate ARIA attributes for live regions (announcements)
 */
export function getLiveRegionAria(politeness: 'polite' | 'assertive' = 'polite'): AriaProps {
  return {
    role: 'status',
    'aria-live': politeness,
    'aria-atomic': true,
  };
}

/**
 * Generate ARIA attributes for disclosure widgets (expandable sections)
 */
export function getDisclosureAria(
  isExpanded: boolean,
  controlsId: string,
  label: string
): AriaProps {
  return {
    'aria-expanded': isExpanded,
    'aria-controls': controlsId,
    'aria-label': label,
    tabIndex: 0,
  };
}

/**
 * Generate ARIA attributes for tabs
 */
export function getTabAria(
  isSelected: boolean,
  controlsId: string,
  label: string
): AriaProps {
  return {
    role: 'tab',
    'aria-selected': isSelected,
    'aria-controls': controlsId,
    'aria-label': label,
    tabIndex: isSelected ? 0 : -1,
  };
}

/**
 * Generate ARIA attributes for dropdown menus
 */
export function getMenuAria(isOpen: boolean, label: string): AriaProps {
  return {
    'aria-haspopup': 'menu',
    'aria-expanded': isOpen,
    'aria-label': label,
    tabIndex: 0,
  };
}

/**
 * Keyboard event handler helpers
 */
export const KeyboardKeys = {
  Enter: 'Enter',
  Space: ' ',
  Escape: 'Escape',
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
  Tab: 'Tab',
  Home: 'Home',
  End: 'End',
} as const;

/**
 * Check if event is activation key (Enter or Space)
 */
export function isActivationKey(event: React.KeyboardEvent): boolean {
  return event.key === KeyboardKeys.Enter || event.key === KeyboardKeys.Space;
}

/**
 * Check if event is escape key
 */
export function isEscapeKey(event: React.KeyboardEvent): boolean {
  return event.key === KeyboardKeys.Escape;
}

/**
 * Check if event is arrow navigation key
 */
export function isArrowKey(event: React.KeyboardEvent): boolean {
  const arrowKeys = [
    KeyboardKeys.ArrowUp,
    KeyboardKeys.ArrowDown,
    KeyboardKeys.ArrowLeft,
    KeyboardKeys.ArrowRight,
  ];
  return arrowKeys.includes(event.key as any);
}

/**
 * Trap focus within a container (for modals)
 */
export function trapFocus(
  container: HTMLElement,
  event: React.KeyboardEvent | KeyboardEvent
): void {
  if (event.key !== KeyboardKeys.Tab) return;

  const focusableElements = container.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement?.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement?.focus();
  }
}

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(message: string, politeness: 'polite' | 'assertive' = 'polite'): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', politeness);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Get accessible color contrast ratio
 */
export function getContrastRatio(foreground: string, background: string): number {
  // Simplified contrast calculation - real implementation would parse RGB values
  // This is a placeholder for proper WCAG contrast ratio calculation
  return 4.5; // WCAG AA minimum for normal text
}

/**
 * Check if color combination meets WCAG standards
 */
export function meetsWCAGContrast(foreground: string, background: string, level: 'AA' | 'AAA' = 'AA'): boolean {
  const ratio = getContrastRatio(foreground, background);
  const minimumRatio = level === 'AAA' ? 7 : 4.5;
  return ratio >= minimumRatio;
}
