/**
 * Error Tracking Utilities
 * Centralized error logging and tracking
 */

export interface ErrorContext {
  user?: {
    id?: string;
    email?: string;
  };
  tags?: Record<string, string>;
  extra?: Record<string, any>;
}

class ErrorTracker {
  private static instance: ErrorTracker;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker();
    }
    return ErrorTracker.instance;
  }

  /**
   * Initialize error tracking
   */
  init(options: { environment: string; dsn?: string }) {
    if (this.isInitialized) {
      console.warn('Error tracker already initialized');
      return;
    }

    // TODO: Initialize actual error tracking service (e.g., Sentry)
    console.log('Error tracking initialized:', options);
    
    // Set up global error handlers
    this.setupGlobalHandlers();
    
    this.isInitialized = true;
  }

  /**
   * Set up global error handlers
   */
  private setupGlobalHandlers() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      this.captureException(event.reason, {
        tags: { type: 'unhandled-rejection' },
      });
    });

    // Handle global errors
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
      this.captureException(event.error, {
        tags: { type: 'global-error' },
      });
    });
  }

  /**
   * Capture an exception
   */
  captureException(error: Error, context?: ErrorContext) {
    if (!this.isInitialized && !import.meta.env.DEV) {
      console.warn('Error tracker not initialized');
    }

    const errorData = {
      message: error.message,
      stack: error.stack,
      name: error.name,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      context,
    };

    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('Error captured:', errorData);
      return;
    }

    // Send to backend error logging endpoint
    this.sendToBackend(errorData);
  }

  /**
   * Capture a message (non-error)
   */
  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info', context?: ErrorContext) {
    const messageData = {
      message,
      level,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      context,
    };

    if (import.meta.env.DEV) {
      console.log('Message captured:', messageData);
      return;
    }

    this.sendToBackend(messageData);
  }

  /**
   * Send error data to backend
   */
  private async sendToBackend(data: any) {
    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.error('Failed to send error to backend:', err);
    }
  }

  /**
   * Set user context for error tracking
   */
  setUser(user: { id?: string; email?: string; username?: string }) {
    console.log('User context set:', user);
    // TODO: Set user context in actual error tracking service
  }

  /**
   * Add breadcrumb for debugging
   */
  addBreadcrumb(breadcrumb: {
    message: string;
    category?: string;
    level?: 'info' | 'warning' | 'error';
    data?: Record<string, any>;
  }) {
    console.log('Breadcrumb added:', breadcrumb);
    // TODO: Add breadcrumb to actual error tracking service
  }
}

// Export singleton instance
export const errorTracker = ErrorTracker.getInstance();

// Initialize in production
if (import.meta.env.PROD) {
  errorTracker.init({
    environment: 'production',
  });
}
