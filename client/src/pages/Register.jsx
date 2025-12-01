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
      return; }

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
      className="min-h-screen flex bg-gray-50 dark:bg-gray-900"
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
          <p className="text-lg opacity-80 max-w-md mb-8">
            Join thousands who have found peace and clarity with our AI-powered mental health companion.
          </p>
          <div className="space-y-3 text-left max-w-sm mx-auto">
            {[
              "24/7 AI companion for support",
              "Track and understand your moods",
              "Private, secure journaling",
              "Crisis resources when you need them"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 opacity-90">
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
            <Brain className="w-8 h-8 text-emerald-600" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              MyMentalHealthBuddy
            </span>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <div className="text-center mb-6">
              <div 
                className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" }}
              >
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <h1
                data-testid="text-register-title"
                className="text-2xl font-bold mb-2 text-gray-900 dark:text-white"
              >
                Create Account
              </h1>
              <p
                data-testid="text-register-subtitle"
                className="text-gray-600 dark:text-gray-400"
              >
                Start your mental health journey today
              </p>
            </div>

            {error && (
              <div
                data-testid="text-error"
                role="alert"
                className="p-3 rounded-xl mb-4 flex items-center gap-2 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
              >
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleRegister} data-testid="form-register" className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-600 dark:text-gray-300"
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
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-600 dark:text-gray-300"
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
                  className={`w-full p-3 rounded-xl border bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${fieldErrors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'}`}
                />
                {fieldErrors.email && (
                  <span id="email-error" data-testid="error-email" className="text-xs mt-1 block text-red-600">
                    {fieldErrors.email}
                  </span>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-600 dark:text-gray-300"
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
                  className={`w-full p-3 rounded-xl border bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${fieldErrors.password ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'}`}
                />
                {fieldErrors.password && (
                  <span id="password-error" data-testid="error-password" className="text-xs mt-1 block text-red-600">
                    {fieldErrors.password}
                  </span>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-600 dark:text-gray-300"
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
                  className={`w-full p-3 rounded-xl border bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${fieldErrors.confirmPassword ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'}`}
                />
                {fieldErrors.confirmPassword && (
                  <span id="confirm-error" data-testid="error-confirm-password" className="text-xs mt-1 block text-red-600">
                    {fieldErrors.confirmPassword}
                  </span>
                )}
              </div>

              <button
                type="submit"
                data-testid="button-register"
                disabled={isLoading}
                aria-busy={isLoading}
                className="w-full py-3 px-6 rounded-xl text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:shadow-lg hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" }}
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

            <p className="text-center mt-6 text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                data-testid="link-login"
                className="font-semibold hover:underline text-emerald-600 dark:text-emerald-400"
              >
                Sign in
              </Link>
            </p>

            <p className="text-center mt-4 text-xs text-gray-500 dark:text-gray-500">
              By creating an account, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
