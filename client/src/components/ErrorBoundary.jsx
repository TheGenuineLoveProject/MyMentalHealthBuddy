import React from "react";
import { RefreshCw, Home } from 'lucide-react';
import { OfficialLumi } from "@/lumi-registry";

function shouldShowDiagnostics() {
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
    this.setState({ info });
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
            {/* CRITICAL SAFETY: state="crisis" is the only state with
                configured motion="steady" per avatarState.ts. Errors are
                a crisis-adjacent moment; per the kernel "asymmetric risk:
                err toward safety", non-flashing presence is mandatory. */}
            <div
              style={{
                margin: "0 auto 1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 128,
                height: 128,
              }}
            >
              <React.Suspense fallback={null}>
                <OfficialLumi
                  variant="LUMI_SUPPORTIVE"
                  scene="error-boundary"
                  position="card"
                  pageId="error-boundary"
                  size={128}
                  alt="Lumi offering gentle support"
                  data-testid="error-boundary-buddy"
                />
              </React.Suspense>
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

            {this.state.error && shouldShowDiagnostics() ? (
              <details
                style={{
                  textAlign: "left",
                  marginBottom: "1.25rem",
                  padding: "0.75rem 1rem",
                  background: "rgba(239,68,68,0.04)",
                  border: "1px solid rgba(239,68,68,0.18)",
                  borderRadius: "0.6rem",
                  fontSize: "0.78rem",
                  color: "#7f1d1d",
                }}
                data-testid="details-error-info"
              >
                <summary style={{ cursor: "pointer", fontWeight: 600 }}>
                  Technical details
                </summary>
                <p
                  style={{ margin: "0.5rem 0 0", fontSize: "0.78rem", color: "#991b1b" }}
                  data-testid="text-error-message"
                >
                  {(this.state.error && (this.state.error.message || String(this.state.error))) ||
                    "Unknown error"}
                </p>
                {this.state.info?.componentStack ? (
                  <pre
                    style={{
                      marginTop: "0.4rem",
                      padding: "0.5rem",
                      background: "rgba(255,255,255,0.6)",
                      borderRadius: "6px",
                      overflowX: "auto",
                      fontSize: "0.7rem",
                      whiteSpace: "pre-wrap",
                      color: "#7f1d1d",
                    }}
                  >
                    {this.state.info.componentStack.trim()}
                  </pre>
                ) : null}
              </details>
            ) : null}

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
