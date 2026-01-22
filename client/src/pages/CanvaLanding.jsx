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
          style={{ color: 'var(--charcoal)' }}
          data-testid="button-close-mobile-menu"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="space-y-6">
          <a href="#home" className="block text-2xl font-serif font-semibold" style={{ color: 'var(--deep-teal)' }}>Home</a>
          <a href="#about" className="block text-2xl font-serif font-semibold" style={{ color: 'var(--deep-teal)' }}>About</a>
          <a href="#features" className="block text-2xl font-serif font-semibold" style={{ color: 'var(--deep-teal)' }}>Features</a>
          <a href="#faq" className="block text-2xl font-serif font-semibold" style={{ color: 'var(--deep-teal)' }}>FAQ</a>
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
          <div className="flex items-center justify-between h-[68px] sm:h-[76px] lg:h-[88px]">
            {/* Logo - Compact on mobile, expanded on desktop */}
            <Link href="/">
              <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 cursor-pointer group shrink-0" data-testid="link-logo">
                <div className="relative w-12 h-12 sm:w-[52px] sm:h-[52px] lg:w-[60px] lg:h-[60px] rounded-xl lg:rounded-2xl overflow-hidden flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg" style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))', boxShadow: '0 4px 16px var(--glp-sage-30)' }}>
                  <img 
                    src="/brand/logo-mark.png" 
                    alt="" 
                    className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <Heart className="w-5 h-5 text-white hidden" fill="currentColor" style={{ display: 'none' }} />
                </div>
                <div className="hidden sm:flex flex-col leading-snug">
                  <span className="text-lg lg:text-xl xl:text-[22px] font-bold tracking-tight" style={{ color: 'var(--glp-sage-deep)' }}>
                    The Genuine Love Project
                  </span>
                  <span className="text-[11px] lg:text-xs font-semibold tracking-[0.15em] uppercase mt-0.5" style={{ color: 'var(--glp-sage)' }}>
                    Live in Genuine Love
                  </span>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation - Centered */}
            <nav className="hidden lg:flex items-center gap-2 xl:gap-3 absolute left-1/2 transform -translate-x-1/2">
              <a href="#home" className="px-5 xl:px-6 py-2.5 text-[15px] font-semibold rounded-xl transition-all duration-200 hover:bg-[var(--glp-sage-10)]" style={{ color: 'var(--glp-sage-deep)' }}>Home</a>
              <a href="#about" className="px-5 xl:px-6 py-2.5 text-[15px] font-semibold rounded-xl transition-all duration-200 hover:bg-[var(--glp-sage-10)]" style={{ color: 'var(--glp-sage-deep)' }}>About</a>
              <a href="#features" className="px-5 xl:px-6 py-2.5 text-[15px] font-semibold rounded-xl transition-all duration-200 hover:bg-[var(--glp-sage-10)]" style={{ color: 'var(--glp-sage-deep)' }}>Features</a>
              <a href="#faq" className="px-5 xl:px-6 py-2.5 text-[15px] font-semibold rounded-xl transition-all duration-200 hover:bg-[var(--glp-sage-10)]" style={{ color: 'var(--glp-sage-deep)' }}>FAQ</a>
              <a href="/pricing" className="px-5 xl:px-6 py-2.5 text-[15px] font-semibold rounded-xl transition-all duration-200 hover:bg-[var(--glp-sage-10)]" style={{ color: 'var(--glp-sage-deep)' }}>Pricing</a>
            </nav>

            {/* CTA Buttons - Right aligned */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              <Link href="/login">
                <button 
                  className="hidden md:inline-flex font-semibold text-sm lg:text-[15px] px-5 lg:px-6 py-2.5 lg:py-3 rounded-full transition-all border-2 hover:bg-[var(--glp-sage-deep)] hover:text-white hover:shadow-md"
                  style={{ color: 'var(--glp-sage-deep)', borderColor: 'var(--glp-sage-deep)' }}
                  data-testid="button-signin"
                >
                  Sign In
                </button>
              </Link>
              <Link href="/register">
                <button 
                  className="inline-flex items-center gap-2 font-semibold text-sm lg:text-[15px] px-5 lg:px-6 py-2.5 lg:py-3 rounded-full transition-all hover:opacity-90 hover:shadow-lg text-white"
                  style={{ background: 'linear-gradient(135deg, var(--glp-gold), var(--glp-gold-dark))', boxShadow: '0 4px 14px var(--glp-gold-30)' }}
                  data-testid="button-getstarted"
                >
                  <Sparkles className="w-4 h-4 lg:w-[18px] lg:h-[18px]" />
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
              <span className="bg-gradient-to-r from-[var(--glp-sage)] via-[var(--glp-gold)] to-[var(--glp-sage-deep)] bg-clip-text text-transparent">
                Body & Soul
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl sm:text-2xl md:text-3xl font-serif mb-8 animate-fade-in-up" style={{ color: 'var(--glp-sage)', fontWeight: 600, animationDelay: '0.2s' }}>
              360° Transformation from A to Z
            </p>

            {/* Description */}
            <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in-up" style={{ color: 'var(--glp-ink)', opacity: 0.8, animationDelay: '0.3s' }}>
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
          <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center p-6 rounded-2xl transition-all hover:scale-105" style={{ background: 'var(--glp-paper-70)', border: '1px solid var(--glp-sage-20)' }}>
              <div className="text-4xl md:text-5xl font-bold mb-2" style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>10K+</div>
              <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--glp-ink)', opacity: 0.7 }}>
                Active Members
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl transition-all hover:scale-105" style={{ background: 'var(--glp-paper-70)', border: '1px solid var(--glp-sage-20)' }}>
              <div className="text-4xl md:text-5xl font-bold mb-2" style={{ background: 'linear-gradient(135deg, var(--glp-gold), var(--glp-gold-dark))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>500+</div>
              <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--glp-ink)', opacity: 0.7 }}>
                Wellness Tools
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl transition-all hover:scale-105" style={{ background: 'var(--glp-paper-70)', border: '1px solid var(--glp-sage-20)' }}>
              <div className="text-4xl md:text-5xl font-bold mb-2" style={{ background: 'linear-gradient(135deg, var(--glp-blush), var(--glp-rose)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>24/7</div>
              <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--glp-ink)', opacity: 0.7 }}>
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
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-8 pulse-glow"
            style={{ background: 'linear-gradient(135deg, var(--warm-gold), var(--blush-pink))' }}
          >
            <Heart className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6" style={{ color: 'var(--deep-teal)' }}>
            Our Mission
          </h2>

          <p 
            className="text-xl md:text-2xl leading-relaxed font-serif"
            style={{ color: 'var(--charcoal)', opacity: 0.85 }}
          >
            We believe healing begins with genuine love—love for yourself, your journey, and your potential. 
            Our platform provides a sacred space where mind, body, and soul unite in transformative growth, 
            offering comprehensive tools, wisdom, and community support for your holistic wellness.
          </p>

          {/* Values Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="reveal">
              <div className="icon-circle mx-auto mb-4">
                <Lightbulb className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-serif text-2xl font-semibold mb-3" style={{ color: 'var(--deep-teal)' }}>
                Wisdom
              </h3>
              <p className="leading-relaxed" style={{ color: 'var(--charcoal)', opacity: 0.75 }}>
                Curated insights from ancient traditions to modern psychology
              </p>
            </div>

            <div className="reveal" style={{ animationDelay: '0.2s' }}>
              <div className="icon-circle mx-auto mb-4">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-serif text-2xl font-semibold mb-3" style={{ color: 'var(--deep-teal)' }}>
                Community
              </h3>
              <p className="leading-relaxed" style={{ color: 'var(--charcoal)', opacity: 0.75 }}>
                Connect with kindred spirits on similar healing paths
              </p>
            </div>

            <div className="reveal" style={{ animationDelay: '0.4s' }}>
              <div className="icon-circle mx-auto mb-4">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-serif text-2xl font-semibold mb-3" style={{ color: 'var(--deep-teal)' }}>
                Transformation
              </h3>
              <p className="leading-relaxed" style={{ color: 'var(--charcoal)', opacity: 0.75 }}>
                Evidence-based tools for measurable personal growth
              </p>
            </div>
          </div>

          {/* Centered decorative line below stages */}
          <div className="section-divider mx-auto mt-16" />
        </div>
      </section>

      {/* Featured Quote Section - QuoteBlock_1_Healing */}
      <section className="py-16 px-6" style={{ background: 'var(--soft-ivory)' }}>
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
      <section className="py-16 px-6" style={{ background: 'linear-gradient(180deg, var(--soft-ivory), rgba(244, 199, 195, 0.1))' }}>
        <div className="max-w-5xl mx-auto">
          <div className="welcome-banner text-center" data-testid="welcome-banner">
            <div className="flex justify-center mb-6">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center breathing-pulse"
                style={{ background: 'rgba(255, 255, 255, 0.2)' }}
              >
                <Heart className="w-10 h-10 text-white" />
              </div>
            </div>
            <h3 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              You Are Safe Here
            </h3>
            <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
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
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-4" style={{ color: 'var(--deep-teal)' }}>
              Your Complete Wellness Toolkit
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--charcoal)', opacity: 0.75 }}>
              Comprehensive resources designed to support every aspect of your healing journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="glass-card rounded-3xl p-8">
                <div className="mb-6">
                  <feature.icon className="feature-icon" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-serif font-semibold mb-3" style={{ color: 'var(--deep-teal)' }}>
                  {feature.title}
                </h3>
                <p className="leading-relaxed mb-4" style={{ color: 'var(--charcoal)', opacity: 0.75 }}>
                  {feature.description}
                </p>
                <Link href="/register">
                  <span className="inline-flex items-center font-semibold cursor-pointer" style={{ color: 'var(--sage-green)' }}>
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
      <section className="py-20 px-6" style={{ background: 'var(--soft-ivory)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-4" style={{ color: 'var(--deep-teal)' }}>
              How It Works
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--charcoal)', opacity: 0.75 }}>
              Begin your transformation in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {steps.map((step, index) => (
              <div key={index} className="step-card" data-testid={`step-card-${index}`}>
                <div className="step-number" aria-label={`Step ${index + 1}`}>{index + 1}</div>
                <div className="mb-4 flex justify-center">
                  <step.icon className="w-10 h-10" style={{ color: 'var(--sage-green)' }} />
                </div>
                <h3 className="text-xl font-serif font-semibold mb-2" style={{ color: 'var(--deep-teal)' }}>
                  {step.title}
                </h3>
                <p className="text-sm" style={{ color: 'var(--charcoal)', opacity: 0.75 }}>
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
        style={{ background: 'linear-gradient(180deg, var(--soft-ivory), rgba(244, 199, 195, 0.15))' }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-4" style={{ color: 'var(--deep-teal)' }}>
              Voices of Healing
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--charcoal)', opacity: 0.75 }}>
              Real stories from our community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card" data-testid={`testimonial-${index}`}>
                <p className="mb-6 leading-relaxed italic" style={{ color: 'var(--charcoal)' }}>
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="testimonial-avatar" aria-hidden="true">
                    {testimonial.initial}
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--deep-teal)' }}>{testimonial.name}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-16">
            <div className="trust-badge">
              <Lock className="w-4 h-4" />
              <span>256-bit Encryption</span>
            </div>
            <div className="trust-badge">
              <Shield className="w-4 h-4" />
              <span>GDPR Compliant</span>
            </div>
            <div className="trust-badge">
              <Clock className="w-4 h-4" />
              <span>24/7 Support</span>
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
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-4" style={{ color: 'var(--deep-teal)' }}>
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
      <section className="py-24 px-6 text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--deep-teal), var(--sage-green))' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-8">
            <Sparkles className="w-4 h-4 text-white/80" />
            <span className="text-sm text-white/80 font-medium">Start your transformation today</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 text-white leading-tight">
            Begin Your Healing
            <br />
            <span className="text-[var(--warm-gold)]">Journey Today</span>
          </h2>
          <p className="text-lg md:text-xl mb-10 text-white/85 max-w-xl mx-auto">
            Join thousands who have found peace, growth, and genuine love within themselves.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <button 
                className="group px-10 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 hover:shadow-2xl"
                style={{
                  background: 'white',
                  color: 'var(--deep-teal)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
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

      {/* Footer */}
      <footer className="py-16 px-6" style={{ background: 'var(--glp-paper)', borderTop: '1px solid var(--glp-sage-15)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--sage-green), var(--deep-teal))' }}>
                  <Heart className="w-5 h-5 text-white" fill="currentColor" />
                </div>
                <span className="font-serif font-bold text-lg" style={{ color: 'var(--deep-teal)' }}>
                  Genuine Love
                </span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--charcoal)', opacity: 0.7 }}>
                Transformative healing through AI-powered support, mindfulness, and community.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4" style={{ color: 'var(--deep-teal)' }}>Platform</h4>
              <ul className="space-y-3 text-sm" style={{ color: 'var(--charcoal)', opacity: 0.7 }}>
                <li><Link href="/crm"><span className="hover:opacity-100 cursor-pointer transition-opacity" data-testid="link-footer-dashboard">Dashboard</span></Link></li>
                <li><Link href="/onboarding"><span className="hover:opacity-100 cursor-pointer transition-opacity" data-testid="link-footer-onboarding">Get Started</span></Link></li>
                <li><Link href="/pricing"><span className="hover:opacity-100 cursor-pointer transition-opacity">Pricing</span></Link></li>
                <li><Link href="/tools"><span className="hover:opacity-100 cursor-pointer transition-opacity">Tools Library</span></Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4" style={{ color: 'var(--deep-teal)' }}>Resources</h4>
              <ul className="space-y-3 text-sm" style={{ color: 'var(--charcoal)', opacity: 0.7 }}>
                <li><Link href="/content-index"><span className="hover:opacity-100 cursor-pointer transition-opacity" data-testid="link-footer-content">Content Library</span></Link></li>
                <li><Link href="/qa"><span className="hover:opacity-100 cursor-pointer transition-opacity" data-testid="link-footer-qa">Q&A Community</span></Link></li>
                <li><Link href="/crisis"><span className="hover:opacity-100 cursor-pointer transition-opacity">Crisis Support</span></Link></li>
                <li><Link href="/study-vault"><span className="hover:opacity-100 cursor-pointer transition-opacity">Study Vault</span></Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4" style={{ color: 'var(--deep-teal)' }}>Legal</h4>
              <ul className="space-y-3 text-sm" style={{ color: 'var(--charcoal)', opacity: 0.7 }}>
                <li><Link href="/privacy"><span className="hover:opacity-100 cursor-pointer transition-opacity" data-testid="link-footer-privacy">Privacy Policy</span></Link></li>
                <li><Link href="/terms"><span className="hover:opacity-100 cursor-pointer transition-opacity" data-testid="link-footer-terms">Terms of Service</span></Link></li>
                <li><Link href="/accessibility"><span className="hover:opacity-100 cursor-pointer transition-opacity">Accessibility</span></Link></li>
                <li><Link href="/contact"><span className="hover:opacity-100 cursor-pointer transition-opacity">Contact Us</span></Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid var(--glp-sage-15)' }}>
            <p className="text-sm" style={{ color: 'var(--charcoal)', opacity: 0.6 }}>
              © {new Date().getFullYear()} The Genuine Love Project. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--charcoal)', opacity: 0.6 }}>
              <span>Made with</span>
              <Heart className="w-4 h-4" style={{ color: 'var(--blush-pink)' }} fill="currentColor" />
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
