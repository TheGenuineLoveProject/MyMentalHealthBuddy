import React, { Suspense } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

function isDiagnosticsVisible() {
  try {
    if (import.meta.env && import.meta.env.DEV) return true;
  } catch {}
  try {
    if (typeof sessionStorage !== "undefined" && sessionStorage.getItem("adminSessionToken")) {
      return true;
    }
  } catch {}
  return false;
}

export class AdminErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
    this.handleRetry = this.handleRetry.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    const name = this.props.name || "admin panel";
    console.error(`[AdminErrorBoundary:${name}]`, error, info);
    this.setState({ info });
  }

  handleRetry() {
    this.setState({ error: null, info: null });
  }

  render() {
    if (this.state.error) {
      const name = this.props.name || "Panel";
      const showDetails = isDiagnosticsVisible();
      return (
        <div
          className="mb-6 p-4 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20"
          role="alert"
          data-testid={`admin-panel-error-${name}`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-600 flex-shrink-0" />
              <span className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                {name} couldn’t load
              </span>
            </div>
            <button
              type="button"
              onClick={this.handleRetry}
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
              data-testid={`button-retry-panel-${name}`}
            >
              <RotateCcw size={12} /> Retry
            </button>
          </div>
          <p className="text-xs text-amber-700 dark:text-amber-300">
            This panel hit an error, but the rest of the page is still working. You can retry, or
            keep going — nothing was lost.
          </p>
          {showDetails && (
            <details className="mt-2" data-testid={`details-panel-error-${name}`}>
              <summary className="text-[11px] cursor-pointer text-amber-700 dark:text-amber-300 font-medium">
                Technical details
              </summary>
              <p className="mt-1 text-[11px] font-mono text-red-700 dark:text-red-400 break-all">
                {(this.state.error && (this.state.error.message || String(this.state.error))) ||
                  "Unknown error"}
              </p>
              {this.state.info?.componentStack ? (
                <pre className="mt-1 p-2 rounded bg-background border border-amber-100 dark:border-amber-800 text-[10px] whitespace-pre-wrap overflow-x-auto text-amber-900 dark:text-amber-200">
                  {this.state.info.componentStack.trim()}
                </pre>
              ) : null}
            </details>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

export function AdminPanelSkeleton({ name }) {
  return (
    <div
      className="mb-6 p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-muted/20 animate-pulse"
      role="status"
      aria-live="polite"
      data-testid={`admin-panel-loading-${name || "panel"}`}
    >
      <span className="sr-only">Loading {name || "panel"}…</span>
      <div className="h-4 w-40 rounded bg-gray-200 dark:bg-gray-700 mb-3" />
      <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-700" />
    </div>
  );
}

export function LazyAdminPanel({ name, children, fallback }) {
  return (
    <AdminErrorBoundary name={name}>
      <Suspense fallback={fallback ?? <AdminPanelSkeleton name={name} />}>
        {children}
      </Suspense>
    </AdminErrorBoundary>
  );
}

export default AdminErrorBoundary;
