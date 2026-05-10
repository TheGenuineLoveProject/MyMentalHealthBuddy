import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, Shield, Heart, Sparkles, Check, Mail, Lock, User as UserIcon, Loader2 } from "lucide-react";
import SEO from "../components/SEO";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast";
import { useAuth } from "../context/AuthContext.jsx";
import LumiMascot from "../components/lumi/LumiMascot.jsx";
import LumiV6 from "../components/lumi/LumiV6";

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const benefits = [
    "24/7 AI wellness companion",
    "Private mood tracking & analytics",
    "Secure personal journaling",
    "Crisis resources when you need them"
  ];

  function validate() {
    const e = {};
    if (!form.name || form.name.trim().length < 2) e.name = "Please enter your name (2+ characters).";
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Please enter a valid email address.";
    if (!form.password || form.password.length < 8) e.password = "Password must be at least 8 characters.";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev) {
    ev.preventDefault();
    if (!validate() || submitting) return;
    setSubmitting(true);
    try {
      const data = await apiRequest("POST", "/api/auth/register", {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
      if (!data || data?.ok === false) {
        const msg = data?.error || data?.message || "Could not create account. Please try again.";
        toast({ title: "Sign up failed", description: msg, variant: "destructive" });
        setSubmitting(false);
        return;
      }
      if (data?.token) login(data.token, data.user || null);
      toast({ title: "Welcome to MyMentalHealthBuddy", description: "Your account is ready. Let's begin." });
      setLocation("/onboarding");
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
        title: "Sign up failed",
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
        title="Create Account - MyMentalHealthBuddy"
        description="Create your free account. Mood tracking, journaling, reflection prompts, and AI chat — no credit card required."
      />
      <div className="min-h-screen overflow-hidden relative flex items-center justify-center px-6 py-8" style={{ background: 'linear-gradient(180deg, var(--glp-paper) 0%, var(--glp-sage-10) 100%)' }}>
        <div className="absolute -top-24 -left-24 w-[500px] h-[500px] rounded-full animate-pulse" style={{ background: 'radial-gradient(circle, var(--glp-sage-30), transparent 70%)' }} aria-hidden="true" />
        <div className="absolute bottom-0 -right-24 w-[450px] h-[450px] rounded-full animate-pulse" style={{ background: 'radial-gradient(circle, var(--glp-rose-20), transparent 70%)', animationDelay: '1s' }} aria-hidden="true" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full" style={{ background: 'radial-gradient(circle, var(--glp-gold-30), transparent 60%)' }} aria-hidden="true" />

        <div className="relative z-10 w-full max-w-md animate-fade-in-up">
          <div className="text-center mb-5">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <span
                aria-hidden="true"
                className="w-20 h-20 flex items-center justify-center transition-all group-hover:scale-105"
                style={{ background: 'radial-gradient(circle at 50% 55%, var(--glp-sage-15) 0%, var(--glp-sage-10) 38%, transparent 72%)', overflow: 'visible' }}
                data-testid="img-register-logo"
              >
                <LumiV6
                  size="md-header"
                  colorMode="yellow"
                  emotion="joy"
                  data-testid="lumi-register"
                />
              </span>
              <span className="text-lg font-bold tracking-tight" style={{ color: 'var(--glp-sage-deep)' }}>MyMentalHealthBuddy</span>
            </Link>
          </div>

          <form
            onSubmit={onSubmit}
            noValidate
            className="rounded-3xl p-6 shadow-2xl"
            style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-20)' }}
            data-testid="form-register"
          >
            <div className="text-center mb-4">
              <h1 className="text-2xl font-bold font-display mb-1" style={{ color: 'var(--glp-sage-deep)' }} data-testid="text-register-title">
                Create Your Account
              </h1>
              <p className="text-sm" style={{ color: 'var(--glp-sage)' }}>Free to start. No credit card required.</p>
            </div>

            <div className="mb-4 p-3 rounded-xl" style={{ background: 'var(--glp-sage-10)', border: '1px solid var(--glp-sage-20)' }}>
              <ul className="space-y-2">
                {benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm" style={{ color: 'var(--glp-sage-deep)' }}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--glp-sage-20)' }}>
                      <Check className="w-3 h-3" style={{ color: 'var(--glp-sage-deep)' }} aria-hidden="true" />
                    </div>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <label className="block">
                <span className="sr-only">Your name</span>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--glp-sage)' }} aria-hidden="true" />
                  <input
                    type="text"
                    autoComplete="name"
                    required
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    className="w-full pl-10 pr-3 py-3 rounded-xl text-sm focus:outline-none focus:ring-2"
                    style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-20)', color: 'var(--glp-sage-deep)' }}
                    data-testid="input-name"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "err-name" : undefined}
                  />
                </div>
                {errors.name && <p id="err-name" className="text-xs mt-1" style={{ color: '#b13c3c' }} data-testid="error-name">{errors.name}</p>}
              </label>

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
                <span className="sr-only">Create a password</span>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--glp-sage)' }} aria-hidden="true" />
                  <input
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    placeholder="Create a password (8+ characters)"
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

              <label className="block">
                <span className="sr-only">Confirm password</span>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--glp-sage)' }} aria-hidden="true" />
                  <input
                    type="password"
                    autoComplete="new-password"
                    required
                    placeholder="Confirm password"
                    value={form.confirmPassword}
                    onChange={(e) => set("confirmPassword", e.target.value)}
                    className="w-full pl-10 pr-3 py-3 rounded-xl text-sm focus:outline-none focus:ring-2"
                    style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-20)', color: 'var(--glp-sage-deep)' }}
                    data-testid="input-confirm-password"
                    aria-invalid={!!errors.confirmPassword}
                    aria-describedby={errors.confirmPassword ? "err-confirm" : undefined}
                  />
                </div>
                {errors.confirmPassword && <p id="err-confirm" className="text-xs mt-1" style={{ color: '#b13c3c' }} data-testid="error-confirm-password">{errors.confirmPassword}</p>}
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-4 btn-premium py-4 hover-glow-gold flex items-center justify-center gap-3 min-h-[56px] text-lg font-semibold rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
              data-testid="button-register"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> : <Sparkles className="w-5 h-5" aria-hidden="true" />}
              <span>{submitting ? "Creating your account…" : "Create Account"}</span>
              {!submitting && <ArrowRight className="w-5 h-5" />}
            </button>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--glp-sage)' }}>
                <Shield className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--glp-sage-deep)' }} />
                <span>Encrypted in transit. Private by default.</span>
              </div>
              <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--glp-sage)' }}>
                <Heart className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--glp-sage-deep)' }} />
                <span>Your data stays private and secure.</span>
              </div>
            </div>

            <div className="mt-4 pt-4 text-center" style={{ borderTop: '1px solid var(--glp-sage-20)' }}>
              <p className="text-sm" style={{ color: 'var(--glp-sage)' }}>
                Already have an account?{" "}
                <Link href="/login" className="font-semibold transition-colors" style={{ color: 'var(--glp-sage-deep)' }}
                  data-testid="link-login"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>

          <p className="text-center text-xs mt-6" style={{ color: 'var(--glp-sage)' }}>
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="underline">Terms of Service</Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </>
  );
}
