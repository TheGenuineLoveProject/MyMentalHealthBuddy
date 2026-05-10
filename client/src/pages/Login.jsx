import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, Shield, Heart, Sparkles, Mail, Lock, Loader2 } from "lucide-react";
import SEO from "../components/SEO";
import { useAuth } from "../context/AuthContext.jsx";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast";
import LumiMascot from "../components/lumi/LumiMascot.jsx";
import LumiV6 from "../components/lumi/LumiV6";

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
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(180deg, var(--glp-paper) 0%, var(--glp-sage-10) 100%)' }}>
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
      />
      <div className="min-h-screen overflow-hidden relative flex items-center justify-center px-6 py-12" style={{ background: 'linear-gradient(180deg, var(--glp-paper) 0%, var(--glp-sage-10) 100%)' }}>
        <div className="absolute -top-24 -left-24 w-[500px] h-[500px] rounded-full animate-pulse" style={{ background: 'radial-gradient(circle, var(--glp-sage-30), transparent 70%)' }} aria-hidden="true" />
        <div className="absolute bottom-0 -right-24 w-[450px] h-[450px] rounded-full animate-pulse" style={{ background: 'radial-gradient(circle, var(--glp-rose-20), transparent 70%)', animationDelay: '1s' }} aria-hidden="true" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full" style={{ background: 'radial-gradient(circle, var(--glp-gold-30), transparent 60%)' }} aria-hidden="true" />

        <div className="relative z-10 w-full max-w-md animate-fade-in-up">
          <div className="text-center mb-6">
            <Link href="/" className="inline-flex flex-col items-center gap-3 group">
              <span
                aria-hidden="true"
                className="w-24 h-24 flex items-center justify-center transition-all group-hover:scale-105"
                style={{ background: 'radial-gradient(circle at 50% 55%, var(--glp-sage-15) 0%, var(--glp-sage-10) 38%, transparent 72%)', overflow: 'visible' }}
                data-testid="img-login-logo"
              >
                <LumiV6
                  size="md"
                  pixelSize={80}
                  emotion="greeting"
                  v8
                  memoryKey="login"
                  data-testid="lumi-login"
                />
              </span>
              <span className="text-lg font-bold tracking-tight" style={{ color: 'var(--glp-sage-deep)' }}>MyMentalHealthBuddy</span>
            </Link>
          </div>

          <form
            onSubmit={onSubmit}
            noValidate
            className="rounded-3xl p-8 shadow-2xl"
            style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-20)' }}
            data-testid="form-login"
          >
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold font-display" style={{ color: 'var(--glp-sage-deep)' }} data-testid="text-login-title">
                Welcome Back
              </h1>
              <p className="mt-2 text-sm" style={{ color: 'var(--glp-sage)' }}>Sign in to access your tools and reflections</p>
            </div>

            <div className="space-y-3">
              <label className="block">
                <span className="sr-only">Email address</span>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--glp-sage)' }} aria-hidden="true" />
                  <input
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@email.com"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    className="w-full pl-10 pr-3 py-3 rounded-xl text-sm focus:outline-none focus:ring-2"
                    style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-20)', color: 'var(--glp-sage-deep)' }}
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
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--glp-sage)' }} aria-hidden="true" />
                  <input
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="Your password"
                    value={form.password}
                    onChange={(e) => set("password", e.target.value)}
                    className="w-full pl-10 pr-3 py-3 rounded-xl text-sm focus:outline-none focus:ring-2"
                    style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-20)', color: 'var(--glp-sage-deep)' }}
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
              className="w-full mt-4 btn-premium py-4 hover-glow-gold flex items-center justify-center gap-3 min-h-[56px] text-lg font-semibold rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
              data-testid="button-login"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> : <Sparkles className="w-5 h-5" aria-hidden="true" />}
              <span>{submitting ? "Signing you in…" : "Sign In"}</span>
              {!submitting && <ArrowRight className="w-5 h-5" />}
            </button>

            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--glp-sage)' }}>
                <Shield className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--glp-sage-deep)' }} />
                <span>Encrypted in transit. Private by default.</span>
              </div>
              <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--glp-sage)' }}>
                <Heart className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--glp-sage-deep)' }} />
                <span>Your data stays private and secure.</span>
              </div>
            </div>

            <div className="mt-6 pt-5 text-center" style={{ borderTop: '1px solid var(--glp-sage-20)' }}>
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
