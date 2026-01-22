import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "../context/AuthContext.jsx";
import { Heart, Mail, Lock, ArrowRight } from "lucide-react";
import { SiGithub } from "react-icons/si";
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
      <div className="min-h-screen overflow-hidden relative flex items-center justify-center px-6" style={{ background: 'linear-gradient(180deg, var(--glp-paper) 0%, var(--glp-teal-50) 100%)' }}>
        <div className="absolute -top-24 -left-24 w-[500px] h-[500px] rounded-full animate-pulse" style={{ background: 'radial-gradient(circle, var(--glp-sage-30), transparent 70%)' }} aria-hidden="true" />
        <div className="absolute bottom-0 -right-24 w-[450px] h-[450px] rounded-full animate-pulse" style={{ background: 'radial-gradient(circle, var(--glp-rose-20), transparent 70%)', animationDelay: '1s' }} aria-hidden="true" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full" style={{ background: 'radial-gradient(circle, var(--glp-gold-30), transparent 60%)' }} aria-hidden="true" />
        
        <div className="relative z-10 w-full max-w-md animate-fade-in-up">
          <div className="text-center mb-10">
            <Link href="/" className="inline-flex items-center gap-4 group">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all group-hover:scale-105 group-hover:shadow-lg" style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))', boxShadow: '0 4px 16px var(--glp-sage-30)' }}>
                <img 
                  src="/brand/logo-mark.png" 
                  alt="The Genuine Love Project" 
                  className="w-10 h-10 object-contain"
                  data-testid="img-login-logo"
                />
              </div>
              <span className="text-2xl font-bold tracking-tight" style={{ color: 'var(--glp-sage-deep)' }}>The Genuine Love Project</span>
            </Link>
          </div>

          <div className="rounded-3xl p-8 shadow-2xl" style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-20)' }}>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold font-display" style={{ color: 'var(--glp-sage-deep)' }}>
                Welcome Back
              </h1>
              <p className="mt-3" style={{ color: 'var(--glp-sage)' }}>Sign in to continue your healing journey</p>
            </div>

            {error && (
              <div className="p-4 rounded-xl mb-6 text-sm" style={{ background: 'var(--glp-rose-15)', border: '1px solid var(--glp-blush)', color: 'var(--glp-rose-dark)' }} role="alert" data-testid="text-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input pl-12"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    data-testid="input-email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input pl-12"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    data-testid="input-password"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end">
                <Link href="/forgot-password" className="text-sm font-medium transition-colors" style={{ color: 'var(--glp-sage-deep)' }}>
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

            <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--glp-sage-20)' }}>
              <p className="text-center text-sm mb-4" style={{ color: 'var(--glp-sage)' }}>Or continue with</p>
              <a
                href="/api/auth/github"
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-medium transition-all"
                style={{ border: '1px solid var(--glp-sage-20)', background: 'var(--glp-paper)', color: 'var(--glp-sage-deep)' }}
                data-testid="button-github-login"
              >
                <SiGithub className="w-5 h-5" />
                Continue with GitHub
              </a>
            </div>

            <div className="mt-6 pt-6 text-center" style={{ borderTop: '1px solid var(--glp-sage-20)' }}>
              <p className="text-sm" style={{ color: 'var(--glp-sage)' }}>
                Don't have an account?{" "}
                <Link href="/register" className="font-semibold transition-colors" style={{ color: 'var(--glp-sage-deep)' }}>
                  Create one
                </Link>
              </p>
            </div>
            
            {import.meta.env.DEV && (
              <div className="mt-4 pt-4 text-center" style={{ borderTop: '1px dashed var(--glp-sage-20)' }}>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem("glp-qa", "1");
                    setLocation("/dashboard");
                  }}
                  className="text-xs underline transition-colors"
                  style={{ color: 'var(--glp-sage)' }}
                  data-testid="button-qa-mode"
                >
                  Enable QA Mode (DEV)
                </button>
              </div>
            )}
          </div>

          <p className="text-center text-xs mt-6" style={{ color: 'var(--glp-sage)' }}>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </>
  );
}
