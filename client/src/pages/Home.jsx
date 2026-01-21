import { Link } from "wouter";
import SEO from "../components/SEO";
import { Heart, Shield, Sparkles, Brain, ArrowRight, Star, Leaf, Users } from "lucide-react";

const logo = "/brand/logo.png";

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
        className="relative z-10 mx-auto max-w-6xl py-6 pl-[calc(1rem+env(safe-area-inset-left))] pr-[calc(1rem+env(safe-area-inset-right))] flex items-center justify-between"
        role="banner"
      >
        <div className="flex items-center gap-3 min-w-0">
          <img src={logo} alt="" className="h-11 w-auto flex-shrink-0" aria-hidden="true" />
          <span className="text-heading-sm text-teal-dark hidden sm:block truncate">
            The Genuine Love Project
          </span>
        </div>
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
            A private space to process what you carry—
            <span className="text-gradient-brand block mt-2">without performance, diagnosis, or someone else's timeline.</span>
          </h1>

          <p className="text-lead text-center mx-auto" data-testid="text-subheadline">
            For people who think deeply and want tools that respect that.
          </p>

          <div className="flex items-center gap-2 text-body-sm bg-sage-soft px-4 py-2.5 rounded-full" data-testid="text-not-therapy">
            <Shield className="w-4 h-4 text-sage" />
            <span>Not therapy. Not a crisis service. Not performance wellness.</span>
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
            <h3 className="text-heading-sm text-teal-dark mb-2" data-testid="text-feature-privacy-title">Private & Secure</h3>
            <p className="text-body-sm" data-testid="text-feature-privacy-desc">Your inner world stays yours. No social features, no sharing, no performance.</p>
          </div>
          
          <div 
            className="card-elevated group animate-fade-in-scale delay-200" 
            data-testid="card-feature-ai"
          >
            <div className="icon-container icon-lg icon-gradient-teal mb-4 group-hover:scale-110 transition-transform">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-heading-sm text-teal-dark mb-2" data-testid="text-feature-ai-title">AI-Guided Reflection</h3>
            <p className="text-body-sm" data-testid="text-feature-ai-desc">Thoughtful prompts and insights that meet you where you are today.</p>
          </div>
          
          <div 
            className="card-elevated group animate-fade-in-scale delay-300" 
            data-testid="card-feature-tools"
          >
            <div className="icon-container icon-lg icon-gradient-gold mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-heading-sm text-teal-dark mb-2" data-testid="text-feature-tools-title">1000+ Wellness Tools</h3>
            <p className="text-body-sm" data-testid="text-feature-tools-desc">Evidence-based practices from psychology, philosophy, and wisdom traditions.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 content-center">
          <div className="stat-card text-center">
            <div className="stat-value">10K+</div>
            <div className="stat-label">Active Users</div>
          </div>
          <div className="stat-card text-center">
            <div className="stat-value">1000+</div>
            <div className="stat-label">Wellness Tools</div>
          </div>
          <div className="stat-card text-center">
            <div className="stat-value">260+</div>
            <div className="stat-label">API Routes</div>
          </div>
          <div className="stat-card text-center">
            <div className="stat-value">99.9%</div>
            <div className="stat-label">Uptime</div>
          </div>
        </div>

        <div className="mt-16 md:mt-20 content-center">
          <blockquote className="text-quote max-w-2xl" data-testid="text-philosophy">
            "Emotional precision is a skill. This is where you practice."
          </blockquote>
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
