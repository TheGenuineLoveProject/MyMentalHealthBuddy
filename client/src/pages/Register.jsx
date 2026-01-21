import { useLocation, Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Heart, Mail, Lock, User, Sparkles, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { apiRequest } from "../lib/queryClient.js";
import SEO from "../components/SEO";

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
    <>
      <SEO 
        title="Create Account"
        description="Create your free Genuine Love Project account. Start your mental wellness journey with AI-powered support, mood tracking, and journaling."
      />
      <div className="min-h-screen hero-gradient overflow-hidden relative flex items-center justify-center p-6">
        <div className="decorative-orb decorative-orb-sage w-[400px] h-[400px] -top-20 -right-20 absolute" aria-hidden="true" />
        <div className="decorative-orb decorative-orb-blush w-[350px] h-[350px] bottom-10 -left-20 absolute" aria-hidden="true" />
        <div className="decorative-orb decorative-orb-gold w-[200px] h-[200px] top-1/3 left-10 absolute" aria-hidden="true" />
        
        <div className="relative z-10 w-full max-w-md animate-fade-in-up">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <img 
                src="/brand/logo-mark.png" 
                alt="The Genuine Love Project" 
                className="w-14 h-14 object-contain group-hover:scale-110 transition-transform"
                data-testid="img-register-logo"
              />
              <span className="text-xl font-bold tracking-tight text-[var(--text)]">The Genuine Love Project</span>
            </Link>
          </div>

          <form 
            onSubmit={handleSubmit(onSubmit)}
            className="glass-premium rounded-2xl p-8"
            data-testid="form-register"
            noValidate
          >
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-[var(--text)] mb-2 font-display" data-testid="text-register-title">
                Start Your Wellness Journey
              </h1>
              <p className="text-[var(--text-secondary)]">Create your free account today</p>
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
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
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
  );
}
