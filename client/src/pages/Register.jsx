import { Link } from "wouter";
import { ArrowRight, Shield, Heart, Sparkles, Check, Leaf, Brain, Sun, Star } from "lucide-react";
import SEO from "../components/SEO";

export default function Register() {
  const benefits = [
    "24/7 AI wellness companion",
    "Private mood tracking & analytics",
    "Secure personal journaling",
    "Crisis resources when you need them"
  ];

  return (
    <>
      <SEO 
        title="Create Account - MyMentalHealthBuddy"
        description="Create your free account. Mood tracking, journaling, reflection prompts, and AI chat — no credit card required."
      />
      <div className="min-h-screen overflow-hidden relative flex items-center justify-center px-6 py-8" style={{ background: 'linear-gradient(180deg, var(--glp-paper) 0%, var(--glp-sage-10) 100%)' }}>
        <div className="absolute -top-24 -left-24 w-[500px] h-[500px] rounded-full animate-pulse" style={{ background: 'radial-gradient(circle, var(--glp-sage-30), transparent 70%)' }} aria-hidden="true" />
        <div className="absolute bottom-0 -right-24 w-[450px] h-[450px] rounded-full animate-pulse" style={{ background: 'radial-gradient(circle, var(--glp-rose-20), transparent 70%)', animationDelay: '1s' }} aria-hidden="true" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full" style={{ background: 'radial-gradient(circle, var(--glp-gold-30), transparent 60%)' }} aria-hidden="true" />
        
        <div className="relative z-10 w-full max-w-md animate-fade-in-up">
          <div className="text-center mb-5">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <img 
                src="/brand/mmhb-icon.svg" 
                alt="MyMentalHealthBuddy" 
                className="w-14 h-14 rounded-xl object-contain transition-all group-hover:scale-105"
                style={{ boxShadow: '0 3px 16px var(--glp-sage-deep-20)' }}
                data-testid="img-register-logo"
              />
              <span className="text-lg font-bold tracking-tight" style={{ color: 'var(--glp-sage-deep)' }}>MyMentalHealthBuddy</span>
            </Link>
          </div>

          <div 
            className="rounded-3xl p-6 shadow-2xl"
            style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-20)' }}
            data-testid="form-register"
          >
            <div className="text-center mb-4">
              <h1 className="text-2xl font-bold font-display mb-1" style={{ color: 'var(--glp-sage-deep)' }} data-testid="text-register-title">
                Create Your Account
              </h1>
              <p className="text-sm" style={{ color: 'var(--glp-sage)' }}>Free to start. No credit card required.</p>
            </div>

            <div className="mb-4 p-3 rounded-xl" style={{ background: 'var(--glp-sage-10)', border: '1px solid var(--glp-sage-20)' }}>
              <ul className="space-y-2">
                {benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm" style={{ color: 'var(--glp-sage-deep)' }}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--glp-sage-20)' }}>
                      <Check className="w-3 h-3" style={{ color: 'var(--glp-sage-deep)' }} aria-hidden="true" />
                    </div>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <a
              href="/api/login"
              className="w-full btn-premium py-4 hover-glow-gold flex items-center justify-center gap-3 min-h-[56px] text-lg font-semibold rounded-xl"
              data-testid="button-register"
            >
              <Sparkles className="w-5 h-5" aria-hidden="true" />
              <span>Get Started Securely</span>
              <ArrowRight className="w-5 h-5" />
            </a>

            <div className="mt-4 space-y-2">
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

            <div className="mt-4 pt-4 text-center" style={{ borderTop: '1px solid var(--glp-sage-20)' }}>
              <p className="text-sm" style={{ color: 'var(--glp-sage)' }}>
                Already have an account?{" "}
                <Link href="/login" className="font-semibold transition-colors" style={{ color: 'var(--glp-sage-deep)' }}
                  data-testid="link-login"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
          
          <p className="text-center text-xs mt-6" style={{ color: 'var(--glp-sage)' }}>
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="underline">Terms of Service</Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </>
  );
}
