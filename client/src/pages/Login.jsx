import { Link, useLocation } from "wouter";
import { useEffect } from "react";
import { ArrowRight, Shield, Heart, Sparkles, LayoutDashboard } from "lucide-react";
import SEO from "../components/SEO";
import { useAuth } from "../context/AuthContext.jsx";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function Login() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && isAuthenticated()) {
      setLocation("/dashboard");
    }
  }, [isLoading, isAuthenticated, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(180deg, var(--glp-paper) 0%, var(--glp-sage-10) 100%)' }}>
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'var(--glp-sage-deep)', borderTopColor: 'transparent' }} />
          <p className="text-sm" style={{ color: 'var(--glp-sage)' }}>Checking your session...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated()) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(180deg, var(--glp-paper) 0%, var(--glp-sage-10) 100%)' }}>
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'var(--glp-sage-deep)', borderTopColor: 'transparent' }} />
          <p className="text-sm" style={{ color: 'var(--glp-sage)' }}>Taking you to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
  <WellnessPageShell
    title="Sign In"
    subtitle="Sign in to your account."
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
        title="Sign In - The Genuine Love Project"
        description="Sign in to your Genuine Love Project account to access your wellness tools."
      />
      <div className="min-h-screen overflow-hidden relative flex items-center justify-center px-6" style={{ background: 'linear-gradient(180deg, var(--glp-paper) 0%, var(--glp-sage-10) 100%)' }}>
        <div className="absolute -top-24 -left-24 w-[500px] h-[500px] rounded-full animate-pulse" style={{ background: 'radial-gradient(circle, var(--glp-sage-30), transparent 70%)' }} aria-hidden="true" />
        <div className="absolute bottom-0 -right-24 w-[450px] h-[450px] rounded-full animate-pulse" style={{ background: 'radial-gradient(circle, var(--glp-rose-20), transparent 70%)', animationDelay: '1s' }} aria-hidden="true" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full" style={{ background: 'radial-gradient(circle, var(--glp-gold-30), transparent 60%)' }} aria-hidden="true" />
        
        <div className="relative z-10 w-full max-w-md animate-fade-in-up">
          <div className="text-center mb-10">
            <Link href="/" className="inline-flex flex-col items-center gap-3 group">
              <img 
                src="/brand/login-logo.png" 
                alt="The Genuine Love Project" 
                className="w-24 h-24 object-contain transition-all group-hover:scale-105"
                data-testid="img-login-logo"
              />
              <span className="text-xl font-bold tracking-tight" style={{ color: 'var(--glp-sage-deep)' }}>The Genuine Love Project</span>
            </Link>
          </div>

          <div className="rounded-3xl p-8 shadow-2xl" style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-20)' }}>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold font-display" style={{ color: 'var(--glp-sage-deep)' }}>
                Welcome Back
              </h1>
              <p className="mt-3" style={{ color: 'var(--glp-sage)' }}>Sign in to access your tools and reflections</p>
            </div>

            <a
              href="/api/login"
              className="w-full btn-premium py-4 hover-glow-gold flex items-center justify-center gap-3 min-h-[56px] text-lg font-semibold rounded-xl"
              data-testid="button-login"
            >
              <span>Sign In Securely</span>
              <ArrowRight className="w-5 h-5" />
            </a>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--glp-sage)' }}>
                <Shield className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--glp-sage-deep)' }} />
                <span>Sign in with Google, GitHub, or email</span>
              </div>
              <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--glp-sage)' }}>
                <Heart className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--glp-sage-deep)' }} />
                <span>Your data stays private and secure</span>
              </div>
              <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--glp-sage)' }}>
                <Sparkles className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--glp-sage-deep)' }} />
                <span>No passwords to remember</span>
              </div>
            </div>

            <div className="mt-8 pt-6 text-center" style={{ borderTop: '1px solid var(--glp-sage-20)' }}>
              <p className="text-sm" style={{ color: 'var(--glp-sage)' }}>
                New here?{" "}
                <Link href="/register" className="font-semibold transition-colors" style={{ color: 'var(--glp-sage-deep)' }}>
                  Create an account
                </Link>
              </p>
            </div>
          </div>

          <p className="text-center text-xs mt-6" style={{ color: 'var(--glp-sage)' }}>
            By signing in, you agree to our{" "}
            <Link href="/terms" className="underline">Terms of Service</Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </>
  </WellnessPageShell>
  );
}
