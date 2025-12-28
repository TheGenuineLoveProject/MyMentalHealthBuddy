import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "../lib/queryClient.js";
import { CheckCircle, ArrowLeft, Mail, Send, Heart, Shield, Clock } from "lucide-react";
import SEO from "../components/SEO";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const resetMutation = useMutation({
    mutationFn: (data) => apiRequest("POST", "/api/account/password-reset/request", data),
    onError: (err) => {
      setError("root", { 
        message: err.message || "Something went wrong. Please try again." 
      });
    },
  });

  const onSubmit = (data) => {
    resetMutation.mutate(data);
  };

  if (resetMutation.isSuccess) {
    return (
      <>
        <SEO 
          title="Check Your Email"
          description="Password reset instructions have been sent to your email address."
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
              Check Your Email
            </h1>
            <p className="text-[var(--text-secondary)] mb-4" data-testid="text-success-message">
              If an account exists with that email address, we've sent instructions to reset your password.
            </p>
            <div className="flex items-center justify-center gap-2 text-[var(--text-muted)] text-sm mb-6 p-3 bg-[var(--surface)]/50 rounded-xl">
              <Clock className="w-4 h-4" aria-hidden="true" />
              <span>Link expires in 1 hour</span>
            </div>
            <p className="text-[var(--text-muted)] text-sm mb-6">
              Didn't receive an email? Check your spam folder or try again.
            </p>
            <Link 
              href="/login" 
              className="inline-flex items-center justify-center gap-2 text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium transition-colors"
              data-testid="link-back-to-login"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO 
        title="Forgot Password"
        description="Reset your Genuine Love Project password. We'll send you a secure link to create a new password."
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
                <Mail className="w-8 h-8 text-white" aria-hidden="true" />
              </div>
              <h1 className="text-2xl font-display font-bold mb-2 text-[var(--text)]" data-testid="text-forgot-password-title">
                Forgot Password?
              </h1>
              <p className="text-[var(--text-secondary)]">
                No worries! Enter your email and we'll send you a secure reset link.
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

            <form onSubmit={handleSubmit(onSubmit)} data-testid="form-forgot-password" noValidate>
              <div className="mb-6">
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-[var(--text)]">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                    <Mail className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    className={`input-lg pl-12 w-full ${errors.email ? "border-[var(--accent-rose)] focus:border-[var(--accent-rose)]" : ""}`}
                    placeholder="you@example.com"
                    autoComplete="email"
                    aria-invalid={errors.email ? "true" : "false"}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    data-testid="input-email"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p id="email-error" className="mt-2 text-sm text-[var(--accent-rose)] flex items-center gap-1.5" role="alert">
                    <span className="w-1 h-1 bg-[var(--accent-rose)] rounded-full"></span>
                    {errors.email.message}
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
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" aria-hidden="true" />
                    Send Reset Link
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-[var(--text-secondary)]">
              Remember your password?{" "}
              <Link 
                href="/login" 
                className="text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium transition-colors"
                data-testid="link-login"
              >
                Sign in
              </Link>
            </p>
          </div>
          
          <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
            Your security is our priority. Reset links expire after 1 hour.
          </p>
        </div>
      </div>
    </>
  );
}
