import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, Shield, Heart, Sparkles, Mail, Lock, Loader2 } from "lucide-react";
import SEO from "../components/SEO";
import { useAuth } from "../context/AuthContext.jsx";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast";
import LumiMascotImage from "../components/lumi/LumiMascotImage.jsx";

function landingPathFor(u) {
  // Mirrors AdminGuard policy (client/src/components/AdminGuard.jsx):
  // only role==="admin" passes the /admin guard. Staff and everyone else
  // land on /dashboard to avoid an immediate guard-bounce loop.
  if (u && u.role === "admin") return "/admin";
  return "/dashboard";
}

export default function Login() {
  const { isAuthenticated, isLoading, login, user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated()) setLocation(landingPathFor(user));
  }, [isLoading, isAuthenticated, setLocation, user]);

  if (isLoading || (typeof isAuthenticated === "function" && isAuthenticated())) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--glp-paper)' }}>
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'var(--glp-sage-deep)', borderTopColor: 'transparent' }} />
          <p className="text-sm" style={{ color: 'var(--glp-sage)' }}>{isLoading ? 'Checking your session…' : 'Taking you to your dashboard…'}</p>
        </div>
      </div>
    );
  }

  function validate() {
    const e = {};
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Please enter a valid email address.";
    if (!form.password) e.password = "Please enter your password.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev) {
    ev.preventDefault();
    if (!validate() || submitting) return;
    setSubmitting(true);
    try {
      const data = await apiRequest("POST", "/api/auth/login", {
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
      if (!data || data?.ok === false) {
        const msg = data?.error || data?.message || "Could not sign in. Please try again.";
        toast({ title: "Sign in failed", description: msg, variant: "destructive" });
        setSubmitting(false);
        return;
      }
      if (data?.token) login(data.token, data.user || null);
      toast({ title: "Welcome back", description: "You're signed in." });
      setLocation(landingPathFor(data?.user));
    } catch (err) {
      const raw = err?.message || "";
      let msg = raw;
      const m = raw.match(/^\d+:\s*(.*)$/);
      if (m) {
        try {
          const parsed = JSON.parse(m[1]);
          msg = parsed?.error || parsed?.message || m[1];
        } catch { msg = m[1]; }
      }
      toast({
        title: "Sign in failed",
        description: msg || "Network error. Please try again in a moment.",
        variant: "destructive",
      });
      setSubmitting(false);
    }
  }

  function set(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  return (
    <>
      <SEO
        title="Sign In - MyMentalHealthBuddy"
        description="Sign in to your MyMentalHealthBuddy account to access your wellness tools."
        noindex
      />
      <div className="min-h-screen overflow-hidden relative flex items-center justify-center" style={{ background: 'var(--glp-paper)', padding: '3rem 1.5rem' }}>
        <div className="absolute -top-24 -left-24 w-[500px] h-[500px] rounded-full animate-pulse" style={{ background: 'radial-gradient(circle, var(--glp-sage-30), transparent 70%)' }} aria-hidden="true" />
        <div className="absolute bottom-0 -right-24 w-[450px] h-[450px] rounded-full animate-pulse" style={{ background: 'radial-gradient(circle, var(--glp-rose-20), transparent 70%)', animationDelay: '1s' }} aria-hidden="true" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full" style={{ background: 'radial-gradient(circle, var(--glp-gold-30), transparent 60%)' }} aria-hidden="true" />

        <div className="relative z-10 w-full max-w-md animate-fade-in-up" style={{ maxWidth: '28rem' }}>
          <div className="text-center mb-6">
            <Link href="/" className="inline-flex flex-col items-center gap-3 group">
              <span
                aria-hidden="true"
                className="w-24 h-24 flex items-center justify-center transition-all group-hover:scale-105"
                style={{ background: 'radial-gradient(circle at 50% 55%, var(--glp-sage-15) 0%, var(--glp-sage-10) 38%, transparent 72%)', overflow: 'visible' }}
                data-testid="img-login-logo"
              >
                <LumiMascotImage
                  size={80}
                  animation="breathe"
                  decorative
                  data-testid="lumi-login"
                />
              </span>
              <span className="text-lg font-bold tracking-tight" style={{ color: 'var(--glp-sage-deep)' }}>MyMentalHealthBuddy</span>
            </Link>
          </div>

          <form
            onSubmit={onSubmit}
            noValidate
            className="rounded-3xl shadow-2xl"
            style={{ background: 'var(--glp-white, #FFFFFF)', border: '1px solid var(--glp-sage-15)', borderRadius: '1.5rem', padding: '2rem', boxShadow: '0 22px 55px rgba(31, 71, 51, 0.12)' }}
            data-testid="form-login"
          >
            <div className="text-center" style={{ marginBottom: '1.5rem' }}>
              <h1 className="text-3xl font-bold font-display" style={{ color: 'var(--glp-sage-deep)' }} data-testid="text-login-title">
                Welcome Back
              </h1>
              <p className="mt-2 text-sm" style={{ color: 'var(--glp-sage)' }}>Sign in to access your tools and reflections</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <label className="block">
                <span className="sr-only">Email address</span>
                <div className="relative">
                  <Mail className="absolute w-4 h-4" style={{ color: 'var(--glp-sage)', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} aria-hidden="true" />
                  <input
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@email.com"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    className="w-full text-sm focus:outline-none focus:ring-2"
                    style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-20)', color: 'var(--glp-sage-deep)', width: '100%', padding: '0.7rem 0.75rem 0.7rem 2.5rem', borderRadius: '0.75rem' }}
                    data-testid="input-email"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "err-email" : undefined}
                  />
                </div>
                {errors.email && <p id="err-email" className="text-xs mt-1" style={{ color: '#b13c3c' }} data-testid="error-email">{errors.email}</p>}
              </label>

              <label className="block">
                <span className="sr-only">Password</span>
                <div className="relative">
                  <Lock className="absolute w-4 h-4" style={{ color: 'var(--glp-sage)', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} aria-hidden="true" />
                  <input
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="Your password"
                    value={form.password}
                    onChange={(e) => set("password", e.target.value)}
                    className="w-full text-sm focus:outline-none focus:ring-2"
                    style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-20)', color: 'var(--glp-sage-deep)', width: '100%', padding: '0.7rem 0.75rem 0.7rem 2.5rem', borderRadius: '0.75rem' }}
                    data-testid="input-password"
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "err-password" : undefined}
                  />
                </div>
                {errors.password && <p id="err-password" className="text-xs mt-1" style={{ color: '#b13c3c' }} data-testid="error-password">{errors.password}</p>}
              </label>

              <div className="text-right">
                <Link href="/forgot-password" className="text-xs font-medium" style={{ color: 'var(--glp-sage-deep)' }} data-testid="link-forgot-password">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-premium hover-glow-gold flex items-center justify-center text-lg font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ width: '100%', marginTop: '1.25rem', padding: '0.95rem 1.5rem', minHeight: '56px', borderRadius: '0.75rem', gap: '0.75rem' }}
              data-testid="button-login"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> : <Sparkles className="w-5 h-5" aria-hidden="true" />}
              <span>{submitting ? "Signing you in…" : "Sign In"}</span>
              {!submitting && <ArrowRight className="w-5 h-5" aria-hidden="true" />}
            </button>

            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div className="flex items-center text-sm" style={{ color: 'var(--glp-sage)', gap: '0.75rem' }}>
                <Shield className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--glp-sage-deep)' }} />
                <span>Encrypted in transit. Private by default.</span>
              </div>
              <div className="flex items-center text-sm" style={{ color: 'var(--glp-sage)', gap: '0.75rem' }}>
                <Heart className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--glp-sage-deep)' }} />
                <span>Your data stays private and secure.</span>
              </div>
            </div>

            <div className="text-center" style={{ borderTop: '1px solid var(--glp-sage-20)', marginTop: '1.5rem', paddingTop: '1.25rem' }}>
              <p className="text-sm" style={{ color: 'var(--glp-sage)' }}>
                New here?{" "}
                <Link href="/register" className="font-semibold transition-colors" style={{ color: 'var(--glp-sage-deep)' }} data-testid="link-register">
                  Create an account
                </Link>
              </p>
            </div>
          </form>

          <p className="text-center text-xs mt-6" style={{ color: 'var(--glp-sage)' }}>
            By signing in, you agree to our{" "}
            <Link href="/terms" className="underline">Terms of Service</Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </>
  );
}
