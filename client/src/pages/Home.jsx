import { Link } from "wouter";
import SEO from "../components/SEO";
import { Heart, Shield, Sparkles, Brain, ArrowRight } from "lucide-react";

const logo = "/brand/logo.png";

export default function Home() {
  return (
    <div className="min-h-screen hero-gradient overflow-hidden relative">
      <SEO 
        title="The Genuine Love Project — A Private Space for Reflection" 
        description="A private space to process what you carry—without performance, diagnosis, or someone else's timeline. For people who think deeply."
      />

      <div className="decorative-orb decorative-orb-sage w-[500px] h-[500px] -top-32 -left-32 absolute" aria-hidden="true" />
      <div className="decorative-orb decorative-orb-blush w-[400px] h-[400px] top-40 -right-32 absolute" aria-hidden="true" />
      <div className="decorative-orb decorative-orb-gold w-[250px] h-[250px] bottom-40 left-1/3 absolute" aria-hidden="true" />

      <nav className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <img src={logo} alt="" className="h-10 w-auto opacity-90" aria-hidden="true" />
          <span className="text-sm font-medium text-[#2D3748]">
            The Genuine Love Project
          </span>
        </div>
        <div className="flex items-center gap-6">
          <Link 
            href="/pricing" 
            className="text-sm text-[#4a7a5e] hover:text-[#2D3748] transition-colors hidden sm:block font-medium"
            data-testid="link-pricing-nav"
          >
            Pricing
          </Link>
          <Link 
            href="/login" 
            className="btn-secondary-premium text-sm"
            data-testid="link-login"
          >
            Sign in
          </Link>
        </div>
      </nav>

      <main className="relative z-10 mx-auto max-w-3xl px-6 pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="space-y-8 animate-fade-in-up">
          <h1 
            className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold leading-tight tracking-tight text-[#2D3748]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            data-testid="text-headline"
          >
            A private space to process what you carry—
            <br className="hidden md:block" />
            <span className="text-gradient-brand">without performance, diagnosis, or someone else's timeline.</span>
          </h1>

          <p 
            className="text-base md:text-lg text-[#4A5568] max-w-2xl leading-relaxed"
            data-testid="text-subheadline"
          >
            For people who think deeply and want tools that respect that.
          </p>

          <p 
            className="text-sm text-[#6B7280] max-w-xl flex items-center gap-2"
            data-testid="text-not-therapy"
          >
            <Shield className="w-4 h-4 text-[#7FAF9B]" />
            This is not therapy, not a crisis service, and not a place to perform wellness for an audience.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-start gap-4">
            <Link
              href="/register"
              className="btn-premium text-base px-6 py-3.5 hover-glow-gold"
              data-testid="button-begin"
            >
              <Heart className="w-4 h-4 mr-2" />
              Begin Quietly
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 text-sm text-[#4a7a5e] hover:text-[#2D3748] transition-colors py-3.5 font-medium group"
              data-testid="link-how-it-works"
            >
              See how it works
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="mt-20 md:mt-28 grid grid-cols-1 md:grid-cols-3 gap-6" data-testid="features-grid">
          <div 
            className="card-elevated group animate-fade-in-scale" 
            style={{ animationDelay: '100ms' }}
            data-testid="card-feature-privacy"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5A8A6E] to-[#4a7a5e] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-sm font-semibold text-[#2D3748] mb-2" data-testid="text-feature-privacy-title">Private & Secure</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed" data-testid="text-feature-privacy-desc">Your inner world stays yours. No social features, no sharing, no performance.</p>
          </div>
          
          <div 
            className="card-elevated group animate-fade-in-scale" 
            style={{ animationDelay: '200ms' }}
            data-testid="card-feature-ai"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5A8A6E] to-[#4a7a5e] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-sm font-semibold text-[#2D3748] mb-2" data-testid="text-feature-ai-title">AI-Guided Reflection</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed" data-testid="text-feature-ai-desc">Thoughtful prompts and insights that meet you where you are today.</p>
          </div>
          
          <div 
            className="card-elevated group animate-fade-in-scale" 
            style={{ animationDelay: '300ms' }}
            data-testid="card-feature-tools"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5A8A6E] to-[#4a7a5e] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-sm font-semibold text-[#2D3748] mb-2" data-testid="text-feature-tools-title">1000+ Wellness Tools</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed" data-testid="text-feature-tools-desc">Evidence-based practices from psychology, philosophy, and wisdom traditions.</p>
          </div>
        </div>

        <div className="mt-16 md:mt-20 pt-8 border-t border-[rgba(143,191,159,0.2)]">
          <p 
            className="text-sm text-[#6B7280] italic text-center"
            data-testid="text-philosophy"
          >
            "Emotional precision is a skill. This is where you practice."
          </p>
        </div>
      </main>

      <footer className="relative z-10 border-t border-[rgba(143,191,159,0.15)] py-8">
        <div className="mx-auto max-w-5xl px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#6B7280]">
          <span>© {new Date().getFullYear()} The Genuine Love Project</span>
          <div className="flex gap-6">
            <Link href="/pricing" className="hover:text-[#4a7a5e] transition-colors" data-testid="link-pricing">
              Pricing
            </Link>
            <Link href="/blog" className="hover:text-[#4a7a5e] transition-colors" data-testid="link-blog">
              Writing
            </Link>
            <Link href="/crisis" className="hover:text-[#4a7a5e] transition-colors" data-testid="link-crisis">
              Crisis Resources
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
