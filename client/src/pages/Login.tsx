import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiPost, ApiError } from "../utils/api";
import { LogIn, Mail, Lock, ArrowRight, Brain, Sparkles } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data = await apiPost<{ token: string; user: { id: number; email: string; name?: string } }>(
        "/api/auth/login",
        { email: email.trim().toLowerCase(), password }
      );

      if (data.ok && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      data-testid="page-login"
      className="min-h-screen flex"
      style={{ background: "var(--background)" }}
    >
      <div 
        className="hidden lg:flex lg:w-1/2 items-center justify-center p-12"
        style={{ 
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        }}
      >
        <div className="text-center text-white animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Brain className="w-16 h-16" />
            <Sparkles className="w-8 h-8 animate-pulse" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Welcome to MyMentalHealthBuddy</h2>
          <p className="text-lg text-white/80 max-w-md">
            Your compassionate AI companion for mental wellness. Track your mood, 
            journal your thoughts, and find peace of mind.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-in">
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <Brain className="w-8 h-8" style={{ color: "var(--primary)" }} />
            <span className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
              MyMentalHealthBuddy
            </span>
          </div>

          <div className="card p-8">
            <div className="text-center mb-6">
              <div 
                className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ background: "var(--gradient-primary)" }}
              >
                <LogIn className="w-6 h-6 text-white" />
              </div>
              <h1
                data-testid="text-login-title"
                className="text-2xl font-bold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                Welcome Back
              </h1>
              <p
                data-testid="text-login-subtitle"
                style={{ color: "var(--text-secondary)" }}
              >
                Sign in to continue your journey
              </p>
            </div>

            {error && (
              <div
                data-testid="text-error"
                role="alert"
                className="p-3 rounded-xl mb-4 flex items-center gap-2"
                style={{ background: "#fef2f2", color: "#dc2626" }}
              >
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleLogin} data-testid="form-login" className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="flex items-center gap-2 text-sm font-medium mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  data-testid="input-email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full p-3 rounded-xl border"
                  style={{
                    background: "var(--background)",
                    color: "var(--text-primary)",
                    borderColor: "var(--border)"
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="flex items-center gap-2 text-sm font-medium mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <Lock className="w-4 h-4" />
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  data-testid="input-password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full p-3 rounded-xl border"
                  style={{
                    background: "var(--background)",
                    color: "var(--text-primary)",
                    borderColor: "var(--border)"
                  }}
                />
              </div>

              <button
                type="submit"
                data-testid="button-login"
                disabled={isLoading}
                aria-busy={isLoading}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  "Signing in..."
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center mt-6" style={{ color: "var(--text-secondary)" }}>
              Don't have an account?{" "}
              <Link
                to="/register"
                data-testid="link-register"
                className="font-semibold hover:underline"
                style={{ color: "var(--primary)" }}
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
