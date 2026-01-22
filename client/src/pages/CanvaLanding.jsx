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
          <div className="pt-6 mt-6 border-t" style={{ borderColor: 'rgba(143, 191, 159, 0.3)' }}>
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
      <header className="canva-header sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer" data-testid="link-logo">
              <img 
                src="/brand/logo-mark.png" 
                alt="The Genuine Love Project" 
                className="h-12 w-auto"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <span className="font-serif text-xl font-bold hidden sm:block" style={{ color: 'var(--deep-teal)' }}>
                The Genuine Love Project
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#home" className="nav-link font-medium" style={{ color: 'var(--deep-teal)' }}>Home</a>
            <a href="#about" className="nav-link font-medium" style={{ color: 'var(--deep-teal)' }}>About</a>
            <a href="#features" className="nav-link font-medium" style={{ color: 'var(--deep-teal)' }}>Features</a>
            <a href="#faq" className="nav-link font-medium" style={{ color: 'var(--deep-teal)' }}>FAQ</a>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login">
              <button 
                className="font-semibold px-6 py-2 rounded-full transition-all"
                style={{ color: 'var(--deep-teal)', border: '2px solid var(--deep-teal)' }}
                data-testid="button-signin"
              >
                Sign In
              </button>
            </Link>
            <Link href="/register">
              <button className="btn-primary" style={{ padding: '12px 28px' }} data-testid="button-getstarted">
                Get Started
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden w-10 h-10 flex items-center justify-center"
            style={{ color: 'var(--deep-teal)' }}
            data-testid="button-open-mobile-menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative py-20 md:py-32 px-6 overflow-hidden">
        {/* Decorative Background Elements */}
        <div 
          className="decorative-circle float-element"
          style={{
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(143, 191, 159, 0.2), transparent)',
            position: 'absolute',
            top: '-100px',
            right: '-100px'
          }}
        />
        <div 
          className="decorative-circle float-element"
          style={{
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(244, 199, 195, 0.15), transparent)',
            position: 'absolute',
            bottom: '-150px',
            left: '-150px',
            animationDelay: '2s'
          }}
        />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            {/* Badge */}
            <div 
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full mb-8"
              style={{
                background: 'linear-gradient(135deg, rgba(143, 191, 159, 0.15), rgba(244, 199, 195, 0.15))',
                border: '1px solid rgba(143, 191, 159, 0.3)'
              }}
            >
              <Star className="w-5 h-5" style={{ color: 'var(--sage-green)' }} />
              <span className="font-semibold uppercase tracking-wider text-sm" style={{ color: 'var(--deep-teal)' }}>
                Transformative Healing Platform
              </span>
            </div>

            {/* Main Headline */}
            <h1 
              className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-6 leading-tight"
              style={{ color: 'var(--deep-teal)' }}
            >
              Heal Your Mind,<br />Body & Soul
            </h1>

            {/* Subheadline */}
            <p 
              className="text-xl md:text-3xl font-serif mb-8"
              style={{ color: 'var(--sage-green)', fontWeight: 500 }}
            >
              360° Transformation from A to Z
            </p>

            {/* Description */}
            <p 
              className="text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed"
              style={{ color: 'var(--charcoal)', opacity: 0.8 }}
            >
              Discover a comprehensive platform designed to guide you through every step of your healing journey—from mindfulness practices to personal growth tools.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <button className="btn-primary" data-testid="button-hero-begin">
                  Begin Your Journey
                </button>
              </Link>
              <Link href="/crm">
                <button className="btn-secondary" data-testid="button-hero-dashboard">
                  Go to Dashboard
                </button>
              </Link>
            </div>
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto mt-20">
            <div className="text-center reveal">
              <div className="stat-number">10K+</div>
              <p className="text-sm uppercase tracking-wider mt-2" style={{ color: 'var(--charcoal)', opacity: 0.6 }}>
                Active Members
              </p>
            </div>
            <div className="text-center reveal" style={{ animationDelay: '0.2s' }}>
              <div className="stat-number">500+</div>
              <p className="text-sm uppercase tracking-wider mt-2" style={{ color: 'var(--charcoal)', opacity: 0.6 }}>
                Resources
              </p>
            </div>
            <div className="text-center reveal" style={{ animationDelay: '0.4s' }}>
              <div className="stat-number">24/7</div>
              <p className="text-sm uppercase tracking-wider mt-2" style={{ color: 'var(--charcoal)', opacity: 0.6 }}>
                Support
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement Section */}
      <section 
        id="about" 
        className="py-20 px-6"
        style={{ background: 'linear-gradient(180deg, var(--soft-ivory), rgba(143, 191, 159, 0.08))' }}
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
                    <p className="text-sm" style={{ color: 'var(--charcoal)', opacity: 0.6 }}>{testimonial.role}</p>
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
        style={{ background: 'linear-gradient(180deg, rgba(143, 191, 159, 0.08), var(--soft-ivory))' }}
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
      <section className="py-20 px-6 text-center" style={{ background: 'linear-gradient(135deg, var(--deep-teal), var(--sage-green))' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-white">
            Begin Your Healing Journey Today
          </h2>
          <p className="text-xl mb-12 text-white opacity-90">
            Join thousands of souls who have found peace, growth, and genuine love within themselves.
          </p>
          <Link href="/register">
            <button 
              className="px-12 py-5 rounded-full font-semibold text-lg transition-all"
              style={{
                background: 'white',
                color: 'var(--deep-teal)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
              }}
              data-testid="button-final-cta"
            >
              Start Free Today
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6" style={{ background: 'var(--soft-ivory)', borderTop: '1px solid rgba(143, 191, 159, 0.2)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6" style={{ color: 'var(--sage-green)' }} />
              <span className="font-serif font-bold" style={{ color: 'var(--deep-teal)' }}>
                The Genuine Love Project
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm" style={{ color: 'var(--charcoal)', opacity: 0.7 }}>
              <Link href="/onboarding"><span className="hover:opacity-100 cursor-pointer" data-testid="link-footer-onboarding">Onboarding</span></Link>
              <Link href="/crm"><span className="hover:opacity-100 cursor-pointer" data-testid="link-footer-dashboard">Dashboard</span></Link>
              <Link href="/content-index"><span className="hover:opacity-100 cursor-pointer" data-testid="link-footer-content">Content</span></Link>
              <Link href="/qa"><span className="hover:opacity-100 cursor-pointer" data-testid="link-footer-qa">Q&A</span></Link>
              <Link href="/privacy"><span className="hover:opacity-100 cursor-pointer" data-testid="link-footer-privacy">Privacy</span></Link>
              <Link href="/terms"><span className="hover:opacity-100 cursor-pointer" data-testid="link-footer-terms">Terms</span></Link>
            </div>
          </div>
          <div className="text-center mt-8 text-sm" style={{ color: 'var(--charcoal)', opacity: 0.5 }}>
            © {new Date().getFullYear()} The Genuine Love Project. All rights reserved.
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
