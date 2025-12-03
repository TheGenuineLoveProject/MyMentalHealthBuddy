import { Link } from "wouter";
import { Heart, MessageCircle, BarChart3, Notebook, Shield, Clock, Sparkles, ArrowRight, Star } from "lucide-react";
import SEO from "../components/SEO.jsx";

export default function Home() {
  return (
    <>
      <SEO 
        title="AI-Powered Mental Health Support"
        description="24/7 AI-powered mental health support with mood tracking, journaling, and therapeutic chat. Your compassionate companion for emotional wellness."
      />
      <div className="min-h-screen bg-gradient-mesh text-[var(--text)]">
        {/* Navigation */}
        <header className="py-6 px-6 flex items-center justify-between max-w-6xl mx-auto" role="banner">
          <Link href="/" className="flex items-center gap-3 group" aria-label="MyMentalHealthBuddy home" data-testid="link-brand-home">
            <div className="w-10 h-10 rounded-xl bg-[var(--gradient-focus)] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Heart className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <span className="text-xl font-bold tracking-tight" data-testid="text-brand-name">MyMentalHealthBuddy</span>
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

        <main className="px-6" role="main">
          {/* Hero Section */}
          <section className="hero max-w-5xl mx-auto" aria-labelledby="hero-title">
            <div className="hero-content py-16 md:py-24">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] text-sm font-medium mb-8 animate-fade-in-up">
                <Star className="w-4 h-4" aria-hidden="true" />
                <span>Trusted by thousands for mental wellness</span>
              </div>
              
              <h1 id="hero-title" className="hero-title" data-testid="text-hero-title">
                Your Daily Companion for{" "}
                <span className="hero-gradient-text">Mental Wellness</span>
              </h1>
              
              <p className="hero-subtitle">
                Track your mood, journal your thoughts, and chat with an AI companion designed to support your mental health journey — available 24/7, completely private.
              </p>
              
              <div className="hero-cta">
                <Link 
                  href="/register" 
                  className="btn btn-gradient text-lg px-8 py-4"
                  data-testid="link-get-started"
                >
                  Start Your Journey
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </Link>
                <Link 
                  href="/login" 
                  className="btn btn-secondary text-lg px-8 py-4"
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
            <div className="bg-[var(--card)] rounded-[var(--radius-2xl)] p-8 md:p-12 border border-[var(--border)] shadow-[var(--shadow-lg)]">
              <h2 id="benefits-title" className="text-2xl font-bold text-center mb-10">Why choose MyMentalHealthBuddy?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8" role="list">
                <div className="flex flex-col items-center text-center" data-testid="benefit-privacy" role="listitem">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--accent-sky-soft)] flex items-center justify-center mb-4">
                    <Shield className="w-8 h-8 text-[var(--accent-sky)]" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">100% Private</h3>
                  <p className="text-sm text-[var(--text-secondary)]">Your data is encrypted and stays confidential. We never share or sell your information.</p>
                </div>
                <div className="flex flex-col items-center text-center" data-testid="benefit-available" role="listitem">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--accent-teal-soft)] flex items-center justify-center mb-4">
                    <Clock className="w-8 h-8 text-[var(--accent-teal)]" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">24/7 Available</h3>
                  <p className="text-sm text-[var(--text-secondary)]">Access support whenever you need it, day or night. We're always here for you.</p>
                </div>
                <div className="flex flex-col items-center text-center" data-testid="benefit-care" role="listitem">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--accent-rose-soft)] flex items-center justify-center mb-4">
                    <Heart className="w-8 h-8 text-[var(--accent-rose)]" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Built with Care</h3>
                  <p className="text-sm text-[var(--text-secondary)]">Designed by mental health advocates using evidence-based approaches.</p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="max-w-4xl mx-auto py-20 text-center" aria-labelledby="cta-title">
            <div className="bg-[var(--gradient-focus)] rounded-[var(--radius-2xl)] p-10 md:p-16 text-white shadow-[var(--shadow-glow)]">
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
              <div className="w-8 h-8 rounded-lg bg-[var(--gradient-focus)] flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" aria-hidden="true" />
              </div>
              <span>&copy; {new Date().getFullYear()} MyMentalHealthBuddy</span>
            </div>
            <p>
              <a 
                href="mailto:support@mymentalhealthbuddy.com" 
                className="hover:text-[var(--primary)] transition"
                aria-label="Email support"
              >
                support@mymentalhealthbuddy.com
              </a>
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
