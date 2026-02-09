import { AlertCircle, RefreshCw, Loader2 } from "lucide-react";
import { Link } from "wouter";

export function AdminErrorBanner({ title = "Unable to load data", message = "Authentication may be required or the service is temporarily unavailable.", onRetry, testId = "error-state" }) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 p-6" data-testid={testId}>
      <AlertCircle className="w-12 h-12 text-destructive/60" />
      <h2 className="text-xl font-semibold" data-testid="text-error-title">{title}</h2>
      <p className="text-muted-foreground text-sm text-center max-w-md">{message}</p>
      <div className="flex items-center gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            data-testid="button-retry"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
        )}
        <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-back-command-center">
          Back to Command Center
        </Link>
      </div>
    </div>
  );
}

export function AdminLoadingState({ label = "Loading...", testId = "loading-state" }) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 p-6" data-testid={testId}>
      <Loader2 className="w-10 h-10 animate-spin text-primary/60" />
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
}

export function AdminInlineError({ message = "Failed to load this section", onRetry, testId = "inline-error" }) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-sm" data-testid={testId}>
      <AlertCircle className="w-5 h-5 text-destructive/60 flex-shrink-0" />
      <span className="text-muted-foreground flex-1">{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-xs font-medium hover:bg-destructive/20 transition-colors"
          data-testid="button-inline-retry"
        >
          <RefreshCw className="w-3 h-3" /> Retry
        </button>
      )}
    </div>
  );
}
