import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Section-Level Error Boundary
 * Smaller error boundaries for individual sections/components
 */
import { Component } from 'react';
import { Button } from '@/components/Button';
import { AlertCircle, RefreshCw } from 'lucide-react';
export class SectionErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
        };
    }
    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            error,
        };
    }
    componentDidCatch(error, errorInfo) {
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
            return (_jsx("div", { className: "p-6 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10 rounded-lg", role: "alert", "data-testid": "section-error-boundary", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(AlertCircle, { className: "h-5 w-5 text-red-500 flex-shrink-0 mt-0.5", "aria-hidden": "true" }), _jsxs("div", { className: "flex-1", children: [_jsxs("h3", { className: "font-medium text-red-900 dark:text-red-100 mb-1", children: [this.props.sectionName || 'Section', " Error"] }), _jsx("p", { className: "text-sm text-red-700 dark:text-red-300 mb-3", children: "This section failed to load. The rest of the page is still working." }), this.props.showDetails && !import.meta.env.PROD && this.state.error && (_jsx("p", { className: "text-xs font-mono text-red-600 dark:text-red-400 mb-3", children: this.state.error.message })), _jsxs(Button, { onClick: this.handleReset, variant: "secondary", size: "sm", "data-testid": "button-reset-section", "aria-label": `Retry loading ${this.props.sectionName || 'this section'}`, children: [_jsx(RefreshCw, { className: "h-3 w-3 mr-2", "aria-hidden": "true" }), "Retry"] })] })] }) }));
        }
        return this.props.children;
    }
}
