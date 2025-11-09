import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Page-Level Error Boundary
 * Granular error boundaries for individual pages with recovery actions
 */
import { Component } from 'react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { AlertCircle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
export class PageErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            errorCount: 0,
        };
    }
    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            error,
        };
    }
    componentDidCatch(error, errorInfo) {
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
    logErrorToService(error, errorInfo) {
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
            return (_jsx("div", { className: "min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900", children: _jsx(Card, { className: "max-w-2xl w-full p-8", "data-testid": "page-error-boundary", children: _jsxs("div", { className: "text-center", children: [_jsx(AlertCircle, { className: "h-16 w-16 text-red-500 mx-auto mb-4", "aria-hidden": "true" }), _jsx("h1", { className: "text-2xl font-bold mb-2", children: this.props.pageName ? `${this.props.pageName} Error` : 'Something went wrong' }), _jsx("p", { className: "text-muted-foreground mb-6", children: "We encountered an unexpected error on this page. Don't worry, your data is safe." }), !import.meta.env.PROD && this.state.error && (_jsxs("details", { className: "mb-6 text-left", children: [_jsx("summary", { className: "cursor-pointer text-sm font-medium mb-2", children: "Error Details (Development Only)" }), _jsxs("div", { className: "bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-sm", children: [_jsxs("p", { className: "font-mono text-xs mb-2", children: [_jsx("strong", { children: "Error:" }), " ", this.state.error.message] }), this.state.error.stack && (_jsx("pre", { className: "text-xs overflow-x-auto whitespace-pre-wrap", children: this.state.error.stack }))] })] })), _jsxs("div", { className: "flex flex-wrap gap-3 justify-center", children: [_jsxs(Button, { onClick: this.handleReset, variant: "primary", "data-testid": "button-reset-error", "aria-label": "Try again", children: [_jsx(RefreshCw, { className: "h-4 w-4 mr-2", "aria-hidden": "true" }), "Try Again"] }), _jsxs(Button, { onClick: this.handleGoBack, variant: "secondary", "data-testid": "button-go-back", "aria-label": "Go back to previous page", children: [_jsx(ArrowLeft, { className: "h-4 w-4 mr-2", "aria-hidden": "true" }), "Go Back"] }), _jsxs(Button, { onClick: this.handleGoHome, variant: "secondary", "data-testid": "button-go-home", "aria-label": "Go to home page", children: [_jsx(Home, { className: "h-4 w-4 mr-2", "aria-hidden": "true" }), "Home"] }), this.state.errorCount > 2 && (_jsxs(Button, { onClick: this.handleReload, variant: "secondary", "data-testid": "button-reload-page", "aria-label": "Reload the entire page", children: [_jsx(RefreshCw, { className: "h-4 w-4 mr-2", "aria-hidden": "true" }), "Reload Page"] }))] }), _jsx("p", { className: "text-sm text-muted-foreground mt-6", children: "If this problem persists, please contact support or try clearing your browser cache." })] }) }) }));
        }
        return this.props.children;
    }
}
