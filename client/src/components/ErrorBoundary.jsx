import React from "react";
import { Heart, RefreshCw, Home } from "lucide-react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error("UI error caught by ErrorBoundary:", error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            fontFamily: "system-ui, -apple-system, sans-serif",
            background: "#faf9f7",
            color: "#3a3a3a",
          }}
          role="alert"
        >
          <div style={{ maxWidth: 480, textAlign: "center" }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "rgba(143,191,159,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem",
              }}
            >
              <Heart size={28} color="#2f5d5d" />
            </div>

            <h1
              style={{
                fontSize: "1.5rem",
                fontWeight: 600,
                color: "#2f5d5d",
                marginBottom: "0.75rem",
              }}
            >
              Something unexpected happened
            </h1>

            <p
              style={{
                fontSize: "1rem",
                lineHeight: 1.6,
                color: "#666",
                marginBottom: "1.5rem",
              }}
            >
              This isn't your fault — sometimes technology needs a moment.
              You can try refreshing the page, or head back to the homepage.
            </p>

            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => window.location.reload()}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1.5rem",
                  background: "#2f5d5d",
                  color: "white",
                  border: "none",
                  borderRadius: "0.75rem",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  minHeight: 44,
                }}
                data-testid="button-error-refresh"
              >
                <RefreshCw size={16} />
                Refresh Page
              </button>
              <a
                href="/"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1.5rem",
                  background: "white",
                  color: "#2f5d5d",
                  border: "1px solid #ddd",
                  borderRadius: "0.75rem",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  textDecoration: "none",
                  minHeight: 44,
                }}
                data-testid="button-error-home"
              >
                <Home size={16} />
                Go Home
              </a>
            </div>

            <p
              style={{
                fontSize: "0.8125rem",
                color: "#999",
                marginTop: "1.5rem",
              }}
            >
              If this keeps happening, you can{" "}
              <a href="/crisis" style={{ color: "#2f5d5d" }}>
                reach crisis support anytime
              </a>
              .
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
export default ErrorBoundary;
