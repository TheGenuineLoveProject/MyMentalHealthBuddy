import { AdminInlineError } from "./AdminQueryStates";

export default function PublishingQueryState({ section, error, loading, fetching, onRetry, children }) {
  if (error) {
    return (
      <div role="alert" aria-busy={!!fetching} data-testid={`publishing-error-${section}`}>
        <AdminInlineError
          message={`Unable to load ${section}. Your session may have expired, access may be restricted, or the service may be unavailable.`}
          onRetry={fetching ? undefined : onRetry}
        />
        {fetching && <p role="status">Retrying {section}…</p>}
      </div>
    );
  }
  if (loading) return <p role="status">Loading {section}…</p>;
  return children;
}