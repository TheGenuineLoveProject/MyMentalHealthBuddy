import { Link, useSearch } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "../lib/queryClient.js";
import { CheckCircle, AlertCircle, Lock, Eye, EyeOff, Shield, ArrowRight } from 'lucide-react';
import { useMemo, useState } from "react";
import SEO from "../components/SEO";
import LumiMascotImage from "../components/lumi/LumiMascotImage.jsx";
import SafetyFooter from "../components/SafetyFooter.jsx";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

const resetPasswordSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
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
          noindex
        />
        <div className="min-h-screen flex items-center justify-center overflow-hidden relative" style={{ background: 'var(--glp-paper)', padding: '1.5rem' }}>
          <div className="decorative-orb decorative-orb-blush w-[400px] h-[400px] -top-20 -left-20 absolute" aria-hidden="true" />
          <div className="decorative-orb decorative-orb-sage w-[300px] h-[300px] bottom-10 -right-10 absolute" aria-hidden="true" />
          
          <div className="w-full text-center relative z-10 animate-fade-in-up shadow-2xl" style={{ background: 'var(--glp-white, #FFFFFF)', border: '1px solid var(--glp-sage-15)', maxWidth: '28rem', borderRadius: '1.25rem', padding: '2rem' }}>
            <div className="w-20 h-20 flex items-center justify-center mx-auto shadow-lg" style={{ background: 'linear-gradient(135deg, var(--glp-rose) 0%, #E8913A 100%)', borderRadius: '1rem', marginBottom: '1.5rem' }}>
              <AlertCircle className="w-10 h-10 text-white" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-display font-bold text-[var(--text)]" style={{ marginBottom: '0.75rem' }} data-testid="text-error-title">
              Invalid Reset Link
            </h1>
            <p className="text-[var(--text-secondary)]" style={{ marginBottom: '1.5rem' }} data-testid="text-error-message">
              This password reset link is invalid or has expired. Please request a new one to continue.
            </p>
            <Link 
              href="/forgot-password" 
              className="btn-premium inline-flex items-center" style={{ padding: '0.7rem 2rem', borderRadius: '0.75rem', gap: '0.5rem' }}
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
          noindex
        />
        <div className="min-h-screen flex items-center justify-center overflow-hidden relative" style={{ background: 'var(--glp-paper)', padding: '1.5rem' }}>
          <div className="decorative-orb decorative-orb-sage w-[400px] h-[400px] -top-20 -left-20 absolute" aria-hidden="true" />
          <div className="decorative-orb decorative-orb-gold w-[250px] h-[250px] bottom-10 -right-10 absolute" aria-hidden="true" />
          
          <div className="w-full text-center relative z-10 animate-fade-in-up shadow-2xl" style={{ background: 'var(--glp-white, #FFFFFF)', border: '1px solid var(--glp-sage-15)', maxWidth: '28rem', borderRadius: '1.25rem', padding: '2rem' }}>
            <div className="w-20 h-20 flex items-center justify-center mx-auto shadow-lg" style={{ background: 'linear-gradient(135deg, #4A7E72 0%, #A8C9A0 100%)', borderRadius: '1rem', marginBottom: '1.5rem' }}>
              <CheckCircle className="w-10 h-10 text-white" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-display font-bold text-[var(--text)]" style={{ marginBottom: '0.75rem' }} data-testid="text-success-title">
              Password Reset Complete
            </h1>
            <p className="text-[var(--text-secondary)]" style={{ marginBottom: '1.5rem' }} data-testid="text-success-message"
            role="status"
            aria-live="polite"
            aria-atomic="true"
            data-phase113hr="PHASE113HR_RESET_PASSWORD_SUCCESS_STATUS_ANNOUNCEMENT_FIX"
          >
              Your password has been successfully reset. You can now sign in with your new password.
            </p>
            <Link 
              href="/login" 
              className="btn-premium inline-flex items-center" style={{ padding: '0.7rem 2rem', borderRadius: '0.75rem', gap: '0.5rem' }}
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
        { label: "Beginner", examples: ["Choose a password you'll remember.", "Make it at least 8 characters."] },
        { label: "Intermediate", examples: ["Use a mix of letters and numbers.", "Avoid common words."] },
        { label: "Advanced", examples: ["Use a password manager.", "Enable two-factor authentication."] }
      ]}
    >
    <>
      <SEO 
        title="Reset Password"
        description="Create a new password for your MyMentalHealthBuddy account."
        noindex
      />
      <div className="min-h-screen flex items-center justify-center overflow-hidden relative" style={{ background: 'var(--glp-paper)', padding: '1.5rem' }}>
        <div className="decorative-orb decorative-orb-sage w-[400px] h-[400px] -top-20 -left-20 absolute" aria-hidden="true" />
        <div className="decorative-orb decorative-orb-blush w-[350px] h-[350px] bottom-10 -right-20 absolute" aria-hidden="true" />
        
        <div className="w-full relative z-10 animate-fade-in-up" style={{ maxWidth: '28rem' }}>
          <Link 
            href="/" 
            className="flex items-center justify-center hover:opacity-80 transition-opacity"
            style={{ gap: '0.75rem', marginBottom: '2rem' }}
            data-testid="link-home"
          >
            <span
              aria-hidden="true"
              className="w-16 h-16 flex items-center justify-center"
              style={{ background: 'radial-gradient(circle at 50% 55%, var(--glp-sage-10) 0%, transparent 72%)', overflow: 'visible' }}
            >
              {/* Recovery surface: static official PNG only, no interaction.
                  Renders the canonical avatar-floating PNG from /brand/v17. */}
              <LumiMascotImage
                size={56}
                animation="breathe"
                decorative
                data-testid="lumi-reset"
              />
            </span>
            <span className="font-display font-semibold text-lg text-[var(--text)]">MyMentalHealthBuddy</span>
          </Link>
          
          <div className="shadow-2xl" style={{ background: 'var(--glp-white, #FFFFFF)', border: '1px solid var(--glp-sage-15)', borderRadius: '1.5rem', padding: '2rem' }}>
            <div className="text-center" style={{ marginBottom: '1.5rem' }}>
              <div className="w-16 h-16 flex items-center justify-center mx-auto shadow-lg" style={{ background: 'linear-gradient(135deg, #4A7E72 0%, #A8C9A0 100%)', borderRadius: '1rem', marginBottom: '1rem' }}>
                <Lock className="w-8 h-8 text-white" aria-hidden="true" />
              </div>
              <h1 className="text-2xl font-display font-bold text-[var(--text)]" style={{ marginBottom: '0.5rem' }} data-testid="text-reset-password-title">
                Create New Password
              </h1>
              <p className="text-[var(--text-secondary)]">
                Choose a strong password to keep your account secure.
              </p>
            </div>

            {errors.root && (
              <div 
                className="bg-[var(--accent-rose-soft)] border border-[var(--accent-rose)]/30 text-[var(--accent-rose)] text-sm flex items-start" 
                style={{ marginBottom: '1rem', padding: '1rem', borderRadius: '0.75rem', gap: '0.75rem' }}
                data-testid="text-error"
                role="alert"
              >
                <Shield className="w-5 h-5 flex-shrink-0" style={{ marginTop: '0.125rem' }} aria-hidden="true" />
                <span>{errors.root.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} data-testid="form-reset-password" noValidate>
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="newPassword" className="block text-sm font-medium text-[var(--text)]" style={{ marginBottom: '0.5rem' }}>
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute text-[var(--text-muted)]" style={{ left: '1rem', top: '50%', transform: 'translateY(-50%)' }}>
                    <Lock className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    className={`input-lg w-full ${errors.newPassword ? "border-[var(--accent-rose)] focus:border-[var(--accent-rose)]" : ""}`}
                    style={{ paddingLeft: '3rem', paddingRight: '3rem' }}
                    placeholder="Min 8 characters"
                    autoComplete="new-password"
                    aria-invalid={errors.newPassword ? "true" : "false"}
                    aria-describedby={errors.newPassword ? "newPassword-error" : undefined}
                    data-testid="input-new-password"
                    {...register("newPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute text-[var(--text-muted)] hover:text-[var(--text)] transition-colors" style={{ right: '1rem', top: '50%', transform: 'translateY(-50%)' }}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p id="newPassword-error" className="text-sm text-[var(--accent-rose)] flex items-center" style={{ marginTop: '0.5rem', gap: '0.375rem' }} role="alert">
                    <span className="w-1 h-1 bg-[var(--accent-rose)] rounded-full"></span>
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--text)]" style={{ marginBottom: '0.5rem' }}>
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute text-[var(--text-muted)]" style={{ left: '1rem', top: '50%', transform: 'translateY(-50%)' }}>
                    <Lock className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    className={`input-lg w-full ${errors.confirmPassword ? "border-[var(--accent-rose)] focus:border-[var(--accent-rose)]" : ""}`}
                    style={{ paddingLeft: '3rem', paddingRight: '3rem' }}
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
                    className="absolute text-[var(--text-muted)] hover:text-[var(--text)] transition-colors" style={{ right: '1rem', top: '50%', transform: 'translateY(-50%)' }}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p id="confirmPassword-error" className="text-sm text-[var(--accent-rose)] flex items-center" style={{ marginTop: '0.5rem', gap: '0.375rem' }} role="alert">
                    <span className="w-1 h-1 bg-[var(--accent-rose)] rounded-full"></span>
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={resetMutation.isPending}
                className="btn-premium w-full text-base font-medium flex items-center justify-center"
                style={{ width: '100%', padding: '0.95rem 1.5rem', minHeight: '54px', borderRadius: '0.75rem', gap: '0.5rem' }}
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

            <div className="bg-[var(--surface)]/50" style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: '0.75rem' }}>
              <h3 className="text-sm font-medium text-[var(--text)] flex items-center" style={{ marginBottom: '0.5rem', gap: '0.5rem' }}>
                <Shield className="w-4 h-4 text-[var(--primary)]" aria-hidden="true" />
                Password Tips
              </h3>
              <ul className="text-xs text-[var(--text-muted)]" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <li>• Use at least 8 characters</li>
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
