import { Link, useSearch } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "../lib/queryClient.js";
import { CheckCircle, AlertCircle, Lock, Eye, EyeOff, Heart, Shield, ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import SEO from "../components/SEO";

const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function ResetPassword() {
  const searchString = useSearch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const token = useMemo(() => {
    if (!searchString) return null;
    const params = new URLSearchParams(searchString);
    return params.get("token");
  }, [searchString]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const resetMutation = useMutation({
    mutationFn: (data) => apiRequest("POST", "/api/account/password-reset/confirm", {
      token,
      password: data.newPassword,
    }),
    onError: (err) => {
      const message = err.message?.includes("expired") || err.message?.includes("invalid")
        ? "This reset link has expired or is invalid. Please request a new one."
        : "Something went wrong. Please try again.";
      setError("root", { message });
    },
  });

  const onSubmit = (data) => {
    if (!token) {
      setError("root", { message: "Invalid reset token. Please request a new password reset link." });
      return;
    }
    resetMutation.mutate(data);
  };

  if (!token) {
    return (
      <>
        <SEO 
          title="Invalid Reset Link"
          description="This password reset link is invalid or has expired."
        />
        <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--bg)]">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--accent-rose)]/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[var(--primary)]/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="w-full max-w-md card-elevated p-8 text-center relative z-10 animate-fade-in-up">
            <div className="w-20 h-20 bg-gradient-to-br from-[var(--accent-rose)] to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <AlertCircle className="w-10 h-10 text-white" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-display font-bold mb-3 text-[var(--text)]" data-testid="text-error-title">
              Invalid Reset Link
            </h1>
            <p className="text-[var(--text-secondary)] mb-6" data-testid="text-error-message">
              This password reset link is invalid or has expired. Please request a new one to continue.
            </p>
            <Link 
              href="/forgot-password" 
              className="btn btn-gradient px-8 py-3 inline-flex items-center gap-2"
              data-testid="link-request-new"
            >
              Request New Link
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </>
    );
  }

  if (resetMutation.isSuccess) {
    return (
      <>
        <SEO 
          title="Password Reset Complete"
          description="Your password has been successfully reset."
        />
        <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--bg)]">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--accent-teal)]/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[var(--primary)]/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="w-full max-w-md card-elevated p-8 text-center relative z-10 animate-fade-in-up">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle className="w-10 h-10 text-white" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-display font-bold mb-3 text-[var(--text)]" data-testid="text-success-title">
              Password Reset Complete
            </h1>
            <p className="text-[var(--text-secondary)] mb-6" data-testid="text-success-message">
              Your password has been successfully reset. You can now sign in with your new password.
            </p>
            <Link 
              href="/login" 
              className="btn btn-gradient px-8 py-3 inline-flex items-center gap-2"
              data-testid="link-login"
            >
              Sign In
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO 
        title="Reset Password"
        description="Create a new password for your Genuine Love Project account."
      />
      <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--bg)]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--accent-teal)]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[var(--primary)]/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="w-full max-w-md relative z-10 animate-fade-in-up">
          <Link 
            href="/" 
            className="flex items-center justify-center gap-2 mb-8 text-[var(--primary)] hover:opacity-80 transition-opacity"
            data-testid="link-home"
          >
            <Heart className="w-6 h-6" aria-hidden="true" />
            <span className="font-display font-semibold text-lg text-[var(--text)]">The Genuine Love Project</span>
          </Link>
          
          <div className="card-elevated p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[var(--primary)] to-[var(--accent-violet)] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Lock className="w-8 h-8 text-white" aria-hidden="true" />
              </div>
              <h1 className="text-2xl font-display font-bold mb-2 text-[var(--text)]" data-testid="text-reset-password-title">
                Create New Password
              </h1>
              <p className="text-[var(--text-secondary)]">
                Choose a strong password to keep your account secure.
              </p>
            </div>

            {errors.root && (
              <div 
                className="mb-4 p-4 bg-[var(--accent-rose-soft)] border border-[var(--accent-rose)]/30 rounded-xl text-[var(--accent-rose)] text-sm flex items-start gap-3" 
                data-testid="text-error"
                role="alert"
              >
                <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>{errors.root.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} data-testid="form-reset-password" noValidate>
              <div className="mb-4">
                <label htmlFor="newPassword" className="block mb-2 text-sm font-medium text-[var(--text)]">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                    <Lock className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    className={`input-lg pl-12 pr-12 w-full ${errors.newPassword ? "border-[var(--accent-rose)] focus:border-[var(--accent-rose)]" : ""}`}
                    placeholder="Min 6 characters"
                    autoComplete="new-password"
                    aria-invalid={errors.newPassword ? "true" : "false"}
                    aria-describedby={errors.newPassword ? "newPassword-error" : undefined}
                    data-testid="input-new-password"
                    {...register("newPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p id="newPassword-error" className="mt-2 text-sm text-[var(--accent-rose)] flex items-center gap-1.5" role="alert">
                    <span className="w-1 h-1 bg-[var(--accent-rose)] rounded-full"></span>
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-[var(--text)]">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                    <Lock className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    className={`input-lg pl-12 pr-12 w-full ${errors.confirmPassword ? "border-[var(--accent-rose)] focus:border-[var(--accent-rose)]" : ""}`}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    aria-invalid={errors.confirmPassword ? "true" : "false"}
                    aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                    data-testid="input-confirm-password"
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p id="confirmPassword-error" className="mt-2 text-sm text-[var(--accent-rose)] flex items-center gap-1.5" role="alert">
                    <span className="w-1 h-1 bg-[var(--accent-rose)] rounded-full"></span>
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={resetMutation.isPending}
                className="btn btn-gradient w-full py-4 text-base font-medium flex items-center justify-center gap-2"
                data-testid="button-submit"
              >
                {resetMutation.isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Resetting...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" aria-hidden="true" />
                    Reset Password
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 p-4 bg-[var(--surface)]/50 rounded-xl">
              <h3 className="text-sm font-medium text-[var(--text)] mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-[var(--primary)]" aria-hidden="true" />
                Password Tips
              </h3>
              <ul className="text-xs text-[var(--text-muted)] space-y-1">
                <li>• Use at least 6 characters</li>
                <li>• Mix letters, numbers, and symbols</li>
                <li>• Avoid common words or patterns</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
