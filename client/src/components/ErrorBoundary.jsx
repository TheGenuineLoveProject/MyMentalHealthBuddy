import { Component } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
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
          className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-neutral-900 to-neutral-950"
          role="alert"
          aria-live="assertive"
          data-testid="error-boundary"
        >
          <div className="max-w-md w-full text-center p-8 rounded-2xl bg-neutral-800 shadow-xl">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center bg-gradient-to-br from-red-500 to-pink-600">
              <AlertTriangle className="w-8 h-8 text-white" aria-hidden="true" />
            </div>
            
            <h2 
              className="text-2xl font-bold mb-3 text-white"
              data-testid="error-title"
            >
              Something went wrong
            </h2>
            
            <p 
              className="mb-6 text-neutral-400"
              data-testid="error-message"
            >
              We encountered an unexpected error. Don't worry, your data is safe.
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                data-testid="button-retry"
              >
                <RefreshCw className="w-4 h-4" aria-hidden="true" />
                Try Again
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition"
                data-testid="button-go-home"
              >
                <Home className="w-4 h-4" aria-hidden="true" />
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
