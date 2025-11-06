/**
 * Error Handler Hook
 * Centralized error handling with user-friendly messages
 */

import { useCallback } from 'react';
import { useToast } from '@/contexts/ToastContext';

interface ErrorHandlerOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  rethrow?: boolean;
}

export function useErrorHandler() {
  const { error: showError } = useToast();

  const handleError = useCallback(
    (error: unknown, options: ErrorHandlerOptions = {}) => {
      const {
        showToast = true,
        logToConsole = true,
        rethrow = false,
      } = options;

      // Extract error message
      let message = 'An unexpected error occurred';
      let details = '';

      if (error instanceof Error) {
        message = error.message;
        details = error.stack || '';
      } else if (typeof error === 'string') {
        message = error;
      } else if (error && typeof error === 'object' && 'message' in error) {
        message = String(error.message);
      }

      // Log to console
      if (logToConsole) {
        console.error('Error handled:', error);
      }

      // Show toast notification
      if (showToast) {
        showError('Error', getUserFriendlyMessage(message), 5000);
      }

      // Log to error tracking service in production
      if (import.meta.env.PROD && error instanceof Error) {
        logErrorToService(error);
      }

      // Rethrow if needed
      if (rethrow) {
        throw error;
      }
    },
    [showError]
  );

  return { handleError };
}

/**
 * Convert technical error messages to user-friendly ones
 */
function getUserFriendlyMessage(technicalMessage: string): string {
  const errorMappings: Record<string, string> = {
    'Network request failed': 'Unable to connect. Please check your internet connection.',
    'Failed to fetch': 'Unable to load data. Please try again.',
    'Unauthorized': 'Your session has expired. Please log in again.',
    '403': 'You don\'t have permission to access this.',
    '404': 'The requested resource was not found.',
    '500': 'Server error. Please try again later.',
    'timeout': 'The request took too long. Please try again.',
  };

  // Check if message contains any known error patterns
  for (const [pattern, friendlyMessage] of Object.entries(errorMappings)) {
    if (technicalMessage.toLowerCase().includes(pattern.toLowerCase())) {
      return friendlyMessage;
    }
  }

  // Default: return the original message but cleaned up
  return technicalMessage.length > 100
    ? technicalMessage.substring(0, 100) + '...'
    : technicalMessage;
}

/**
 * Log error to external service (placeholder)
 */
function logErrorToService(error: Error) {
  // TODO: Integrate with error tracking service (e.g., Sentry, LogRocket)
  const errorData = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
  };

  console.log('Error would be logged to service:', errorData);
  
  // Example integration:
  // fetch('/api/errors', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(errorData),
  // });
}
