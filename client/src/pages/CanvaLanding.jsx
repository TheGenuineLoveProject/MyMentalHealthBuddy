import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Heart, Lightbulb, Users, Zap, Smile, BarChart3, BookOpen, Shield, Star, ChevronDown, Menu, X, ArrowRight, ArrowUp, Lock, Clock, Sparkles, PenLine, MessageCircle, TrendingUp } from "lucide-react";
import "../styles/canva-landing.css";
import QuoteBlock from "../components/ui/QuoteBlock.jsx";

export default function CanvaLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const steps = [
    {
      icon: PenLine,
      title: "Create Your Profile",
      description: "Tell us about your journey and what matters most to you"
    },
    {
      icon: MessageCircle,
      title: "Connect with AI",
      description: "Start conversations with our compassionate AI companion"
    },
    {
      icon: TrendingUp,
      title: "Track Your Growth",
      description: "Watch your progress unfold with personalized insights"
    }
  ];

  const testimonials = [
    {
      initial: "S",
      name: "Sarah M.",
      text: "This platform helped me reconnect with myself after years of burnout. The AI companion feels like talking to a wise friend.",
      role: "Teacher"
    },
    {
      initial: "J",
      name: "James K.",
      text: "The mood tracking and journaling features have become essential to my daily routine. I feel more grounded than ever.",
      role: "Software Engineer"
    },
    {
      initial: "M",
      name: "Maria L.",
      text: "Finally, a wellness app that doesn't feel clinical. It's warm, supportive, and genuinely helpful.",
      role: "Healthcare Worker"
    }
  ];

  const features = [
    {
      icon: Smile,
      title: "Mindful Practices",
      description: "Daily meditations, breathing exercises, and guided visualizations for inner peace"
    },
    {
      icon: BarChart3,
      title: "Personal Growth",
      description: "Track your transformation journey with intelligent progress insights and milestones"
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Connect with like-minded souls in a safe, nurturing environment"
    },
    {
      icon: BookOpen,
      title: "Wisdom Library",
      description: "Access ancient wisdom and modern psychology insights curated for your journey"
    },
    {
      icon: Shield,
      title: "Safe Space",
      description: "Your sanctuary for vulnerability, growth, and authentic self-expression"
    },
    {
      icon: Zap,
      title: "AI Companion",
      description: "24/7 compassionate guidance powered by trauma-informed AI technology"
    }
  ];

  const faqs = [
    {
      question: "What is The Genuine Love Project?",
      answer: "The Genuine Love Project is a comprehensive mental wellness platform designed to support your healing journey through AI-powered guidance, journaling, mood tracking, and evidence-based wellness tools."
    },
    {
      question: "Is my data private and secure?",
      answer: "Absolutely. We use enterprise-grade encryption and never share your personal data. Your healing journey is completely private and protected."
    },
    {
      question: "How does the AI companion work?",
      answer: "Our AI companion uses trauma-informed principles to provide compassionate, personalized support 24/7. It's designed to listen, reflect, and guide—never to diagnose or replace professional care."
    },
    {
      question: "Is there a free version?",
      answer: "Yes! We offer a generous free tier with core features. Premium plans unlock advanced tools, unlimited AI conversations, and exclusive content."
    }
  ];

  return (
    <div className="canva-landing min-h-screen">
      {/* Mobile Overlay */}
      <div 
        className={`mobile-overlay ${mobileMenuOpen ? 'active' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Menu */}
      <nav className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
        <button 
          onClick={() => setMobileMenuOpen(false)}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center"
          style={{ color: 'var(--glp-ink)' }}
          data-testid="button-close-mobile-menu"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="space-y-6">
          <a href="#home" className="block text-2xl font-serif font-semibold" style={{ color: 'var(--glp-sage-deep)' }}>Home</a>
          <a href="#about" className="block text-2xl font-serif font-semibold" style={{ color: 'var(--glp-sage-deep)' }}>About</a>
          <a href="#features" className="block text-2xl font-serif font-semibold" style={{ color: 'var(--glp-sage-deep)' }}>Features</a>
          <a href="#faq" className="block text-2xl font-serif font-semibold" style={{ color: 'var(--glp-sage-deep)' }}>FAQ</a>
          <div className="pt-6 mt-6 border-t" style={{ borderColor: 'var(--glp-sage-30)' }}>
            <Link href="/login">
              <button className="btn-primary w-full mb-3" data-testid="button-mobile-signin">Sign In</button>
            </Link>
            <Link href="/register">
              <button className="btn-secondary w-full" data-testid="button-mobile-getstarted">Get Started</button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header / Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b" style={{ background: 'var(--glp-paper-98)', borderColor: 'var(--glp-sage-15)', boxShadow: '0 2px 8px var(--glp-sage-deep-12)' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-[80px] sm:h-[92px] lg:h-[108px]">
            {/* Logo - Compact on mobile, expanded on desktop */}
            <Link href="/">
              <div className="flex items-center gap-4 sm:gap-5 lg:gap-6 cursor-pointer group shrink-0" data-testid="link-logo">
                <div className="relative w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] lg:w-[64px] lg:h-[64px] flex items-center justify-center transition-all duration-300 group-hover:scale-105">
                  <img 
                    src="/brand/logo-monogram.png" 
                    alt="The Genuine Love Project" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex flex-col leading-snug">
                  <span className="text-sm sm:text-lg lg:text-xl xl:text-2xl font-bold tracking-tight" style={{ color: 'var(--glp-sage-deep)' }}>
                    The Genuine Love Project
                  </span>
                  <span className="text-[10px] sm:text-xs lg:text-[13px] font-semibold tracking-[0.12em] sm:tracking-[0.18em] uppercase mt-0.5" style={{ color: 'var(--glp-sage)' }}>
                    Live in Genuine Love
                  </span>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation - Centered */}
            <nav className="hidden lg:flex items-center gap-4 xl:gap-5 absolute left-1/2 transform -translate-x-1/2">
              <a href="#home" className="px-6 xl:px-7 py-3 text-[15px] xl:text-base font-semibold rounded-xl transition-all duration-200 hover:bg-[var(--glp-sage-10)]" style={{ color: 'var(--glp-sage-deep)' }}>Home</a>
              <a href="#about" className="px-6 xl:px-7 py-3 text-[15px] xl:text-base font-semibold rounded-xl transition-all duration-200 hover:bg-[var(--glp-sage-10)]" style={{ color: 'var(--glp-sage-deep)' }}>About</a>
              <a href="#features" className="px-6 xl:px-7 py-3 text-[15px] xl:text-base font-semibold rounded-xl transition-all duration-200 hover:bg-[var(--glp-sage-10)]" style={{ color: 'var(--glp-sage-deep)' }}>Features</a>
              <a href="#faq" className="px-6 xl:px-7 py-3 text-[15px] xl:text-base font-semibold rounded-xl transition-all duration-200 hover:bg-[var(--glp-sage-10)]" style={{ color: 'var(--glp-sage-deep)' }}>FAQ</a>
              <a href="/pricing" className="px-6 xl:px-7 py-3 text-[15px] xl:text-base font-semibold rounded-xl transition-all duration-200 hover:bg-[var(--glp-sage-10)]" style={{ color: 'var(--glp-sage-deep)' }}>Pricing</a>
            </nav>

            {/* CTA Buttons - Right aligned */}
            <div className="flex items-center gap-5 sm:gap-6 shrink-0">
              <Link href="/login">
                <button 
                  className="hidden md:inline-flex font-semibold text-[15px] lg:text-base px-6 lg:px-7 py-3 lg:py-3.5 rounded-full transition-all border-2 hover:bg-[var(--glp-sage-deep)] hover:text-white hover:shadow-md"
                  style={{ color: 'var(--glp-sage-deep)', borderColor: 'var(--glp-sage-deep)' }}
                  data-testid="button-signin"
                >
                  Sign In
                </button>
              </Link>
              <Link href="/register">
                <button 
                  className="inline-flex items-center gap-2.5 font-semibold text-[15px] lg:text-base px-6 lg:px-7 py-3 lg:py-3.5 rounded-full transition-all hover:opacity-90 hover:shadow-lg text-white"
                  style={{ background: 'linear-gradient(135deg, var(--glp-gold), var(--glp-gold-dark))', boxShadow: '0 4px 14px var(--glp-gold-30)' }}
                  data-testid="button-getstarted"
                >
                  <Sparkles className="w-[18px] h-[18px] lg:w-5 lg:h-5" />
                  <span className="hidden sm:inline">Get Started</span>
                  <span className="sm:hidden">Start</span>
                </button>
              </Link>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2.5 rounded-xl transition-colors hover:bg-[var(--glp-sage-10)]"
                style={{ color: 'var(--glp-sage-deep)' }}
                data-testid="button-open-mobile-menu"
              >
                <Menu className="w-6 h-6 sm:w-7 sm:h-7" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative py-20 md:py-28 lg:py-36 px-6 sm:px-8 overflow-hidden" style={{ background: 'linear-gradient(180deg, var(--glp-paper) 0%, var(--glp-teal-50) 100%)' }}>
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full animate-pulse"
            style={{ background: 'radial-gradient(circle, var(--glp-sage-30), transparent 70%)' }}
          />
          <div 
            className="absolute -bottom-48 -left-48 w-[600px] h-[600px] rounded-full animate-pulse"
            style={{ background: 'radial-gradient(circle, var(--glp-rose-20), transparent 70%)', animationDelay: '1s' }}
          />
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full"
            style={{ background: 'radial-gradient(circle, var(--glp-gold-30), transparent 60%)' }}
          />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center">
            {/* Badge */}
            <div 
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full mb-10 shadow-lg animate-fade-in-up"
              style={{
                background: 'var(--glp-paper)',
                border: '2px solid var(--glp-sage-30)',
                boxShadow: '0 8px 32px var(--glp-sage-20)'
              }}
            >
              <Star className="w-5 h-5" style={{ color: 'var(--glp-gold)' }} fill="currentColor" />
              <span className="font-bold uppercase tracking-widest text-sm" style={{ color: 'var(--glp-sage-deep)' }}>
                Transformative Healing Platform
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold mb-8 leading-[1.05] tracking-tight animate-fade-in-up" style={{ color: 'var(--glp-sage-deep)', animationDelay: '0.1s' }}>
              Heal Your Mind,
              <br />
              <span style={{ background: 'linear-gradient(135deg, var(--glp-sage-deep), var(--glp-gold), var(--glp-sage))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Body & Soul
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl sm:text-2xl md:text-3xl font-serif mb-8 animate-fade-in-up" style={{ color: 'var(--glp-sage-deep)', fontWeight: 600, animationDelay: '0.2s' }}>
              360° Transformation from A to Z
            </p>

            {/* Description */}
            <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in-up" style={{ color: 'var(--glp-ink)', animationDelay: '0.3s' }}>
              A comprehensive platform designed to guide you through every step of your healing journey—from mindfulness to personal growth.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-20 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Link href="/register">
                <button 
                  className="group inline-flex items-center gap-3 font-bold text-lg px-10 py-5 rounded-full transition-all hover:opacity-90 hover:-translate-y-1 text-white"
                  style={{ background: 'linear-gradient(135deg, var(--glp-gold), var(--glp-gold-dark))', boxShadow: '0 8px 32px var(--glp-gold-30)' }}
                  data-testid="button-hero-begin"
                >
                  <Sparkles className="w-6 h-6" />
                  Begin Your Journey
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
              <Link href="/dashboard">
                <button 
                  className="inline-flex items-center gap-3 font-bold text-lg px-10 py-5 rounded-full transition-all border-2 hover:bg-[var(--glp-sage-deep)] hover:text-white hover:-translate-y-1"
                  style={{ color: 'var(--glp-sage-deep)', borderColor: 'var(--glp-sage-deep)' }}
                  data-testid="button-hero-dashboard"
                >
                  Explore Dashboard
                </button>
              </Link>
            </div>
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            <div className="text-center p-4 sm:p-6 rounded-2xl transition-all hover:scale-105 shadow-lg" style={{ background: 'var(--glp-white)', border: '2px solid var(--glp-sage-30)' }}>
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2" style={{ color: 'var(--glp-sage-deep)' }}>10K+</div>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--glp-sage-deep)' }}>
                Active Members
              </p>
            </div>
            <div className="text-center p-4 sm:p-6 rounded-2xl transition-all hover:scale-105 shadow-lg" style={{ background: 'var(--glp-white)', border: '2px solid var(--glp-gold-30)' }}>
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2" style={{ color: 'var(--glp-gold-dark)' }}>500+</div>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--glp-sage-deep)' }}>
                Wellness Tools
              </p>
            </div>
            <div className="text-center p-4 sm:p-6 rounded-2xl transition-all hover:scale-105 shadow-lg" style={{ background: 'var(--glp-white)', border: '2px solid var(--glp-rose-20)' }}>
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2" style={{ color: 'var(--glp-sage-deep)' }}>24/7</div>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--glp-sage-deep)' }}>
                AI Support
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement Section */}
      <section 
        id="about" 
        className="py-20 px-6"
        style={{ background: 'linear-gradient(180deg, var(--glp-paper), var(--glp-sage-10))' }}
      >
        <div className="max-w-5xl mx-auto text-center">
          <div 
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-8 pulse-glow"
            style={{ background: 'linear-gradient(135deg, var(--glp-gold), var(--glp-gold-dark))', boxShadow: '0 8px 24px var(--glp-gold-30), inset 0 1px 0 rgba(255,255,255,0.3)', border: '2px solid var(--glp-gold)' }}
          >
            <Heart className="w-8 h-8 text-white drop-shadow-sm" />
          </div>

          <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6" style={{ color: 'var(--glp-sage-deep)' }}>
            Our Mission
          </h2>

          <p 
            className="text-xl md:text-2xl leading-relaxed font-serif max-w-4xl mx-auto"
            style={{ color: 'var(--glp-ink)' }}
          >
            We believe healing begins with genuine love—love for yourself, your journey, and your potential. 
            Our platform provides a sacred space where mind, body, and soul unite in transformative growth, 
            offering comprehensive tools, wisdom, and community support for your holistic wellness.
          </p>

          {/* Values Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="reveal">
              <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-transform hover:scale-105" style={{ background: 'linear-gradient(135deg, var(--glp-gold), var(--glp-gold-dark))', boxShadow: '0 6px 20px var(--glp-gold-30), inset 0 1px 0 rgba(255,255,255,0.2)', border: '2px solid var(--glp-gold)' }}>
                <Lightbulb className="w-7 h-7 text-white drop-shadow-sm" />
              </div>
              <h3 className="font-serif text-2xl font-semibold mb-3" style={{ color: 'var(--glp-sage-deep)' }}>
                Wisdom
              </h3>
              <p className="leading-relaxed" style={{ color: 'var(--glp-ink)' }}>
                Curated insights from ancient traditions to modern psychology
              </p>
            </div>

            <div className="reveal" style={{ animationDelay: '0.2s' }}>
              <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-transform hover:scale-105" style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))', boxShadow: '0 6px 20px var(--glp-sage-30), inset 0 1px 0 rgba(255,255,255,0.2)', border: '2px solid var(--glp-sage)' }}>
                <Users className="w-7 h-7 text-white drop-shadow-sm" />
              </div>
              <h3 className="font-serif text-2xl font-semibold mb-3" style={{ color: 'var(--glp-sage-deep)' }}>
                Community
              </h3>
              <p className="leading-relaxed" style={{ color: 'var(--glp-ink)' }}>
                Connect with kindred spirits on similar healing paths
              </p>
            </div>

            <div className="reveal" style={{ animationDelay: '0.4s' }}>
              <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-transform hover:scale-105" style={{ background: 'linear-gradient(135deg, var(--glp-rose), var(--glp-blush))', boxShadow: '0 6px 20px var(--glp-rose-20), inset 0 1px 0 rgba(255,255,255,0.2)', border: '2px solid var(--glp-rose)' }}>
                <Zap className="w-7 h-7 text-white drop-shadow-sm" />
              </div>
              <h3 className="font-serif text-2xl font-semibold mb-3" style={{ color: 'var(--glp-sage-deep)' }}>
                Transformation
              </h3>
              <p className="leading-relaxed" style={{ color: 'var(--glp-ink)' }}>
                Evidence-based tools for measurable personal growth
              </p>
            </div>
          </div>

          {/* Centered decorative line below stages */}
          <div className="section-divider mx-auto mt-16" />
        </div>
      </section>

      {/* Featured Quote Section - QuoteBlock_1_Healing */}
      <section className="py-16 px-6" style={{ background: 'var(--glp-paper)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="quote-block" data-testid="quote-block-healing">
            <p className="quote-text relative z-10">
              The wound is the place where the Light enters you. Your healing journey isn't about becoming 
              someone new—it's about returning to who you've always been, beneath the layers of pain.
            </p>
            <p className="quote-author">— Rumi, adapted for modern healing</p>
          </div>
        </div>
      </section>

      {/* Calming Welcome Banner with Breathing Pulse */}
      <section className="py-16 px-6" style={{ background: 'linear-gradient(180deg, var(--glp-paper), var(--glp-rose-10))' }}>
        <div className="max-w-5xl mx-auto">
          <div className="welcome-banner text-center" data-testid="welcome-banner">
            <div className="flex justify-center mb-6">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center breathing-pulse"
                style={{ background: 'linear-gradient(135deg, var(--glp-rose), var(--glp-blush))', boxShadow: '0 8px 24px var(--glp-rose-20), inset 0 1px 0 rgba(255,255,255,0.3)', border: '2px solid var(--glp-rose)' }}
              >
                <Heart className="w-8 h-8 text-white drop-shadow-sm" />
              </div>
            </div>
            <h3 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              You Are Safe Here
            </h3>
            <p className="text-lg max-w-2xl mx-auto mb-8" style={{ color: 'var(--glp-ink)' }}>
              Take a deep breath. This is your sanctuary for healing, growth, and self-discovery. 
              Every step forward is a victory.
            </p>
            <Link href="/onboarding">
              <button className="mission-cta" data-testid="cta-join-now">
                Begin Your Healing Journey
                <ArrowRight className="inline ml-3 w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-4" style={{ color: 'var(--glp-sage-deep)' }}>
              Your Complete Wellness Toolkit
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--glp-ink)' }}>
              Comprehensive resources designed to support every aspect of your healing journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="glass-card rounded-3xl p-8">
                <div className="mb-6 flex items-center justify-center w-14 h-14 rounded-2xl" style={{ background: 'linear-gradient(135deg, var(--glp-sage-20), var(--glp-rose-15))', boxShadow: '0 4px 12px var(--glp-sage-20)' }}>
                  <feature.icon className="w-7 h-7" style={{ color: 'var(--glp-sage-deep)' }} strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-serif font-semibold mb-3" style={{ color: 'var(--glp-sage-deep)' }}>
                  {feature.title}
                </h3>
                <p className="leading-relaxed mb-4" style={{ color: 'var(--glp-ink)' }}>
                  {feature.description}
                </p>
                <Link href="/register">
                  <span className="inline-flex items-center font-semibold cursor-pointer" style={{ color: 'var(--glp-sage)' }}>
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6" style={{ background: 'var(--glp-paper)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-4" style={{ color: 'var(--glp-sage-deep)' }}>
              How It Works
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--glp-ink)' }}>
              Begin your transformation in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {steps.map((step, index) => (
              <div key={index} className="step-card" data-testid={`step-card-${index}`}>
                <div className="step-number" aria-label={`Step ${index + 1}`}>{index + 1}</div>
                <div className="mb-4 flex justify-center">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--glp-sage-20), var(--glp-sage-10))', boxShadow: '0 4px 12px var(--glp-sage-20)', border: '2px solid var(--glp-sage-30)' }}>
                    <step.icon className="w-6 h-6" style={{ color: 'var(--glp-sage-deep)' }} strokeWidth={2} />
                  </div>
                </div>
                <h3 className="text-xl font-serif font-semibold mb-2" style={{ color: 'var(--glp-sage-deep)' }}>
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--glp-ink)' }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section 
        className="py-20 px-6"
        style={{ background: 'linear-gradient(180deg, var(--glp-paper), var(--glp-rose-15))' }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-4" style={{ color: 'var(--glp-sage-deep)' }}>
              Voices of Healing
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--glp-ink)' }}>
              Real stories from our community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card" data-testid={`testimonial-${index}`}>
                <p className="mb-6 leading-relaxed italic" style={{ color: 'var(--glp-ink)' }}>
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="testimonial-avatar" aria-hidden="true">
                    {testimonial.initial}
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--glp-sage-deep)' }}>{testimonial.name}</p>
                    <p className="text-sm" style={{ color: 'var(--glp-sage)' }}>{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-16">
            <div className="trust-badge" style={{ background: 'var(--glp-white)', border: '2px solid var(--glp-sage-20)', boxShadow: '0 4px 12px var(--glp-sage-10)' }}>
              <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'var(--glp-sage-15)' }}>
                <Lock className="w-3.5 h-3.5" style={{ color: 'var(--glp-sage-deep)' }} />
              </div>
              <span style={{ color: 'var(--glp-ink)' }}>256-bit Encryption</span>
            </div>
            <div className="trust-badge" style={{ background: 'var(--glp-white)', border: '2px solid var(--glp-sage-20)', boxShadow: '0 4px 12px var(--glp-sage-10)' }}>
              <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'var(--glp-sage-15)' }}>
                <Shield className="w-3.5 h-3.5" style={{ color: 'var(--glp-sage-deep)' }} />
              </div>
              <span style={{ color: 'var(--glp-ink)' }}>GDPR Compliant</span>
            </div>
            <div className="trust-badge" style={{ background: 'var(--glp-white)', border: '2px solid var(--glp-sage-20)', boxShadow: '0 4px 12px var(--glp-sage-10)' }}>
              <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'var(--glp-sage-15)' }}>
                <Clock className="w-3.5 h-3.5" style={{ color: 'var(--glp-sage-deep)' }} />
              </div>
              <span style={{ color: 'var(--glp-ink)' }}>24/7 Support</span>
            </div>
          </div>

          {/* Rotating Quote Block */}
          <div className="mt-16 max-w-3xl mx-auto">
            <QuoteBlock variant="centered" />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section 
        id="faq" 
        className="py-20 px-6"
        style={{ background: 'linear-gradient(180deg, var(--glp-sage-10), var(--glp-paper))' }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-4" style={{ color: 'var(--glp-sage-deep)' }}>
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-0">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`faq-item ${activeFaq === index ? 'active' : ''}`}
                data-testid={`faq-item-${index}`}
              >
                <button 
                  className="faq-question w-full text-left"
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                >
                  {faq.question}
                  <ChevronDown className="faq-icon w-5 h-5 flex-shrink-0" />
                </button>
                <div className="faq-answer">
                  {faq.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-6 text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--glp-sage-deep), var(--glp-sage))' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6">
            <Sparkles className="w-4 h-4 text-white/80" />
            <span className="text-sm text-white/80 font-medium">Start your transformation today</span>
          </div>
          
          {/* Lotus Accent */}
          <div className="mx-auto mb-2 flex items-center justify-center" style={{ width: '10px', height: '0.5px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }}>
            <div className="rounded-full overflow-hidden" style={{ width: '0.5px', height: '0.5px', background: 'var(--glp-white)' }}>
              <img 
                src="/brand/footer-wellness-graphic.png" 
                alt="" 
                style={{ width: '0.5px', height: '0.5px', objectFit: 'cover', opacity: 0.4 }}
              />
            </div>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 text-white leading-tight">
            Begin Your Healing
            <br />
            <span className="text-[var(--glp-gold)]">Journey Today</span>
          </h2>
          <p className="text-lg md:text-xl mb-10 text-white/85 max-w-xl mx-auto">
            Join thousands who have found peace, growth, and genuine love within themselves.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <button 
                className="group px-10 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 hover:shadow-2xl"
                style={{
                  background: 'var(--glp-white)',
                  color: 'var(--glp-sage-deep)',
                  boxShadow: '0 8px 32px var(--glp-overlay-50)'
                }}
                data-testid="button-final-cta"
              >
                <span className="flex items-center gap-2">
                  Start Free Today
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
              </button>
            </Link>
            <Link href="/pricing">
              <button 
                className="px-8 py-4 rounded-full font-semibold text-white border-2 border-white/30 hover:border-white/60 hover:bg-white/10 transition-all"
                data-testid="button-view-pricing"
              >
                View Pricing
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Explore Our Platform Section */}
      <section className="py-20 px-6" style={{ background: 'linear-gradient(180deg, var(--glp-sage-10) 0%, var(--glp-paper) 100%)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4" style={{ color: 'var(--glp-sage-deep)' }}>
              Explore Our Platform
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--glp-ink)' }}>
              Discover all the tools, resources, and support available for your healing journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Wellness Tools */}
            <div className="p-6 rounded-2xl" style={{ background: 'var(--glp-white)', border: '2px solid var(--glp-sage-20)', boxShadow: '0 6px 20px var(--glp-sage-15)' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))' }}>
                  <Smile className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-lg" style={{ color: 'var(--glp-sage-deep)' }}>Wellness Tools</h3>
              </div>
              <div className="space-y-2 text-sm" style={{ color: 'var(--glp-ink)' }}>
                <Link href="/mood-tracker"><div className="p-2 rounded-lg hover:bg-[var(--glp-sage-10)] cursor-pointer transition-all">Mood Tracker</div></Link>
                <Link href="/journal"><div className="p-2 rounded-lg hover:bg-[var(--glp-sage-10)] cursor-pointer transition-all">Daily Journal</div></Link>
                <Link href="/meditation"><div className="p-2 rounded-lg hover:bg-[var(--glp-sage-10)] cursor-pointer transition-all">Meditation</div></Link>
                <Link href="/breathing"><div className="p-2 rounded-lg hover:bg-[var(--glp-sage-10)] cursor-pointer transition-all">Breathing Exercises</div></Link>
                <Link href="/affirmations"><div className="p-2 rounded-lg hover:bg-[var(--glp-sage-10)] cursor-pointer transition-all">Affirmations</div></Link>
              </div>
            </div>

            {/* AI & Support */}
            <div className="p-6 rounded-2xl" style={{ background: 'var(--glp-white)', border: '2px solid var(--glp-gold-30)', boxShadow: '0 6px 20px var(--glp-gold-15)' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--glp-gold), var(--glp-gold-dark))' }}>
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-lg" style={{ color: 'var(--glp-sage-deep)' }}>AI & Support</h3>
              </div>
              <div className="space-y-2 text-sm" style={{ color: 'var(--glp-ink)' }}>
                <Link href="/chat"><div className="p-2 rounded-lg hover:bg-[var(--glp-gold-10)] cursor-pointer transition-all">AI Companion</div></Link>
                <Link href="/therapy-chat"><div className="p-2 rounded-lg hover:bg-[var(--glp-gold-10)] cursor-pointer transition-all">Therapy Sessions</div></Link>
                <Link href="/crisis"><div className="p-2 rounded-lg hover:bg-[var(--glp-gold-10)] cursor-pointer transition-all">Crisis Support</div></Link>
                <Link href="/qa"><div className="p-2 rounded-lg hover:bg-[var(--glp-gold-10)] cursor-pointer transition-all">Q&A Community</div></Link>
                <Link href="/support"><div className="p-2 rounded-lg hover:bg-[var(--glp-gold-10)] cursor-pointer transition-all">Help Center</div></Link>
              </div>
            </div>

            {/* Learning & Growth */}
            <div className="p-6 rounded-2xl" style={{ background: 'var(--glp-white)', border: '2px solid var(--glp-rose-20)', boxShadow: '0 6px 20px var(--glp-rose-10)' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--glp-rose), var(--glp-blush))' }}>
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-lg" style={{ color: 'var(--glp-sage-deep)' }}>Learning & Growth</h3>
              </div>
              <div className="space-y-2 text-sm" style={{ color: 'var(--glp-ink)' }}>
                <Link href="/content-index"><div className="p-2 rounded-lg hover:bg-[var(--glp-rose-10)] cursor-pointer transition-all">Content Library</div></Link>
                <Link href="/study-vault"><div className="p-2 rounded-lg hover:bg-[var(--glp-rose-10)] cursor-pointer transition-all">Study Vault</div></Link>
                <Link href="/healing-library"><div className="p-2 rounded-lg hover:bg-[var(--glp-rose-10)] cursor-pointer transition-all">Healing Library</div></Link>
                <Link href="/how-to-guides"><div className="p-2 rounded-lg hover:bg-[var(--glp-rose-10)] cursor-pointer transition-all">How-To Guides</div></Link>
                <Link href="/research"><div className="p-2 rounded-lg hover:bg-[var(--glp-rose-10)] cursor-pointer transition-all">Research & Evidence</div></Link>
              </div>
            </div>

            {/* Advanced Tools */}
            <div className="p-6 rounded-2xl" style={{ background: 'var(--glp-white)', border: '2px solid var(--glp-sage-30)', boxShadow: '0 6px 20px var(--glp-sage-10)' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--glp-sage-deep), var(--glp-ink))' }}>
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-lg" style={{ color: 'var(--glp-sage-deep)' }}>Advanced Tools</h3>
              </div>
              <div className="space-y-2 text-sm" style={{ color: 'var(--glp-ink)' }}>
                <Link href="/tools"><div className="p-2 rounded-lg hover:bg-[var(--glp-sage-10)] cursor-pointer transition-all">Tools Library</div></Link>
                <Link href="/intellectual-atlas"><div className="p-2 rounded-lg hover:bg-[var(--glp-sage-10)] cursor-pointer transition-all">Intellectual Atlas</div></Link>
                <Link href="/cognitive-lab"><div className="p-2 rounded-lg hover:bg-[var(--glp-sage-10)] cursor-pointer transition-all">Cognitive Lab</div></Link>
                <Link href="/purpose-compass"><div className="p-2 rounded-lg hover:bg-[var(--glp-sage-10)] cursor-pointer transition-all">Purpose Compass</div></Link>
                <Link href="/mastery"><div className="p-2 rounded-lg hover:bg-[var(--glp-sage-10)] cursor-pointer transition-all">Mastery Suite</div></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6" style={{ background: 'linear-gradient(180deg, var(--glp-paper) 0%, var(--glp-sage-10) 100%)', borderTop: '1px solid var(--glp-sage-15)' }}>
        <div className="max-w-6xl mx-auto">
          {/* Inspirational Words Section - Now at Top */}
          <div className="flex flex-col items-center justify-center pb-12 mb-12" style={{ borderBottom: '1px solid var(--glp-sage-15)' }}>
            <div className="w-full max-w-4xl mb-6 rounded-2xl overflow-hidden" style={{ boxShadow: '0 12px 40px var(--glp-sage-20)' }}>
              <img 
                src="/brand/inspirational-words.png" 
                alt="Genuine Love, Healing, Transformation, Compassion, Growth, Peace, Wisdom, Hope, Strength, Courage" 
                className="w-full h-auto object-cover"
              />
            </div>
            <p className="text-lg sm:text-xl text-center font-serif font-semibold" style={{ color: 'var(--glp-sage-deep)' }}>
              360° Support from A to Z — Live in Genuine Love
            </p>
          </div>

          {/* Platform, Resources, Legal - Full Width */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
            {/* Platform */}
            <div className="p-6 rounded-2xl text-center sm:text-left transition-all hover:shadow-lg" style={{ background: 'var(--glp-white)', border: '2px solid var(--glp-sage-15)', boxShadow: '0 4px 16px var(--glp-sage-10)' }}>
              <div className="flex items-center justify-center sm:justify-start gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))', boxShadow: '0 4px 12px var(--glp-sage-30)' }}>
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-semibold text-lg" style={{ color: 'var(--glp-sage-deep)' }}>Platform</h4>
              </div>
              <div className="space-y-2 text-sm">
                <Link href="/crm"><div className="p-2.5 rounded-xl hover:bg-[var(--glp-sage-10)] cursor-pointer transition-all flex items-center justify-center sm:justify-start gap-3 group" data-testid="link-footer-dashboard"><div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'var(--glp-sage-15)' }}><ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" style={{ color: 'var(--glp-sage-deep)' }} /></div><span style={{ color: 'var(--glp-ink)' }}>Dashboard</span></div></Link>
                <Link href="/onboarding"><div className="p-2.5 rounded-xl hover:bg-[var(--glp-sage-10)] cursor-pointer transition-all flex items-center justify-center sm:justify-start gap-3 group" data-testid="link-footer-onboarding"><div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'var(--glp-sage-15)' }}><ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" style={{ color: 'var(--glp-sage-deep)' }} /></div><span style={{ color: 'var(--glp-ink)' }}>Get Started</span></div></Link>
                <Link href="/pricing"><div className="p-2.5 rounded-xl hover:bg-[var(--glp-sage-10)] cursor-pointer transition-all flex items-center justify-center sm:justify-start gap-3 group"><div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'var(--glp-sage-15)' }}><ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" style={{ color: 'var(--glp-sage-deep)' }} /></div><span style={{ color: 'var(--glp-ink)' }}>Pricing</span></div></Link>
                <Link href="/tools"><div className="p-2.5 rounded-xl hover:bg-[var(--glp-sage-10)] cursor-pointer transition-all flex items-center justify-center sm:justify-start gap-3 group"><div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'var(--glp-sage-15)' }}><ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" style={{ color: 'var(--glp-sage-deep)' }} /></div><span style={{ color: 'var(--glp-ink)' }}>Tools Library</span></div></Link>
              </div>
            </div>
            
            {/* Resources */}
            <div className="p-6 rounded-2xl text-center sm:text-left transition-all hover:shadow-lg" style={{ background: 'var(--glp-white)', border: '2px solid var(--glp-gold-30)', boxShadow: '0 4px 16px var(--glp-gold-10)' }}>
              <div className="flex items-center justify-center sm:justify-start gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--glp-gold), var(--glp-gold-dark))', boxShadow: '0 4px 12px var(--glp-gold-30)' }}>
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-semibold text-lg" style={{ color: 'var(--glp-sage-deep)' }}>Resources</h4>
              </div>
              <div className="space-y-2 text-sm">
                <Link href="/content-index"><div className="p-2.5 rounded-xl hover:bg-[var(--glp-gold-10)] cursor-pointer transition-all flex items-center justify-center sm:justify-start gap-3 group" data-testid="link-footer-content"><div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'var(--glp-gold-20)' }}><ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" style={{ color: 'var(--glp-gold-dark)' }} /></div><span style={{ color: 'var(--glp-ink)' }}>Content Library</span></div></Link>
                <Link href="/qa"><div className="p-2.5 rounded-xl hover:bg-[var(--glp-gold-10)] cursor-pointer transition-all flex items-center justify-center sm:justify-start gap-3 group" data-testid="link-footer-qa"><div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'var(--glp-gold-20)' }}><ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" style={{ color: 'var(--glp-gold-dark)' }} /></div><span style={{ color: 'var(--glp-ink)' }}>Q&A Community</span></div></Link>
                <Link href="/crisis"><div className="p-2.5 rounded-xl hover:bg-[var(--glp-gold-10)] cursor-pointer transition-all flex items-center justify-center sm:justify-start gap-3 group"><div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'var(--glp-gold-20)' }}><ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" style={{ color: 'var(--glp-gold-dark)' }} /></div><span style={{ color: 'var(--glp-ink)' }}>Crisis Support</span></div></Link>
                <Link href="/study-vault"><div className="p-2.5 rounded-xl hover:bg-[var(--glp-gold-10)] cursor-pointer transition-all flex items-center justify-center sm:justify-start gap-3 group"><div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'var(--glp-gold-20)' }}><ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" style={{ color: 'var(--glp-gold-dark)' }} /></div><span style={{ color: 'var(--glp-ink)' }}>Study Vault</span></div></Link>
              </div>
            </div>
            
            {/* Legal */}
            <div className="p-6 rounded-2xl text-center sm:text-left transition-all hover:shadow-lg" style={{ background: 'var(--glp-white)', border: '2px solid var(--glp-rose-15)', boxShadow: '0 4px 16px var(--glp-rose-10)' }}>
              <div className="flex items-center justify-center sm:justify-start gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--glp-rose), var(--glp-blush))', boxShadow: '0 4px 12px var(--glp-rose-20)' }}>
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-semibold text-lg" style={{ color: 'var(--glp-sage-deep)' }}>Legal</h4>
              </div>
              <div className="space-y-2 text-sm">
                <Link href="/privacy"><div className="p-2.5 rounded-xl hover:bg-[var(--glp-rose-10)] cursor-pointer transition-all flex items-center justify-center sm:justify-start gap-3 group" data-testid="link-footer-privacy"><div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'var(--glp-rose-15)' }}><ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" style={{ color: 'var(--glp-rose)' }} /></div><span style={{ color: 'var(--glp-ink)' }}>Privacy Policy</span></div></Link>
                <Link href="/terms"><div className="p-2.5 rounded-xl hover:bg-[var(--glp-rose-10)] cursor-pointer transition-all flex items-center justify-center sm:justify-start gap-3 group" data-testid="link-footer-terms"><div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'var(--glp-rose-15)' }}><ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" style={{ color: 'var(--glp-rose)' }} /></div><span style={{ color: 'var(--glp-ink)' }}>Terms of Service</span></div></Link>
                <Link href="/accessibility"><div className="p-2.5 rounded-xl hover:bg-[var(--glp-rose-10)] cursor-pointer transition-all flex items-center justify-center sm:justify-start gap-3 group"><div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'var(--glp-rose-15)' }}><ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" style={{ color: 'var(--glp-rose)' }} /></div><span style={{ color: 'var(--glp-ink)' }}>Accessibility</span></div></Link>
                <Link href="/contact"><div className="p-2.5 rounded-xl hover:bg-[var(--glp-rose-10)] cursor-pointer transition-all flex items-center justify-center sm:justify-start gap-3 group"><div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'var(--glp-rose-15)' }}><ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" style={{ color: 'var(--glp-rose)' }} /></div><span style={{ color: 'var(--glp-ink)' }}>Contact Us</span></div></Link>
              </div>
            </div>
          </div>

          {/* Brand Column - Now at Bottom */}
          <div className="flex flex-col items-center text-center py-8 mb-8" style={{ borderTop: '1px solid var(--glp-sage-15)' }}>
            <div className="rounded-3xl overflow-hidden mb-6 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl" style={{ boxShadow: '0 12px 40px var(--glp-sage-30)', border: '3px solid var(--glp-sage-20)', maxWidth: '180px', background: 'linear-gradient(135deg, var(--glp-white), var(--glp-sage-10))' }}>
              <img 
                src="/brand/footer-wellness-graphic.png" 
                alt="Wellness and healing" 
                className="w-full h-auto object-cover"
              />
            </div>
            <h4 className="font-serif font-bold text-xl mb-3" style={{ color: 'var(--glp-sage-deep)' }}>
              The Genuine Love Project
            </h4>
            <p className="text-sm leading-relaxed mb-4 max-w-md" style={{ color: 'var(--glp-ink)' }}>
              Transformative healing through AI-powered support, mindfulness, and community.
            </p>
            <div className="flex justify-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform hover:scale-110 cursor-pointer" style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))', boxShadow: '0 4px 12px var(--glp-sage-30)' }}>
                <Heart className="w-4 h-4 text-white" />
              </div>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform hover:scale-110 cursor-pointer" style={{ background: 'linear-gradient(135deg, var(--glp-gold), var(--glp-gold-dark))', boxShadow: '0 4px 12px var(--glp-gold-30)' }}>
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform hover:scale-110 cursor-pointer" style={{ background: 'linear-gradient(135deg, var(--glp-rose), var(--glp-blush))', boxShadow: '0 4px 12px var(--glp-rose-20)' }}>
                <Star className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid var(--glp-sage-15)' }}>
            <p className="text-sm" style={{ color: 'var(--glp-sage)' }}>
              © {new Date().getFullYear()} The Genuine Love Project. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--glp-sage)' }}>
              <span>Made with</span>
              <Heart className="w-4 h-4" style={{ color: 'var(--glp-blush)' }} fill="currentColor" />
              <span>for your healing journey</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`scroll-to-top ${showScrollTop ? 'visible' : ''}`}
        aria-label="Scroll to top"
        data-testid="button-scroll-to-top"
      >
        <ArrowUp className="w-6 h-6" />
      </button>
    </div>
  );
}
