/**
 * Error Tracking Utilities
 * Centralized error logging and tracking using Sentry
 */

import * as Sentry from '@sentry/react';

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
   * Initialize error tracking - Sentry is already initialized in instrument.ts
   */
  init(options: { environment: string; dsn?: string }) {
    if (this.isInitialized) {
      console.warn('Error tracker already initialized');
      return;
    }

    console.log('✅ Error tracking service connected (Sentry)');
    
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
   * Capture an exception using Sentry
   */
  captureException(error: Error, context?: ErrorContext) {
    if (!this.isInitialized && !import.meta.env.DEV) {
      console.warn('Error tracker not initialized');
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('Error captured:', error, context);
    }

    // Send to Sentry with context
    Sentry.captureException(error, {
      tags: context?.tags,
      extra: context?.extra,
      user: context?.user,
    });
  }

  /**
   * Capture a message (non-error) using Sentry
   */
  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info', context?: ErrorContext) {
    if (import.meta.env.DEV) {
      console.log(`[${level.toUpperCase()}] Message captured:`, message, context);
    }

    Sentry.captureMessage(message, {
      level: level as Sentry.SeverityLevel,
      tags: context?.tags,
      extra: context?.extra,
      user: context?.user,
    });
  }

  /**
   * Set user context for error tracking using Sentry
   */
  setUser(user: { id?: string; email?: string; username?: string }) {
    console.log('User context set:', user);
    Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.username,
    });
  }

  /**
   * Add breadcrumb for debugging using Sentry
   */
  addBreadcrumb(breadcrumb: {
    message: string;
    category?: string;
    level?: 'info' | 'warning' | 'error';
    data?: Record<string, any>;
  }) {
    console.log('Breadcrumb added:', breadcrumb);
    Sentry.addBreadcrumb({
      message: breadcrumb.message,
      category: breadcrumb.category,
      level: breadcrumb.level as Sentry.SeverityLevel,
      data: breadcrumb.data,
    });
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
