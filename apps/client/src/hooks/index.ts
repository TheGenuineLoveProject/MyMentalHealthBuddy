/**
 * Custom Hooks Library
 * Centralized exports for all custom React hooks
 */

export { useDebounce } from './useDebounce';
export { useLocalStorage } from './useLocalStorage';
export { 
  useMediaQuery, 
  useIsMobile, 
  useIsTablet, 
  useIsDesktop,
  usePrefersDarkMode,
  usePrefersReducedMotion
} from './useMediaQuery';
export { useOnClickOutside } from './useOnClickOutside';

// Toast hook now exported from ToastContext
export { useToast } from '../contexts/ToastContext';
