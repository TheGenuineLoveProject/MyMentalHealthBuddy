import { Component, ErrorInfo, ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Advanced Error Boundary Component
 * Catches JavaScript errors in child components and displays fallback UI
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }

    // Log to error tracking service in production
    if (import.meta.env.PROD) {
      // Send to Sentry, LogRocket, etc.
      console.error('[Production Error]', {
        error: error.toString(),
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
      });
    }

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-mesh">
          <Card className="max-w-2xl w-full p-8 shadow-2xl">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900 mb-6">
                <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-300" />
              </div>
              
              <h1 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white" data-testid="text-error-title">
                Oops! Something went wrong
              </h1>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                We encountered an unexpected error. Don't worry, your data is safe.
              </p>

              {import.meta.env.DEV && this.state.error && (
                <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-left overflow-auto max-h-48">
                  <p className="font-mono text-sm text-red-600 dark:text-red-400 mb-2">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <pre className="font-mono text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              )}

              <div className="flex gap-3 justify-center">
                <Button
                  onClick={this.handleReset}
                  variant="default"
                  className="inline-flex items-center gap-2"
                  data-testid="button-try-again"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
                
                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="inline-flex items-center gap-2"
                  data-testid="button-go-home"
                >
                  <Home className="h-4 w-4" />
                  Go Home
                </Button>
              </div>

              <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                If this problem persists, please contact support.
              </p>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Functional wrapper for easier use
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithErrorBoundaryWrapper(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
