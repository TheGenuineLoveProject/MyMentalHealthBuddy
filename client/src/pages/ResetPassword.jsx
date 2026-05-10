import { Link, useSearch } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "../lib/queryClient.js";
import { CheckCircle, AlertCircle, Lock, Eye, EyeOff, Shield, ArrowRight } from 'lucide-react';
import { useMemo, useState } from "react";
import SEO from "../components/SEO";
import LumiMascot from "../components/lumi/LumiMascot.jsx";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

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
    if (!searchString) return (
    <div className="min-h-screen safe-padding hero-gradient">
      <SEO title="Reset Password — MyMentalHealthBuddy" description="Explore reset password tools for your wellness journey." />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Reset Password</h1>
        <p className="text-muted-foreground mb-8">
          This page is being refined. Use the navigation to explore tools while we finish this section.
        </p>
        <SafetyFooter />
      </main>
    </div>
  );
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
  <WellnessPageShell
    title="ResetPassword"
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
          title="Invalid Reset Link"
          description="This password reset link is invalid or has expired."
        />
        <div className="min-h-screen flex items-center justify-center p-6 hero-gradient overflow-hidden relative">
          <div className="decorative-orb decorative-orb-blush w-[400px] h-[400px] -top-20 -left-20 absolute" aria-hidden="true" />
          <div className="decorative-orb decorative-orb-sage w-[300px] h-[300px] bottom-10 -right-10 absolute" aria-hidden="true" />
          
          <div className="w-full max-w-md glass-premium rounded-2xl p-8 text-center relative z-10 animate-fade-in-up">
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
    </WellnessPageShell>
    );
  }

  if (resetMutation.isSuccess) {
    return (
      <WellnessPageShell
        title="Password Reset Complete"
        subtitle="Your password has been successfully reset"
        benefits={pickBenefits(["agency","calm","clarity","selfRespect","meaning"], 5)}
        clarity={{
          what: "Password reset confirmation.",
          why: "To confirm your password was successfully changed.",
          who: "For users who just reset their password.",
          when: "After completing a password reset.",
          where: "Right here.",
          how: "Click to sign in with your new password."
        }}
        examples={[
          { label: "Beginner", examples: ["Click sign in.", "Enter your new password."] },
          { label: "Intermediate", examples: ["Use a password manager.", "Enable two-factor authentication."] },
          { label: "Advanced", examples: ["Review security settings.", "Set up recovery options."] }
        ]}
      >
      <>
        <SEO 
          title="Password Reset Complete"
          description="Your password has been successfully reset."
        />
        <div className="min-h-screen flex items-center justify-center p-6 hero-gradient overflow-hidden relative">
          <div className="decorative-orb decorative-orb-sage w-[400px] h-[400px] -top-20 -left-20 absolute" aria-hidden="true" />
          <div className="decorative-orb decorative-orb-gold w-[250px] h-[250px] bottom-10 -right-10 absolute" aria-hidden="true" />
          
          <div className="w-full max-w-md glass-premium rounded-2xl p-8 text-center relative z-10 animate-fade-in-up">
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
    </WellnessPageShell>
    );
  }

  return (
    <WellnessPageShell
      title="Reset Password"
      subtitle="Create a new secure password"
      benefits={pickBenefits(["agency","calm","clarity","selfRespect","meaning"], 5)}
      clarity={{
        what: "A secure password reset form.",
        why: "To help you regain access to your account safely.",
        who: "For users who need to reset their password.",
        when: "When you have a valid reset link.",
        where: "Right here.",
        how: "Enter your new password twice and submit."
      }}
      examples={[
        { label: "Beginner", examples: ["Choose a password you'll remember.", "Make it at least 6 characters."] },
        { label: "Intermediate", examples: ["Use a mix of letters and numbers.", "Avoid common words."] },
        { label: "Advanced", examples: ["Use a password manager.", "Enable two-factor authentication."] }
      ]}
    >
    <>
      <SEO 
        title="Reset Password"
        description="Create a new password for your MyMentalHealthBuddy account."
      />
      <div className="min-h-screen flex items-center justify-center p-6 hero-gradient overflow-hidden relative">
        <div className="decorative-orb decorative-orb-sage w-[400px] h-[400px] -top-20 -left-20 absolute" aria-hidden="true" />
        <div className="decorative-orb decorative-orb-blush w-[350px] h-[350px] bottom-10 -right-20 absolute" aria-hidden="true" />
        
        <div className="w-full max-w-md relative z-10 animate-fade-in-up">
          <Link 
            href="/" 
            className="flex items-center justify-center gap-3 mb-8 hover:opacity-80 transition-opacity"
            data-testid="link-home"
          >
            <span
              aria-hidden="true"
              className="w-16 h-16 flex items-center justify-center"
              style={{ background: 'radial-gradient(circle at 50% 55%, var(--glp-sage-10) 0%, transparent 72%)', overflow: 'visible' }}
            >
              <LumiMascot emotion="comfort" size={48} />
            </span>
            <span className="font-display font-semibold text-lg text-[var(--text)]">MyMentalHealthBuddy</span>
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
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin motion-reduce:animate-none"></div>
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
  </WellnessPageShell>
  );
}
