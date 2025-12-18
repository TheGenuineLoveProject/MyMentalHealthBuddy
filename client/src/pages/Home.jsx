import { Link } from "wouter";
import { Heart, MessageCircle, BarChart3, Notebook, Shield, Clock, Sparkles, ArrowRight, Star } from "lucide-react";
import SEO from "../components/SEO.jsx";

export default function Home() {
  return (
    <>
      <SEO 
        title="Live in Genuine Love"
        description="An AI-powered mental wellness platform for self-love, healing, and emotional growth — private, compassionate, and available 24/7."
      />
      <div className="min-h-screen bg-gradient-mesh text-[var(--text)] overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-40"
           style={{ background: "radial-gradient(circle, #8FBF9F 0%, transparent 60%)" }} />
        <div className="absolute top-10 -right-24 h-72 w-72 rounded-full blur-3xl opacity-35"
           style={{ background: "radial-gradient(circle, #F4C7C3 0%, transparent 60%)" }} />
        <div className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full blur-3xl opacity-30"
           style={{ background: "radial-gradient(circle, #2F5D5D 0%, transparent 60%)" }} />
        {/* Navigation */}
        <header className="relative z-50 py-6 px-6 flex items-center justify-between max-w-6xl mx-auto" role="banner">
          <Link href="/" className="flex items-center gap-3 group" aria-label="The Genuine Love Project home" data-testid="link-brand-home">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8FBF9F] to-[#2F5D5D] flex items-center justify-center shadow-xl shadow-[#2F5D5D]/25 group-hover:scale-110 group-hover:shadow-[#2F5D5D]/40 transition-all duration-300">
              <Heart className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#2F5D5D] dark:text-[#8FBF9F]" data-testid="text-brand-name">The Genuine Love Project</span>
          </Link>
          <nav className="flex items-center gap-3" aria-label="Main navigation">
            <Link 
              href="/login" 
              className="nav-link hidden sm:block"
              data-testid="link-login"
            >
              Sign In
            </Link>
            <Link 
              href="/register" 
              className="btn btn-primary"
              data-testid="link-register"
            >
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              Get Started
            </Link>
          </nav>
        </header>

        <main className="relative z-10 px-6" role="main">
          {/* Hero Section */}
          <section className="hero max-w-5xl mx-auto" aria-labelledby="hero-title">
            <div className="hero-content py-20 md:py-32">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur-sm border border-[#8FBF9F]/50 dark:border-[#8FBF9F]/20 text-[#2F5D5D] dark:text-[#8FBF9F] text-sm font-medium mb-10 animate-fade-in-up shadow-lg shadow-[#8FBF9F]/10">
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                <span>AI-Powered Mental Wellness Platform</span>
              </div>
              
              <h1 id="hero-title" className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] text-center" data-testid="text-hero-title">
                Your Safe Space for{" "}
                <span className="text-[#2F5D5D] dark:text-[#8FBF9F]">Mental Wellness</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed">
                Track your mood, journal your thoughts, and connect with an AI companion that truly listens — available 24/7, completely private.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link 
                  href="/register" 
                  className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#2F5D5D] to-[#8FBF9F] text-white text-lg font-semibold rounded-2xl shadow-xl shadow-[#2F5D5D]/30 hover:shadow-[#2F5D5D]/50 hover:scale-105 transition-all duration-300"
                  data-testid="link-get-started"
                >
                  <span>Start Your Journey</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </Link>
                <Link 
                  href="/login" 
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/80 dark:bg-white/10 backdrop-blur-sm border-2 border-gray-200 dark:border-white/20 text-gray-700 dark:text-white text-lg font-semibold rounded-2xl hover:bg-gray-50 dark:hover:bg-white/20 hover:border-[#8FBF9F] transition-all duration-300"
                  data-testid="link-signin"
                >
                  Sign In
                </Link>
              </div>
              
              {/* Social Proof */}
              <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-[var(--text-secondary)]">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[...Array(4)].map((_, i) => (
                      <div 
                        key={i} 
                        className="w-8 h-8 rounded-full border-2 border-[var(--bg)] bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)]"
                        style={{ opacity: 1 - i * 0.15 }}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">Join 10,000+ users</span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[var(--mood-happy)] text-[var(--mood-happy)]" aria-hidden="true" />
                  ))}
                  <span className="text-sm font-medium ml-1">4.9/5 rating</span>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="max-w-6xl mx-auto py-20" aria-labelledby="features-title">
            <div className="section-header">
              <h2 id="features-title" className="section-title">
                Features designed for your wellbeing
              </h2>
              <p className="section-subtitle">
                Everything you need to understand, track, and improve your mental health in one beautiful app.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6" role="list">
              <article className="feature-card" data-testid="feature-mood" role="listitem">
                <div className="feature-icon bg-[var(--accent-sky-soft)]">
                  <BarChart3 className="w-7 h-7 text-[var(--accent-sky)]" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Mood Tracking</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  Track your emotional patterns over time with intuitive mood logging and insightful analytics that help you understand yourself better.
                </p>
              </article>

              <article className="feature-card" data-testid="feature-journal" role="listitem">
                <div className="feature-icon bg-[var(--primary-soft)]">
                  <Notebook className="w-7 h-7 text-[var(--primary)]" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Personal Journal</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  Write freely and reflect on your thoughts in a private, secure journal space. Your stories are encrypted and only yours.
                </p>
              </article>

              <article className="feature-card" data-testid="feature-chat" role="listitem">
                <div className="feature-icon bg-[var(--accent-teal-soft)]">
                  <MessageCircle className="w-7 h-7 text-[var(--accent-teal)]" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold mb-3">AI Companion</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  Chat with a compassionate AI companion that listens without judgment and offers supportive, thoughtful responses 24/7.
                </p>
              </article>
            </div>
          </section>
          {/* Benefits Section */}
          <section className="max-w-5xl mx-auto py-20" aria-labelledby="benefits-title">
            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-[#8FBF9F]/20 shadow-xl">
              <h2 id="benefits-title" className="text-2xl font-bold text-center mb-10 text-[#2F5D5D]">Why choose The Genuine Love Project?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8" role="list">
                <div className="flex flex-col items-center text-center" data-testid="benefit-privacy" role="listitem">
                  <div className="w-16 h-16 rounded-2xl bg-[#8FBF9F]/20 flex items-center justify-center mb-4">
                    <Shield className="w-8 h-8 text-[#2F5D5D]" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">100% Private</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Your data is encrypted and stays confidential. We never share or sell your information.</p>
                </div>
                <div className="flex flex-col items-center text-center" data-testid="benefit-available" role="listitem">
                  <div className="w-16 h-16 rounded-2xl bg-[#F4C7C3]/30 flex items-center justify-center mb-4">
                    <Clock className="w-8 h-8 text-[#2F5D5D]" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">24/7 Available</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Access support whenever you need it, day or night. We're always here for you.</p>
                </div>
                <div className="flex flex-col items-center text-center" data-testid="benefit-care" role="listitem">
                  <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/20 flex items-center justify-center mb-4">
                    <Heart className="w-8 h-8 text-[#D4AF37]" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Built with Care</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Designed by mental health advocates using evidence-based approaches.</p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="max-w-4xl mx-auto py-20 text-center" aria-labelledby="cta-title">
            <div className="bg-gradient-to-r from-[#2F5D5D] via-[#8FBF9F] to-[#D4AF37] text-white rounded-3xl p-10">
              <h2 id="cta-title" className="text-3xl md:text-4xl font-bold mb-4">
                Ready to start your wellness journey?
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
                Join thousands of others who are taking control of their mental health. It only takes a minute to get started.
              </p>
              <Link 
                href="/register" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[var(--primary-dark)] rounded-xl font-semibold text-lg hover:bg-white/90 transition shadow-lg"
                data-testid="link-cta-register"
              >
                Create Free Account
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Link>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="py-10 px-6 border-t border-[var(--border)]" role="contentinfo">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[var(--text-secondary)]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8FBF9F] to-[#2F5D5D] flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" aria-hidden="true" />
              </div>
              <span>&copy; {new Date().getFullYear()} The Genuine Love Project</span>
            </div>
            <p>
              <a 
                href="mailto:support@thegenuineloveproject.com" 
                className="hover:text-[var(--primary)] transition"
                aria-label="Email support"
              >
                support@thegenuineloveproject.com
              </a>
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
