import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Shield, KeyRound, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import BrandLogo from "@/components/brand/BrandLogo";
import BrandGlow from "@/components/BrandGlow";

/**
 * AdminLogin — dedicated entry point for Command Center access.
 * Bookmark-friendly URL: /admin-login
 *
 * Posts the ADMIN_TOKEN to /api/admin/verify-token; on success stores the
 * 4h JWT session token in sessionStorage under the existing keys
 * ("adminVerified", "adminSessionToken") consumed by Admin.jsx + AdminGuard,
 * then redirects to /admin (Command Center).
 *
 * Already-verified visitors are redirected immediately.
 */
export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Admin Login — MyMentalHealthBuddy Command Center";
    if (sessionStorage.getItem("adminVerified") === "true") {
      setLocation("/admin");
    }
  }, [setLocation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const trimmed = token.trim();
    if (!trimmed) {
      setError("Please enter your admin token.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/verify-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: trimmed }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        sessionStorage.setItem("adminVerified", "true");
        if (data.sessionToken) {
          sessionStorage.setItem("adminSessionToken", data.sessionToken);
        }
        setLocation("/admin");
      } else if (res.status === 500) {
        setError("Admin access is not configured on the server. Please set the ADMIN_TOKEN secret.");
      } else {
        setError(data.message || "Invalid admin token. Please double-check and try again.");
      }
    } catch (err) {
      console.error("[AdminLogin]", err);
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen relative flex items-center justify-center px-4 py-12"
      style={{ background: "var(--glp-cream-50)" }}
      data-testid="page-admin-login"
    >
      <BrandGlow />

      <div className="relative w-full max-w-md">
        <div
          className="card-aurora rounded-2xl p-8 sm:p-10 shadow-xl"
          style={{
            background: "var(--glp-cream-100)",
            border: "1px solid var(--glp-sage-200)",
          }}
        >
          <div className="flex flex-col items-center text-center mb-8">
            <BrandLogo size="lg" showText={false} linkTo={null} />
            <div
              className="mt-5 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
              style={{
                background: "var(--glp-sage-100)",
                color: "var(--glp-sage-800)",
              }}
              data-testid="badge-admin-area"
            >
              <Shield className="w-3.5 h-3.5" />
              Restricted Area
            </div>
            <h1
              className="mt-4 text-2xl sm:text-3xl font-display"
              style={{ color: "var(--glp-ink-900)" }}
              data-testid="text-page-title"
            >
              Command Center Access
            </h1>
            <p
              className="mt-2 text-sm leading-relaxed"
              style={{ color: "var(--glp-ink-600)" }}
            >
              Enter your administrator token to enter the MyMentalHealthBuddy
              operations console.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" data-testid="form-admin-login">
            <div>
              <label
                htmlFor="admin-token"
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--glp-ink-800)" }}
              >
                Administrator Token
              </label>
              <div className="relative">
                <KeyRound
                  className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "var(--glp-sage-600)" }}
                  aria-hidden="true"
                />
                <input
                  id="admin-token"
                  type="password"
                  autoComplete="current-password"
                  autoFocus
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Paste your ADMIN_TOKEN"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all focus:outline-none"
                  style={{
                    background: "var(--glp-cream-50)",
                    border: "1px solid var(--glp-sage-300)",
                    color: "var(--glp-ink-900)",
                  }}
                  disabled={loading}
                  data-testid="input-admin-token"
                />
              </div>
              <p
                className="mt-2 text-xs"
                style={{ color: "var(--glp-ink-500)" }}
              >
                Your token grants a 4-hour secure session. It is never stored on disk.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 p-3 rounded-lg text-sm"
                style={{
                  background: "rgba(220, 38, 38, 0.08)",
                  border: "1px solid rgba(220, 38, 38, 0.25)",
                  color: "rgb(153, 27, 27)",
                }}
                data-testid="text-admin-error"
              >
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !token}
              className="btn-primary w-full inline-flex items-center justify-center gap-2 font-semibold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="button-admin-submit"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying…
                </>
              ) : (
                <>
                  Enter Command Center
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div
            className="mt-8 pt-6 text-center text-xs"
            style={{
              borderTop: "1px solid var(--glp-sage-200)",
              color: "var(--glp-ink-500)",
            }}
          >
            <p>
              Not an administrator?{" "}
              <button
                type="button"
                onClick={() => setLocation("/")}
                className="font-medium underline-offset-2 hover:underline"
                style={{ color: "var(--glp-sage-700)" }}
                data-testid="link-back-home"
              >
                Return to MyMentalHealthBuddy
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
