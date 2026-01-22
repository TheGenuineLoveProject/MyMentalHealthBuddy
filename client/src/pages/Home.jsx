import { Link } from "wouter";
import SEO from "../components/SEO";
import { Shield, Sparkles, Brain, ArrowRight, Star, Leaf, Users, Heart } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen hero-gradient overflow-hidden relative">
      <SEO 
        title="The Genuine Love Project — A Private Space for Reflection" 
        description="A private space to process what you carry—without performance, diagnosis, or someone else's timeline. For people who think deeply."
      />

      <div className="decorative-orb decorative-orb-sage w-[600px] h-[600px] -top-40 -left-40 absolute" aria-hidden="true" />
      <div className="decorative-orb decorative-orb-blush w-[450px] h-[450px] top-32 -right-40 absolute" aria-hidden="true" />
      <div className="decorative-orb decorative-orb-gold w-[300px] h-[300px] bottom-32 left-1/4 absolute" aria-hidden="true" />

      <nav 
        className="relative z-10 mx-auto max-w-6xl py-4 px-6 flex items-center justify-between"
        role="banner"
      >
        <Link href="/" className="flex items-center gap-3 min-w-0">
          <img 
            src="/brand/logo-mark.png" 
            alt="The Genuine Love Project" 
            className="h-12 w-12 object-contain flex-shrink-0"
            data-testid="img-home-logo"
          />
          <span className="text-heading-sm text-teal-dark hidden md:block">
            The Genuine Love Project
          </span>
        </Link>
        <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
          <Link 
            href="/pricing" 
            className="text-sm text-sage font-medium hover:text-teal-dark transition-colors hidden sm:block"
            data-testid="link-pricing-nav"
          >
            Pricing
          </Link>
          <Link 
            href="/login" 
            className="btn-secondary-premium btn-sm whitespace-nowrap"
            data-testid="link-login"
          >
            Sign in
          </Link>
        </div>
      </nav>

      <main className="relative z-10 content-wrapper content-max-lg pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="content-center space-y-6 animate-fade-in-up">
          <span className="badge badge-sage badge-lg animate-bounce-subtle">
            <Leaf className="w-3.5 h-3.5" />
            Trusted by 10,000+ reflective minds
          </span>
          
          <h1 
            className="text-display-lg text-teal-dark text-center max-w-4xl"
            data-testid="text-headline"
          >
            Your sanctuary for emotional healing—
            <span className="text-gradient-brand block mt-2">where growth happens at your own pace, on your own terms.</span>
          </h1>

          <p className="text-lead text-center mx-auto max-w-2xl" data-testid="text-subheadline">
            A trauma-informed space built for people who carry more than they show. 
            Process grief, navigate anxiety, rediscover joy—all without judgment, timelines, or someone watching.
          </p>

          <div className="flex flex-wrap justify-center gap-3 text-body-sm" data-testid="text-not-therapy">
            <span className="bg-sage-soft px-4 py-2 rounded-full flex items-center gap-2">
              <Shield className="w-4 h-4 text-sage" />
              Private by design
            </span>
            <span className="bg-teal-50 dark:bg-teal-900/20 px-4 py-2 rounded-full flex items-center gap-2">
              <Heart className="w-4 h-4 text-teal-600" />
              Evidence-based tools
            </span>
            <span className="bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-full flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-600" />
              AI-guided support 24/7
            </span>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/register"
              className="btn-premium btn-lg animate-glow-pulse"
              data-testid="button-begin"
            >
              <Heart className="w-5 h-5 mr-2" />
              Begin Quietly
            </Link>
            <Link
              href="/pricing"
              className="btn-ghost inline-flex items-center gap-2 group"
              data-testid="link-how-it-works"
            >
              See how it works
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="separator-gradient mt-16 md:mt-20" />

        <div className="grid-features mt-12" data-testid="features-grid">
          <div 
            className="card-elevated group animate-fade-in-scale delay-100" 
            data-testid="card-feature-privacy"
          >
            <div className="icon-container icon-lg icon-gradient-sage mb-4 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-heading-sm text-teal-dark mb-2" data-testid="text-feature-privacy-title">Truly Private Healing</h3>
            <p className="text-body-sm" data-testid="text-feature-privacy-desc">Your deepest thoughts stay yours alone. No social pressure, no metrics to perform for, no one watching your journey but you. End-to-end encryption keeps your reflections safe.</p>
          </div>
          
          <div 
            className="card-elevated group animate-fade-in-scale delay-200" 
            data-testid="card-feature-ai"
          >
            <div className="icon-container icon-lg icon-gradient-teal mb-4 group-hover:scale-110 transition-transform">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-heading-sm text-teal-dark mb-2" data-testid="text-feature-ai-title">Compassionate AI Companion</h3>
            <p className="text-body-sm" data-testid="text-feature-ai-desc">An AI trained in trauma-informed care that listens without judgment. Get gentle prompts, validation, and insights that honor where you are—not where you "should" be.</p>
          </div>
          
          <div 
            className="card-elevated group animate-fade-in-scale delay-300" 
            data-testid="card-feature-tools"
          >
            <div className="icon-container icon-lg icon-gradient-gold mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-heading-sm text-teal-dark mb-2" data-testid="text-feature-tools-title">1000+ Healing Modalities</h3>
            <p className="text-body-sm" data-testid="text-feature-tools-desc">From CBT and DBT to somatic practices and ancient wisdom traditions. Breathing exercises, guided meditations, journaling prompts, emotional regulation tools—all in one place.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 content-center">
          <div className="stat-card text-center">
            <div className="stat-value">50K+</div>
            <div className="stat-label">Healing Journeys Started</div>
          </div>
          <div className="stat-card text-center">
            <div className="stat-value">1000+</div>
            <div className="stat-label">Evidence-Based Tools</div>
          </div>
          <div className="stat-card text-center">
            <div className="stat-value">24/7</div>
            <div className="stat-label">AI Support Available</div>
          </div>
          <div className="stat-card text-center">
            <div className="stat-value">100%</div>
            <div className="stat-label">Private & Encrypted</div>
          </div>
        </div>

        <div className="mt-16 md:mt-20 content-center space-y-8">
          <blockquote className="text-quote max-w-2xl" data-testid="text-philosophy">
            "Healing isn't about becoming someone new—it's about coming home to who you've always been, beneath the wounds and adaptations."
          </blockquote>
          
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h3 className="text-heading-md text-teal-dark">Built for Real Healing</h3>
            <p className="text-body text-secondary">
              We understand that emotional work isn't linear. Some days you'll feel ready to dive deep into trauma processing. 
              Other days, you might just need a breathing exercise to get through the next hour. 
              This platform meets you wherever you are—with compassion, privacy, and tools that actually work.
            </p>
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-sage py-8 bg-sage-soft">
        <div className="content-wrapper flex flex-col md:flex-row items-center justify-between gap-4 text-body-sm">
          <span className="text-teal">© {new Date().getFullYear()} The Genuine Love Project</span>
          <div className="flex gap-6">
            <Link href="/pricing" className="hover:text-sage transition-colors" data-testid="link-pricing">
              Pricing
            </Link>
            <Link href="/blog" className="hover:text-sage transition-colors" data-testid="link-blog">
              Writing
            </Link>
            <Link href="/crisis" className="hover:text-sage transition-colors" data-testid="link-crisis">
              Crisis Resources
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
