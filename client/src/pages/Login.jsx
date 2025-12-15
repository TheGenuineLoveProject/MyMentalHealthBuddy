import { useLocation, Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Heart, Mail, Lock, ArrowRight } from "lucide-react";
import { apiRequest } from "../lib/queryClient.js";
import SEO from "../components/SEO.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: (data) => apiRequest("POST", "/api/auth/login", data),
    onSuccess: (result) => {
      if (result.token) {
        login(result.token, result.user);
        setLocation("/dashboard");
      } else {
        setError("root", { message: result.message || "Login failed" });
      }
    },
    onError: (err) => {
      const message = err.message?.includes("401") 
        ? "Invalid email or password" 
        : "Something went wrong. Please try again.";
      setError("root", { message });
    },
  });

  const onSubmit = (data) => {
    loginMutation.mutate(data);
  };

  return (
    <>
      <SEO 
        title="Sign In"
        description="Sign in to your Genuine Love Project account to access your wellness dashboard, mood tracking, and AI companion."
      />
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-mesh">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-xl bg-[var(--gradient-focus)] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Heart className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              <span className="text-2xl font-bold tracking-tight">The Genuine Love Project</span>
            </Link>
          </div>

          <form 
            onSubmit={handleSubmit(onSubmit)}
            className="card-elevated p-8"
            data-testid="form-login"
            noValidate
          >
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2" data-testid="text-login-title">
                Welcome Back
              </h1>
              <p className="text-[var(--text-secondary)]">Sign in to continue your wellness journey</p>
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
                    placeholder="Enter your password"
                    autoComplete="current-password"
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
            </div>

            <div className="mt-4 text-right">
              <Link 
                href="/forgot-password" 
                className="text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition"
                data-testid="link-forgot-password"
              >
                Forgot your password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="btn btn-gradient w-full mt-6 py-4 text-base"
              data-testid="button-submit"
            >
              {loginMutation.isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </>
              )}
            </button>

            <div className="mt-6 pt-6 border-t border-[var(--border)] text-center">
              <p className="text-[var(--text-secondary)]">
                Don't have an account?{" "}
                <Link 
                  href="/register" 
                  className="text-[var(--primary)] hover:text-[var(--primary-dark)] font-medium transition"
                  data-testid="link-register"
                >
                  Create one
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
