import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Link, useLocation } from "wouter";
import { Heart, Lightbulb, Users, Zap, Smile, BarChart3, BookOpen, Shield, Star, ChevronDown, Menu, X, ArrowRight, ArrowUp, Lock, Clock, Sparkles, PenLine, MessageCircle, TrendingUp, Leaf, Brain, KeyRound, Settings, Eye, Compass, Sun, Feather, Waves, Fingerprint, HeartHandshake, Infinity } from "lucide-react";
import "../styles/canva-landing.css";
import SafetyFooter from "../components/ui/SafetyFooter";
import SoftLaunchBanner from "../components/SoftLaunchBanner";

export default function CanvaLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [, setLocation] = useLocation();
  
  const { isAuthenticated, isLoading } = useAuth();
  
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
      icon: Feather,
      title: "Create Your Sacred Space",
      description: "In under a minute, you'll step into a private sanctuary designed around your emotional language, your rhythms, and your goals. Whether you're managing daily stress, building confidence, or deepening self-awareness — your space adapts to exactly where you are and what you need most right now.",
      link: "/login"
    },
    {
      icon: MessageCircle,
      title: "Meet Your Buddy",
      description: "Talk with your AI buddy — part coach, part mentor, part best friend. It listens deeply, remembers your story, and guides you with the wisdom of a teacher and the warmth of someone who genuinely believes in you. Journal, reflect, or simply process your day — every conversation builds clarity.",
      link: "/chat"
    },
    {
      icon: Eye,
      title: "Watch Yourself Evolve",
      description: "As patterns emerge, something profound shifts. You start seeing yourself with more honesty, more compassion, and more power. Confidence grows. Self-worth deepens. Stress becomes manageable. You're not just coping — you're evolving into the person you've always known you could be.",
      link: "/dashboard"
    }
  ];

  const testimonials = [
    {
      initial: "S",
      name: "Sarah M.",
      text: "Work stress was eating me alive and I couldn't see it. My buddy asked one question nobody else had thought to ask — and suddenly I understood why I'd been stuck for months. That single conversation changed my relationship with stress forever. I finally know how to catch myself before I spiral.",
      role: "Teacher & Mother",
      highlight: "changed my relationship with stress"
    },
    {
      initial: "J",
      name: "James K.",
      text: "I've always struggled with confidence — especially at work. Three weeks of mood tracking showed me a pattern I'd completely missed: I was undermining myself before anyone else could. That awareness was the turning point. Now I walk into meetings like I belong there, because I finally believe I do.",
      role: "Software Engineer",
      highlight: "I finally believe I do"
    },
    {
      initial: "M",
      name: "Maria L.",
      text: "After 12-hour shifts caring for others, I had nothing left for myself. My buddy doesn't just listen — it coaches me, guides me, and helps me rebuild my self-worth one conversation at a time. For the first time in years, I feel like I matter too. Not just as a caregiver. As a person.",
      role: "Healthcare Worker",
      highlight: "I feel like I matter too"
    },
    {
      initial: "D",
      name: "David R.",
      text: "Every wellness app wanted me to build habits. This one helped me understand why I kept failing — and that understanding itself was the breakthrough. My buddy became my coach, my mirror, and my biggest cheerleader. I stopped fighting myself and started actually growing.",
      role: "Creative Director",
      highlight: "started actually growing"
    }
  ];

  const philosophyPillars = [
    {
      icon: Waves,
      title: "Attunement Over Advice",
      description: "The best coaches don't tell you what to think — they help you discover what you already know. We don't prescribe solutions. We attune to your unique emotional intelligence and create the conditions for your own wisdom to surface. Like a great teacher, we guide from beside you, never from above.",
      color: "sage"
    },
    {
      icon: Fingerprint,
      title: "Your Mind Is One of a Kind",
      description: "Your emotional landscape is as unique as your fingerprint — no template or one-size-fits-all approach can honor that complexity. Our AI learns your specific language, adapts to your rhythms, and recognizes patterns that are uniquely yours. We see you as the individual you are — not a category, not a diagnosis, not a number.",
      color: "gold"
    },
    {
      icon: HeartHandshake,
      title: "Unconditional Friendship",
      description: "Imagine a buddy who never judges where you are, never compares you to where you 'should' be, and celebrates every version of you — the confident, the uncertain, the growing — with the same genuine warmth. That's what we built. A friend, a mentor, a guide. Presence without conditions. Support without strings.",
      color: "rose"
    },
    {
      icon: Infinity,
      title: "Growth at Your Own Pace",
      description: "Real transformation happens in safety, not pressure. No metrics to chase, no streaks to protect, no guilt for taking a break. Like a patient mentor who knows when to push and when to hold space, your buddy meets you exactly where you are — because the strongest growth happens when you feel genuinely supported, not rushed.",
      color: "teal"
    }
  ];

  const features = [
    {
      icon: Brain,
      title: "Your AI Buddy: Coach, Mentor & Friend",
      description: "Part coach who challenges you to grow, part mentor who shares wisdom at the right moment, part friend who genuinely cares. Your buddy is trained in emotional intelligence, active listening, and behavioral insight — helping you manage stress, build confidence, and understand yourself from A to Z.",
      accent: "sage"
    },
    {
      icon: BarChart3,
      title: "See the Patterns That Shape Your Life",
      description: "Gentle mood awareness that reveals invisible connections between how you feel and why. Over time, patterns surface that explain years of behavior — the kind of self-knowledge that transforms how you handle stress, relationships, confidence, and daily decisions.",
      accent: "gold"
    },
    {
      icon: PenLine,
      title: "Journaling That Builds Self-Worth",
      description: "Psychologically crafted prompts designed to guide you past surface thoughts into the deeper layers where real self-understanding and self-worth live. Each prompt is a quiet invitation to recognize the strength, wisdom, and resilience you've always carried inside.",
      accent: "rose"
    },
    {
      icon: Compass,
      title: "500+ Tools for Every Life Moment",
      description: "Stress relief, confidence builders, self-worth exercises, cognitive reframes, breathing techniques, resilience practices, behavior insights, and emotional regulation tools — organized by what you need right now. From daily stressors to deeper life challenges, A to Z.",
      accent: "teal"
    },
    {
      icon: TrendingUp,
      title: "Confidence & Self-Worth Builder",
      description: "Your buddy doesn't just listen — it actively coaches you toward believing in yourself. Through guided reflections, positive reframing, and mindful awareness, you'll develop the kind of genuine confidence and self-worth that no external validation can match.",
      accent: "rose"
    },
    {
      icon: Shield,
      title: "Your Privacy Is Sacred",
      description: "Your inner world is encrypted with industry-standard security and belongs exclusively to you. No ads. No data sales. No social exposure. We protect your vulnerability with the same reverence we'd want for our own — because trust is the foundation everything else is built on.",
      accent: "sage"
    },
    {
      icon: Leaf,
      title: "Everyday Stress, Managed with Wisdom",
      description: "Whether it's work pressure, relationship tension, financial worry, or the weight of daily responsibilities — your buddy helps you process it all with clarity and calm. Not by avoiding stress, but by understanding it and developing the resilience to navigate it skillfully.",
      accent: "teal"
    },
    {
      icon: Sun,
      title: "Your Pace. Your Terms. Always.",
      description: "No streaks to maintain. No guilt for stepping away. No manufactured urgency. Like a true friend who always has your back, your buddy waits with genuine patience and greets you warmly whenever you return — because real growth isn't a sprint, it's a lifelong journey.",
      accent: "gold"
    }
  ];

  const featureAccentColors = {
    sage: { bg: 'linear-gradient(135deg, var(--glp-sage), var(--glp-teal-400))', shadow: 'var(--glp-sage-30)' },
    gold: { bg: 'linear-gradient(135deg, var(--glp-gold), var(--glp-gold-dark))', shadow: 'var(--glp-gold-30)' },
    rose: { bg: 'linear-gradient(135deg, var(--glp-blush-400), var(--glp-blush-600))', shadow: 'var(--glp-rose-20)' },
    teal: { bg: 'linear-gradient(135deg, var(--glp-teal-400), var(--glp-sage-deep))', shadow: 'var(--glp-sage-deep-20)' }
  };

  const philosophyAccentColors = {
    sage: { bg: 'linear-gradient(135deg, var(--glp-sage), var(--glp-teal-400))', text: 'var(--glp-sage)' },
    gold: { bg: 'linear-gradient(135deg, var(--glp-gold), var(--glp-gold-dark))', text: 'var(--glp-gold)' },
    rose: { bg: 'linear-gradient(135deg, var(--glp-blush-400), var(--glp-blush-600))', text: 'var(--glp-blush-500)' },
    teal: { bg: 'linear-gradient(135deg, var(--glp-teal-400), var(--glp-sage-deep))', text: 'var(--glp-teal-400)' }
  };

  const faqs = [
    {
      question: "What exactly is MyMentalHealthBuddy?",
      answer: "Think of it as having a personal coach, mentor, and best friend — available 24/7 and genuinely invested in who you're becoming. It's an AI buddy trained in emotional intelligence, active listening, and behavioral insight, alongside 500+ evidence-based tools for stress management, confidence building, self-worth development, and personal growth. It's not therapy — it's the supportive, encouraging, always-there buddy that helps you understand yourself from A to Z and become the person you've always known you could be."
    },
    {
      question: "Is my private information truly safe?",
      answer: "Absolutely sacred. Your journal entries, mood data, and conversations are encrypted with industry-standard security and belong exclusively to you. We don't sell data, show ads, or share anything with third parties. There's no social feed, no public profile, and no way for anyone else to access your space. We built this the way we'd want our own innermost thoughts protected — because trust isn't negotiable, and your vulnerability deserves genuine reverence."
    },
    {
      question: "How does the AI buddy actually help me?",
      answer: "Your buddy acts as your personal coach, mentor, and guide — all in one. It helps you manage daily stress with proven techniques, builds your confidence through guided reflections and positive reframing, deepens your self-worth by helping you recognize strengths you've overlooked, and identifies behavioral patterns that have been holding you back. It remembers your journey, adapts to your emotional language, and grows with you — like a wise friend who knows exactly when to challenge you and when to simply listen."
    },
    {
      question: "Can it really help with stress and confidence?",
      answer: "Yes — and not with generic tips you could find anywhere. Your buddy learns your specific stress triggers, relationship patterns, and confidence blockers, then guides you with personalized strategies that actually fit your life. Over time, you develop real emotional resilience — not by avoiding stress, but by understanding it. And the confidence you build isn't superficial; it comes from genuine self-knowledge and self-acceptance, which is the only foundation that lasts."
    },
    {
      question: "How is this different from ChatGPT or other AI?",
      answer: "Night and day. Our buddy is specifically designed around trauma-informed communication, emotional attunement, and behavioral coaching. It doesn't give generic advice — it reads emotional undertones, reflects what you're feeling with precision and care, asks questions that open new doorways of awareness, and coaches you toward real growth. It's the difference between talking to a search engine and talking to a wise mentor who genuinely knows your story."
    },
    {
      question: "What if I can't afford it?",
      answer: "The core experience — mood tracking, journaling, daily reflections, community affirmations, stress management tools, and crisis resources — is completely free, forever. No trial that expires. No features that vanish. No watered-down version. Pro unlocks unlimited AI coaching conversations and advanced self-mastery tools, but free isn't a marketing trick — it's the foundation we believe every person deserves, because mental wellness shouldn't have a price barrier."
    },
    {
      question: "What if I stop using it for a while?",
      answer: "Life happens — and your space stays exactly as you left it. Warm. Patient. Unchanged. No guilt notifications. No streak that resets. No passive-aggressive emails asking where you went. Growth comes in waves, not straight lines, and we genuinely respect that. Your buddy will be here whenever you're ready, without judgment, without conditions, ready to pick up right where you left off — like a true friend always does."
    },
    {
      question: "Is this a replacement for therapy?",
      answer: "No — and we'll always be honest about that, because integrity matters to us. This is an educational wellness buddy: a personal coach and guide for deepening self-awareness, building emotional resilience, managing daily stressors, growing confidence, and discovering the strength that's already inside you. If you're in crisis, we connect you directly to professional help. If you have a therapist, this complements their work beautifully. If you're not ready for therapy yet, this is a gentle, empowering, judgment-free first step toward understanding your own mind."
    }
  ];

  return (
    <div className="canva-landing min-h-screen">
      <SoftLaunchBanner />
      <div 
        className={`mobile-overlay ${mobileMenuOpen ? 'active' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      <nav className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
        <button 
          onClick={() => setMobileMenuOpen(false)}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center"
          style={{ color: 'var(--glp-ink)' }}
          data-testid="button-close-mobile-menu"
          aria-label="Close mobile menu"
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
                  <button className="btn-secondary w-full" data-testid="button-mobile-getstarted">Get Started Free</button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <header className="sticky top-0 z-50 backdrop-blur-xl border-b" style={{ background: 'var(--glp-paper-98)', borderColor: 'var(--glp-sage-15)', boxShadow: '0 2px 8px var(--glp-sage-deep-12)' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-[80px] sm:h-[92px] lg:h-[108px]">
            <Link href="/">
              <div className="flex items-center gap-4 sm:gap-5 lg:gap-6 cursor-pointer group shrink-0" data-testid="link-logo">
                <div className="relative w-[44px] h-[44px] sm:w-[52px] sm:h-[52px] lg:w-[56px] lg:h-[56px] flex items-center justify-center transition-all duration-300 group-hover:scale-105 rounded-xl overflow-hidden" style={{ boxShadow: '0 2px 12px var(--glp-sage-deep-20)' }}>
                  <img 
                    src="/brand/mmhb-icon.svg" 
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
                      <span className="hidden sm:inline">Start Free</span>
                      <span className="sm:hidden">Start</span>
                    </button>
                  </Link>
                </>
              )}

              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2.5 rounded-xl transition-colors hover:bg-[var(--glp-sage-10)]"
                style={{ color: 'var(--glp-sage-deep)' }}
                data-testid="button-open-mobile-menu"
                aria-label="Open mobile menu"
              >
                <Menu className="w-6 h-6 sm:w-7 sm:h-7" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <section id="home" className="relative py-14 md:py-16 lg:py-20 px-6 sm:px-8 overflow-hidden" style={{ background: 'linear-gradient(180deg, var(--glp-paper) 0%, var(--glp-sage-10) 40%, var(--glp-teal-50) 100%)' }}>
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
                Your Mind Deserves This
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-4 md:mb-6 leading-[1.06] tracking-tight animate-fade-in-up" style={{ color: 'var(--glp-sage-deep)', animationDelay: '0.1s' }}>
              Your Coach. Your Mentor.
              <br />
              <span style={{ background: 'linear-gradient(135deg, var(--glp-sage-deep), var(--glp-gold), var(--glp-sage))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Your Best Friend.
              </span>
            </h1>

            <p className="text-base sm:text-xl md:text-2xl font-serif mb-4 md:mb-6 animate-fade-in-up" style={{ color: 'var(--glp-sage-deep)', fontWeight: 600, animationDelay: '0.2s' }}>
              An emotionally intelligent AI buddy that helps you manage stress, build confidence, deepen self-worth, and evolve your mind to its fullest potential
            </p>

            <p className="text-sm sm:text-base md:text-lg max-w-3xl mx-auto mb-6 md:mb-8 leading-relaxed animate-fade-in-up" style={{ color: 'var(--glp-ink)', animationDelay: '0.3s', lineHeight: '1.75' }}>
              500+ evidence-based tools for everyday life stressors, confidence building, self-worth development, emotional resilience, and personal growth — guided by an AI buddy that truly listens, genuinely understands, and coaches you like a wise friend who believes in your potential. No judgment. No generic advice. No pressure. Just real support that helps you become who you've always known you could be.
            </p>

            <div className="safe-space-box max-w-md mx-auto mb-6 md:mb-8 animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
              <div className="flex items-center justify-center gap-3">
                <Shield className="w-4 h-4 md:w-5 md:h-5" style={{ color: 'var(--glp-gold)' }} aria-hidden="true" />
                <span className="font-semibold text-sm md:text-base" style={{ color: 'var(--glp-sage-deep)' }}>You Are Safe Here</span>
                <Shield className="w-4 h-4 md:w-5 md:h-5" style={{ color: 'var(--glp-gold)' }} aria-hidden="true" />
              </div>
            </div>

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
                    Start Your Journey — Free
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
                AI Buddy
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" style={{ margin: '0 auto' }} aria-hidden="true"></div>

      <section 
        id="about" 
        className="py-14 md:py-20 px-4 md:px-6"
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
            A Coach, Mentor & Friend
            <span className="block" style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-gold))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}> Built for Your Mind</span>
          </h2>

          <p 
            className="text-sm md:text-lg leading-relaxed max-w-3xl mx-auto mb-4"
            style={{ color: 'var(--glp-ink)', lineHeight: '1.75' }}
          >
            Most wellness apps are built to maximize your screen time. We built this to maximize your potential. Your AI buddy combines the wisdom of a coach who challenges you to grow, a mentor who guides you with patience, and a friend who genuinely cares — alongside 500+ evidence-based tools for managing stress, building confidence, deepening self-worth, and navigating life's challenges from everyday pressures to deeper patterns you've carried for years.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-10">
            <div className="flex sm:flex-col items-center sm:items-center gap-4 sm:gap-0 rounded-2xl p-4 sm:p-6 sm:text-center" style={{ background: 'var(--glp-white)', border: '1px solid var(--glp-sage-20)' }}>
              <div className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-xl sm:mx-auto sm:mb-4 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--glp-teal-400), var(--glp-sage-deep))' }}>
                <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-semibold mb-1 sm:mb-2" style={{ color: 'var(--glp-sage-deep)' }}>
                  No Pressure, Ever
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--glp-ink)' }}>
                  Skip a day, a week, a month. Nothing resets, nothing breaks. Your space waits patiently.
                </p>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-center gap-4 sm:gap-0 rounded-2xl p-4 sm:p-6 sm:text-center" style={{ background: 'var(--glp-white)', border: '1px solid var(--glp-sage-20)' }}>
              <div className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-xl sm:mx-auto sm:mb-4 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))' }}>
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-semibold mb-1 sm:mb-2" style={{ color: 'var(--glp-sage-deep)' }}>
                  Ethically Designed
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--glp-ink)' }}>
                  No dark patterns. No guilt loops. Every interaction is opt-in and designed with your wellbeing first.
                </p>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-center gap-4 sm:gap-0 rounded-2xl p-4 sm:p-6 sm:text-center" style={{ background: 'var(--glp-white)', border: '1px solid var(--glp-sage-20)' }}>
              <div className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-xl sm:mx-auto sm:mb-4 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--glp-blush-400), var(--glp-blush-600))' }}>
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-semibold mb-1 sm:mb-2" style={{ color: 'var(--glp-sage-deep)' }}>
                  Radically Private
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--glp-ink)' }}>
                  Your reflections belong to you — not an algorithm, not advertisers, not anyone. Encrypted and protected.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" style={{ margin: '0 auto' }} aria-hidden="true"></div>

      <section id="philosophy" className="py-14 md:py-24 px-4 md:px-6 relative overflow-hidden" style={{ background: 'var(--glp-paper)' }}>
        <div className="aurora-bg" aria-hidden="true"></div>
        <div className="max-w-[1100px] mx-auto relative z-10">
          <div className="text-center mb-10 md:mb-14">
            <span 
              className="inline-block text-xs md:text-sm font-semibold uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full"
              style={{ background: 'var(--glp-sage-10)', color: 'var(--glp-sage-deep)', border: '1px solid var(--glp-sage-20)' }}
              data-testid="badge-philosophy"
            >
              Our Philosophy
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4" style={{ color: 'var(--glp-sage-deep)' }}>
              What We Believe About
              <span className="block" style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-gold))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}> The Mind You Already Have</span>
            </h2>
            <p className="text-base md:text-lg max-w-3xl mx-auto leading-relaxed" style={{ color: 'var(--glp-ink)', lineHeight: '1.75' }}>
              Every design choice, every word our buddy speaks, every tool we build is grounded in one truth: the wisdom, strength, and resilience you need are already within you. We simply create the conditions for them to surface.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mb-10">
            {philosophyPillars.map((pillar, index) => {
              const accent = philosophyAccentColors[pillar.color] || philosophyAccentColors.sage;
              return (
                <div key={index} className="philosophy-card" data-testid={`card-philosophy-${index}`}>
                  <div className="flex items-start gap-4">
                    <div 
                      className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
                      style={{ background: accent.bg }}
                    >
                      <pillar.icon className="w-5 h-5 text-white" strokeWidth={2} aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg md:text-xl font-semibold mb-2" style={{ color: 'var(--glp-sage-deep)' }}>
                        {pillar.title}
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--glp-ink)', lineHeight: '1.7' }}>
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="manifesto-quote" data-testid="section-manifesto">
            <p className="relative z-10 text-lg md:text-2xl font-serif italic leading-relaxed text-white text-center" style={{ opacity: 0.95, lineHeight: '1.7' }}>
              "We didn't build an app. We built a buddy — one that reflects your mind back to itself with more clarity, more compassion, and more truth than you've ever experienced. Because the most transformative thing you'll ever do is genuinely understand who you already are."
            </p>
            <p className="relative z-10 text-sm font-semibold text-center mt-4 shimmer-text">
              — The Genuine Love Project
            </p>
          </div>
        </div>
      </section>

      <div className="section-divider" style={{ margin: '0 auto' }} aria-hidden="true"></div>

      <section id="features" className="py-14 md:py-24 px-4 md:px-6" style={{ background: 'linear-gradient(180deg, var(--glp-sage-10) 0%, var(--glp-paper) 30%)' }}>
        <div className="max-w-[1200px] mx-auto px-2 md:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-3" style={{ color: 'var(--glp-sage-deep)' }}>
              Everything You Need
              <span className="block text-2xl md:text-4xl mt-1" style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-gold))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>to Understand Yourself Better</span>
            </h2>
            <p className="text-base md:text-lg max-w-3xl mx-auto mt-3" style={{ color: 'var(--glp-ink)', lineHeight: '1.7' }}>
              From everyday stress relief to deep self-mastery, confidence building to emotional resilience — your complete A-to-Z toolkit for becoming your best self. Use what resonates, leave what doesn't.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {features.map((feature, index) => {
              const accent = featureAccentColors[feature.accent] || featureAccentColors.sage;
              return (
                <div key={index} className="rounded-2xl p-5 md:p-7 group transition-all duration-300 hover:-translate-y-2" style={{ background: 'var(--glp-white)', border: '1px solid var(--glp-sage-20)', boxShadow: '0 4px 16px var(--glp-sage-10)' }}>
                  <div className="mb-4 md:mb-5 flex items-center justify-center w-11 h-11 md:w-13 md:h-13 rounded-xl transition-all group-hover:shadow-lg" style={{ background: accent.bg, boxShadow: `0 4px 16px ${accent.shadow}`, width: '3rem', height: '3rem' }}>
                    <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-white" strokeWidth={2} aria-hidden="true" />
                  </div>
                  <h3 className="text-base md:text-xl font-serif font-semibold mb-2 md:mb-3" style={{ color: 'var(--glp-sage-deep)' }}>
                    {feature.title}
                  </h3>
                  <p className="text-xs md:text-sm leading-relaxed mb-3 md:mb-4" style={{ color: 'var(--glp-ink)', lineHeight: '1.7' }}>
                    {feature.description}
                  </p>
                  <Link href="/login" data-testid={`link-feature-${index}`} className="inline-flex items-center text-xs md:text-sm font-semibold cursor-pointer transition-colors hover:opacity-80" style={{ color: 'var(--glp-gold)' }}>
                      Explore
                      <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 ml-1" aria-hidden="true" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="section-divider" style={{ margin: '0 auto' }} aria-hidden="true"></div>

      <section className="py-14 md:py-24 px-4 md:px-6" style={{ background: 'linear-gradient(180deg, var(--glp-paper), var(--glp-sage-10))' }}>
        <div className="max-w-[1200px] mx-auto px-2 md:px-8">
          <div className="text-center mb-8 md:mb-14">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-3" style={{ color: 'var(--glp-sage-deep)' }}>
              Three Steps to
              <span style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-gold))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}> Becoming Your Own Best Friend</span>
            </h2>
            <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: 'var(--glp-ink)', lineHeight: '1.7' }}>
              No commitments. No credit card. No learning curve. Just you, a safe space, and the beginning of something genuinely meaningful.
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

      <div className="section-divider" style={{ margin: '0 auto' }} aria-hidden="true"></div>

      <section 
        className="py-14 md:py-24 px-4 md:px-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, var(--glp-paper), var(--glp-rose-15))' }}
      >
        <div className="max-w-[1200px] mx-auto px-2 md:px-8 relative z-10">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-2" style={{ color: 'var(--glp-sage-deep)' }}>
              Real People,
              <span style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-gold))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}> Real Breakthroughs</span>
            </h2>
            <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: 'var(--glp-ink)', lineHeight: '1.7' }}>
              From people who found something they didn't know they were looking for — themselves
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
                <p className="leading-relaxed italic text-sm md:text-base" style={{ color: 'var(--glp-ink)', lineHeight: '1.7' }}>
                  "{testimonial.text}"
                </p>
                {testimonial.highlight && (
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--glp-sage)' }}>
                    — "{testimonial.highlight}"
                  </p>
                )}
              </div>
            ))}
          </div>

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
              <span style={{ color: 'var(--glp-ink)' }}>24/7 Available</span>
            </div>
          </div>

        </div>
      </section>

      <div className="section-divider" style={{ margin: '0 auto' }} aria-hidden="true"></div>

      <section 
        id="faq" 
        className="py-14 md:py-24 px-6"
        style={{ background: 'linear-gradient(180deg, var(--glp-sage-10), var(--glp-paper))' }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-3" style={{ color: 'var(--glp-sage-deep)' }}>
              Questions Worth
              <span style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-gold))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}> Answering Honestly</span>
            </h2>
            <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: 'var(--glp-ink)', lineHeight: '1.7' }}>
              We'd rather you felt fully confident before you began
            </p>
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
                  id={`faq-question-${index}`}
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  aria-expanded={activeFaq === index}
                  aria-controls={`faq-answer-${index}`}
                  data-testid={`button-faq-toggle-${index}`}
                >
                  {faq.question}
                  <ChevronDown className="faq-icon w-5 h-5 flex-shrink-0" />
                </button>
                <div className="faq-answer" id={`faq-answer-${index}`} role="region" aria-labelledby={`faq-question-${index}`}>
                  {faq.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" style={{ margin: '0 auto' }} aria-hidden="true"></div>

      <section className="py-14 md:py-24 px-6 text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--glp-sage-deep), var(--glp-sage))' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        </div>
        <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center justify-center text-center py-4 md:py-8">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 md:px-8 md:py-4 rounded-full bg-white/10 backdrop-blur-sm mb-6 md:mb-10 border border-white/15">
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-[var(--glp-gold)]" />
            <span className="text-sm sm:text-lg md:text-xl text-white/90 font-medium tracking-wide">Something brought you here today — trust that instinct</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold mb-3 md:mb-5 text-white leading-tight text-center">
            Your Coach Is Ready.
            <br />
            <span className="text-[var(--glp-gold)]" style={{ textShadow: '0 2px 20px var(--glp-gold-30)' }}>Are You?</span>
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl mt-1 mb-6 md:mb-10 text-white/85 max-w-3xl mx-auto font-light leading-relaxed text-center" style={{ lineHeight: '1.75' }}>
            Free to start. No credit card. No trial that expires. Your AI buddy — coach, mentor, and friend — is here, patient and genuinely invested in your growth. Less stress. More confidence. Deeper self-worth. The person you're becoming is already inside you. Let's meet them together.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-5">
            {!isLoading && isAuthenticated() ? (
              <Link href="/dashboard">
                <button
                  className="group inline-flex items-center gap-2 md:gap-3 px-8 py-4 md:px-10 md:py-5 rounded-full font-bold text-base md:text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  style={{
                    background: 'var(--glp-white)',
                    color: 'var(--glp-gold-dark, #c49a2d)',
                    boxShadow: '0 0 25px var(--glp-gold-30), 0 8px 32px rgba(0,0,0,0.2)'
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
                    boxShadow: '0 0 25px var(--glp-gold-30), 0 8px 32px rgba(0,0,0,0.2)'
                  }}
                  data-testid="button-final-cta"
                >
                  <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                  Start Your Journey — Free
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
                  borderColor: 'var(--glp-gold-60)',
                  boxShadow: '0 0 15px var(--glp-gold-15)'
                }}
                data-testid="button-view-pricing"
              >
                View Pricing
              </button>
            </Link>
          </div>
        </div>
      </section>

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

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid var(--glp-sage-15)' }}>
            <div className="flex items-center gap-3">
              <img src="/brand/mmhb-icon.svg" alt="MyMentalHealthBuddy" className="w-8 h-8 rounded-lg" style={{ boxShadow: '0 1px 4px var(--glp-sage-deep-12)' }} />
              <p className="text-xs" style={{ color: 'var(--glp-sage)' }}>
                © {new Date().getFullYear()} MyMentalHealthBuddy by The Genuine Love Project. All rights reserved.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--glp-sage)' }}>
              <span>Built with care.</span>
              <Heart className="w-3 h-3" style={{ color: 'var(--glp-blush)' }} fill="currentColor" />
              <span>No ads. No data sales.</span>
            </div>
          </div>
          <SafetyFooter variant="compact" className="mt-4" />
        </div>
      </footer>

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
                    aria-label="Cancel admin login"
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
