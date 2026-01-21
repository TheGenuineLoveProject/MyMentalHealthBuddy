import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "../context/AuthContext.jsx";
import { Heart, Mail, Lock, ArrowRight } from "lucide-react";
import SEO from "../components/SEO";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      login(data.token, data.user);
      setLocation("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Sign In - The Genuine Love Project"
        description="Sign in to your Genuine Love Project account. Continue your mental wellness journey."
      />
      <div className="min-h-screen hero-gradient overflow-hidden relative flex items-center justify-center px-4">
        <div className="decorative-orb decorative-orb-sage w-[400px] h-[400px] -top-20 -left-20 absolute" aria-hidden="true" />
        <div className="decorative-orb decorative-orb-blush w-[350px] h-[350px] bottom-10 -right-20 absolute" aria-hidden="true" />
        
        <div className="relative z-10 w-full max-w-md animate-fade-in-up">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sage-500 to-sage-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Heart className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              <span className="text-xl font-bold tracking-tight text-teal">The Genuine Love Project</span>
            </Link>
          </div>

          <div className="glass-premium rounded-2xl p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-teal font-display">
                Welcome Back
              </h1>
              <p className="text-sage-400 mt-2">Sign in to continue your journey</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 text-sm" role="alert" data-testid="text-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-teal mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-sage-200 rounded-xl bg-white/80 focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all text-teal placeholder:text-sage-400"
                    placeholder="you@example.com"
                    required
                    data-testid="input-email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-teal mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-sage-200 rounded-xl bg-white/80 focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all text-teal placeholder:text-sage-400"
                    placeholder="••••••••"
                    required
                    data-testid="input-password"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end">
                <Link href="/forgot-password" className="text-sm text-sage-600 hover:text-teal transition-colors font-medium">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-premium py-3.5 hover-glow-gold disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="button-login"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-sage-200/50 text-center">
              <p className="text-sage-400 text-sm">
                Don't have an account?{" "}
                <Link href="/register" className="text-sage-600 hover:text-teal font-semibold transition-colors">
                  Create one
                </Link>
              </p>
            </div>
            
            {import.meta.env.DEV && (
              <div className="mt-4 pt-4 border-t border-dashed border-sage-200/50 text-center">
                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem("glp-qa", "1");
                    setLocation("/dashboard");
                  }}
                  className="text-xs text-sage-400 hover:text-sage-600 underline transition-colors"
                  data-testid="button-qa-mode"
                >
                  Enable QA Mode (DEV)
                </button>
              </div>
            )}
          </div>

          <p className="text-center text-xs text-sage-400 mt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </>
  );
}
