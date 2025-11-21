/**
 * Alert - Visual Feedback Component
 * Provides consistent messaging with icons and colors
 */

import { type ReactNode } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string | ReactNode;
  onClose?: () => void;
  className?: string;
  testId?: string;
}

export function Alert({ 
  type = 'info', 
  title, 
  message, 
  onClose, 
  className = '',
  testId
}: AlertProps) {
  const config = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-500',
      text: 'text-green-800',
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-500',
      text: 'text-red-800',
      icon: <XCircle className="w-5 h-5 text-red-600" />,
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-500',
      text: 'text-yellow-800',
      icon: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-500',
      text: 'text-blue-800',
      icon: <Info className="w-5 h-5 text-blue-600" />,
    },
  };

  const { bg, border, text, icon } = config[type];

  return (
    <div
      className={`${bg} ${border} border-l-4 p-4 rounded-lg animate-slide-in-down ${className}`}
      role="alert"
      data-testid={testId}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">{icon}</div>
        
        <div className="flex-1">
          {title && (
            <h4 className={`font-semibold mb-1 ${text}`} data-testid={`${testId}-title`}>
              {title}
            </h4>
          )}
          <div className={text} data-testid={`${testId}-message`}>
            {message}
          </div>
        </div>
        
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close alert"
            data-testid={`${testId}-close`}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
