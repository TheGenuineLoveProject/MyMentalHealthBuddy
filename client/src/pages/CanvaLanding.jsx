import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Link, useLocation } from "wouter";
import { Heart, Lightbulb, Users, Zap, Smile, BarChart3, BookOpen, Shield, Star, ChevronDown, Menu, X, ArrowRight, ArrowUp, Lock, Clock, Sparkles, PenLine, MessageCircle, TrendingUp, Leaf, Brain, KeyRound, Settings } from "lucide-react";
import "../styles/canva-landing.css";
import SafetyFooter from "../components/ui/SafetyFooter";
import SoftLaunchBanner from "../components/SoftLaunchBanner";

export default function CanvaLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [, setLocation] = useLocation();
  
  const { isAuthenticated, isLoading } = useAuth();
  
  // Admin login state
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminToken, setAdminToken] = useState("");
  const [adminError, setAdminError] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);
  
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAdminError("");
    setAdminLoading(true);
    
    const trimmedToken = adminToken.trim();
    if (!trimmedToken) {
      setAdminError("Please enter your admin token");
      setAdminLoading(false);
      return;
    }
    
    try {
      const response = await fetch("/api/admin/verify-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: trimmedToken })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        sessionStorage.setItem("adminVerified", "true");
        if (data.sessionToken) {
          sessionStorage.setItem("adminSessionToken", data.sessionToken);
        }
        setLocation("/admin");
      } else if (response.status === 500) {
        setAdminError("Admin access not configured. Please set the ADMIN_TOKEN secret.");
      } else {
        setAdminError(data.message || "Invalid admin token. Please check and try again.");
      }
    } catch (err) {
      console.error("[Admin Login]", err);
      setAdminError("Connection error. Please try again.");
    } finally {
      setAdminLoading(false);
    }
  };

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
      title: "Set Up Your Space",
      description: "Choose what feels relevant — skip anything that doesn't",
      link: "/login"
    },
    {
      icon: MessageCircle,
      title: "Explore at Your Pace",
      description: "Journal, reflect, or talk with the AI companion — whatever suits the day",
      link: "/chat"
    },
    {
      icon: TrendingUp,
      title: "Check In When You Want",
      description: "Your patterns are tracked privately, available whenever you're curious",
      link: "/dashboard"
    }
  ];

  const testimonials = [
    {
      initial: "S",
      name: "Sarah M.",
      text: "I use this when I need to think something through. The AI companion doesn't tell me what to do — it just reflects things back in a way that helps me see more clearly.",
      role: "Teacher"
    },
    {
      initial: "J",
      name: "James K.",
      text: "The mood tracking helped me notice patterns I wasn't seeing on my own. I don't use it every day, but when I do, it's useful.",
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
      description: "Track how you're feeling over time with mood patterns, reflection history, and progress insights"
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Share anonymous affirmations and read others' — a quiet, moderated space with no social pressure"
    },
    {
      icon: BookOpen,
      title: "Wisdom Library",
      description: "Browse reflection prompts, educational articles, and evidence-informed wellness concepts"
    },
    {
      icon: Shield,
      title: "Safe Space",
      description: "Private by default. No social feeds, no public profiles, no pressure to share"
    },
    {
      icon: Zap,
      title: "AI Companion",
      description: "An AI reflection partner available anytime — it listens, reflects back, and doesn't tell you what to do"
    }
  ];

  const faqs = [
    {
      question: "What is MyMentalHealthBuddy?",
      answer: "MyMentalHealthBuddy by The Genuine Love Project is a private wellness platform with journaling, mood tracking, guided reflection, and an AI companion. It's educational — not clinical — and designed for adults exploring self-awareness at their own pace."
    },
    {
      question: "Is my data private and secure?",
      answer: "Yes. Your entries are encrypted and private. We don't sell your data, we don't show ads, and we don't share your information with third parties."
    },
    {
      question: "How does the AI companion work?",
      answer: "It uses trauma-informed language principles to reflect what you share back to you with care. It won't diagnose, prescribe, or replace professional support — it's a thinking-out-loud space, not a therapist."
    },
    {
      question: "Do I have to pay?",
      answer: "Core tools — mood tracking, journaling, daily reflection, and community features — are free with no expiration. Pro adds unlimited AI conversations and additional tools. You can cancel Pro anytime with no penalties."
    },
    {
      question: "What if I stop using it for a while?",
      answer: "Nothing happens. There are no streaks to lose, no progress that resets, and no notifications asking you to come back. Your space stays exactly as you left it."
    }
  ];

  return (
    <div className="canva-landing min-h-screen">
      <SoftLaunchBanner />
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
        <div className="space-y-5">
          <a href="#home" onClick={() => setMobileMenuOpen(false)} className="block text-2xl font-serif font-semibold" style={{ color: 'var(--glp-sage-deep)' }} data-testid="mobile-nav-home">Home</a>
          <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block text-2xl font-serif font-semibold" style={{ color: 'var(--glp-sage-deep)' }} data-testid="mobile-nav-about">About</a>
          <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-2xl font-serif font-semibold" style={{ color: 'var(--glp-sage-deep)' }} data-testid="mobile-nav-features">Features</a>
          <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block text-2xl font-serif font-semibold" style={{ color: 'var(--glp-sage-deep)' }} data-testid="mobile-nav-faq">FAQ</a>
          <div className="pt-4 mt-4 border-t" style={{ borderColor: 'var(--glp-sage-20)' }}>
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--glp-sage)' }}>Explore</p>
            <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="block text-xl font-serif font-semibold mb-3" style={{ color: 'var(--glp-sage-deep)' }} data-testid="mobile-nav-blog">Blog</Link>
            <Link href="/community" onClick={() => setMobileMenuOpen(false)} className="block text-xl font-serif font-semibold mb-3" style={{ color: 'var(--glp-sage-deep)' }} data-testid="mobile-nav-community">Community</Link>
            <Link href="/learn" onClick={() => setMobileMenuOpen(false)} className="block text-xl font-serif font-semibold mb-3" style={{ color: 'var(--glp-sage-deep)' }} data-testid="mobile-nav-learn">Learn</Link>
            <Link href="/affirmations" onClick={() => setMobileMenuOpen(false)} className="block text-xl font-serif font-semibold mb-3" style={{ color: 'var(--glp-sage-deep)' }} data-testid="mobile-nav-affirmations">Affirmations</Link>
            <Link href="/crisis" onClick={() => setMobileMenuOpen(false)} className="block text-xl font-serif font-semibold" style={{ color: 'var(--glp-rose)' }} data-testid="mobile-nav-crisis">Crisis Help</Link>
          </div>
          <div className="pt-4 mt-4 border-t" style={{ borderColor: 'var(--glp-sage-30)' }}>
            <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="block text-lg font-semibold mb-4" style={{ color: 'var(--glp-sage)' }} data-testid="mobile-nav-pricing">Pricing</Link>
            {!isLoading && isAuthenticated() ? (
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <button className="btn-primary w-full" data-testid="button-mobile-dashboard">My Dashboard</button>
              </Link>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <button className="btn-primary w-full mb-3" data-testid="button-mobile-signin">Sign In</button>
                </Link>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <button className="btn-secondary w-full" data-testid="button-mobile-getstarted">Get Started</button>
                </Link>
              </>
            )}
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
                    alt="MyMentalHealthBuddy" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex flex-col leading-snug">
                  <span className="text-sm sm:text-lg lg:text-xl xl:text-2xl font-bold tracking-tight" style={{ color: 'var(--glp-sage-deep)' }}>
                    MyMentalHealthBuddy
                  </span>
                  <span className="text-[10px] sm:text-xs lg:text-[13px] font-semibold tracking-[0.12em] sm:tracking-[0.18em] uppercase mt-0.5" style={{ color: 'var(--glp-sage)' }}>
                    by The Genuine Love Project
                  </span>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation - Centered */}
            <nav className="hidden lg:flex items-center gap-2 xl:gap-3 absolute left-1/2 transform -translate-x-1/2">
              <a href="#home" className="px-4 xl:px-5 py-3 text-[14px] xl:text-[15px] font-semibold rounded-xl transition-all duration-200 hover:bg-[var(--glp-sage-10)]" style={{ color: 'var(--glp-sage-deep)' }} data-testid="nav-home">Home</a>
              <a href="#about" className="px-4 xl:px-5 py-3 text-[14px] xl:text-[15px] font-semibold rounded-xl transition-all duration-200 hover:bg-[var(--glp-sage-10)]" style={{ color: 'var(--glp-sage-deep)' }} data-testid="nav-about">About</a>
              <a href="#features" className="px-4 xl:px-5 py-3 text-[14px] xl:text-[15px] font-semibold rounded-xl transition-all duration-200 hover:bg-[var(--glp-sage-10)]" style={{ color: 'var(--glp-sage-deep)' }} data-testid="nav-features">Features</a>
              <Link href="/blog" className="px-4 xl:px-5 py-3 text-[14px] xl:text-[15px] font-semibold rounded-xl transition-all duration-200 hover:bg-[var(--glp-sage-10)]" style={{ color: 'var(--glp-sage-deep)' }} data-testid="nav-blog">Blog</Link>
              <Link href="/community" className="px-4 xl:px-5 py-3 text-[14px] xl:text-[15px] font-semibold rounded-xl transition-all duration-200 hover:bg-[var(--glp-sage-10)]" style={{ color: 'var(--glp-sage-deep)' }} data-testid="nav-community">Community</Link>
              <Link href="/learn" className="px-4 xl:px-5 py-3 text-[14px] xl:text-[15px] font-semibold rounded-xl transition-all duration-200 hover:bg-[var(--glp-sage-10)]" style={{ color: 'var(--glp-sage-deep)' }} data-testid="nav-learn">Learn</Link>
              <Link href="/crisis" className="px-4 xl:px-5 py-3 text-[14px] xl:text-[15px] font-semibold rounded-xl transition-all duration-200 hover:bg-[var(--glp-sage-10)]" style={{ color: 'var(--glp-sage-deep)' }} data-testid="nav-crisis">Crisis Help</Link>
              <Link href="/pricing" className="px-4 xl:px-5 py-3 text-[14px] xl:text-[15px] font-semibold rounded-xl transition-all duration-200 hover:bg-[var(--glp-sage-10)]" style={{ color: 'var(--glp-sage-deep)' }} data-testid="nav-pricing">Pricing</Link>
            </nav>

            {/* CTA Buttons - Right aligned */}
            <div className="flex items-center gap-5 sm:gap-6 shrink-0">
              {!isLoading && isAuthenticated() ? (
                <Link href="/dashboard">
                  <button 
                    className="inline-flex items-center gap-2.5 font-semibold text-[15px] lg:text-base px-6 lg:px-7 py-3 lg:py-3.5 rounded-full transition-all hover:opacity-90 hover:shadow-lg text-white"
                    style={{ background: 'linear-gradient(135deg, var(--glp-gold), var(--glp-gold-dark))', boxShadow: '0 4px 14px var(--glp-gold-30)' }}
                    data-testid="button-go-dashboard"
                  >
                    <Sparkles className="w-[18px] h-[18px] lg:w-5 lg:h-5" />
                    <span className="hidden sm:inline">My Dashboard</span>
                    <span className="sm:hidden">Dashboard</span>
                  </button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <button 
                      className="hidden md:inline-flex font-semibold text-[15px] lg:text-base px-6 lg:px-7 py-3 lg:py-3.5 rounded-full transition-all border-2 hover:bg-[var(--glp-sage-deep)] hover:text-white hover:shadow-md"
                      style={{ color: 'var(--glp-sage-deep)', borderColor: 'var(--glp-sage-deep)' }}
                      data-testid="button-signin"
                    >
                      Sign In
                    </button>
                  </Link>
                  <Link href="/login">
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
                </>
              )}

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
      <section id="home" className="relative py-16 md:py-20 lg:py-24 px-6 sm:px-8 overflow-hidden" style={{ background: 'linear-gradient(180deg, var(--glp-paper) 0%, var(--glp-sage-10) 50%, var(--glp-teal-50) 100%)' }}>
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div 
            className="decorative-orb sage animate-drift w-[500px] h-[500px] -top-32 -right-32"
            style={{ animationDelay: '0s' }}
          />
          <div 
            className="decorative-orb rose animate-drift w-[400px] h-[400px] -bottom-40 -left-40"
            style={{ animationDelay: '5s' }}
          />
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-30"
            style={{ background: 'radial-gradient(circle, var(--glp-sage-20) 0%, transparent 50%)' }}
          />
          
          <div className="floating-icon-container top-16 left-[8%] w-12 h-12 rounded-xl animate-float opacity-50 hidden md:flex" style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-teal-400))', boxShadow: '0 8px 24px var(--glp-sage-30)', animationDelay: '0s' }}>
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div className="floating-icon-container top-24 right-[12%] w-10 h-10 rounded-lg animate-float opacity-40 hidden md:flex" style={{ background: 'linear-gradient(135deg, var(--glp-rose), var(--glp-blush))', boxShadow: '0 6px 20px var(--glp-rose-20)', animationDelay: '0.7s' }}>
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div className="floating-icon-container bottom-32 left-[6%] w-11 h-11 rounded-xl animate-float opacity-40 hidden lg:flex" style={{ background: 'linear-gradient(135deg, var(--glp-teal-500), var(--glp-sage-deep))', boxShadow: '0 8px 24px var(--glp-sage-30)', animationDelay: '1.2s' }}>
            <Brain className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center">
            {/* Badge */}
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 rounded-full mb-6 md:mb-10 shadow-lg animate-fade-in-up"
              style={{
                background: 'var(--glp-paper)',
                border: '2px solid var(--glp-sage-30)',
                boxShadow: '0 8px 32px var(--glp-sage-20)'
              }}
            >
              <Star className="w-4 h-4 md:w-5 md:h-5" style={{ color: 'var(--glp-gold)' }} fill="currentColor" />
              <span className="font-bold uppercase tracking-widest text-xs md:text-sm" style={{ color: 'var(--glp-sage-deep)' }}>
                A Quieter Kind of Wellness
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-4 md:mb-6 leading-[1.08] tracking-tight animate-fade-in-up" style={{ color: 'var(--glp-sage-deep)', animationDelay: '0.1s' }}>
              A Private Space
              <br />
              <span style={{ background: 'linear-gradient(135deg, var(--glp-sage-deep), var(--glp-gold), var(--glp-sage))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                for Honest Reflection
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-xl md:text-2xl font-serif mb-4 md:mb-6 animate-fade-in-up" style={{ color: 'var(--glp-sage-deep)', fontWeight: 600, animationDelay: '0.2s' }}>
              Wellness tools that respect your pace
            </p>

            {/* Description */}
            <p className="text-sm sm:text-base md:text-lg max-w-3xl mx-auto mb-6 md:mb-10 leading-relaxed animate-fade-in-up" style={{ color: 'var(--glp-ink)', opacity: 0.88, animationDelay: '0.3s', lineHeight: '1.7' }}>
              Most wellness apps want your attention. This one gives it back. Journaling, mood tracking, and AI-assisted reflection — built around how you actually feel, not how a product wants you to engage.
            </p>

            {/* Safety Box */}
            <div className="safe-space-box max-w-md mx-auto mb-6 md:mb-8 animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
              <div className="flex items-center justify-center gap-3">
                <Shield className="w-4 h-4 md:w-5 md:h-5" style={{ color: 'var(--glp-gold)' }} aria-hidden="true" />
                <span className="font-semibold text-sm md:text-base" style={{ color: 'var(--glp-sage-deep)' }}>You Are Safe Here</span>
                <Shield className="w-4 h-4 md:w-5 md:h-5" style={{ color: 'var(--glp-gold)' }} aria-hidden="true" />
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mb-8 md:mb-10 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              {!isLoading && isAuthenticated() ? (
                <Link href="/dashboard">
                  <button
                    className="btn-sacred-gold group inline-flex items-center gap-2 md:gap-3 font-bold text-base md:text-lg px-8 py-4 md:px-10 md:py-5"
                    data-testid="button-hero-dashboard"
                  >
                    <Sparkles className="w-5 h-5 md:w-6 md:h-6" aria-hidden="true" />
                    Go to My Dashboard
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </button>
                </Link>
              ) : (
                <Link href="/login">
                  <button
                    className="btn-sacred-gold group inline-flex items-center gap-2 md:gap-3 font-bold text-base md:text-lg px-8 py-4 md:px-10 md:py-5"
                    data-testid="button-hero-begin"
                  >
                    <Sparkles className="w-5 h-5 md:w-6 md:h-6" aria-hidden="true" />
                    Try It Free
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </button>
                </Link>
              )}
              <Link href="/pricing">
                <button 
                  className="inline-flex items-center gap-2 md:gap-3 font-bold text-sm md:text-lg px-6 py-3 md:px-10 md:py-5 rounded-full transition-all border-2 hover:bg-[var(--glp-sage-deep)] hover:text-white hover:-translate-y-1 hover:shadow-lg"
                  style={{ color: 'var(--glp-sage-deep)', borderColor: 'var(--glp-sage-deep)', boxShadow: '0 2px 8px var(--glp-sage-deep-12)' }}
                  data-testid="button-hero-explore"
                >
                  See What's Included
                </button>
              </Link>
            </div>
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-4xl mx-auto">
            <div className="text-center p-4 sm:p-8 rounded-2xl sm:rounded-3xl" style={{ background: 'var(--glp-white)', border: '1px solid var(--glp-sage-20)' }}>
              <div className="text-2xl sm:text-4xl md:text-5xl font-bold mb-1 md:mb-2 font-serif" style={{ background: 'linear-gradient(135deg, var(--glp-sage-deep), var(--glp-sage))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>$0</div>
              <p className="text-[10px] sm:text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--glp-sage-deep)' }}>
                Core Tools, Always Free
              </p>
            </div>
            <div className="text-center p-4 sm:p-8 rounded-2xl sm:rounded-3xl" style={{ background: 'var(--glp-white)', border: '1px solid var(--glp-gold-20)' }}>
              <div className="text-2xl sm:text-4xl md:text-5xl font-bold mb-1 md:mb-2 font-serif" style={{ background: 'linear-gradient(135deg, var(--glp-gold), var(--glp-gold-dark))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>500+</div>
              <p className="text-[10px] sm:text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--glp-sage-deep)' }}>
                Wellness Tools
              </p>
            </div>
            <div className="text-center p-4 sm:p-8 rounded-2xl sm:rounded-3xl" style={{ background: 'var(--glp-white)', border: '1px solid var(--glp-rose-20)' }}>
              <div className="text-2xl sm:text-4xl md:text-5xl font-bold mb-1 md:mb-2 font-serif" style={{ background: 'linear-gradient(135deg, var(--glp-sage-deep), var(--glp-teal-400))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>24/7</div>
              <p className="text-[10px] sm:text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--glp-sage-deep)' }}>
                AI Companion
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement Section */}
      <section 
        id="about" 
        className="py-8 md:py-12 px-4 md:px-6"
        style={{ background: 'linear-gradient(180deg, var(--glp-paper), var(--glp-sage-10))' }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div 
            className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl mb-4 md:mb-6"
            style={{ background: 'var(--metallic-gold)', boxShadow: '0 0 20px var(--metallic-gold-glow)' }}
          >
            <Heart className="w-6 h-6 md:w-7 md:h-7 text-white" aria-hidden="true" />
          </div>

          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-3 md:mb-5" style={{ color: 'var(--glp-sage-deep)' }}>
            Why This Exists
          </h2>

          <p 
            className="text-sm md:text-lg leading-relaxed max-w-3xl mx-auto"
            style={{ color: 'var(--glp-ink)' }}
          >
            Most wellness apps are built to maximize engagement. This one was built to respect it. No streaks to protect, no notifications pulling you back, no punishment for stepping away. The tools here are available when you want them and quiet when you don't.
          </p>

          {/* Values Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-10">
            <div className="flex sm:flex-col items-center sm:items-center gap-4 sm:gap-0 rounded-2xl p-4 sm:p-6 sm:text-center" style={{ background: 'var(--glp-white)', border: '1px solid var(--glp-sage-20)' }}>
              <div className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-xl sm:mx-auto sm:mb-4 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--glp-teal-400), var(--glp-sage-deep))' }}>
                <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-semibold mb-1 sm:mb-2" style={{ color: 'var(--glp-sage-deep)' }}>
                  No Streak Pressure
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--glp-ink)' }}>
                  Use the tools when they help. Skip a day, a week, a month — nothing resets.
                </p>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-center gap-4 sm:gap-0 rounded-2xl p-4 sm:p-6 sm:text-center" style={{ background: 'var(--glp-white)', border: '1px solid var(--glp-sage-20)' }}>
              <div className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-xl sm:mx-auto sm:mb-4 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))' }}>
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-semibold mb-1 sm:mb-2" style={{ color: 'var(--glp-sage-deep)' }}>
                  No Dark Patterns
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--glp-ink)' }}>
                  No guilt notifications, no manufactured urgency. Every interaction is opt-in.
                </p>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-center gap-4 sm:gap-0 rounded-2xl p-4 sm:p-6 sm:text-center" style={{ background: 'var(--glp-white)', border: '1px solid var(--glp-sage-20)' }}>
              <div className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-xl sm:mx-auto sm:mb-4 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--glp-rose), var(--glp-blush))' }}>
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-semibold mb-1 sm:mb-2" style={{ color: 'var(--glp-sage-deep)' }}>
                  Your Data, Your Space
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--glp-ink)' }}>
                  Private by default. Your reflections belong to you — not an algorithm.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section id="features" className="py-8 md:py-12 px-4 md:px-6" style={{ background: 'var(--glp-paper)' }}>
        <div className="max-w-[1200px] mx-auto px-2 md:px-8">
          <div className="text-center mb-6 md:mb-10">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-3" style={{ color: 'var(--glp-sage-deep)' }}>
              What's Available
            </h2>
            <p className="text-lg max-w-3xl mx-auto" style={{ color: 'var(--glp-ink)' }}>
              Use what resonates. Ignore what doesn't. Everything here is optional.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <div key={index} className="rounded-2xl p-4 md:p-6 group transition-all duration-300 hover:-translate-y-1" style={{ background: 'var(--glp-white)', border: '1px solid var(--glp-sage-20)', boxShadow: '0 4px 16px var(--glp-sage-10)' }}>
                <div className="mb-3 md:mb-5 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl transition-all group-hover:shadow-lg" style={{ background: 'linear-gradient(135deg, var(--glp-sage-20), var(--glp-rose-15))', boxShadow: '0 4px 12px var(--glp-sage-20)' }}>
                  <feature.icon className="w-5 h-5 md:w-6 md:h-6" style={{ color: 'var(--glp-sage-deep)' }} strokeWidth={2} aria-hidden="true" />
                </div>
                <h3 className="text-base md:text-xl font-serif font-semibold mb-1 md:mb-2" style={{ color: 'var(--glp-sage-deep)' }}>
                  {feature.title}
                </h3>
                <p className="text-xs md:text-sm leading-relaxed mb-3 md:mb-4" style={{ color: 'var(--glp-ink)' }}>
                  {feature.description}
                </p>
                <Link href="/login" data-testid={`link-feature-${index}`} className="inline-flex items-center text-xs md:text-sm font-semibold cursor-pointer transition-colors hover:opacity-80" style={{ color: 'var(--glp-gold)' }}>
                    Explore
                    <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 ml-1" aria-hidden="true" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-8 md:py-12 px-4 md:px-6" style={{ background: 'linear-gradient(180deg, var(--glp-paper), var(--glp-sage-10))' }}>
        <div className="max-w-[1200px] mx-auto px-2 md:px-8">
          <div className="text-center mb-6 md:mb-10">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-3" style={{ color: 'var(--glp-sage-deep)' }}>
              How It Works
            </h2>
            <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: 'var(--glp-ink)' }}>
              Three ways to get oriented — no commitments
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-stretch justify-center gap-4 md:gap-6">
            {steps.map((step, index) => (
              <Link 
                key={index} 
                href={step.link}
                className="flex items-center gap-4 md:flex-col md:items-center md:text-center md:max-w-xs mx-auto group cursor-pointer transition-transform duration-300 hover:scale-[1.02] md:hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-2xl p-4 md:p-6" 
                style={{ '--tw-ring-color': 'var(--glp-sage)', background: 'var(--glp-white)', border: '1px solid var(--glp-sage-15)' }}
                data-testid={`step-card-${index}`}
                aria-label={`${step.title} - ${step.description}`}
              >
                <div className="relative shrink-0">
                  <div 
                    className="w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center text-base md:text-lg font-bold text-white"
                    style={{ background: 'var(--metallic-gold)', boxShadow: '0 0 16px var(--metallic-gold-glow)' }}
                    aria-hidden="true"
                  >
                    {index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 left-full w-20 h-0.5" style={{ background: 'linear-gradient(90deg, var(--glp-gold), transparent)' }} aria-hidden="true" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-serif font-semibold mb-1 group-hover:underline" style={{ color: 'var(--glp-sage-deep)' }}>
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--glp-ink)' }}>
                    {step.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section 
        className="py-8 md:py-12 px-4 md:px-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, var(--glp-paper), var(--glp-rose-15))' }}
      >
        <div className="max-w-[1200px] mx-auto px-2 md:px-8 relative z-10">
          <div className="text-center mb-6 md:mb-10">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-2" style={{ color: 'var(--glp-sage-deep)' }}>
              What People Say
            </h2>
            <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: 'var(--glp-ink)' }}>
              From people who use the platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="rounded-2xl p-6 md:p-8"
                style={{ 
                  background: 'var(--glp-white)',
                  border: '1px solid var(--glp-sage-20)',
                  boxShadow: '0 4px 16px var(--glp-sage-10)'
                }}
                data-testid={`testimonial-${index}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-base md:text-lg text-white shrink-0"
                    style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))' }}
                    aria-hidden="true"
                  >
                    {testimonial.initial}
                  </div>
                  <div>
                    <p className="font-semibold text-sm md:text-base" style={{ color: 'var(--glp-sage-deep)' }}>{testimonial.name}</p>
                    <p className="text-xs md:text-sm" style={{ color: 'var(--glp-sage)' }}>{testimonial.role}</p>
                  </div>
                </div>
                <p className="leading-relaxed italic text-sm md:text-base" style={{ color: 'var(--glp-ink)' }}>
                  "{testimonial.text}"
                </p>
              </div>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-3 mt-10">
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

        </div>
      </section>

      {/* FAQ Section */}
      <section 
        id="faq" 
        className="py-8 md:py-12 px-6"
        style={{ background: 'linear-gradient(180deg, var(--glp-sage-10), var(--glp-paper))' }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-6 md:mb-10">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-3" style={{ color: 'var(--glp-sage-deep)' }}>
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
      <section className="py-10 md:py-14 px-6 text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--glp-sage-deep), var(--glp-sage))' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        </div>
        <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center justify-center text-center py-4 md:py-8">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 md:px-8 md:py-4 rounded-full bg-white/10 backdrop-blur-sm mb-6 md:mb-10 border border-white/15">
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-[var(--glp-gold)]" />
            <span className="text-sm sm:text-lg md:text-xl text-white/90 font-medium tracking-wide">A place to begin, whenever you're ready</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-3 md:mb-5 text-white leading-tight text-center">
            If This Feels
            <br />
            <span className="text-[var(--glp-gold)]" style={{ textShadow: '0 2px 20px rgba(234, 195, 59, 0.3)' }}>Right, Come In</span>
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl mt-1 mb-6 md:mb-10 text-white/80 max-w-3xl mx-auto font-light leading-relaxed text-center">
            Free to start. Free to pause. Free to leave. Always here if you come back.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-5">
            {!isLoading && isAuthenticated() ? (
              <Link href="/dashboard">
                <button
                  className="group inline-flex items-center gap-2 md:gap-3 px-8 py-4 md:px-10 md:py-5 rounded-full font-bold text-base md:text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  style={{
                    background: 'var(--glp-white)',
                    color: 'var(--glp-gold-dark, #c49a2d)',
                    boxShadow: '0 0 25px rgba(234, 195, 59, 0.3), 0 8px 32px rgba(0,0,0,0.2)'
                  }}
                  data-testid="button-final-dashboard"
                >
                  <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                  My Dashboard
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
            ) : (
              <Link href="/login">
                <button
                  className="group inline-flex items-center gap-2 md:gap-3 px-8 py-4 md:px-10 md:py-5 rounded-full font-bold text-base md:text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  style={{
                    background: 'var(--glp-white)',
                    color: 'var(--glp-gold-dark, #c49a2d)',
                    boxShadow: '0 0 25px rgba(234, 195, 59, 0.3), 0 8px 32px rgba(0,0,0,0.2)'
                  }}
                  data-testid="button-final-cta"
                >
                  <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                  Try It Free
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
            )}
            <Link href="/pricing">
              <button 
                className="group inline-flex items-center gap-2 md:gap-3 px-8 py-4 md:px-10 md:py-5 rounded-full font-bold text-base md:text-lg transition-all duration-300 hover:scale-105 border-2"
                style={{
                  background: 'transparent',
                  color: 'var(--glp-gold)',
                  borderColor: 'rgba(234, 195, 59, 0.5)',
                  boxShadow: '0 0 15px rgba(234, 195, 59, 0.15)'
                }}
                data-testid="button-view-pricing"
              >
                View Pricing
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6" style={{ background: 'var(--glp-paper)', borderTop: '1px solid var(--glp-sage-15)' }}>
        <div className="max-w-[1100px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-4" style={{ color: 'var(--glp-sage-deep)' }}>Platform</h4>
              <div className="space-y-2 text-sm">
                <Link href="/crm" className="block hover:underline transition-colors" style={{ color: 'var(--glp-ink)' }} data-testid="link-footer-dashboard">Dashboard</Link>
                <Link href="/onboarding" className="block hover:underline transition-colors" style={{ color: 'var(--glp-ink)' }} data-testid="link-footer-onboarding">Get Started</Link>
                <Link href="/pricing" className="block hover:underline transition-colors" style={{ color: 'var(--glp-ink)' }} data-testid="link-footer-pricing">Pricing</Link>
                <Link href="/tools" className="block hover:underline transition-colors" style={{ color: 'var(--glp-ink)' }} data-testid="link-footer-tools">Tools Library</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-4" style={{ color: 'var(--glp-sage-deep)' }}>Resources</h4>
              <div className="space-y-2 text-sm">
                <Link href="/blog" className="block hover:underline transition-colors" style={{ color: 'var(--glp-ink)' }} data-testid="link-footer-blog">Blog</Link>
                <Link href="/community" className="block hover:underline transition-colors" style={{ color: 'var(--glp-ink)' }} data-testid="link-footer-community">Community</Link>
                <Link href="/learn" className="block hover:underline transition-colors" style={{ color: 'var(--glp-ink)' }} data-testid="link-footer-learn">Learn & Grow</Link>
                <Link href="/affirmations" className="block hover:underline transition-colors" style={{ color: 'var(--glp-ink)' }} data-testid="link-footer-affirmations">Affirmation Wall</Link>
                <Link href="/crisis" className="block hover:underline transition-colors" style={{ color: 'var(--glp-ink)' }} data-testid="link-footer-crisis">Crisis Support</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-4" style={{ color: 'var(--glp-sage-deep)' }}>Learn</h4>
              <div className="space-y-2 text-sm">
                <Link href="/content-index" className="block hover:underline transition-colors" style={{ color: 'var(--glp-ink)' }} data-testid="link-footer-content">A–Z Directory</Link>
                <Link href="/study-vault" className="block hover:underline transition-colors" style={{ color: 'var(--glp-ink)' }} data-testid="link-footer-study-vault">Study Vault</Link>
                <Link href="/qa" className="block hover:underline transition-colors" style={{ color: 'var(--glp-ink)' }} data-testid="link-footer-qa">Q&A Community</Link>
                <Link href="/chat" className="block hover:underline transition-colors" style={{ color: 'var(--glp-ink)' }} data-testid="link-footer-chat">AI Companion</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-4" style={{ color: 'var(--glp-sage-deep)' }}>Legal</h4>
              <div className="space-y-2 text-sm">
                <Link href="/privacy" className="block hover:underline transition-colors" style={{ color: 'var(--glp-ink)' }} data-testid="link-footer-privacy">Privacy Policy</Link>
                <Link href="/terms" className="block hover:underline transition-colors" style={{ color: 'var(--glp-ink)' }} data-testid="link-footer-terms">Terms of Service</Link>
                <Link href="/accessibility" className="block hover:underline transition-colors" style={{ color: 'var(--glp-ink)' }} data-testid="link-footer-accessibility">Accessibility</Link>
                <Link href="/contact" className="block hover:underline transition-colors" style={{ color: 'var(--glp-ink)' }} data-testid="link-footer-contact">Contact Us</Link>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderTop: '1px solid var(--glp-sage-15)' }}>
            <p className="text-xs" style={{ color: 'var(--glp-sage)' }}>
              © {new Date().getFullYear()} MyMentalHealthBuddy by The Genuine Love Project. All rights reserved.
            </p>
            <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--glp-sage)' }}>
              <span>Built with care.</span>
              <Heart className="w-3 h-3" style={{ color: 'var(--glp-blush)' }} fill="currentColor" />
              <span>No ads. No data sales.</span>
            </div>
          </div>
          <SafetyFooter variant="compact" className="mt-4" />
        </div>
      </footer>

      {/* Admin Access Section - Discrete at bottom */}
      <section className="py-4 px-6" style={{ background: 'var(--glp-teal-800)' }}>
        <div className="max-w-md mx-auto text-center">
          {!showAdminLogin ? (
            <button
              onClick={() => setShowAdminLogin(true)}
              className="inline-flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-lg transition-all opacity-40 hover:opacity-100"
              style={{ color: 'var(--glp-teal-200)', background: 'var(--glp-teal-700)' }}
              data-testid="button-admin-toggle"
            >
              <Settings className="w-3 h-3" />
              Admin Access
            </button>
          ) : (
            <div 
              className="p-6 rounded-2xl animate-fade-in-up"
              style={{ 
                background: 'linear-gradient(135deg, var(--glp-teal-700), var(--glp-sage-deep))',
                border: '1px solid var(--glp-teal-500)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.3)'
              }}
            >
              <div className="flex items-center justify-center gap-3 mb-5">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-teal-400))', boxShadow: '0 4px 16px var(--glp-sage-30)' }}
                >
                  <KeyRound className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-lg text-white">Admin Portal</h4>
                  <p className="text-xs" style={{ color: 'var(--glp-teal-200)' }}>Platform management access</p>
                </div>
              </div>
              
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="relative">
                  <input
                    type="password"
                    value={adminToken}
                    onChange={(e) => setAdminToken(e.target.value)}
                    placeholder="Enter admin token"
                    className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2"
                    style={{ 
                      background: 'var(--glp-teal-600)',
                      color: 'white',
                      border: '1px solid var(--glp-teal-500)',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
                    }}
                    data-testid="input-admin-token"
                    autoComplete="off"
                  />
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--glp-teal-300)' }} />
                </div>
                
                {adminError && (
                  <p className="text-sm font-medium px-3 py-2 rounded-lg" style={{ background: 'rgba(244,199,195,0.2)', color: 'var(--glp-blush)' }}>
                    {adminError}
                  </p>
                )}
                
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={adminLoading || !adminToken}
                    className="flex-1 inline-flex items-center justify-center gap-2 font-semibold py-3 rounded-xl transition-all disabled:opacity-50"
                    style={{ 
                      background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))',
                      color: 'white',
                      boxShadow: '0 4px 16px var(--glp-sage-30)'
                    }}
                    data-testid="button-admin-submit"
                  >
                    {adminLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin motion-reduce:animate-none" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4" />
                        Access Dashboard
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAdminLogin(false);
                      setAdminToken("");
                      setAdminError("");
                    }}
                    className="px-4 py-3 rounded-xl transition-all hover:bg-[var(--glp-teal-600)]"
                    style={{ color: 'var(--glp-teal-200)' }}
                    data-testid="button-admin-cancel"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </form>
              
              <p className="text-xs mt-4" style={{ color: 'var(--glp-teal-300)' }}>
                For authorized personnel only. All access attempts are logged.
              </p>
            </div>
          )}
        </div>
      </section>

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
