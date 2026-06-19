import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "../lib/queryClient.js";
import { CheckCircle, ArrowLeft, Mail, Send, Shield, Clock } from 'lucide-react';
import SEO from "../components/SEO";
import LumiMascotImage from "../components/lumi/LumiMascotImage.jsx";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

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
  <WellnessPageShell
    title="ForgotPassword"
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
          title="Check Your Email"
          description="Password reset instructions have been sent to your email address."
          noindex
        />
        <div className="min-h-screen flex items-center justify-center overflow-hidden relative" style={{ background: 'var(--glp-paper)', padding: '1.5rem' }}>
          <div className="decorative-orb decorative-orb-sage w-[400px] h-[400px] -top-20 -left-20 absolute" aria-hidden="true" />
          <div className="decorative-orb decorative-orb-gold w-[250px] h-[250px] bottom-10 -right-10 absolute" aria-hidden="true" />
          
          <div className="w-full v28-card text-center relative z-10 animate-fade-in-up" style={{ maxWidth: '28rem', borderRadius: '1.25rem', padding: '2rem' }}>
            <div className="w-20 h-20 flex items-center justify-center mx-auto shadow-lg" style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))', borderRadius: '1rem', marginBottom: '1.5rem' }}>
              <CheckCircle className="w-10 h-10 text-white" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-display font-bold text-[var(--text)]" style={{ marginBottom: '0.75rem' }} data-testid="text-success-title">
              Check Your Email
            </h1>
            <p className="text-[var(--text-secondary)]" style={{ marginBottom: '1rem' }} data-testid="text-success-message"
              role="status"
              aria-live="polite"
              aria-atomic="true"
              data-phase113hw="PHASE113HW_FORGOT_PASSWORD_SUCCESS_STATUS_ANNOUNCEMENT_FIX"
            >
              If an account exists with that email address, we've sent instructions to reset your password.
            </p>
            <div className="flex items-center justify-center text-[var(--text-muted)] text-sm bg-[var(--surface)]/50" style={{ gap: '0.5rem', marginBottom: '1.5rem', padding: '0.75rem', borderRadius: '0.75rem' }}>
              <Clock className="w-4 h-4" aria-hidden="true" />
              <span>Link expires in 1 hour</span>
            </div>
            <p className="text-[var(--text-muted)] text-sm" style={{ marginBottom: '1.5rem' }}>
              Didn't receive an email? Check your spam folder or try again.
            </p>
            <Link 
              href="/login" 
              className="inline-flex items-center justify-center text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium transition-colors"
              style={{ gap: '0.5rem' }}
              data-testid="link-back-to-login"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </>
    </WellnessPageShell>
    );
  }

  return (
    <WellnessPageShell
      title="Forgot Password"
      subtitle="Reset your password securely"
      benefits={pickBenefits(["agency","calm","clarity","selfRespect","meaning"], 5)}
      clarity={{
        what: "A secure password reset tool.",
        why: "To help you regain access to your account safely.",
        who: "For users who need to reset their password.",
        when: "Anytime you've forgotten your password.",
        where: "Right here, securely.",
        how: "Enter your email and follow the link we send."
      }}
      examples={[
        { label: "Beginner", examples: ["Enter your email address.", "Check your inbox for the reset link."] },
        { label: "Intermediate", examples: ["Click the reset link within 1 hour.", "Create a new secure password."] },
        { label: "Advanced", examples: ["Use a password manager for security.", "Enable two-factor authentication."] }
      ]}
    >
      <>
        <SEO 
          title="Forgot Password"
          description="Reset your MyMentalHealthBuddy password. We'll send you a secure link to create a new password."
          noindex
        />
      <div className="min-h-screen flex items-center justify-center overflow-hidden relative" style={{ background: 'var(--glp-paper)', padding: '1.5rem' }}>
        <div className="absolute -top-24 -left-24 w-[500px] h-[500px] rounded-full animate-pulse motion-reduce:animate-none" style={{ background: 'radial-gradient(circle, var(--glp-sage-30), transparent 70%)' }} aria-hidden="true" />
        <div className="absolute bottom-0 -right-24 w-[450px] h-[450px] rounded-full animate-pulse motion-reduce:animate-none" style={{ background: 'radial-gradient(circle, var(--glp-rose-20), transparent 70%)', animationDelay: '1s' }} aria-hidden="true" />
        
        <div className="w-full relative z-10 animate-fade-in-up" style={{ maxWidth: '28rem' }}>
          <Link 
            href="/" 
            className="flex items-center justify-center hover:opacity-90 transition-opacity group"
            style={{ gap: '1rem', marginBottom: '2.5rem' }}
            data-testid="link-home"
          >
            <span
              aria-hidden="true"
              className="w-20 h-20 flex items-center justify-center transition-all group-hover:scale-105"
              style={{ background: 'radial-gradient(circle at 50% 55%, var(--glp-sage-15) 0%, var(--glp-sage-10) 38%, transparent 72%)', overflow: 'visible' }}
            >
              {/* Sensitive surface (account recovery): static official PNG only,
                  no interaction (asymmetric risk: distressed users shouldn't be
                  invited to interact with the mascot). Renders the canonical
                  avatar-floating PNG from /brand/v17. */}
              <LumiMascotImage
                size={72}
                animation="breathe"
                decorative
                data-testid="lumi-forgot"
              />
            </span>
            <span className="font-display font-bold text-xl" style={{ color: 'var(--glp-sage-deep)' }}>MyMentalHealthBuddy</span>
          </Link>
          
          <div className="card-elevated" style={{ padding: '2rem', borderRadius: '1.25rem' }}>
            <div className="text-center" style={{ marginBottom: '1.5rem' }}>
              <div className="w-16 h-16 flex items-center justify-center mx-auto shadow-lg" style={{ background: 'linear-gradient(135deg, #4A7E72 0%, #A8C9A0 100%)', borderRadius: '1rem', marginBottom: '1rem' }}>
                <Mail className="w-8 h-8 text-white" aria-hidden="true" />
              </div>
              <h1 className="text-2xl font-display font-bold text-[var(--text)]" style={{ marginBottom: '0.5rem' }} data-testid="text-forgot-password-title">
                Forgot Password?
              </h1>
              <p className="text-[var(--text-secondary)]">
                No worries! Enter your email and we'll send you a secure reset link.
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

            <form onSubmit={handleSubmit(onSubmit)} data-testid="form-forgot-password" noValidate>
              <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="email" className="block text-sm font-medium text-[var(--text)]" style={{ marginBottom: '0.5rem' }}>
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute text-[var(--text-muted)]" style={{ left: '1rem', top: '50%', transform: 'translateY(-50%)' }}>
                    <Mail className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    className={`input-lg w-full ${errors.email ? "border-[var(--accent-rose)] focus:border-[var(--accent-rose)]" : ""}`}
                    style={{ paddingLeft: '3rem' }}
                    placeholder="you@example.com"
                    autoComplete="email"
                    aria-invalid={errors.email ? "true" : "false"}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    data-testid="input-email"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p id="email-error" className="text-sm text-[var(--accent-rose)] flex items-center" style={{ marginTop: '0.5rem', gap: '0.375rem' }} role="alert">
                    <span className="w-1 h-1 bg-[var(--accent-rose)] rounded-full"></span>
                    {errors.email.message}
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

            <p className="text-center text-[var(--text-secondary)]" style={{ marginTop: '1.5rem' }}>
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
          
          <p className="text-center text-sm text-[var(--text-muted)]" style={{ marginTop: '1.5rem' }}>
            Your security is our priority. Reset links expire after 1 hour.
          </p>
        </div>
      </div>
    </>
  </WellnessPageShell>
  );
}
