import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiPost, ApiError } from "../utils/api";
import { UserPlus, Mail, Lock, User, ArrowRight, Brain, Sparkles, ShieldCheck } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  function validateForm(): boolean {
    const errors: Record<string, string> = {};

    if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (!email.includes("@")) {
      errors.email = "Please enter a valid email address";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleRegister(e: FormEvent) {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const data = await apiPost<{ token: string; user: { id: number; email: string; name?: string } }>(
        "/api/auth/register",
        { 
          email: email.trim().toLowerCase(), 
          password,
          name: name.trim() || undefined
        }
      );

      if (data.ok && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.data.validationErrors) {
          const errors: Record<string, string> = {};
          err.data.validationErrors.forEach((e) => {
            errors[e.field] = e.message;
          });
          setFieldErrors(errors);
        } else {
          setError(err.message);
        }
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      data-testid="page-register"
      className="min-h-screen flex"
      style={{ background: "var(--background)" }}
    >
      <div 
        className="hidden lg:flex lg:w-1/2 items-center justify-center p-12"
        style={{ 
          background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
        }}
      >
        <div className="text-center text-white animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Brain className="w-16 h-16" />
            <Sparkles className="w-8 h-8 animate-pulse" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Begin Your Wellness Journey</h2>
          <p className="text-lg text-white/80 max-w-md mb-8">
            Join thousands who have found peace and clarity with our AI-powered mental health companion.
          </p>
          <div className="space-y-3 text-left max-w-sm mx-auto">
            {[
              "24/7 AI companion for support",
              "Track and understand your moods",
              "Private, secure journaling",
              "Crisis resources when you need them"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-white/90">
                <ShieldCheck className="w-5 h-5" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
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
                style={{ background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" }}
              >
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <h1
                data-testid="text-register-title"
                className="text-2xl font-bold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                Create Account
              </h1>
              <p
                data-testid="text-register-subtitle"
                style={{ color: "var(--text-secondary)" }}
              >
                Start your mental health journey today
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

            <form onSubmit={handleRegister} data-testid="form-register" className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="flex items-center gap-2 text-sm font-medium mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <User className="w-4 h-4" />
                  Name (optional)
                </label>
                <input
                  id="name"
                  type="text"
                  data-testid="input-name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
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
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby={fieldErrors.email ? "email-error" : undefined}
                  className="w-full p-3 rounded-xl border"
                  style={{
                    background: "var(--background)",
                    color: "var(--text-primary)",
                    borderColor: fieldErrors.email ? "#dc2626" : "var(--border)"
                  }}
                />
                {fieldErrors.email && (
                  <span id="email-error" data-testid="error-email" className="text-xs mt-1 block" style={{ color: "#dc2626" }}>
                    {fieldErrors.email}
                  </span>
                )}
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
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  aria-invalid={!!fieldErrors.password}
                  aria-describedby={fieldErrors.password ? "password-error" : undefined}
                  className="w-full p-3 rounded-xl border"
                  style={{
                    background: "var(--background)",
                    color: "var(--text-primary)",
                    borderColor: fieldErrors.password ? "#dc2626" : "var(--border)"
                  }}
                />
                {fieldErrors.password && (
                  <span id="password-error" data-testid="error-password" className="text-xs mt-1 block" style={{ color: "#dc2626" }}>
                    {fieldErrors.password}
                  </span>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="flex items-center gap-2 text-sm font-medium mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <ShieldCheck className="w-4 h-4" />
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  data-testid="input-confirm-password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  aria-invalid={!!fieldErrors.confirmPassword}
                  aria-describedby={fieldErrors.confirmPassword ? "confirm-error" : undefined}
                  className="w-full p-3 rounded-xl border"
                  style={{
                    background: "var(--background)",
                    color: "var(--text-primary)",
                    borderColor: fieldErrors.confirmPassword ? "#dc2626" : "var(--border)"
                  }}
                />
                {fieldErrors.confirmPassword && (
                  <span id="confirm-error" data-testid="error-confirm-password" className="text-xs mt-1 block" style={{ color: "#dc2626" }}>
                    {fieldErrors.confirmPassword}
                  </span>
                )}
              </div>

              <button
                type="submit"
                data-testid="button-register"
                disabled={isLoading}
                aria-busy={isLoading}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  "Creating account..."
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center mt-6" style={{ color: "var(--text-secondary)" }}>
              Already have an account?{" "}
              <Link
                to="/login"
                data-testid="link-login"
                className="font-semibold hover:underline"
                style={{ color: "var(--primary)" }}
              >
                Sign in
              </Link>
            </p>

            <p className="text-center mt-4 text-xs" style={{ color: "var(--text-muted)" }}>
              By creating an account, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
