import { Link } from "wouter";
import { ArrowRight, Shield, Heart, Sparkles, Check, Leaf, Brain, Sun, Star } from "lucide-react";
import SEO from "../components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function Register() {
  const benefits = [
    "24/7 AI wellness companion",
    "Private mood tracking & analytics",
    "Secure personal journaling",
    "Crisis resources when you need them"
  ];

  return (
  <WellnessPageShell
    title="Get Started"
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
        title="Create Account - The Genuine Love Project"
        description="Create your free account. Mood tracking, journaling, reflection prompts, and AI chat — no credit card required."
      />
      <div className="min-h-screen overflow-hidden relative flex items-center justify-center p-6" style={{ background: 'linear-gradient(180deg, var(--glp-paper) 0%, var(--glp-sage-10) 50%, var(--glp-teal-50) 100%)' }}>
        <div className="decorative-orb sage animate-drift w-[500px] h-[500px] -top-24 -right-24" style={{ animationDelay: '0s' }} aria-hidden="true" />
        <div className="decorative-orb rose animate-drift w-[400px] h-[400px] -bottom-32 -left-32" style={{ animationDelay: '5s' }} aria-hidden="true" />
        <div className="decorative-orb teal animate-drift w-[300px] h-[300px] top-1/3 left-10" style={{ animationDelay: '10s' }} aria-hidden="true" />
        
        <div className="floating-icon-container top-16 left-[8%] w-12 h-12 rounded-xl animate-float opacity-60" style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-teal-400))', boxShadow: '0 8px 24px var(--glp-sage-30)', animationDelay: '0s' }} aria-hidden="true">
          <Leaf className="w-6 h-6 text-white" />
        </div>
        <div className="floating-icon-container top-24 right-[10%] w-10 h-10 rounded-lg animate-float opacity-50" style={{ background: 'linear-gradient(135deg, var(--glp-rose), var(--glp-blush))', boxShadow: '0 6px 20px var(--glp-rose-20)', animationDelay: '1.2s' }} aria-hidden="true">
          <Heart className="w-5 h-5 text-white" />
        </div>
        <div className="floating-icon-container bottom-32 left-[6%] w-11 h-11 rounded-xl animate-float opacity-45" style={{ background: 'linear-gradient(135deg, var(--glp-teal-400), var(--glp-sage-deep))', boxShadow: '0 6px 20px var(--glp-sage-30)', animationDelay: '2.4s' }} aria-hidden="true">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div className="floating-icon-container top-1/3 right-[6%] w-9 h-9 rounded-lg animate-float opacity-55" style={{ background: 'linear-gradient(135deg, var(--glp-gold), var(--glp-gold-dim))', boxShadow: '0 6px 20px var(--glp-gold-30)', animationDelay: '3.6s' }} aria-hidden="true">
          <Sun className="w-4 h-4 text-white" />
        </div>
        <div className="floating-icon-container bottom-40 right-[12%] w-10 h-10 rounded-xl animate-float opacity-50" style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))', boxShadow: '0 8px 24px var(--glp-sage-30)', animationDelay: '0.8s' }} aria-hidden="true">
          <Star className="w-5 h-5 text-white" />
        </div>
        <div className="floating-icon-container top-12 left-1/4 w-8 h-8 rounded-lg animate-float opacity-35" style={{ background: 'linear-gradient(135deg, var(--glp-blush), var(--glp-rose))', boxShadow: '0 6px 20px var(--glp-rose-20)', animationDelay: '4s' }} aria-hidden="true">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        
        <div className="relative z-10 w-full max-w-md animate-fade-in-up">
          <div className="text-center mb-10">
            <Link href="/" className="inline-flex items-center gap-4 group">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all group-hover:scale-105 group-hover:shadow-lg" style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))', boxShadow: '0 4px 16px var(--glp-sage-30)' }}>
                <img 
                  src="/brand/logo-mark.png" 
                  alt="The Genuine Love Project" 
                  className="w-10 h-10 object-contain"
                  data-testid="img-register-logo"
                />
              </div>
              <span className="text-2xl font-bold tracking-tight" style={{ color: 'var(--glp-sage-deep)' }}>The Genuine Love Project</span>
            </Link>
          </div>

          <div 
            className="rounded-3xl p-8 shadow-2xl"
            style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-20)' }}
            data-testid="form-register"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold font-display mb-3" style={{ color: 'var(--glp-sage-deep)' }} data-testid="text-register-title">
                Create Your Account
              </h1>
              <p style={{ color: 'var(--glp-sage)' }}>Free to start. No credit card required.</p>
            </div>

            <div className="mb-6 p-4 rounded-xl" style={{ background: 'var(--glp-sage-10)', border: '1px solid var(--glp-sage-20)' }}>
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
                Already have an account?{" "}
                <a href="/api/login" className="font-semibold transition-colors" style={{ color: 'var(--glp-sage-deep)' }}
                  data-testid="link-login"
                >
                  Sign in
                </a>
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
  </WellnessPageShell>
  );
}
