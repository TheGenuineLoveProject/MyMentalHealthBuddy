import { useState, useCallback } from 'react';
import type { ToastType, ToastProps } from '@/components/Toast';

let toastCounter = 0;

/**
 * Custom hook for managing toast notifications
 * Provides methods to show/hide toasts
 */
export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const showToast = useCallback((
    type: ToastType,
    title: string,
    message?: string,
    duration?: number
  ) => {
    const id = `toast-${++toastCounter}`;
    
    const toast: ToastProps = {
      id,
      type,
      title,
      message,
      duration,
      onClose: (toastId: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== toastId));
      },
    };

    setToasts((prev) => [...prev, toast]);
    return id;
  }, []);

  const success = useCallback(
    (title: string, message?: string, duration?: number) =>
      showToast('success', title, message, duration),
    [showToast]
  );

  const error = useCallback(
    (title: string, message?: string, duration?: number) =>
      showToast('error', title, message, duration),
    [showToast]
  );

  const info = useCallback(
    (title: string, message?: string, duration?: number) =>
      showToast('info', title, message, duration),
    [showToast]
  );

  const warning = useCallback(
    (title: string, message?: string, duration?: number) =>
      showToast('warning', title, message, duration),
    [showToast]
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    success,
    error,
    info,
    warning,
    dismiss,
    dismissAll,
  };
}
