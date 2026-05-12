import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Link, useLocation } from "wouter";
import { Heart, Lightbulb, Users, Zap, BarChart3, Shield, Star, ChevronDown, Menu, X, ArrowRight, ArrowUp, Lock, Clock, Sparkles, PenLine, MessageCircle, TrendingUp, Leaf, Brain, KeyRound, Settings, Eye, Compass, Sun, Feather, Waves, Fingerprint, HeartHandshake, Infinity } from 'lucide-react';
import "../styles/canva-landing.css";
import SafetyFooter from "../components/ui/SafetyFooter";
import SoftLaunchBanner from "../components/SoftLaunchBanner";
import LumiMascot from "../components/lumi/LumiMascot.jsx";
import LumiCompanion from "../components/lumi/LumiCompanion.jsx";
import EmotionalJourney from "../sections/EmotionalJourney.jsx";
import NlpMiContent from "../sections/NlpMiContent.jsx";
import VisualBenefits from "../sections/VisualBenefits.jsx";
import ValueProposition from "../sections/ValueProposition.jsx";
import NextStepCTA from "../sections/NextStepCTA.jsx";
import ValueBridge from "../sections/ValueBridge.jsx";
import EmailCapture from "../sections/EmailCapture.jsx";
import SEO from "@/components/SEO";

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

  useEffect(() => {
    const sections = document.querySelectorAll('.section-reveal');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      sections.forEach(el => el.classList.add('revealed'));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const steps = [
    {
      icon: Feather,
      title: "Step Into Your Sanctuary",
      description: "In sixty seconds, you'll enter a private space shaped entirely around how your mind works — your emotional rhythms, your stress patterns, your focus style, your deepest goals. No templates. No one-size-fits-all. Whether you're managing ADHD, navigating overwhelm, or simply seeking clarity, this sanctuary adapts to exactly where you are and evolves as you grow.",
      link: "/login"
    },
    {
      icon: MessageCircle,
      title: "Meet Your Metacognitive Coach",
      description: "Your AI buddy is part life coach, part wise mentor, part loyal friend, part behavioral strategist. It doesn't just listen — it helps you think about how you think. Through active listening, intelligent questioning, and real-time pattern recognition, it guides you toward insights that change how you understand yourself. Every conversation builds metacognitive skill — the ability to observe, regulate, and evolve your own mind.",
      link: "/chat"
    },
    {
      icon: Eye,
      title: "Become Who You Already Are",
      description: "Something shifts when you finally see yourself clearly. Patterns that once controlled you become conscious choices. Self-regulation becomes natural. Confidence stops being something you perform and becomes something you embody. You're not learning to cope — you're mastering the inner skills that let you thrive as the person you've always been underneath.",
      link: "/dashboard"
    }
  ];

  const testimonials = [
    {
      initial: "S",
      name: "Sarah M.",
      text: "I was drowning in stress and couldn't even name what was wrong. My buddy asked one question nobody in my life had ever thought to ask — and something I'd buried for years suddenly made sense. It didn't just relieve the stress. It taught me how to observe my own mind, catch the pattern before it spirals, and respond with clarity instead of panic. That's a skill I'll carry forever.",
      role: "Teacher & Mother of Two",
      highlight: "respond with clarity instead of panic"
    },
    {
      initial: "J",
      name: "James K.",
      text: "Living with ADHD, my brain moves faster than I can follow. Every app wanted me to build habits I couldn't sustain. This buddy understood that my mind works differently — and instead of fighting it, helped me build self-regulation strategies that actually fit how I think. Three weeks in, I finally stopped sabotaging myself. Not through willpower. Through genuine self-understanding.",
      role: "Software Engineer",
      highlight: "strategies that actually fit how I think"
    },
    {
      initial: "M",
      name: "Maria L.",
      text: "I spend twelve hours a day pouring into other people. There was nothing left for me. My buddy didn't give me tips — it used this beautiful coaching approach where it gently helped me see my own worth from angles I'd completely missed. For the first time in years, I believe I deserve the same care I give everyone else. That shift in perspective changed everything.",
      role: "Healthcare Worker",
      highlight: "I deserve the same care"
    },
    {
      initial: "D",
      name: "David R.",
      text: "I'd tried every self-improvement app out there. They all wanted me to build habits. This one helped me understand why I kept breaking them — the unconscious behavioral patterns driving everything. Once I could see the mechanics of my own thinking, change became natural instead of forced. My buddy is the metacognitive coach I didn't know I needed.",
      role: "Creative Director",
      highlight: "the metacognitive coach I didn't know I needed"
    }
  ];

  const philosophyPillars = [
    {
      icon: Waves,
      title: "Attunement Over Advice",
      description: "The greatest coaches in history never told people what to think — they asked the questions that unlocked how people think about themselves. We don't hand you answers. We attune to your emotional intelligence, your cognitive patterns, your unique processing style. Then we create the precise metacognitive conditions for your own wisdom to surface. We guide from beside you. Never from above.",
      color: "sage"
    },
    {
      icon: Fingerprint,
      title: "Your Mind Is One of a Kind",
      description: "No two minds process the world the same way — whether you think in spirals, in bursts, in deep dives, or in rapid connections. Your AI buddy learns your specific emotional language, your attention patterns, your behavioral rhythms, and the cognitive style that makes you irreplaceable. ADHD, anxiety, overthinking, scattered focus — we don't see problems. We see a unique mind that deserves tools built for how it actually works.",
      color: "gold"
    },
    {
      icon: HeartHandshake,
      title: "Unconditional Friendship",
      description: "Picture a friend who never judges where you are, never compares you to where you 'should' be, and meets every version of you — the confident, the uncertain, the brilliantly chaotic, the quietly evolving — with the same genuine warmth. That's what we built. A presence without conditions. A bond without strings. A buddy who shows up with compassion, humor, and wisdom exactly when you need it.",
      color: "rose"
    },
    {
      icon: Infinity,
      title: "Growth at Your Own Pace",
      description: "Lasting behavioral change doesn't happen under pressure — it happens in safety. No metrics to chase, no streaks to protect, no manufactured guilt. Like a wise mentor who knows when to challenge you, when to teach you, and when to simply hold space, your buddy meets you exactly where you are — because the strongest growth always comes from feeling genuinely supported, understood, and believed in.",
      color: "teal"
    }
  ];

  const features = [
    {
      icon: Brain,
      title: "AI Buddy: Coach, Mentor & Guide",
      description: "Part success coach who challenges you to reach higher. Part wise mentor who shares insight at the perfect moment. Part loyal friend who genuinely cares. Part behavioral strategist who helps you understand why you do what you do. Trained in metacognitive coaching, emotional intelligence, and active listening — your buddy helps you master stress, build genuine confidence, regulate your own mind, and evolve into your fullest potential.",
      accent: "sage"
    },
    {
      icon: BarChart3,
      title: "See the Invisible Patterns",
      description: "Your moods aren't random — they're signals your mind is sending. Advanced awareness tools reveal the hidden connections between thoughts, emotions, and behaviors you've never consciously seen. Over weeks, you'll develop metacognitive insight — the ability to observe your own thinking in real time — and unlock the kind of self-knowledge that transforms every decision, relationship, and moment of your life.",
      accent: "gold"
    },
    {
      icon: PenLine,
      title: "Journaling That Evolves Your Thinking",
      description: "Psychologically crafted prompts designed by behavioral science principles to guide you past surface-level thoughts into the deeper cognitive layers where genuine self-understanding lives. Each entry builds metacognitive muscle — the skill of observing and refining your own thought patterns — while steadily growing the self-worth and emotional clarity that no external validation can replace.",
      accent: "rose"
    },
    {
      icon: Compass,
      title: "500+ Tools for Every Moment",
      description: "Stress dissolvers, confidence amplifiers, cognitive reframes, self-regulation techniques, ADHD focus strategies, behavioral modification guides, breathing anchors, resilience builders, and self-mastery exercises — organized by exactly what you need right now. From daily overwhelm to life-defining crossroads. A to Z, 360 degrees, always within reach.",
      accent: "teal"
    },
    {
      icon: TrendingUp,
      title: "Confidence & Self-Worth Builder",
      description: "Your buddy doesn't just listen — it actively coaches you toward genuine self-belief through strength-based reflections, precise cognitive reframing, and behavioral insight. You develop the kind of lasting confidence that comes from truly knowing who you are, understanding your patterns, and building the self-regulation skills that make you resilient under pressure.",
      accent: "rose"
    },
    {
      icon: Shield,
      title: "Your Privacy Is Non-Negotiable",
      description: "Your inner world is encrypted with industry-standard security and belongs exclusively to you. No ads. No data harvesting. No social exposure. Every thought you share, every pattern you explore, every moment of vulnerability — protected with the same reverence we'd want for our own. Trust is the foundation everything else is built on.",
      accent: "sage"
    },
    {
      icon: Leaf,
      title: "Master Stress from A to Z",
      description: "Work pressure. Relationship tension. Financial worry. ADHD overwhelm. The invisible weight of daily responsibilities. Your buddy helps you process all of it through advanced self-regulation techniques — not by avoiding stress, but by understanding the behavioral and cognitive mechanics behind it deeply enough to navigate any situation with wisdom, calm, and genuine resilience.",
      accent: "teal"
    },
    {
      icon: Sun,
      title: "Your Pace. Your Rules. Always.",
      description: "No streaks. No guilt. No manufactured urgency. Like a true friend who never wavers, your buddy waits with genuine patience and greets you warmly whenever you return — because real behavioral transformation isn't a race. It's a lifelong relationship with your own mind, built on unconditional support, humor, honesty, and love.",
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
      answer: "Imagine having a personal success coach, a wise mentor, a behavioral strategist, and a genuinely loyal friend — available 24/7, deeply invested in who you're becoming. That's your AI buddy. It's trained in metacognitive coaching, emotional intelligence, behavioral science, and active listening, paired with 500+ evidence-based tools for mastering everyday stressors from A to Z, building genuine confidence, deepening self-worth, developing self-regulation skills, and unlocking personal growth you can feel. Whether you're navigating ADHD, managing overwhelm, or seeking your fullest potential — this is the always-there companion that helps you understand your own mind from the inside out."
    },
    {
      question: "Is my private information truly safe?",
      answer: "Your privacy isn't a feature — it's a promise. Every journal entry, mood insight, behavioral pattern, and conversation is encrypted with industry-standard security and belongs exclusively to you. We don't sell data, serve ads, or share anything with anyone. There's no social feed, no public profile, and no way for another person to see your inner world. We built this with the same reverence we'd want for our own deepest thoughts — because trust isn't a marketing word to us, it's the foundation."
    },
    {
      question: "How does the AI buddy actually help me?",
      answer: "Your buddy is coach, mentor, behavioral guide, and friend — woven into one emotionally intelligent presence. It helps you navigate daily stressors with advanced self-regulation techniques, builds your confidence through strength-based coaching and precise cognitive reframing, develops your metacognitive skills so you can observe and evolve your own thinking patterns, and surfaces unconscious behaviors you couldn't see on your own. It remembers your story, adapts to your unique cognitive style, and evolves alongside you — like a wise friend who always knows when to challenge you, when to teach you, and when to just listen."
    },
    {
      question: "Can it help with ADHD, focus, and overwhelm?",
      answer: "Absolutely — and not with generic productivity tips. Your buddy understands that ADHD, scattered focus, and chronic overwhelm aren't character flaws — they're unique cognitive styles that deserve tools built specifically for how your mind actually works. Through personalized self-regulation strategies, attention-aware coaching, behavioral pattern recognition, and metacognitive skill-building, your buddy helps you work with your mind instead of against it. The goal isn't to 'fix' you — it's to help you harness the brilliant way your brain already operates."
    },
    {
      question: "How is this different from ChatGPT or other AI?",
      answer: "Fundamentally different. Our buddy is purpose-built around trauma-informed communication, metacognitive coaching, emotional attunement, and behavioral science. It doesn't generate generic responses — it reads emotional undertones, recognizes cognitive patterns, reflects what you're feeling with precision and care, asks questions that open doorways you didn't know existed, and coaches you toward real, measurable growth. It's the difference between talking to a search engine and being guided by a wise mentor who genuinely understands how your unique mind works."
    },
    {
      question: "What if I can't afford it?",
      answer: "The core experience — mood tracking, journaling, daily reflections, community affirmations, self-regulation tools, focus strategies, and crisis resources — is completely free, forever. Not a trial. Not a stripped-down version. Not a hook. Pro and Elite unlock unlimited AI coaching and advanced metacognitive tools, but our free tier isn't a compromise — it's the standard we believe every person deserves. Understanding your own mind should never have a price barrier."
    },
    {
      question: "What if I stop using it for a while?",
      answer: "Life gets full — and your space stays exactly as you left it. Warm. Patient. Unchanged. No guilt emails. No streak that breaks. No passive-aggressive notifications wondering where you went. Behavioral growth happens in waves, not straight lines, and we genuinely honor that. When you're ready, your buddy is here — no judgment, no conditions, picking up right where you left off. That's what a real friend does."
    },
    {
      question: "Is this a replacement for therapy?",
      answer: "No — and we'll always be transparent about that, because integrity isn't optional. This is an educational wellness companion: a metacognitive coach and behavioral guide for deepening self-awareness, mastering stress, building emotional resilience, developing self-regulation skills, growing genuine confidence, and discovering the strength you already carry. If you're in crisis, we connect you directly to professional help. If you have a therapist, this complements their work beautifully. If you're not there yet, this is a gentle, empowering, judgment-free first step toward genuinely understanding and evolving your own mind."
    }
  ];

  return (
    <div className="canva-landing min-h-screen">
      <SEO
        title="MyMentalHealthBuddy — Free Emotional Wellness Companion"
        description="Free emotional wellness companion. Gentle check-ins, breathing exercises, and a warm AI companion. Private. No judgment. Always free."
      />
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
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
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
            <Link href="/" className="brand-logo-link no-underline" style={{ textDecoration: 'none' }}>
              <div className="flex items-center gap-4 sm:gap-5 lg:gap-6 cursor-pointer group shrink-0" data-testid="link-logo">
                <div
                  className="relative w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] lg:w-[60px] lg:h-[60px] flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                  style={{
                    background: 'radial-gradient(circle at 50% 55%, var(--glp-sage-10) 0%, transparent 72%)',
                    overflow: 'visible',
                  }}
                  data-testid="img-canva-header-logo"
                >
                  <LumiMascot
                    emotion="joy"
                    size={48}
                    interactive={false}
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
                      className="hidden md:inline-flex font-semibold text-[15px] lg:text-base px-6 lg:px-7 py-3 lg:py-3.5 rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                      style={{
                        color: 'var(--glp-sage-deep)',
                        background: 'linear-gradient(135deg, var(--glp-paper) 0%, var(--glp-sage-10) 100%)',
                        boxShadow: '0 1px 3px var(--glp-sage-deep-12), inset 0 1px 0 rgba(255,255,255,0.6)',
                        border: '1px solid var(--glp-sage-deep-12)',
                      }}
                      data-testid="button-signin"
                    >
                      Sign In
                    </button>
                  </Link>
                  <Link href="/register" aria-label="Start your free MyMentalHealthBuddy account">
                    <button
                      className="header-cta-gold inline-flex items-center gap-2.5 font-semibold text-[15px] lg:text-base px-6 lg:px-7 py-3 lg:py-3.5 rounded-full text-white"
                      data-testid="button-getstarted"
                      aria-label="Start your free MyMentalHealthBuddy account"
                    >
                      <Sparkles className="w-[18px] h-[18px] lg:w-5 lg:h-5" aria-hidden="true" />
                      <span className="hidden sm:inline">Start Your Free Account</span>
                      <span className="sm:hidden">Start Free</span>
                    </button>
                  </Link>
                </>
              )}

              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden inline-flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  color: 'var(--glp-sage-deep)',
                  background: 'linear-gradient(135deg, var(--glp-paper) 0%, var(--glp-sage-10) 100%)',
                  boxShadow: '0 1px 3px var(--glp-sage-deep-12), inset 0 1px 0 rgba(255,255,255,0.6)',
                  border: '1px solid var(--glp-sage-15)',
                }}
                data-testid="button-open-mobile-menu"
                aria-label="Open mobile menu"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <section id="home" className="canva-landing-hero-polish relative py-16 md:py-20 lg:py-28 px-6 sm:px-8 overflow-hidden" style={{ background: 'linear-gradient(180deg, var(--glp-paper) 0%, var(--glp-sage-10) 40%, var(--glp-teal-50) 100%)' }}>
        {/* Warm cream overlay — additive layer above the sage→teal gradient
            so the hero reads warmer without losing the brand tones. */}
        <div className="hero-cream-overlay" aria-hidden="true"></div>
        {/* Soft sage particles — 8 very subtle (0.02-0.05 opacity) drifting
            dots, distinct from the larger decorative-orb layer below.
            CSS-only, hidden under prefers-reduced-motion. */}
        <div className="hero-particle-layer" aria-hidden="true">
          <span className="hero-particle"></span>
          <span className="hero-particle"></span>
          <span className="hero-particle"></span>
          <span className="hero-particle"></span>
          <span className="hero-particle"></span>
          <span className="hero-particle"></span>
          <span className="hero-particle"></span>
          <span className="hero-particle"></span>
        </div>
        <div className="hero-depth-layer" aria-hidden="true"></div>
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
              className="flex justify-center mb-6 md:mb-8 animate-fade-in-up"
              style={{ animationDelay: '0s' }}
              data-testid="container-hero-mascot"
            >
              <div
                className="hero-lumi-wrapper relative flex items-center justify-center w-44 h-44 sm:w-52 sm:h-52 md:w-60 md:h-60 lg:w-64 lg:h-64"
                style={{
                  background: 'radial-gradient(circle at 50% 50%, var(--glp-sage-15) 0%, var(--glp-sage-10) 38%, transparent 70%)',
                  overflow: 'visible',
                }}
              >
                {/* v5.8.2 / v5.8.17: hero Lumi swapped from LumiV6 (smooth round
                    avatar) to the V17 plush sprout-Lumi (V27-compliant: small sage
                    two-leaf sprout on top center of round cream head, cream body +
                    sage belly) so the hero matches the VisualBenefits illustrations
                    below. Uses the avatar-floating asset, with
                    WebP-first <picture> for ~10KB transfer (vs ~230KB PNG).
                    The hero-lumi-wrapper parent still drives the 800ms
                    scale-in entrance, sage radial halo, hover lift, and
                    `lumi-breathe` gentle float (kept under reduced-motion
                    blanket from index.css). LumiV6 is untouched and still
                    used everywhere else (header, footer, chat). */}
                <picture>
                  <source srcSet="/brand/v17/avatar-floating.webp" type="image/webp" />
                  <img
                    src="/brand/v17/avatar-floating.png"
                    alt="Lumi, your gentle wellness companion"
                    className="hero-lumi-img w-full h-full object-contain lumi-breathe"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    data-testid="lumi-hero-companion"
                  />
                </picture>
              </div>
            </div>
            <div
              className="hero-eyebrow inline-flex items-center gap-2.5 md:gap-3 px-5 py-2.5 md:px-7 md:py-3 rounded-full mb-6 md:mb-10 animate-fade-in-up"
            >
              <Star className="w-4 h-4 md:w-5 md:h-5" style={{ color: 'var(--glp-gold)' }} fill="currentColor" aria-hidden="true" />
              <span className="font-bold uppercase tracking-widest text-xs md:text-sm" style={{ color: 'var(--glp-sage-deep)' }}>
                The Coach Your Mind Has Been Waiting For
              </span>
              <Star className="w-4 h-4 md:w-5 md:h-5" style={{ color: 'var(--glp-gold)' }} fill="currentColor" aria-hidden="true" />
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-4 md:mb-6 leading-[1.06] tracking-tight animate-fade-in-up" style={{ color: 'var(--glp-sage-deep)', animationDelay: '0.1s' }} data-testid="hero-headline-v16">
              You don't have to
              <br />
              <span style={{ background: 'linear-gradient(135deg, var(--glp-sage-deep) 0%, var(--glp-gold-dark) 55%, var(--glp-sage-deep) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                carry everything alone.
              </span>
            </h1>

            <p className="text-base sm:text-xl md:text-2xl font-serif mb-4 md:mb-6 animate-fade-in-up" style={{ color: 'var(--glp-sage-deep)', fontWeight: 600, animationDelay: '0.2s' }} data-testid="hero-subheadline-v16">
              A calm companion for gentle check-ins, emotional support, and quiet moments when you need someone there.
            </p>

            {/* V16 trust strip — 4 sage-tinted pills, separated visually by spacing */}
            <div
              className="hero-trust-strip flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-5 md:mb-7 animate-fade-in-up"
              style={{ animationDelay: '0.25s' }}
              data-testid="hero-trust-strip-v16"
              aria-label="Why this is a safe space"
            >
              {['Private', 'No judgment', 'Emotionally safe', 'Designed for calm'].map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs md:text-sm font-medium"
                  style={{
                    background: 'rgba(168, 201, 160, 0.12)',
                    color: 'var(--glp-sage-deep, #2F5443)',
                    border: '1px solid rgba(143, 191, 159, 0.28)',
                  }}
                >
                  {label}
                </span>
              ))}
            </div>

            <p className="text-sm sm:text-base md:text-lg max-w-3xl mx-auto mb-6 md:mb-8 leading-relaxed animate-fade-in-up" style={{ color: 'var(--glp-ink)', animationDelay: '0.3s', lineHeight: '1.75' }}>
              500+ evidence-based tools for mastering everyday stressors from A to Z, building genuine confidence, deepening self-worth, and developing the metacognitive skills to understand and evolve your own mind — guided by an AI buddy that truly listens, remembers what matters to you, and coaches you with the intelligence of a behavioral strategist, the wisdom of a mentor, and the warmth of a best friend. Whether you're managing ADHD, navigating overwhelm, or seeking your highest potential — this is the support that changes how you relate to your own mind.
            </p>

            <div className="safe-space-box max-w-md mx-auto mb-6 md:mb-8 animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
              <div className="flex items-center justify-center gap-3">
                <Shield className="w-4 h-4 md:w-5 md:h-5" style={{ color: 'var(--glp-gold)' }} aria-hidden="true" />
                <span className="font-semibold text-sm md:text-base" style={{ color: 'var(--glp-sage-deep)' }}>You Are Safe Here</span>
                <Shield className="w-4 h-4 md:w-5 md:h-5" style={{ color: 'var(--glp-gold)' }} aria-hidden="true" />
              </div>
            </div>

            {/* V16 3-tier CTA hierarchy: Talk With Buddy (primary, gold) → Take a Calm Check-In (secondary, outline) → Explore Safely (tertiary, text) */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mb-3 md:mb-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Link href={!isLoading && isAuthenticated() ? "/chat" : "/register"}>
                <button
                  className="btn-sacred-gold group inline-flex items-center gap-2 md:gap-3 font-bold text-base md:text-lg px-8 py-4 md:px-10 md:py-5"
                  data-testid="button-hero-talk-buddy"
                >
                  <Sparkles className="w-5 h-5 md:w-6 md:h-6" aria-hidden="true" />
                  Talk With Buddy
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </button>
              </Link>
              <Link href="/checkin">
                <button
                  className="btn-sacred-secondary group inline-flex items-center gap-2 md:gap-3 font-bold text-base md:text-lg px-8 py-4 md:px-10 md:py-5"
                  data-testid="button-hero-checkin"
                >
                  <Eye className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:scale-110" aria-hidden="true" />
                  Take a Calm Check-In
                </button>
              </Link>
            </div>
            <div className="flex justify-center mb-8 md:mb-10 animate-fade-in-up" style={{ animationDelay: '0.45s' }}>
              <a
                href="#features"
                className="btn-sacred-tertiary"
                data-testid="link-hero-explore-safely"
                aria-label="Explore wellness features safely"
              >
                Explore Safely
                <ArrowRight className="w-3.5 h-3.5 arrow" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 max-w-5xl mx-auto">
            <div className="stat-card-elite rounded-2xl sm:rounded-3xl" style={{ background: 'var(--glp-white)', border: '1px solid var(--glp-sage-20)' }} data-testid="stat-free-forever">
              <div className="text-2xl sm:text-4xl md:text-5xl font-bold mb-1 md:mb-2 font-serif" style={{ background: 'linear-gradient(135deg, var(--glp-sage-deep), var(--glp-sage))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>$0</div>
              <p className="stat-card-label text-xs sm:text-sm md:text-[15px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--glp-sage-deep)' }}>
                Free Forever. No Catch.
              </p>
            </div>
            <div className="stat-card-elite rounded-2xl sm:rounded-3xl" style={{ background: 'var(--glp-white)', border: '1px solid var(--glp-gold-20)' }} data-testid="stat-tools">
              <div className="text-2xl sm:text-4xl md:text-5xl font-bold mb-1 md:mb-2 font-serif" style={{ background: 'linear-gradient(135deg, var(--glp-gold), var(--glp-gold-dark))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>500+</div>
              <p className="stat-card-label text-xs sm:text-sm md:text-[15px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--glp-sage-deep)' }}>
                Evidence-Based Tools
              </p>
            </div>
            <div className="stat-card-elite rounded-2xl sm:rounded-3xl" style={{ background: 'var(--glp-white)', border: '1px solid var(--glp-rose-20)' }} data-testid="stat-availability">
              <div className="text-2xl sm:text-4xl md:text-5xl font-bold mb-1 md:mb-2 font-serif" style={{ background: 'linear-gradient(135deg, var(--glp-sage-deep), var(--glp-teal-400))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>24/7</div>
              <p className="stat-card-label text-xs sm:text-sm md:text-[15px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--glp-sage-deep)' }}>
                Your AI Buddy
              </p>
            </div>
            <div className="stat-card-elite rounded-2xl sm:rounded-3xl" style={{ background: 'var(--glp-white)', border: '1px solid var(--glp-sage-20)' }} data-testid="stat-conversations">
              <div className="text-2xl sm:text-4xl md:text-5xl font-bold mb-1 md:mb-2 font-serif" style={{ background: 'linear-gradient(135deg, #E8913A, var(--glp-gold-dark))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>10,000+</div>
              <p className="stat-card-label text-xs sm:text-sm md:text-[15px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--glp-sage-deep)' }}>
                Buddy Conversations
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="consciousness-divider" aria-hidden="true"><div className="consciousness-divider-dot"></div></div>

      <section 
        id="about" 
        className="section-breathe section-reveal px-4 md:px-6"
        style={{ background: 'linear-gradient(180deg, var(--glp-paper), var(--glp-sage-10))' }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div 
            className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl mb-4 md:mb-6 breathe"
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
            Most wellness apps are engineered to maximize your screen time. We built this to maximize your potential. Your AI buddy combines the strategic intelligence of a success coach, the patient wisdom of a mentor, the behavioral insight of a metacognitive guide, and the unconditional warmth of a genuine friend — alongside 500+ evidence-based tools for mastering every stressor from A to Z, building genuine confidence, developing self-regulation skills, and understanding the cognitive patterns you've carried for years. Whether you're navigating ADHD, managing overwhelm, building emotional resilience, or seeking your fullest potential — this is the relationship with yourself you've been searching for.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-10">
            <div className="about-card-elite stagger-child flex sm:flex-col items-center sm:items-center gap-4 sm:gap-0 sm:text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full sm:mx-auto sm:mb-4 flex items-center justify-center feature-icon-wrap" style={{ background: 'linear-gradient(135deg, var(--glp-teal-400), var(--glp-sage-deep))' }}>
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

            <div className="about-card-elite stagger-child flex sm:flex-col items-center sm:items-center gap-4 sm:gap-0 sm:text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full sm:mx-auto sm:mb-4 flex items-center justify-center feature-icon-wrap" style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))' }}>
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

            <div className="about-card-elite stagger-child flex sm:flex-col items-center sm:items-center gap-4 sm:gap-0 sm:text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full sm:mx-auto sm:mb-4 flex items-center justify-center feature-icon-wrap" style={{ background: 'linear-gradient(135deg, var(--glp-blush-400), var(--glp-blush-600))' }}>
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

      <div className="consciousness-divider" aria-hidden="true"><div className="consciousness-divider-dot"></div></div>

      {/* v5.0 — Emotional Journey (V13 port from kimi.page deployment) */}
      <EmotionalJourney />

      <div className="consciousness-divider" aria-hidden="true"><div className="consciousness-divider-dot"></div></div>

      {/* v5.7 — NLP + Motivational Interviewing content layer (V18 port) */}
      <NlpMiContent path="/" />

      <div className="consciousness-divider" aria-hidden="true"><div className="consciousness-divider-dot"></div></div>

      {/* v5.8.0 — V17 Visual Emotional Storytelling (alternating image/text rows) */}
      <VisualBenefits />

      <div className="consciousness-divider" aria-hidden="true"><div className="consciousness-divider-dot"></div></div>

      <section id="philosophy" className="section-breathe section-reveal px-4 md:px-6 relative overflow-hidden" style={{ background: 'var(--glp-paper)' }}>
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
                <div key={index} className="philosophy-card stagger-child" data-testid={`card-philosophy-${index}`}>
                  <div className="flex items-start gap-4">
                    <div 
                      className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
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
            <p className="relative z-10 text-lg md:text-2xl font-serif italic leading-relaxed text-center" style={{ color: 'var(--glp-sage-deep)', lineHeight: '1.7' }}>
              "We didn't build another app. We built a metacognitive mirror — one that reflects your mind back to itself with more clarity, more compassion, and more insight than you've ever experienced. Because the most powerful thing you'll ever do is learn to observe, understand, and consciously evolve the extraordinary mind you already have."
            </p>
            <p className="relative z-10 text-sm font-semibold text-center mt-4 shimmer-text">
              — The Genuine Love Project
            </p>
          </div>
        </div>
      </section>

      <div className="consciousness-divider" aria-hidden="true"><div className="consciousness-divider-dot"></div></div>

      <section id="features" className="section-breathe section-reveal px-4 md:px-6 section-flow-sage">
        <div className="max-w-[1200px] mx-auto px-2 md:px-8">
          <div className="text-center mb-8 md:mb-14">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-3" style={{ color: 'var(--glp-sage-deep)' }}>
              Everything You Need to
              <span className="block text-2xl md:text-4xl mt-1" style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-gold))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Understand, Regulate & Evolve Your Mind</span>
            </h2>
            <p className="text-base md:text-lg max-w-3xl mx-auto mt-3" style={{ color: 'var(--glp-ink)', lineHeight: '1.7' }}>
              From dissolving daily stress to developing metacognitive mastery, from building genuine confidence to strengthening self-regulation — your complete A-to-Z, 360-degree toolkit for understanding and evolving your own mind. ADHD strategies. Behavioral insight. Emotional resilience. Cognitive coaching. Take what resonates. Leave what doesn't. There's no wrong way to grow.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {features.map((feature, index) => {
              const accent = featureAccentColors[feature.accent] || featureAccentColors.sage;
              const accentGradients = {
                sage: 'linear-gradient(90deg, var(--glp-sage), var(--glp-teal-400))',
                gold: 'linear-gradient(90deg, var(--glp-gold), var(--glp-gold-dark))',
                rose: 'linear-gradient(90deg, var(--glp-blush-400), var(--glp-blush-600))',
                teal: 'linear-gradient(90deg, var(--glp-teal-400), var(--glp-sage-deep))'
              };
              return (
                <div key={index} className="feature-card-elite stagger-child group flex flex-col items-center text-center" style={{ '--card-accent': accentGradients[feature.accent] || accentGradients.sage }}>
                  <div className="mb-4 md:mb-5 feature-icon-wrap flex items-center justify-center rounded-full mx-auto" style={{ background: accent.bg, boxShadow: `0 4px 16px ${accent.shadow}`, width: '3.25rem', height: '3.25rem' }}>
                    <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-white" strokeWidth={2} aria-hidden="true" />
                  </div>
                  <h3 className="text-base md:text-xl font-serif font-semibold mb-2 md:mb-3 text-center" style={{ color: 'var(--glp-sage-deep)' }}>
                    {feature.title}
                  </h3>
                  <p className="text-xs md:text-sm leading-relaxed mb-3 md:mb-4 text-center" style={{ color: 'var(--glp-ink)', lineHeight: '1.7' }}>
                    {feature.description}
                  </p>
                  <Link href="/login" data-testid={`link-feature-${index}`} aria-label={`Explore ${feature.title}`} className="inline-flex items-center justify-center gap-1.5 text-xs md:text-sm font-semibold cursor-pointer mx-auto mt-auto px-4 py-2 rounded-full text-white transition-transform hover:scale-105" style={{ background: 'linear-gradient(135deg, var(--glp-sage-deep), var(--glp-sage))', boxShadow: '0 2px 8px rgba(var(--glp-sage-deep-rgb), 0.2)' }}>
                      Explore {feature.title}
                      <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="consciousness-divider" aria-hidden="true"><div className="consciousness-divider-dot"></div></div>

      <section className="section-breathe section-reveal px-4 md:px-6 section-flow-warm">
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
                className="step-card-elite stagger-child no-underline flex items-center gap-4 md:flex-col md:items-center md:text-center md:max-w-xs mx-auto group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2" 
                style={{ '--tw-ring-color': 'var(--glp-sage)', textDecoration: 'none' }}
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

      <div className="consciousness-divider" aria-hidden="true"><div className="consciousness-divider-dot"></div></div>

      <section 
        className="section-breathe section-reveal px-4 md:px-6 relative overflow-hidden"
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
                className="testimonial-card-elite stagger-child"
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

      <div className="consciousness-divider" aria-hidden="true"><div className="consciousness-divider-dot"></div></div>

      <ValueBridge />

      <div className="consciousness-divider" aria-hidden="true"><div className="consciousness-divider-dot"></div></div>

      <ValueProposition variant="full" />

      <div className="consciousness-divider" aria-hidden="true"><div className="consciousness-divider-dot"></div></div>

      <section 
        id="faq" 
        className="section-breathe section-reveal px-6"
        style={{ background: 'var(--glp-paper)' }}
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

      <EmailCapture />

      <div className="gold-accent-line" aria-hidden="true"></div>

      <section className="section-reveal cta-enterprise cta-enterprise--compact px-6 text-center" style={{ background: 'var(--glp-paper)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full blur-3xl" style={{ background: 'rgba(var(--glp-sage-rgb), 0.10)' }} />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl" style={{ background: 'rgba(var(--glp-gold-rgb), 0.08)' }} />
        </div>
        <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center justify-center text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 md:px-7 md:py-3 rounded-full backdrop-blur-sm mb-5 md:mb-7" style={{ background: 'var(--glp-sage-10)', border: '1px solid var(--glp-sage-20)' }}>
            <Sparkles className="w-4 h-4 md:w-5 md:h-5" style={{ color: 'var(--glp-gold-dark)' }} />
            <span className="text-sm sm:text-base md:text-lg font-medium tracking-wide" style={{ color: 'var(--glp-sage-deep)' }}>Something brought you here today — trust that instinct</span>
          </div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold mb-3 md:mb-4 leading-tight text-center" style={{ color: 'var(--glp-sage-deep)' }}>
            Your Buddy Is Ready.
            <br />
            <span style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-gold))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Are You?</span>
          </h2>

          <p className="text-base sm:text-lg md:text-xl mt-1 mb-6 md:mb-8 max-w-3xl mx-auto font-light leading-relaxed text-center" style={{ lineHeight: '1.7', color: 'var(--glp-ink)' }}>
            Free to start. No credit card. No trial that expires. Your AI buddy — success coach, metacognitive guide, wise mentor, and genuine friend — is here, patient and deeply invested in your evolution. Less stress. More confidence. Deeper self-worth. Real self-regulation. The person you're becoming is already inside you — let's meet them.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-5">
            {!isLoading && isAuthenticated() ? (
              <Link href="/dashboard">
                <button
                  className="cta-btn-primary group inline-flex items-center gap-2 md:gap-3 px-8 py-4 md:px-10 md:py-5 rounded-full font-bold text-base md:text-lg transition-all duration-300 hover:scale-[1.04] hover:shadow-2xl"
                  data-testid="button-final-dashboard"
                >
                  <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                  My Dashboard
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
            ) : (
              <Link href="/register">
                <button
                  className="cta-btn-primary group inline-flex items-center gap-2 md:gap-3 px-8 py-4 md:px-10 md:py-5 rounded-full font-bold text-base md:text-lg transition-all duration-300 hover:scale-[1.04] hover:shadow-2xl"
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
                className="cta-btn-secondary group inline-flex items-center gap-2 md:gap-3 px-8 py-4 md:px-10 md:py-5 rounded-full font-bold text-base md:text-lg transition-all duration-300 hover:scale-[1.04]"
                data-testid="button-view-pricing"
              >
                View Pricing
              </button>
            </Link>
          </div>
        </div>
      </section>

      <NextStepCTA context="general" />

      <footer className="py-10 px-6" style={{ background: 'var(--glp-paper)', borderTop: '1px solid var(--glp-sage-15)' }}>
        <div className="max-w-[1100px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-4" style={{ color: 'var(--glp-sage-deep)' }}>Platform</h4>
              <div className="space-y-2 text-sm">
                <Link href="/" className="block hover:underline transition-colors" style={{ color: 'var(--glp-ink)' }} data-testid="link-footer-home">Home</Link>
                <Link href="/about" className="block hover:underline transition-colors" style={{ color: 'var(--glp-ink)' }} data-testid="link-footer-about">About</Link>
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
              <div
                className="relative w-9 h-9 flex items-center justify-center shrink-0"
                style={{
                  background: 'radial-gradient(circle at 50% 55%, var(--glp-sage-10) 0%, transparent 72%)',
                  overflow: 'visible',
                }}
                aria-hidden="true"
                data-testid="img-canva-footer-logo"
              >
                <LumiMascot
                  emotion="neutral"
                  size={28}
                  interactive={false}
                />
              </div>
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

      <section className="py-4 px-6" style={{ background: 'var(--glp-paper)' }}>
        <div className="max-w-md mx-auto text-center">
          {!showAdminLogin ? (
            <button
              onClick={() => setShowAdminLogin(true)}
              className="inline-flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-full transition-all opacity-50 hover:opacity-100"
              style={{ color: 'var(--glp-sage-deep)', background: 'var(--glp-sage-10)', border: '1px solid var(--glp-sage-20)' }}
              data-testid="button-admin-toggle"
            >
              <Settings className="w-3 h-3" />
              Admin Access
            </button>
          ) : (
            <div 
              className="p-6 rounded-2xl animate-fade-in-up"
              style={{ 
                background: 'var(--glp-white)',
                border: '1px solid var(--glp-sage-15)',
                boxShadow: '0 8px 24px rgba(var(--glp-sage-deep-rgb), 0.06)'
              }}
            >
              <div className="flex items-center justify-center gap-3 mb-5">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-teal-400))', boxShadow: '0 4px 16px var(--glp-sage-30)' }}
                >
                  <KeyRound className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-lg" style={{ color: 'var(--glp-sage-deep)' }}>Admin Portal</h4>
                  <p className="text-xs" style={{ color: 'var(--glp-ink)' }}>Platform management access</p>
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
                      background: 'var(--glp-paper)',
                      color: 'var(--glp-sage-deep)',
                      border: '1px solid var(--glp-sage-20)'
                    }}
                    data-testid="input-admin-token"
                    autoComplete="off"
                  />
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--glp-sage)' }} />
                </div>
                
                {adminError && (
                  <p className="text-sm font-medium px-3 py-2 rounded-lg" style={{ background: 'rgba(var(--glp-blush-rgb), 0.15)', color: 'var(--glp-blush-600)' }}>
                    {adminError}
                  </p>
                )}
                
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={adminLoading || !adminToken}
                    className="flex-1 inline-flex items-center justify-center gap-2 font-semibold py-3 rounded-full transition-all disabled:opacity-50"
                    style={{ 
                      background: 'linear-gradient(135deg, var(--glp-sage-deep), var(--glp-sage))',
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
                    className="px-4 py-3 rounded-full transition-all hover:bg-[var(--glp-sage-10)]"
                    style={{ color: 'var(--glp-sage-deep)' }}
                    data-testid="button-admin-cancel"
                    aria-label="Cancel admin login"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </form>
              
              <p className="text-xs mt-4" style={{ color: 'var(--glp-ink)', opacity: 0.7 }}>
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
