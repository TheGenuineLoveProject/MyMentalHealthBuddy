import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export class SafeBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    this.setState({ info });
    try {
      console.error(`[SafeBoundary:${this.props.label || "panel"}]`, error, info);
    } catch {}
  }

  reset = () => this.setState({ error: null, info: null });

  render() {
    if (!this.state.error) return this.props.children;

    const label = this.props.label || "section";
    const message =
      (this.state.error && (this.state.error.message || String(this.state.error))) ||
      "Unknown render error";
    const stack = this.state.info?.componentStack || "";

    return (
      <div
        role="alert"
        data-testid={`safeboundary-${label.toLowerCase().replace(/\s+/g, "-")}`}
        style={{
          margin: "0.75rem 0",
          padding: "1rem 1.25rem",
          borderRadius: "12px",
          border: "1px solid rgba(239,68,68,0.2)",
          background: "rgba(239,68,68,0.04)",
          color: "#7f1d1d",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
          <AlertTriangle size={16} aria-hidden="true" />
          <strong style={{ fontSize: "0.92rem" }}>
            "{label}" failed to load
          </strong>
          <button
            type="button"
            onClick={this.reset}
            style={{
              marginLeft: "auto",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "0.72rem",
              padding: "3px 8px",
              borderRadius: "6px",
              border: "1px solid rgba(127,29,29,0.25)",
              background: "white",
              color: "#7f1d1d",
              cursor: "pointer",
            }}
            data-testid={`button-retry-${label.toLowerCase().replace(/\s+/g, "-")}`}
            aria-label={`Retry ${label}`}
          >
            <RefreshCw size={12} aria-hidden="true" /> Retry
          </button>
        </div>
        <p style={{ margin: 0, fontSize: "0.82rem", color: "#991b1b" }}>
          {message}
        </p>
        {stack ? (
          <details style={{ marginTop: "0.5rem", fontSize: "0.72rem", color: "#7f1d1d" }}>
            <summary style={{ cursor: "pointer" }}>Component trace</summary>
            <pre
              style={{
                marginTop: "0.4rem",
                padding: "0.5rem",
                background: "rgba(255,255,255,0.6)",
                borderRadius: "6px",
                overflowX: "auto",
                fontSize: "0.7rem",
                whiteSpace: "pre-wrap",
              }}
            >
              {stack.trim()}
            </pre>
          </details>
        ) : null}
      </div>
    );
  }
}

export default SafeBoundary;
