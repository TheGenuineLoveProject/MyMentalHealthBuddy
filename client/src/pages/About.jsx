import { Link } from "wouter";
import { ArrowLeft, Heart, Shield, Sparkles, Users, Flower2 } from "lucide-react";
import EmotionBackground from "@/components/sacred/EmotionBackground";
import GlowFooter from "@/components/GlowFooter";
import ValueProposition from "@/sections/ValueProposition.jsx";
import NextStepCTA from "@/sections/NextStepCTA.jsx";
import SEO from "@/components/SEO";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--glp-paper, #F7F4EE)' }}>
      <SEO
        title="About — MyMentalHealthBuddy by The Genuine Love Project"
        description="MyMentalHealthBuddy by The Genuine Love Project. Free emotional wellness tools. Evidence-informed. Always private."
      />
      <EmotionBackground emotion="calm" intensity={0.1} />
      
      <main className="flex-1 relative z-10">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group" data-testid="link-back-home">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>

          <div className="text-center mb-12" data-testid="about-header">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 shadow-md" style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))' }} aria-hidden="true">
              <Flower2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4" style={{ color: 'var(--glp-sage-deep)' }} data-testid="text-about-title">
              About MyMentalHealthBuddy
            </h1>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--glp-sage)' }} data-testid="text-about-subtitle">
              A private space for reflection, built around what wellness apps usually get wrong.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 md:p-12 mb-12" style={{ border: '1px solid var(--glp-sage-20)', boxShadow: '0 12px 32px -10px rgba(0,0,0,0.08)' }} data-testid="card-mission">
            <h2 className="text-2xl font-serif font-semibold mb-6 flex items-center gap-3" style={{ color: 'var(--glp-sage-deep)' }} data-testid="text-mission-title">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full" style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))' }} aria-hidden="true">
                <Heart className="w-5 h-5 text-white" />
              </span>
              Our Mission
            </h2>
            <p className="leading-relaxed mb-6" style={{ color: 'var(--glp-sage-deep)', opacity: 0.85 }}>
              This platform exists because most wellness tools are designed to maximize how long you stay, not whether you're actually helped. We built something different — tools that are useful when you need them and quiet when you don't. No streaks, no guilt-driven notifications, no engagement tricks.
            </p>
            <p className="leading-relaxed" style={{ color: 'var(--glp-sage-deep)', opacity: 0.85 }}>
              If you're someone who values privacy, prefers going at your own pace, and wants tools that don't demand constant participation — you'll probably recognize what this is for. You don't need to be in crisis to use it. You don't need to commit to a program. It's here when you want to check in with yourself, and it stays out of the way when you don't.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12" data-testid="about-features-grid">
            <div className="bg-white rounded-2xl p-6 text-center" style={{ border: '1px solid var(--glp-sage-20)', boxShadow: '0 8px 24px -8px rgba(0,0,0,0.06)' }} data-testid="card-feature-safe">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4 shadow-md" style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))' }} aria-hidden="true">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-serif font-semibold mb-2" style={{ color: 'var(--glp-sage-deep)' }}>Safe & Private</h3>
              <p className="text-sm" style={{ color: 'var(--glp-sage-deep)', opacity: 0.78 }}>
                Your reflections are private. We prioritize your privacy and create a judgment-free space for exploration.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 text-center" style={{ border: '1px solid var(--glp-sage-20)', boxShadow: '0 8px 24px -8px rgba(0,0,0,0.06)' }} data-testid="card-feature-ai">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4 shadow-md" style={{ background: 'linear-gradient(135deg, var(--glp-gold), var(--glp-gold-dark))' }} aria-hidden="true">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-serif font-semibold mb-2" style={{ color: 'var(--glp-sage-deep)' }}>AI-Powered Guidance</h3>
              <p className="text-sm" style={{ color: 'var(--glp-sage-deep)', opacity: 0.78 }}>
                Compassionate AI companions available 24/7, trained in trauma-informed care and supportive communication.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 text-center" style={{ border: '1px solid var(--glp-sage-20)', boxShadow: '0 8px 24px -8px rgba(0,0,0,0.06)' }} data-testid="card-feature-community">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4 shadow-md" style={{ background: 'linear-gradient(135deg, #FF9A8B, #E8913A)' }} aria-hidden="true">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-serif font-semibold mb-2" style={{ color: 'var(--glp-sage-deep)' }}>Community Care</h3>
              <p className="text-sm" style={{ color: 'var(--glp-sage-deep)', opacity: 0.78 }}>
                Connect with others on similar paths through shared reflections and supportive community features.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 md:p-12 text-center" style={{ border: '1px solid var(--glp-sage-20)', boxShadow: '0 12px 32px -10px rgba(0,0,0,0.08)', borderTop: '4px solid var(--glp-sage)' }} data-testid="card-quote">
            <blockquote className="text-2xl md:text-3xl font-serif italic mb-4" style={{ color: 'var(--glp-sage-deep)' }} data-testid="text-quote-main">
              "The quietest tools are often the most useful ones."
            </blockquote>
            <p style={{ color: 'var(--glp-sage)' }} data-testid="text-quote-attribution">
              — MyMentalHealthBuddy by The Genuine Love Project
            </p>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm mb-4" style={{ color: 'var(--glp-sage-deep)', opacity: 0.78 }}>
              <strong>Important:</strong> MyMentalHealthBuddy by The Genuine Love Project is an educational wellness platform and is not a substitute for professional mental health treatment. If you're in crisis, please reach out to a qualified professional or call your local emergency services.
            </p>
            <Link
              href="/crisis"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-white font-semibold text-sm transition-all hover:scale-[1.02] hover:shadow-lg"
              style={{ background: 'linear-gradient(135deg, var(--glp-sage-deep), var(--glp-sage))', boxShadow: '0 8px 20px rgba(95, 138, 110, 0.28)' }}
              data-testid="link-crisis-resources"
            >
              Access Crisis Resources →
            </Link>
          </div>
        </div>

        <ValueProposition variant="compact" />
        <NextStepCTA context="about" />
      </main>

      <GlowFooter />
    </div>
  );
}
