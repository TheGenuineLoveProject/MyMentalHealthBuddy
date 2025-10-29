/**
 * Section-Level Error Boundary
 * Smaller error boundaries for individual sections/components
 */

import { Component, ReactNode, ErrorInfo } from 'react';
import { Button } from '@/components/Button.tsx';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface SectionErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  sectionName?: string;
  showDetails?: boolean;
}

interface SectionErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class SectionErrorBoundary extends Component<
  SectionErrorBoundaryProps,
  SectionErrorBoundaryState
> {
  constructor(props: SectionErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<SectionErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Section Error (${this.props.sectionName}):`, error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          className="p-6 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10 rounded-lg"
          role="alert"
          data-testid="section-error-boundary"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div className="flex-1">
              <h3 className="font-medium text-red-900 dark:text-red-100 mb-1">
                {this.props.sectionName || 'Section'} Error
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                This section failed to load. The rest of the page is still working.
              </p>
              {this.props.showDetails && !import.meta.env.PROD && this.state.error && (
                <p className="text-xs font-mono text-red-600 dark:text-red-400 mb-3">
                  {this.state.error.message}
                </p>
              )}
              <Button
                onClick={this.handleReset}
                variant="outline"
                size="sm"
                data-testid="button-reset-section"
                aria-label={`Retry loading ${this.props.sectionName || 'this section'}`}
              >
                <RefreshCw className="h-3 w-3 mr-2" aria-hidden="true" />
                Retry
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
