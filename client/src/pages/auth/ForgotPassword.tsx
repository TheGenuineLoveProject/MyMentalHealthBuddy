import { useState } from "react";
import { Link } from "wouter";
import { 
  KeyRound, Mail, ArrowLeft, Heart, Sparkles, 
  Loader2, Check, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SEO } from "@/components/SEO";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    setError("");
    
    try {
      const res = await fetch("/api/account/password-reset/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() })
      });
      
      setIsSubmitted(true);
    } catch {
      setError("Unable to process request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Reset Password | MyMentalHealthBuddy"
        description="Reset your password. Educational wellness tools for adults 18+."
      />
    <div className="min-h-screen hero-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6" data-testid="link-home">
            <img 
              src="/brand/mmhb-icon.svg" 
              alt="MyMentalHealthBuddy" 
              className="w-14 h-14 rounded-xl object-contain"
              style={{ boxShadow: '0 3px 16px rgba(38,79,79,0.2)' }}
            />
            <span className="text-heading-lg text-teal">MyMentalHealthBuddy</span>
          </Link>
          <h1 className="text-display-md text-teal mb-2" data-testid="text-page-title">Reset Password</h1>
          <p className="text-lead">We'll help you get back in</p>
        </div>

        <div className="card-bordered">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center mb-6">
                <div className="icon-container icon-xl icon-soft-gold mx-auto mb-4">
                  <KeyRound className="h-7 w-7" />
                </div>
                <p className="text-body-sm text-[var(--sage-600)]">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--sage-400)]" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="input-premium pl-10"
                    required
                    data-testid="input-email"
                  />
                </div>
                <p className="form-hint">We'll never share your email</p>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !email.trim()}
                className="btn-premium w-full"
                data-testid="button-submit"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin motion-reduce:animate-none" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Reset Link
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          ) : (
            <div className="text-center py-6">
              <div className="icon-container icon-xl icon-soft-sage mx-auto mb-4">
                <Check className="h-7 w-7" />
              </div>
              <h2 className="text-heading-md text-teal mb-2">Check Your Email</h2>
              <p className="text-body-sm text-[var(--sage-600)] mb-6">
                We've sent a password reset link to <span className="font-medium">{email}</span>. 
                Please check your inbox and follow the instructions.
              </p>
              <p className="text-caption text-[var(--sage-500)] mb-4">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <Button
                variant="outline"
                onClick={() => setIsSubmitted(false)}
                className="btn-secondary-premium"
                data-testid="button-try-again"
              >
                Try Another Email
              </Button>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-[var(--sage-200)] text-center">
            <Link href="/login" className="inline-flex items-center gap-2 text-body-sm text-[var(--sage-500)] hover:text-[var(--teal-600)] transition" data-testid="link-login">
              <ArrowLeft className="h-4 w-4" />
              Back to Sign In
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-caption flex items-center justify-center gap-1">
            <Sparkles className="w-4 h-4 text-[var(--gold-500)]" />
            by The Genuine Love Project
          </p>
          <p className="text-sm opacity-70 mt-2">
            Adults 18+ only. Educational wellness tools, not medical care.
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
