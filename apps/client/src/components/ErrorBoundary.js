import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
/**
 * Advanced Error Boundary Component
 * Catches JavaScript errors in child components and displays fallback UI
 */
export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
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
            return (_jsx("div", { className: "min-h-screen flex items-center justify-center p-4 bg-gradient-mesh", children: _jsx(Card, { className: "max-w-2xl w-full p-8 shadow-2xl", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900 mb-6", children: _jsx(AlertCircle, { className: "h-10 w-10 text-red-600 dark:text-red-300" }) }), _jsx("h1", { className: "text-3xl font-bold mb-3 text-gray-900 dark:text-white", "data-testid": "text-error-title", children: "Oops! Something went wrong" }), _jsx("p", { className: "text-lg text-gray-600 dark:text-gray-300 mb-6", children: "We encountered an unexpected error. Don't worry, your data is safe." }), import.meta.env.DEV && this.state.error && (_jsxs("div", { className: "mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-left overflow-auto max-h-48", children: [_jsx("p", { className: "font-mono text-sm text-red-600 dark:text-red-400 mb-2", children: this.state.error.toString() }), this.state.errorInfo && (_jsx("pre", { className: "font-mono text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap", children: this.state.errorInfo.componentStack }))] })), _jsxs("div", { className: "flex gap-3 justify-center", children: [_jsxs(Button, { onClick: this.handleReset, variant: "primary", className: "inline-flex items-center gap-2", "data-testid": "button-try-again", children: [_jsx(RefreshCw, { className: "h-4 w-4" }), "Try Again"] }), _jsxs(Button, { onClick: this.handleGoHome, variant: "secondary", className: "inline-flex items-center gap-2", "data-testid": "button-go-home", children: [_jsx(Home, { className: "h-4 w-4" }), "Go Home"] })] }), _jsx("p", { className: "mt-6 text-sm text-gray-500 dark:text-gray-400", children: "If this problem persists, please contact support." })] }) }) }));
        }
        return this.props.children;
    }
}
// Functional wrapper for easier use
export function withErrorBoundary(Component, fallback) {
    return function WithErrorBoundaryWrapper(props) {
        return (_jsx(ErrorBoundary, { fallback: fallback, children: _jsx(Component, { ...props }) }));
    };
}
