import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const toastStyles = {
  success: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
  error: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800',
  info: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800',
  warning: 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800',
};

const iconStyles = {
  success: 'text-green-600 dark:text-green-400',
  error: 'text-red-600 dark:text-red-400',
  info: 'text-blue-600 dark:text-blue-400',
  warning: 'text-yellow-600 dark:text-yellow-400',
};

/**
 * Toast Notification Component
 * Displays temporary notification messages
 */
export function Toast({ id, type, title, message, duration = 5000, onClose }: ToastProps) {
  const Icon = toastIcons[type];

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  return (
    <Card
      className={`${toastStyles[type]} p-4 shadow-lg border-2 animate-slide-in-right`}
      data-testid={`toast-${type}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${iconStyles[type]}`} />
        
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 dark:text-white" data-testid={`toast-title-${id}`}>
            {title}
          </p>
          {message && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1" data-testid={`toast-message-${id}`}>
              {message}
            </p>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onClose(id)}
          className="flex-shrink-0 h-6 w-6 p-0"
          data-testid={`toast-close-${id}`}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}

/**
 * Toast Container Component
 * Manages multiple toasts
 */
export interface ToastContainerProps {
  toasts: ToastProps[];
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

const positionStyles = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
};

export function ToastContainer({ toasts, position = 'top-right' }: ToastContainerProps) {
  return (
    <div
      className={`fixed ${positionStyles[position]} z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none`}
      data-testid="toast-container"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast {...toast} />
        </div>
      ))}
    </div>
  );
}
