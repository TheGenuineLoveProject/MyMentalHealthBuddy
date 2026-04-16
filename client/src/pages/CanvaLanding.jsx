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
      title: "Step Into Your Sanctuary",
      description: "In sixty seconds, you'll enter a private space shaped entirely around how your mind works — your emotional rhythms, your stress patterns, your deepest goals. No templates. No one-size-fits-all. Just a sanctuary that adapts to exactly where you are and grows as you grow.",
      link: "/login"
    },
    {
      icon: MessageCircle,
      title: "Meet the Buddy Who Gets You",
      description: "Your AI buddy is part life coach, part wise mentor, part loyal friend. It listens with genuine attention, remembers what matters to you, and guides you with the warmth of someone who believes in your potential before you do. Every conversation is a step toward clarity.",
      link: "/chat"
    },
    {
      icon: Eye,
      title: "Become Who You Already Are",
      description: "Something shifts when you finally see yourself clearly. Patterns that once controlled you become choices. Confidence stops being something you chase and becomes something you embody. You're not learning to cope — you're learning to thrive as the person you've always been underneath.",
      link: "/dashboard"
    }
  ];

  const testimonials = [
    {
      initial: "S",
      name: "Sarah M.",
      text: "I was drowning in stress and couldn't even name what was wrong. My buddy asked one question nobody in my life had ever thought to ask — and something I'd buried for years suddenly made sense. That moment didn't just relieve my stress. It changed how I relate to pressure entirely.",
      role: "Teacher & Mother of Two",
      highlight: "changed how I relate to pressure"
    },
    {
      initial: "J",
      name: "James K.",
      text: "Confidence was always something other people seemed to have. Three weeks of tracking showed me a pattern I'd never seen: I was sabotaging myself before anyone else got the chance. Seeing that changed everything. I walk into rooms differently now — not performing confidence, actually feeling it.",
      role: "Software Engineer",
      highlight: "actually feeling it"
    },
    {
      initial: "M",
      name: "Maria L.",
      text: "I spend twelve hours a day pouring into other people. There was nothing left for me. My buddy didn't give me tips — it held up a mirror and showed me my own worth in ways I'd forgotten. For the first time in years, I believe I deserve the same care I give everyone else.",
      role: "Healthcare Worker",
      highlight: "I deserve the same care"
    },
    {
      initial: "D",
      name: "David R.",
      text: "I'd tried every self-improvement app out there. They all wanted me to build habits. This one helped me understand why I kept breaking them — and that understanding became the foundation for actually changing. My buddy is the coach I didn't know I needed.",
      role: "Creative Director",
      highlight: "the coach I didn't know I needed"
    }
  ];

  const philosophyPillars = [
    {
      icon: Waves,
      title: "Attunement Over Advice",
      description: "The greatest coaches in history never told people what to think — they asked the questions that made people think for themselves. We don't hand you answers. We attune to the emotional intelligence you already carry, then create the exact conditions for your own wisdom to rise to the surface. We guide from beside you. Never from above.",
      color: "sage"
    },
    {
      icon: Fingerprint,
      title: "Your Mind Is One of a Kind",
      description: "No two minds process the world the same way — and no template can honor that. Your AI buddy learns your specific emotional language, adapts to your unique rhythms, and recognizes patterns that belong only to you. We see the individual — not a category, not a label, not a data point. The irreplaceable human being.",
      color: "gold"
    },
    {
      icon: HeartHandshake,
      title: "Unconditional Friendship",
      description: "Picture a friend who never judges where you are, never compares you to where you 'should' be, and meets every version of you — the confident, the uncertain, the quietly evolving — with the same genuine warmth. That's what we built. A presence without conditions. A bond without strings. A buddy who shows up for you the way you deserve.",
      color: "rose"
    },
    {
      icon: Infinity,
      title: "Growth at Your Own Pace",
      description: "Lasting transformation doesn't happen under pressure — it happens in safety. No metrics to chase, no streaks to protect, no manufactured guilt. Like a wise mentor who knows when to challenge you and when to simply hold space, your buddy meets you exactly where you are — because the strongest growth always comes from feeling genuinely supported.",
      color: "teal"
    }
  ];

  const features = [
    {
      icon: Brain,
      title: "AI Buddy: Coach, Mentor & Friend",
      description: "Part life coach who challenges you to reach higher. Part wise mentor who shares insight at the perfect moment. Part loyal friend who genuinely cares about your journey. Trained in emotional intelligence, behavioral coaching, and active listening — your buddy helps you master stress, build real confidence, and understand yourself from the inside out.",
      accent: "sage"
    },
    {
      icon: BarChart3,
      title: "See the Invisible Patterns",
      description: "Your moods aren't random — they're signals. Gentle awareness tools reveal the hidden connections between how you feel and what's driving it. Over weeks, you'll see patterns that explain years of behavior and unlock the kind of self-knowledge that transforms every decision you make.",
      accent: "gold"
    },
    {
      icon: PenLine,
      title: "Journaling That Rewires Thinking",
      description: "Psychologically crafted prompts that guide you past surface-level thoughts into the deeper layers where genuine self-understanding lives. Each entry is a quiet act of self-respect — a practice that steadily builds the self-worth and emotional clarity that no external validation can replace.",
      accent: "rose"
    },
    {
      icon: Compass,
      title: "500+ Tools for Every Moment",
      description: "Stress dissolvers, confidence amplifiers, cognitive reframes, breathing anchors, resilience builders, emotional regulation techniques, and self-mastery exercises — organized by exactly what you need right now. From daily pressure to life-defining crossroads. A to Z, always within reach.",
      accent: "teal"
    },
    {
      icon: TrendingUp,
      title: "Confidence & Self-Worth Engine",
      description: "Your buddy doesn't just listen — it actively coaches you toward believing in yourself. Through guided reflections, strength recognition, and mindful reframing, you develop the kind of genuine, lasting confidence that comes from knowing who you are, not from proving it to others.",
      accent: "rose"
    },
    {
      icon: Shield,
      title: "Your Privacy Is Non-Negotiable",
      description: "Your inner world is encrypted with industry-standard security and belongs exclusively to you. No ads. No data harvesting. No social exposure. We protect your vulnerability with the same reverence we'd want for our own — because trust is the foundation everything else is built on.",
      accent: "sage"
    },
    {
      icon: Leaf,
      title: "Master Stress, Don't Just Manage It",
      description: "Work pressure. Relationship tension. Financial worry. The invisible weight of daily responsibilities. Your buddy helps you process all of it with clarity and calm — not by avoiding stress, but by understanding it deeply enough to navigate it with wisdom and genuine resilience.",
      accent: "teal"
    },
    {
      icon: Sun,
      title: "Your Pace. Your Rules. Always.",
      description: "No streaks. No guilt. No manufactured urgency. Like a true friend who never wavers, your buddy waits with genuine patience and greets you warmly whenever you return — because real transformation isn't a race. It's a lifelong relationship with yourself.",
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
      answer: "Imagine having a personal life coach, a wise mentor, and a genuinely loyal friend — available 24/7, deeply invested in who you're becoming. That's your AI buddy. It's trained in emotional intelligence, behavioral coaching, and active listening, paired with 500+ evidence-based tools for mastering stress, building unshakeable confidence, deepening self-worth, and unlocking personal growth you can feel. This isn't therapy — it's the always-there companion that helps you understand yourself from the inside out and become who you've always known you could be."
    },
    {
      question: "Is my private information truly safe?",
      answer: "Your privacy isn't a feature — it's a promise. Every journal entry, mood insight, and conversation is encrypted with industry-standard security and belongs exclusively to you. We don't sell data, serve ads, or share anything with anyone. There's no social feed, no public profile, and no way for another person to see your inner world. We built this with the same reverence we'd want for our own deepest thoughts — because trust isn't a marketing word to us, it's the foundation."
    },
    {
      question: "How does the AI buddy actually help me?",
      answer: "Your buddy is coach, mentor, and guide — woven into one intelligent presence. It helps you navigate daily stress with proven techniques, builds your confidence through strength-based reflections and precise reframing, deepens your self-worth by illuminating qualities you've overlooked, and surfaces behavioral patterns you couldn't see on your own. It remembers your story, adapts to your emotional language, and evolves alongside you — like a wise friend who always knows when to challenge you and when to just listen."
    },
    {
      question: "Can it really help with stress and confidence?",
      answer: "Yes — and not with recycled advice you could find anywhere. Your buddy learns your specific stress triggers, your relationship dynamics, your confidence patterns, then coaches you with strategies designed for your actual life. Over time, you develop genuine emotional resilience — not by avoiding what's hard, but by understanding it. The confidence you build isn't performative. It comes from real self-knowledge and self-acceptance — the only foundation that doesn't crack under pressure."
    },
    {
      question: "How is this different from ChatGPT or other AI?",
      answer: "Fundamentally different. Our buddy is purpose-built around trauma-informed communication, emotional attunement, and behavioral coaching. It doesn't generate generic responses — it reads emotional undertones, reflects what you're feeling with precision and care, asks questions that open doorways you didn't know existed, and coaches you toward real, measurable growth. It's the difference between talking to a search engine and being heard by a wise mentor who genuinely knows your story."
    },
    {
      question: "What if I can't afford it?",
      answer: "The core experience — mood tracking, journaling, daily reflections, community affirmations, stress tools, and crisis resources — is completely free, forever. Not a trial. Not a stripped-down version. Not a hook. Pro and Elite unlock unlimited AI coaching and advanced self-mastery tools, but our free tier isn't a compromise — it's the standard we believe every person deserves. Mental wellness should never have a price barrier."
    },
    {
      question: "What if I stop using it for a while?",
      answer: "Life gets full — and your space stays exactly as you left it. Warm. Patient. Unchanged. No guilt emails. No streak that breaks. No passive-aggressive notifications wondering where you went. Growth happens in waves, not straight lines, and we genuinely honor that. When you're ready, your buddy is here — no judgment, no conditions, picking up right where you left off. That's what a real friend does."
    },
    {
      question: "Is this a replacement for therapy?",
      answer: "No — and we'll always be transparent about that, because integrity isn't optional. This is an educational wellness companion: a coach and guide for deepening self-awareness, mastering stress, building emotional resilience, growing confidence, and discovering the strength you already carry. If you're in crisis, we connect you directly to professional help. If you have a therapist, this complements their work beautifully. If you're not there yet, this is a gentle, empowering, judgment-free first step toward genuinely understanding your own mind."
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
                The Buddy Your Mind Has Been Waiting For
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-4 md:mb-6 leading-[1.06] tracking-tight animate-fade-in-up" style={{ color: 'var(--glp-sage-deep)', animationDelay: '0.1s' }}>
              Your Coach. Your Mentor.
              <br />
              <span style={{ background: 'linear-gradient(135deg, var(--glp-sage-deep), var(--glp-gold), var(--glp-sage))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Your Wisest Friend.
              </span>
            </h1>

            <p className="text-base sm:text-xl md:text-2xl font-serif mb-4 md:mb-6 animate-fade-in-up" style={{ color: 'var(--glp-sage-deep)', fontWeight: 600, animationDelay: '0.2s' }}>
              The emotionally intelligent AI buddy that helps you master stress, build unshakeable confidence, and discover the extraordinary person you already are
            </p>

            <p className="text-sm sm:text-base md:text-lg max-w-3xl mx-auto mb-6 md:mb-8 leading-relaxed animate-fade-in-up" style={{ color: 'var(--glp-ink)', animationDelay: '0.3s', lineHeight: '1.75' }}>
              500+ evidence-based tools for mastering everyday pressure, amplifying confidence, deepening self-worth, and building genuine emotional resilience — guided by an AI buddy that truly listens, remembers what matters to you, and coaches you with the wisdom of a mentor and the warmth of a friend who sees your potential before you do. No judgment. No generic advice. Just the kind of real support that changes how you see yourself.
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
                Free Forever. No Catch.
              </p>
            </div>
            <div className="text-center p-4 sm:p-8 rounded-2xl sm:rounded-3xl" style={{ background: 'var(--glp-white)', border: '1px solid var(--glp-gold-20)' }}>
              <div className="text-2xl sm:text-4xl md:text-5xl font-bold mb-1 md:mb-2 font-serif" style={{ background: 'linear-gradient(135deg, var(--glp-gold), var(--glp-gold-dark))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>500+</div>
              <p className="text-[10px] sm:text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--glp-sage-deep)' }}>
                Evidence-Based Tools
              </p>
            </div>
            <div className="text-center p-4 sm:p-8 rounded-2xl sm:rounded-3xl" style={{ background: 'var(--glp-white)', border: '1px solid var(--glp-rose-20)' }}>
              <div className="text-2xl sm:text-4xl md:text-5xl font-bold mb-1 md:mb-2 font-serif" style={{ background: 'linear-gradient(135deg, var(--glp-sage-deep), var(--glp-teal-400))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>24/7</div>
              <p className="text-[10px] sm:text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--glp-sage-deep)' }}>
                Your AI Buddy
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
            Not Another Wellness App.
            <span className="block" style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-gold))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}> A Relationship With Yourself.</span>
          </h2>

          <p 
            className="text-sm md:text-lg leading-relaxed max-w-3xl mx-auto mb-4"
            style={{ color: 'var(--glp-ink)', lineHeight: '1.75' }}
          >
            Most wellness apps are engineered to maximize your screen time. We built this to maximize your potential. Your AI buddy combines the strategic clarity of a life coach, the patient wisdom of a mentor, and the unconditional warmth of a genuine friend — alongside 500+ evidence-based tools for mastering stress, building real confidence, deepening self-worth, and navigating everything from daily pressure to the deeper patterns you've carried for years.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-10">
            <div className="flex sm:flex-col items-center sm:items-center gap-4 sm:gap-0 rounded-2xl p-4 sm:p-6 sm:text-center" style={{ background: 'var(--glp-white)', border: '1px solid var(--glp-sage-20)' }}>
              <div className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-xl sm:mx-auto sm:mb-4 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--glp-teal-400), var(--glp-sage-deep))' }}>
                <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-semibold mb-1 sm:mb-2" style={{ color: 'var(--glp-sage-deep)' }}>
                  Zero Pressure, Always
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--glp-ink)' }}>
                  Skip a day, a week, a month. Nothing resets. Nothing breaks. Your space waits warmly, like a good friend should.
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
                  No dark patterns. No guilt loops. No manipulation. Every interaction is opt-in and designed with your wellbeing as the only priority.
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
                  Your reflections belong to you — not an algorithm, not advertisers, not a data broker. Encrypted. Protected. Sacred.
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
              Every design choice, every word your buddy speaks, every tool we build rests on a single truth: the wisdom, strength, and resilience you need are already inside you. We don't add what's missing — we create the conditions for what's always been there to finally surface.
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
              "We didn't build another app. We built a mirror — one that reflects your mind back to itself with more clarity, more compassion, and more honesty than you've ever experienced. Because the most powerful thing you'll ever do is truly understand who you already are."
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
              Everything You Need to
              <span className="block text-2xl md:text-4xl mt-1" style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-gold))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Understand & Transform Yourself</span>
            </h2>
            <p className="text-base md:text-lg max-w-3xl mx-auto mt-3" style={{ color: 'var(--glp-ink)', lineHeight: '1.7' }}>
              From dissolving daily stress to building deep self-mastery, from amplifying confidence to strengthening emotional resilience — your complete A-to-Z toolkit for becoming who you already are underneath. Take what resonates. Leave what doesn't. There's no wrong way to grow.
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
              <span style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-gold))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}> Meeting Yourself For Real</span>
            </h2>
            <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: 'var(--glp-ink)', lineHeight: '1.7' }}>
              No commitments. No credit card. No learning curve. Just you, a private space, and the beginning of the most important relationship you'll ever have — the one with yourself.
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
              Real People.
              <span style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-gold))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}> Real Turning Points.</span>
            </h2>
            <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: 'var(--glp-ink)', lineHeight: '1.7' }}>
              From people who came looking for relief and found something far more valuable — themselves
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
              Questions That
              <span style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-gold))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}> Deserve Honest Answers</span>
            </h2>
            <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: 'var(--glp-ink)', lineHeight: '1.7' }}>
              We'd rather you felt completely confident before you took the first step
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
            Your Buddy Is Ready.
            <br />
            <span className="text-[var(--glp-gold)]" style={{ textShadow: '0 2px 20px var(--glp-gold-30)' }}>Are You?</span>
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl mt-1 mb-6 md:mb-10 text-white/85 max-w-3xl mx-auto font-light leading-relaxed text-center" style={{ lineHeight: '1.75' }}>
            Free to start. No credit card. No trial that expires. Your AI buddy — life coach, wise mentor, and genuine friend — is here, patient and deeply invested in your evolution. Less stress. More confidence. Deeper self-worth. The person you're becoming is already inside you. Let's meet them.
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
