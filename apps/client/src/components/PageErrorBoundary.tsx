/**
 * Page-Level Error Boundary
 * Granular error boundaries for individual pages with recovery actions
 */

import { Component, ReactNode, ErrorInfo } from 'react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { AlertCircle, RefreshCw, Home, ArrowLeft } from 'lucide-react';

interface PageErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  pageName?: string;
}

interface PageErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorCount: number;
}

export class PageErrorBoundary extends Component<PageErrorBoundaryProps, PageErrorBoundaryState> {
  constructor(props: PageErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<PageErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    console.error('Page Error Boundary caught an error:', error, errorInfo);

    // Update state with error details
    this.setState(prevState => ({
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, send to error tracking service
    if (import.meta.env.PROD) {
      // TODO: Integrate with error tracking (e.g., Sentry)
      this.logErrorToService(error, errorInfo);
    }
  }

  logErrorToService(error: Error, errorInfo: ErrorInfo) {
    // Placeholder for error tracking service integration
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };
    
    console.log('Error logged:', errorData);
    // fetch('/api/errors', { method: 'POST', body: JSON.stringify(errorData) });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleGoBack = () => {
    window.history.back();
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
          <Card className="max-w-2xl w-full p-8" data-testid="page-error-boundary">
            <div className="text-center">
              <AlertCircle 
                className="h-16 w-16 text-red-500 mx-auto mb-4" 
                aria-hidden="true"
              />
              <h1 className="text-2xl font-bold mb-2">
                {this.props.pageName ? `${this.props.pageName} Error` : 'Something went wrong'}
              </h1>
              <p className="text-muted-foreground mb-6">
                We encountered an unexpected error on this page. Don't worry, your data is safe.
              </p>

              {/* Error details in development */}
              {!import.meta.env.PROD && this.state.error && (
                <details className="mb-6 text-left">
                  <summary className="cursor-pointer text-sm font-medium mb-2">
                    Error Details (Development Only)
                  </summary>
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-sm">
                    <p className="font-mono text-xs mb-2">
                      <strong>Error:</strong> {this.state.error.message}
                    </p>
                    {this.state.error.stack && (
                      <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                        {this.state.error.stack}
                      </pre>
                    )}
                  </div>
                </details>
              )}

              {/* Recovery Actions */}
              <div className="flex flex-wrap gap-3 justify-center">
                <Button
                  onClick={this.handleReset}
                  variant="default"
                  data-testid="button-reset-error"
                  aria-label="Try again"
                >
                  <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
                  Try Again
                </Button>
                
                <Button
                  onClick={this.handleGoBack}
                  variant="outline"
                  data-testid="button-go-back"
                  aria-label="Go back to previous page"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
                  Go Back
                </Button>

                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  data-testid="button-go-home"
                  aria-label="Go to home page"
                >
                  <Home className="h-4 w-4 mr-2" aria-hidden="true" />
                  Home
                </Button>

                {this.state.errorCount > 2 && (
                  <Button
                    onClick={this.handleReload}
                    variant="outline"
                    data-testid="button-reload-page"
                    aria-label="Reload the entire page"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
                    Reload Page
                  </Button>
                )}
              </div>

              {/* Help message */}
              <p className="text-sm text-muted-foreground mt-6">
                If this problem persists, please contact support or try clearing your browser cache.
              </p>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
