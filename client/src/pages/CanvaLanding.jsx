import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Link, useLocation } from "wouter";
import { Heart, Lightbulb, Users, Zap, Smile, BarChart3, BookOpen, Shield, Star, ChevronDown, Menu, X, ArrowRight, ArrowUp, Lock, Clock, Sparkles, PenLine, MessageCircle, TrendingUp, Leaf, Sun, Moon, Flower2, Brain, Eye, KeyRound, Settings } from "lucide-react";
import "../styles/canva-landing.css";
import QuoteBlock from "../components/ui/QuoteBlock.jsx";
import SafetyFooter from "../components/ui/SafetyFooter";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import SacredBackground, { SacredDivider, GlowingHeartLogo } from "../components/sacred/SacredBackground";
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
      question: "What is The Genuine Love Project?",
      answer: "A private wellness platform with journaling, mood tracking, guided reflection, and an AI companion. It's educational — not clinical — and designed for adults exploring self-awareness at their own pace."
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
      <section id="home" className="relative py-20 md:py-28 lg:py-36 px-6 sm:px-8 overflow-hidden" style={{ background: 'linear-gradient(180deg, var(--glp-paper) 0%, var(--glp-sage-10) 50%, var(--glp-teal-50) 100%)' }}>
        {/* Sacred Geometry Background */}
        <SacredBackground variant="hero" opacity={0.15} />
        
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          {/* Large ambient orbs with drift animation */}
          <div 
            className="decorative-orb sage animate-drift w-[600px] h-[600px] -top-32 -right-32"
            style={{ animationDelay: '0s' }}
          />
          <div 
            className="decorative-orb rose animate-drift w-[500px] h-[500px] -bottom-40 -left-40"
            style={{ animationDelay: '5s' }}
          />
          <div 
            className="decorative-orb teal animate-drift w-[400px] h-[400px] top-1/4 left-1/4"
            style={{ animationDelay: '10s' }}
          />
          <div 
            className="decorative-orb gold animate-drift w-[300px] h-[300px] bottom-1/4 right-1/4"
            style={{ animationDelay: '15s' }}
          />
          
          {/* Central radial glow */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full opacity-40"
            style={{ background: 'radial-gradient(circle, var(--glp-sage-20) 0%, transparent 50%)' }}
          />
          
          {/* Floating Decorative Icons - Enhanced positioning and variety */}
          <div className="floating-icon-container top-16 left-[8%] w-14 h-14 rounded-2xl animate-float opacity-70" style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-teal-400))', boxShadow: '0 10px 30px var(--glp-sage-40)', animationDelay: '0s' }}>
            <Leaf className="w-7 h-7 text-white" />
          </div>
          <div className="floating-icon-container top-24 right-[12%] w-12 h-12 rounded-xl animate-float opacity-60" style={{ background: 'linear-gradient(135deg, var(--glp-rose), var(--glp-blush))', boxShadow: '0 8px 24px var(--glp-rose-30)', animationDelay: '0.7s' }}>
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div className="floating-icon-container bottom-32 left-[6%] w-16 h-16 rounded-2xl animate-float opacity-50" style={{ background: 'linear-gradient(135deg, var(--glp-teal-500), var(--glp-sage-deep))', boxShadow: '0 12px 36px var(--glp-sage-deep-40)', animationDelay: '1.2s' }}>
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div className="floating-icon-container bottom-20 right-[10%] w-13 h-13 rounded-xl animate-float opacity-55" style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))', boxShadow: '0 8px 24px var(--glp-sage-30)', animationDelay: '1.8s' }}>
            <Flower2 className="w-6 h-6 text-white" />
          </div>
          <div className="floating-icon-container top-[45%] left-[3%] w-10 h-10 rounded-lg animate-float opacity-40" style={{ background: 'linear-gradient(135deg, var(--glp-gold), var(--glp-gold-dark))', boxShadow: '0 6px 20px var(--glp-gold-30)', animationDelay: '2.3s' }}>
            <Sun className="w-5 h-5 text-white" />
          </div>
          <div className="floating-icon-container top-[30%] right-[4%] w-11 h-11 rounded-xl animate-float opacity-45" style={{ background: 'linear-gradient(135deg, var(--glp-teal-300), var(--glp-teal-500))', boxShadow: '0 6px 20px var(--glp-sage-30)', animationDelay: '2.8s' }}>
            <Eye className="w-5 h-5 text-white" />
          </div>
          
          {/* Additional floating icons for depth */}
          <div className="floating-icon-container top-[60%] right-[18%] w-9 h-9 rounded-lg animate-float opacity-35" style={{ background: 'linear-gradient(135deg, var(--glp-sage-400), var(--glp-sage-600))', boxShadow: '0 4px 16px var(--glp-sage-20)', animationDelay: '3.2s' }}>
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="floating-icon-container bottom-[55%] left-[15%] w-8 h-8 rounded-lg animate-float opacity-30" style={{ background: 'linear-gradient(135deg, var(--glp-blush), var(--glp-rose))', boxShadow: '0 4px 14px var(--glp-rose-20)', animationDelay: '3.7s' }}>
            <Star className="w-4 h-4 text-white" />
          </div>
          <div className="floating-icon-container top-[70%] left-[20%] w-10 h-10 rounded-xl animate-float opacity-35" style={{ background: 'linear-gradient(135deg, var(--glp-teal-400), var(--glp-sage))', boxShadow: '0 6px 18px var(--glp-sage-30)', animationDelay: '4.1s' }}>
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <div className="floating-icon-container top-[15%] left-[25%] w-9 h-9 rounded-lg animate-float opacity-30" style={{ background: 'linear-gradient(135deg, var(--glp-sage-deep), var(--glp-teal-500))', boxShadow: '0 4px 16px var(--glp-sage-deep-20)', animationDelay: '4.5s' }}>
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div className="floating-icon-container bottom-[40%] right-[6%] w-11 h-11 rounded-xl animate-float opacity-40" style={{ background: 'linear-gradient(135deg, var(--glp-rose-400), var(--glp-rose))', boxShadow: '0 6px 20px var(--glp-rose-30)', animationDelay: '4.9s' }}>
            <Zap className="w-5 h-5 text-white" />
          </div>
          
          {/* Sparkle dots scattered */}
          <div className="absolute top-[25%] left-[30%] w-2 h-2 rounded-full animate-sparkle" style={{ background: 'var(--glp-gold)', boxShadow: '0 0 8px var(--glp-gold)' }} />
          <div className="absolute top-[40%] right-[25%] w-1.5 h-1.5 rounded-full animate-sparkle" style={{ background: 'var(--glp-sage)', boxShadow: '0 0 6px var(--glp-sage)', animationDelay: '0.5s' }} />
          <div className="absolute bottom-[35%] left-[35%] w-2 h-2 rounded-full animate-sparkle" style={{ background: 'var(--glp-teal-400)', boxShadow: '0 0 8px var(--glp-teal-400)', animationDelay: '1s' }} />
          <div className="absolute top-[55%] right-[35%] w-1.5 h-1.5 rounded-full animate-sparkle" style={{ background: 'var(--glp-rose)', boxShadow: '0 0 6px var(--glp-rose)', animationDelay: '1.5s' }} />
          <div className="absolute bottom-[25%] right-[40%] w-2 h-2 rounded-full animate-sparkle" style={{ background: 'var(--glp-gold)', boxShadow: '0 0 8px var(--glp-gold)', animationDelay: '2s' }} />
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
                A Quieter Kind of Wellness
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold mb-8 leading-[1.05] tracking-tight animate-fade-in-up" style={{ color: 'var(--glp-sage-deep)', animationDelay: '0.1s' }}>
              A Private Space
              <br />
              <span style={{ background: 'linear-gradient(135deg, var(--glp-sage-deep), var(--glp-gold), var(--glp-sage))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                for Honest Reflection
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl sm:text-2xl md:text-3xl font-serif mb-8 animate-fade-in-up" style={{ color: 'var(--glp-sage-deep)', fontWeight: 600, animationDelay: '0.2s' }}>
              Wellness tools that respect your pace
            </p>

            {/* Description */}
            <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in-up" style={{ color: 'var(--glp-ink)', animationDelay: '0.3s' }}>
              Most wellness apps want your attention. This one gives it back. Journaling, mood tracking, and AI-assisted reflection — built around how you actually feel, not how a product wants you to engage.
            </p>

            {/* Safety Box */}
            <div className="safe-space-box max-w-md mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
              <div className="flex items-center justify-center gap-3">
                <Shield className="w-5 h-5" style={{ color: 'var(--glp-gold)' }} aria-hidden="true" />
                <span className="font-semibold" style={{ color: 'var(--glp-sage-deep)' }}>You Are Safe Here</span>
                <Shield className="w-5 h-5" style={{ color: 'var(--glp-gold)' }} aria-hidden="true" />
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-20 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              {!isLoading && isAuthenticated() ? (
                <Link href="/dashboard">
                  <button
                    className="btn-sacred-gold group inline-flex items-center gap-3 font-bold text-lg px-10 py-5"
                    data-testid="button-hero-dashboard"
                  >
                    <Sparkles className="w-6 h-6" aria-hidden="true" />
                    Go to My Dashboard
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </button>
                </Link>
              ) : (
                <Link href="/login">
                  <button
                    className="btn-sacred-gold group inline-flex items-center gap-3 font-bold text-lg px-10 py-5"
                    data-testid="button-hero-begin"
                  >
                    <Sparkles className="w-6 h-6" aria-hidden="true" />
                    Try It Free
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </button>
                </Link>
              )}
              <Link href="/pricing">
                <button 
                  className="inline-flex items-center gap-3 font-bold text-lg px-10 py-5 rounded-full transition-all border-2 hover:bg-[var(--glp-sage-deep)] hover:text-white hover:-translate-y-1"
                  style={{ color: 'var(--glp-sage-deep)', borderColor: 'var(--glp-sage-deep)' }}
                  data-testid="button-hero-explore"
                >
                  See What's Included
                </button>
              </Link>
            </div>
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            <div className="glass-card text-center p-5 sm:p-8 rounded-3xl" style={{ border: '1px solid var(--glp-sage-20)' }}>
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 font-serif" style={{ background: 'linear-gradient(135deg, var(--glp-sage-deep), var(--glp-sage))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>$0</div>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--glp-sage-deep)' }}>
                Core Tools, Always Free
              </p>
            </div>
            <div className="glass-card text-center p-5 sm:p-8 rounded-3xl" style={{ border: '1px solid var(--glp-gold-20)' }}>
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 font-serif" style={{ background: 'linear-gradient(135deg, var(--glp-gold), var(--glp-gold-dark))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>500+</div>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--glp-sage-deep)' }}>
                Wellness Tools
              </p>
            </div>
            <div className="glass-card text-center p-5 sm:p-8 rounded-3xl" style={{ border: '1px solid var(--glp-rose-20)' }}>
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 font-serif" style={{ background: 'linear-gradient(135deg, var(--glp-sage-deep), var(--glp-teal-400))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>24/7</div>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--glp-sage-deep)' }}>
                AI Companion
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sacred Divider */}
      <SacredDivider icon={Flower2} />

      {/* Mission Statement Section */}
      <section 
        id="about" 
        className="py-20 px-6"
        style={{ background: 'linear-gradient(180deg, var(--glp-paper), var(--glp-sage-10))' }}
      >
        <div className="max-w-5xl mx-auto text-center">
          <div 
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-8 sacred-pulse"
            style={{ background: 'var(--metallic-gold)', boxShadow: '0 0 30px var(--metallic-gold-glow), inset 0 1px 0 rgba(255,255,255,0.3)', border: '2px solid var(--glp-gold)' }}
          >
            <Heart className="w-8 h-8 text-white drop-shadow-sm" aria-hidden="true" />
          </div>

          <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6" style={{ color: 'var(--glp-sage-deep)' }}>
            Why This Exists
          </h2>

          <p 
            className="text-xl md:text-2xl leading-relaxed font-serif max-w-4xl mx-auto"
            style={{ color: 'var(--glp-ink)' }}
          >
            Most wellness apps are built to maximize engagement. This one was built to respect it. There are no streaks to protect, no notifications designed to pull you back, and no punishment for stepping away. The tools here — journaling, mood tracking, guided reflection, AI-assisted conversation — are available when you want them and quiet when you don't.
          </p>

          {/* Values Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="reveal">
              <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-transform hover:scale-105" style={{ background: 'linear-gradient(135deg, var(--glp-teal-400), var(--glp-sage-deep))', boxShadow: '0 6px 20px var(--glp-sage-30), inset 0 1px 0 rgba(255,255,255,0.2)', border: '2px solid var(--glp-teal-300)' }}>
                <Lightbulb className="w-7 h-7 text-white drop-shadow-sm" />
              </div>
              <h3 className="font-serif text-2xl font-semibold mb-3" style={{ color: 'var(--glp-sage-deep)' }}>
                No Streak Pressure
              </h3>
              <p className="leading-relaxed" style={{ color: 'var(--glp-ink)' }}>
                Use the tools when they help. Skip a day, a week, a month — nothing resets, nothing is lost.
              </p>
            </div>

            <div className="reveal" style={{ animationDelay: '0.2s' }}>
              <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-transform hover:scale-105" style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))', boxShadow: '0 6px 20px var(--glp-sage-30), inset 0 1px 0 rgba(255,255,255,0.2)', border: '2px solid var(--glp-sage)' }}>
                <Users className="w-7 h-7 text-white drop-shadow-sm" />
              </div>
              <h3 className="font-serif text-2xl font-semibold mb-3" style={{ color: 'var(--glp-sage-deep)' }}>
                No Dark Patterns
              </h3>
              <p className="leading-relaxed" style={{ color: 'var(--glp-ink)' }}>
                No guilt notifications, no manufactured urgency, no manipulative design. Every interaction is opt-in.
              </p>
            </div>

            <div className="reveal" style={{ animationDelay: '0.4s' }}>
              <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-transform hover:scale-105" style={{ background: 'linear-gradient(135deg, var(--glp-rose), var(--glp-blush))', boxShadow: '0 6px 20px var(--glp-rose-20), inset 0 1px 0 rgba(255,255,255,0.2)', border: '2px solid var(--glp-rose)' }}>
                <Zap className="w-7 h-7 text-white drop-shadow-sm" />
              </div>
              <h3 className="font-serif text-2xl font-semibold mb-3" style={{ color: 'var(--glp-sage-deep)' }}>
                Your Data, Your Space
              </h3>
              <p className="leading-relaxed" style={{ color: 'var(--glp-ink)' }}>
                Private by default. Your reflections belong to you — not an algorithm, not a feed, not an advertiser.
              </p>
            </div>
          </div>

          {/* Centered decorative line below stages */}
          <div className="section-divider mx-auto mt-8" />
        </div>
      </section>

      {/* Featured Quote Section - QuoteBlock_1_Healing */}
      <section className="py-8 px-6" style={{ background: 'var(--glp-paper)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="quote-block" data-testid="quote-block-healing">
            <p className="quote-text relative z-10">
              The wound is the place where the Light enters you. Healing isn't about becoming 
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
              This Space Is Here When You Are
            </h3>
            <p className="text-lg max-w-2xl mx-auto mb-8" style={{ color: 'var(--glp-ink)' }}>
              There's no right time to start, no wrong way to use this, and no pressure to keep going. 
              Everything here works at your pace.
            </p>
            <Link href="/login">
              <button className="mission-cta" data-testid="cta-join-now">
                Get Started Free
                <ArrowRight className="inline ml-3 w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section id="features" className="py-20 px-6" style={{ background: 'var(--glp-paper)' }}>
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-4" style={{ color: 'var(--glp-sage-deep)' }}>
              What's Available
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--glp-ink)' }}>
              Use what resonates. Ignore what doesn't. Everything here is optional.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="glass-card rounded-3xl p-6 group scale-on-hover">
                <div className="mb-5 flex items-center justify-center w-12 h-12 max-w-[48px] rounded-2xl transition-all group-hover:shadow-lg" style={{ background: 'linear-gradient(135deg, var(--glp-sage-20), var(--glp-rose-15))', boxShadow: '0 4px 12px var(--glp-sage-20)' }}>
                  <feature.icon className="w-6 h-6" style={{ color: 'var(--glp-sage-deep)' }} strokeWidth={2} aria-hidden="true" />
                </div>
                <h3 className="text-xl font-serif font-semibold mb-2" style={{ color: 'var(--glp-sage-deep)' }}>
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--glp-ink)' }}>
                  {feature.description}
                </p>
                <Link href="/login" data-testid={`link-feature-${index}`} className="inline-flex items-center text-sm font-semibold cursor-pointer transition-colors hover:opacity-80" style={{ color: 'var(--glp-gold)' }}>
                    Explore
                    <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Sacred Divider */}
      <SacredDivider icon={Sparkles} />

      {/* How It Works Section */}
      <section className="py-20 px-6" style={{ background: 'linear-gradient(180deg, var(--glp-paper), var(--glp-sage-10))' }}>
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-4" style={{ color: 'var(--glp-sage-deep)' }}>
              How It Works
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--glp-ink)' }}>
              Three ways to get oriented — no commitments
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-start justify-center gap-8 mt-12">
            {steps.map((step, index) => (
              <Link 
                key={index} 
                href={step.link}
                className="flex flex-col items-center text-center max-w-xs mx-auto group cursor-pointer transition-transform duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2" 
                style={{ '--tw-ring-color': 'var(--glp-sage)' }}
                data-testid={`step-card-${index}`}
                aria-label={`${step.title} - ${step.description}`}
              >
                <div 
                  className="relative mb-6 sacred-pulse"
                  style={{ animationDelay: `${index * 0.5}s` }}
                >
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white transition-shadow duration-300 group-hover:shadow-lg"
                    style={{ background: 'var(--metallic-gold)', boxShadow: '0 0 20px var(--metallic-gold-glow)' }}
                    aria-hidden="true"
                  >
                    {index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 left-full w-24 h-0.5" style={{ background: 'linear-gradient(90deg, var(--glp-gold), transparent)' }} aria-hidden="true" />
                  )}
                </div>
                <div className="mb-4 flex justify-center">
                  <div className="w-12 h-12 max-w-[48px] rounded-xl flex items-center justify-center transition-all duration-300 group-hover:shadow-md" style={{ background: 'linear-gradient(135deg, var(--glp-sage-20), var(--glp-sage-10))', boxShadow: '0 4px 12px var(--glp-sage-20)', border: '2px solid var(--glp-sage-30)' }}>
                    <step.icon className="w-6 h-6" style={{ color: 'var(--glp-sage-deep)' }} strokeWidth={2} aria-hidden="true" />
                  </div>
                </div>
                <h3 className="text-xl font-serif font-semibold mb-2 group-hover:underline" style={{ color: 'var(--glp-sage-deep)' }}>
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--glp-ink)' }}>
                  {step.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section 
        className="py-20 px-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, var(--glp-paper), var(--glp-rose-15))' }}
      >
        <SacredBackground variant="flowerOfLife" opacity={0.08} />
        
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-4" style={{ color: 'var(--glp-sage-deep)' }}>
              What People Say
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--glp-ink)' }}>
              From people who use the platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="glass-card rounded-3xl p-8 animate-fade-in-scale"
                style={{ 
                  animationDelay: `${index * 0.2}s`,
                  background: 'var(--glp-white)',
                  border: '1px solid var(--glp-sage-20)',
                  boxShadow: '0 8px 32px var(--glp-sage-10)'
                }}
                data-testid={`testimonial-${index}`}
              >
                <div className="flex items-start gap-2 mb-4">
                  <span className="text-3xl font-serif" style={{ color: '#d4af37' }}>"</span>
                </div>
                <p className="mb-6 leading-relaxed italic text-lg" style={{ color: 'var(--glp-ink)' }}>
                  {testimonial.text}
                </p>
                <div className="flex items-center gap-4 pt-4" style={{ borderTop: '1px solid var(--glp-sage-15)' }}>
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-white"
                    style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))' }}
                    aria-hidden="true"
                  >
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
        <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center justify-center text-center py-16">
          {/* Lotus Accent */}
          <div className="w-full flex items-center justify-center mb-10" style={{ position: 'relative' }}>
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2" style={{ height: '2px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)' }}></div>
            <div className="relative rounded-full overflow-hidden ring-4 ring-white/20" style={{ width: '120px', height: '120px', background: 'var(--glp-white)', boxShadow: '0 12px 48px rgba(0,0,0,0.25)' }}>
              <img 
                src="/brand/footer-wellness-graphic.png" 
                alt="Lotus flower" 
                style={{ width: '120px', height: '120px', objectFit: 'cover' }}
              />
            </div>
          </div>

          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/10 backdrop-blur-sm mb-10 border border-white/15">
            <Sparkles className="w-5 h-5 text-[var(--glp-gold)]" />
            <span className="text-lg sm:text-xl text-white/90 font-medium tracking-wide">A place to begin, whenever you're ready</span>
          </div>
          
          {/* Main Heading */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 text-white leading-tight text-center">
            If This Feels
            <br />
            <span className="text-[var(--glp-gold)]" style={{ textShadow: '0 2px 20px rgba(234, 195, 59, 0.3)' }}>Right, Come In</span>
          </h2>
          
          {/* Subtext */}
          <p className="text-xl sm:text-2xl md:text-3xl mt-2 mb-14 text-white/80 max-w-3xl mx-auto font-light leading-relaxed text-center">
            Free to start. Free to pause. Free to leave. Always here if you come back.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            {!isLoading && isAuthenticated() ? (
              <Link href="/dashboard">
                <button
                  className="group inline-flex items-center gap-3 px-10 py-5 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  style={{
                    background: 'var(--glp-white)',
                    color: 'var(--glp-gold-dark, #c49a2d)',
                    boxShadow: '0 0 25px rgba(234, 195, 59, 0.3), 0 8px 32px rgba(0,0,0,0.2)'
                  }}
                  data-testid="button-final-dashboard"
                >
                  <Sparkles className="w-5 h-5" />
                  My Dashboard
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
            ) : (
              <Link href="/login">
                <button
                  className="group inline-flex items-center gap-3 px-10 py-5 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  style={{
                    background: 'var(--glp-white)',
                    color: 'var(--glp-gold-dark, #c49a2d)',
                    boxShadow: '0 0 25px rgba(234, 195, 59, 0.3), 0 8px 32px rgba(0,0,0,0.2)'
                  }}
                  data-testid="button-final-cta"
                >
                  <Sparkles className="w-5 h-5" />
                  Try It Free
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
            )}
            <Link href="/pricing">
              <button 
                className="group inline-flex items-center gap-3 px-10 py-5 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 border-2"
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

      {/* Explore Our Platform Section */}
      <section className="py-20 px-6" style={{ background: 'linear-gradient(180deg, var(--glp-sage-10) 0%, var(--glp-paper) 100%)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4" style={{ color: 'var(--glp-sage-deep)' }}>
              Explore Our Platform
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--glp-ink)' }}>
              Browse the full set of tools and resources — use what's useful, skip the rest
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
                <Link href="/mood"><div className="p-2 rounded-lg hover:bg-[var(--glp-sage-10)] cursor-pointer transition-all">Mood Tracker</div></Link>
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
                <Link href="/companion"><div className="p-2 rounded-lg hover:bg-[var(--glp-gold-10)] cursor-pointer transition-all">Wellness Companion</div></Link>
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
                <Link href="/atlas"><div className="p-2 rounded-lg hover:bg-[var(--glp-sage-10)] cursor-pointer transition-all">Intellectual Atlas</div></Link>
                <Link href="/cognitive-tools"><div className="p-2 rounded-lg hover:bg-[var(--glp-sage-10)] cursor-pointer transition-all">Cognitive Lab</div></Link>
                <Link href="/hubs/life-purpose"><div className="p-2 rounded-lg hover:bg-[var(--glp-sage-10)] cursor-pointer transition-all">Purpose Compass</div></Link>
                <Link href="/mastery"><div className="p-2 rounded-lg hover:bg-[var(--glp-sage-10)] cursor-pointer transition-all">Mastery Suite</div></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, var(--glp-paper) 0%, var(--glp-sage-10) 100%)', borderTop: '1px solid var(--glp-sage-15)' }}>
        <SacredBackground variant="footer" />
        
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 relative z-10">
          {/* Brand Logo Section - Now at Top */}
          <div className="flex flex-col items-center justify-center text-center pb-8 mb-8" style={{ borderBottom: '1px solid var(--glp-sage-15)' }}>
            <div className="flex items-center justify-center mb-4">
              <GlowingHeartLogo size={56} />
            </div>
            <h3 className="text-2xl font-serif font-bold mb-2" style={{ color: 'var(--glp-sage-deep)' }}>
              The Genuine Love Project
            </h3>
            <p className="text-lg text-center" style={{ color: 'var(--glp-sage)' }}>
              Wellness tools that respect your time, your privacy, and your pace
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
                <Link href="/blog"><div className="p-2.5 rounded-xl hover:bg-[var(--glp-gold-10)] cursor-pointer transition-all flex items-center justify-center sm:justify-start gap-3 group" data-testid="link-footer-blog"><div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'var(--glp-gold-20)' }}><ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" style={{ color: 'var(--glp-gold-dark)' }} /></div><span style={{ color: 'var(--glp-ink)' }}>Blog</span></div></Link>
                <Link href="/community"><div className="p-2.5 rounded-xl hover:bg-[var(--glp-gold-10)] cursor-pointer transition-all flex items-center justify-center sm:justify-start gap-3 group" data-testid="link-footer-community"><div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'var(--glp-gold-20)' }}><ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" style={{ color: 'var(--glp-gold-dark)' }} /></div><span style={{ color: 'var(--glp-ink)' }}>Community</span></div></Link>
                <Link href="/learn"><div className="p-2.5 rounded-xl hover:bg-[var(--glp-gold-10)] cursor-pointer transition-all flex items-center justify-center sm:justify-start gap-3 group" data-testid="link-footer-learn"><div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'var(--glp-gold-20)' }}><ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" style={{ color: 'var(--glp-gold-dark)' }} /></div><span style={{ color: 'var(--glp-ink)' }}>Learn & Grow</span></div></Link>
                <Link href="/affirmations"><div className="p-2.5 rounded-xl hover:bg-[var(--glp-gold-10)] cursor-pointer transition-all flex items-center justify-center sm:justify-start gap-3 group" data-testid="link-footer-affirmations"><div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'var(--glp-gold-20)' }}><ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" style={{ color: 'var(--glp-gold-dark)' }} /></div><span style={{ color: 'var(--glp-ink)' }}>Affirmation Wall</span></div></Link>
                <Link href="/content-index"><div className="p-2.5 rounded-xl hover:bg-[var(--glp-gold-10)] cursor-pointer transition-all flex items-center justify-center sm:justify-start gap-3 group" data-testid="link-footer-content"><div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'var(--glp-gold-20)' }}><ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" style={{ color: 'var(--glp-gold-dark)' }} /></div><span style={{ color: 'var(--glp-ink)' }}>A–Z Directory</span></div></Link>
                <Link href="/qa"><div className="p-2.5 rounded-xl hover:bg-[var(--glp-gold-10)] cursor-pointer transition-all flex items-center justify-center sm:justify-start gap-3 group" data-testid="link-footer-qa"><div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'var(--glp-gold-20)' }}><ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" style={{ color: 'var(--glp-gold-dark)' }} /></div><span style={{ color: 'var(--glp-ink)' }}>Q&A Community</span></div></Link>
                <Link href="/crisis"><div className="p-2.5 rounded-xl hover:bg-[var(--glp-gold-10)] cursor-pointer transition-all flex items-center justify-center sm:justify-start gap-3 group" data-testid="link-footer-crisis"><div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'var(--glp-gold-20)' }}><ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" style={{ color: 'var(--glp-gold-dark)' }} /></div><span style={{ color: 'var(--glp-ink)' }}>Crisis Support</span></div></Link>
                <Link href="/study-vault"><div className="p-2.5 rounded-xl hover:bg-[var(--glp-gold-10)] cursor-pointer transition-all flex items-center justify-center sm:justify-start gap-3 group" data-testid="link-footer-study-vault"><div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'var(--glp-gold-20)' }}><ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" style={{ color: 'var(--glp-gold-dark)' }} /></div><span style={{ color: 'var(--glp-ink)' }}>Study Vault</span></div></Link>
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
            <h4 className="font-serif font-bold text-xl mb-3" style={{ color: 'var(--glp-sage-deep)' }}>
              The Genuine Love Project
            </h4>
            <p className="text-sm leading-relaxed mb-4 max-w-md" style={{ color: 'var(--glp-ink)' }}>
              Private wellness tools, AI-assisted reflection, and a quiet community — available when you need them.
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
              <span>Built with care.</span>
              <Heart className="w-4 h-4" style={{ color: 'var(--glp-blush)' }} fill="currentColor" />
              <span>No ads. No data sales. Your reflections stay private.</span>
            </div>
          </div>
          <SafetyFooter variant="compact" className="mt-8" />
        </div>
      </footer>

      {/* Admin Access Section - Discrete at bottom */}
      <section className="py-8 px-6" style={{ background: 'var(--glp-teal-800)' }}>
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
