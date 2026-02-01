import { useLocation, Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Heart, Mail, Lock, User, Sparkles, Check, Leaf, Brain, Sun, Star, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { apiRequest } from "../lib/queryClient.js";
import SEO from "../components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function Register() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data) => apiRequest("POST", "/api/auth/register", {
      name: data.name,
      email: data.email,
      password: data.password,
    }),
    onSuccess: (result) => {
      if (result.token) {
        login(result.token, result.user);
        setLocation("/dashboard");
      } else {
        setError("root", { message: result.message || "Registration failed" });
      }
    },
    onError: (err) => {
      if (err.message?.includes("409")) {
        setError("email", { message: "An account with this email already exists" });
      } else {
        setError("root", { message: "Something went wrong. Please try again." });
      }
    },
  });

  const onSubmit = (data) => {
    registerMutation.mutate(data);
  };

  const benefits = [
    "24/7 AI wellness companion",
    "Private mood tracking & analytics",
    "Secure personal journaling",
    "Crisis resources when you need them"
  ];

  return (
  <WellnessPageShell
    title="Register"
    subtitle="Educational reflection tools. Choose what feels safe and supportive."
    benefits={pickBenefits(["agency","calm","clarity","selfRespect","meaning"], 5)}
    clarity={{
      what: "A self-paced reflection tool you control.",
      why: "To support clarity, values alignment, and gentle next steps.",
      who: "For adults (18+) who want educational wellness tools (not medical care).",
      when: "Anytime you want a small reset or a thoughtful pause.",
      where: "Anywhere you can breathe and write for 1–5 minutes.",
      how: "Pick one prompt, answer briefly, stop whenever you want."
    }}
    examples={[
      { label: "Beginner", examples: ["Write one honest sentence about how you feel.", "Name one value you want to protect today."] },
      { label: "Intermediate", examples: ["Describe the situation + the need underneath it.", "Write a boundary you could try in one sentence."] },
      { label: "Advanced", examples: ["Identify a pattern and the smallest experiment to change it.", "Write a compassionate reframe and one measurable step."] }
    ]}
  >

    <>
      <SEO 
        title="Create Account"
        description="Create your free Genuine Love Project account. Start your mental wellness journey with AI-powered support, mood tracking, and journaling."
      />
      <div className="min-h-screen overflow-hidden relative flex items-center justify-center p-6" style={{ background: 'linear-gradient(180deg, var(--glp-paper) 0%, var(--glp-sage-10) 50%, var(--glp-teal-50) 100%)' }}>
        {/* Ambient Decorative Orbs */}
        <div className="decorative-orb sage animate-drift w-[500px] h-[500px] -top-24 -right-24" style={{ animationDelay: '0s' }} aria-hidden="true" />
        <div className="decorative-orb rose animate-drift w-[400px] h-[400px] -bottom-32 -left-32" style={{ animationDelay: '5s' }} aria-hidden="true" />
        <div className="decorative-orb teal animate-drift w-[300px] h-[300px] top-1/3 left-10" style={{ animationDelay: '10s' }} aria-hidden="true" />
        
        {/* Floating Decorative Icons */}
        <div className="floating-icon-container top-16 left-[8%] w-12 h-12 rounded-xl animate-float opacity-60" style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-teal-400))', boxShadow: '0 8px 24px var(--glp-sage-30)', animationDelay: '0s' }} aria-hidden="true">
          <Leaf className="w-6 h-6 text-white" />
        </div>
        <div className="floating-icon-container top-24 right-[10%] w-10 h-10 rounded-lg animate-float opacity-50" style={{ background: 'linear-gradient(135deg, var(--glp-rose), var(--glp-blush))', boxShadow: '0 6px 20px var(--glp-rose-20)', animationDelay: '1.2s' }} aria-hidden="true">
          <Heart className="w-5 h-5 text-white" />
        </div>
        <div className="floating-icon-container bottom-32 left-[6%] w-11 h-11 rounded-xl animate-float opacity-45" style={{ background: 'linear-gradient(135deg, var(--glp-teal-400), var(--glp-sage-deep))', boxShadow: '0 6px 20px var(--glp-sage-30)', animationDelay: '2.4s' }} aria-hidden="true">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div className="floating-icon-container top-1/3 right-[6%] w-9 h-9 rounded-lg animate-float opacity-55" style={{ background: 'linear-gradient(135deg, var(--glp-gold), var(--glp-gold-dim))', boxShadow: '0 6px 20px var(--glp-gold-30)', animationDelay: '3.6s' }} aria-hidden="true">
          <Sun className="w-4 h-4 text-white" />
        </div>
        <div className="floating-icon-container bottom-40 right-[12%] w-10 h-10 rounded-xl animate-float opacity-50" style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))', boxShadow: '0 8px 24px var(--glp-sage-30)', animationDelay: '0.8s' }} aria-hidden="true">
          <Star className="w-5 h-5 text-white" />
        </div>
        <div className="floating-icon-container top-2/3 left-[12%] w-9 h-9 rounded-lg animate-float opacity-40" style={{ background: 'linear-gradient(135deg, var(--glp-teal-400), var(--glp-sage))', boxShadow: '0 6px 20px var(--glp-teal-30)', animationDelay: '2s' }} aria-hidden="true">
          <Shield className="w-4 h-4 text-white" />
        </div>
        <div className="floating-icon-container top-12 left-1/4 w-8 h-8 rounded-lg animate-float opacity-35" style={{ background: 'linear-gradient(135deg, var(--glp-blush), var(--glp-rose))', boxShadow: '0 6px 20px var(--glp-rose-20)', animationDelay: '4s' }} aria-hidden="true">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        
        <div className="relative z-10 w-full max-w-md animate-fade-in-up">
          <div className="text-center mb-10">
            <Link href="/" className="inline-flex items-center gap-4 group">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all group-hover:scale-105 group-hover:shadow-lg" style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))', boxShadow: '0 4px 16px var(--glp-sage-30)' }}>
                <img 
                  src="/brand/logo-mark.png" 
                  alt="The Genuine Love Project" 
                  className="w-10 h-10 object-contain"
                  data-testid="img-register-logo"
                />
              </div>
              <span className="text-2xl font-bold tracking-tight" style={{ color: 'var(--glp-sage-deep)' }}>The Genuine Love Project</span>
            </Link>
          </div>

          <form 
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-3xl p-8 shadow-2xl"
            style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-20)' }}
            data-testid="form-register"
            noValidate
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold font-display mb-3" style={{ color: 'var(--glp-sage-deep)' }} data-testid="text-register-title">
                Start Your Wellness Journey
              </h1>
              <p style={{ color: 'var(--glp-sage)' }}>Create your free account today</p>
            </div>

            <div className="mb-6 p-4 rounded-xl bg-[var(--primary-soft)] border border-[var(--primary)]/20">
              <ul className="space-y-2">
                {benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                    <div className="w-5 h-5 rounded-full bg-[var(--primary)]/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-[var(--primary)]" aria-hidden="true" />
                    </div>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {errors.root && (
              <div 
                className="mb-6 p-4 rounded-xl bg-[var(--accent-rose-soft)] border border-[var(--accent-rose)]/30 text-[var(--accent-rose)] text-sm" 
                data-testid="text-error"
                role="alert"
              >
                {errors.root.message}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-[var(--text-secondary)]">
                  Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" aria-hidden="true" />
                  <input
                    id="name"
                    type="text"
                    className={`input pl-12 ${errors.name ? "border-[var(--accent-rose)] focus:border-[var(--accent-rose)]" : ""}`}
                    placeholder="Your name"
                    autoComplete="name"
                    aria-invalid={errors.name ? "true" : "false"}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    data-testid="input-name"
                    {...register("name")}
                  />
                </div>
                {errors.name && (
                  <p id="name-error" className="mt-2 text-sm text-[var(--accent-rose)]" role="alert">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-[var(--text-secondary)]">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" aria-hidden="true" />
                  <input
                    id="email"
                    type="email"
                    className={`input pl-12 ${errors.email ? "border-[var(--accent-rose)] focus:border-[var(--accent-rose)]" : ""}`}
                    placeholder="you@example.com"
                    autoComplete="email"
                    aria-invalid={errors.email ? "true" : "false"}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    data-testid="input-email"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p id="email-error" className="mt-2 text-sm text-[var(--accent-rose)]" role="alert">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-[var(--text-secondary)]">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" aria-hidden="true" />
                  <input
                    id="password"
                    type="password"
                    className={`input pl-12 ${errors.password ? "border-[var(--accent-rose)] focus:border-[var(--accent-rose)]" : ""}`}
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                    aria-invalid={errors.password ? "true" : "false"}
                    aria-describedby={errors.password ? "password-error" : undefined}
                    data-testid="input-password"
                    {...register("password")}
                  />
                </div>
                {errors.password && (
                  <p id="password-error" className="mt-2 text-sm text-[var(--accent-rose)]" role="alert">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-[var(--text-secondary)]">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" aria-hidden="true" />
                  <input
                    id="confirmPassword"
                    type="password"
                    className={`input pl-12 ${errors.confirmPassword ? "border-[var(--accent-rose)] focus:border-[var(--accent-rose)]" : ""}`}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    aria-invalid={errors.confirmPassword ? "true" : "false"}
                    aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                    data-testid="input-confirm-password"
                    {...register("confirmPassword")}
                  />
                </div>
                {errors.confirmPassword && (
                  <p id="confirmPassword-error" className="mt-2 text-sm text-[var(--accent-rose)]" role="alert">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full btn-premium py-3.5 mt-6 hover-glow-gold disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="button-submit"
            >
              {registerMutation.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin motion-reduce:animate-none" aria-hidden="true" />
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" aria-hidden="true" />
                  Create Account
                </span>
              )}
            </button>

            <div className="mt-6 pt-6 border-t border-[var(--border)] text-center">
              <p className="text-[var(--text-secondary)]">
                Already have an account?{" "}
                <Link 
                  href="/login" 
                  className="text-[var(--primary)] hover:text-[var(--primary-dark)] font-semibold transition-colors"
                  data-testid="link-login"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
          
          <p className="text-center text-xs text-[var(--text-muted)] mt-6">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </>
  </WellnessPageShell>
  );
}
