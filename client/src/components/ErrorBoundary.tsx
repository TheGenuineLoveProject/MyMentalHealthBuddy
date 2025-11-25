import { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div 
          className="min-h-screen flex items-center justify-center p-4"
          style={{ background: "var(--background)" }}
          data-testid="error-boundary"
        >
          <div 
            className="max-w-md w-full text-center p-8 rounded-2xl animate-fade-in"
            style={{ background: "var(--surface)", boxShadow: "var(--shadow-lg)" }}
          >
            <div 
              className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" }}
            >
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            
            <h2 
              className="text-2xl font-bold mb-3"
              style={{ color: "var(--text-primary)" }}
              data-testid="error-title"
            >
              Something went wrong
            </h2>
            
            <p 
              className="mb-6"
              style={{ color: "var(--text-secondary)" }}
              data-testid="error-message"
            >
              We encountered an unexpected error. Don't worry, your data is safe.
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="btn-primary flex items-center gap-2"
                data-testid="button-retry"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="btn-secondary flex items-center gap-2"
                data-testid="button-go-home"
              >
                <Home className="w-4 h-4" />
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
