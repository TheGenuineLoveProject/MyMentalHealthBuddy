import { Link } from "wouter";
import SEO from "../components/SEO";
import { Shield, Sparkles, Brain, ArrowRight, Star, Leaf, Users, Heart, Compass, BookOpen, Moon, Sun, Zap, Target, Lightbulb, Feather, Eye, Anchor } from "lucide-react";

const transformationalFeatures = [
  {
    icon: Brain,
    title: "AI-Powered Therapeutic Companion",
    description: "A trauma-informed AI trained in IFS, polyvagal theory, and attachment science. Not a chatbot—a compassionate presence that meets you exactly where you are, without judgment or timelines."
  },
  {
    icon: Heart,
    title: "Inner Child Healing",
    description: "Gentle reparenting exercises to heal the wounds that formed before you had words for them. Give your younger self what they always needed: safety, validation, and unconditional love."
  },
  {
    icon: Shield,
    title: "Nervous System Regulation",
    description: "Evidence-based tools grounded in polyvagal theory to shift from fight-flight-freeze into calm presence. Your nervous system isn't broken—it's protecting you. Learn to work with it."
  },
  {
    icon: Compass,
    title: "Parts Work & IFS",
    description: "Internal Family Systems-informed practices to befriend all parts of yourself—even the ones you've tried to hide. Every part has a purpose. Every part deserves compassion."
  },
  {
    icon: Eye,
    title: "Somatic Awareness",
    description: "The body keeps the score, and it also holds the path to healing. Gentle body-based practices to release stored trauma and reconnect with embodied wisdom."
  },
  {
    icon: Anchor,
    title: "Attachment Healing",
    description: "Understand your relationship patterns and develop earned secure attachment. Whether anxious, avoidant, or disorganized—secure connection is possible at any age."
  }
];

const healingPillars = [
  {
    title: "Private By Design",
    icon: Shield,
    description: "Your healing journey is yours alone. End-to-end encryption, no social features requiring performance, no one watching your progress but you. Complete privacy for complete honesty.",
    stat: "Zero data shared"
  },
  {
    title: "Trauma-Informed",
    icon: Heart,
    description: "Every tool, prompt, and interaction is designed with trauma sensitivity. We understand triggers, we respect your pace, and we never push you beyond your window of tolerance.",
    stat: "100% trauma-aware"
  },
  {
    title: "Evidence-Based",
    icon: BookOpen,
    description: "Grounded in decades of research from IFS, polyvagal theory, attachment science, DBT, ACT, and somatic experiencing. Not pop psychology—real science that creates real change.",
    stat: "50+ research studies"
  },
  {
    title: "Available Always",
    icon: Moon,
    description: "Healing doesn't follow a 9-5 schedule. Whether it's 3 AM anxiety or a Sunday afternoon breakthrough, your AI companion and tools are here, always ready, never judging.",
    stat: "24/7 availability"
  }
];

const testimonialQuotes = [
  {
    quote: "For the first time, I understand why I react the way I do. This platform helped me see my patterns not as flaws, but as adaptations. That reframe changed everything.",
    attribution: "From someone healing attachment wounds"
  },
  {
    quote: "The inner child work brought up tears I'd been holding for decades. But the way it's structured—gentle, paced, with grounding between—made it feel safe for the first time.",
    attribution: "From a trauma survivor"
  },
  {
    quote: "I've been in therapy for years, and this platform amplifies that work beautifully. It gives me tools to practice between sessions and language to understand my experience.",
    attribution: "From someone on their healing journey"
  }
];

const healingApproach = [
  {
    icon: Lightbulb,
    title: "Understand",
    description: "Psychoeducation helps you make sense of your experience. When you understand why you react the way you do, shame dissolves into compassion."
  },
  {
    icon: Feather,
    title: "Feel",
    description: "Gentle practices to safely access and process emotions that were too overwhelming to feel at the time. Healing happens through feeling, not bypassing."
  },
  {
    icon: Zap,
    title: "Regulate",
    description: "Nervous system tools to expand your window of tolerance. Learn to move from survival mode into presence, calm, and genuine connection."
  },
  {
    icon: Target,
    title: "Integrate",
    description: "Weave your insights into daily life. Transform intellectual understanding into embodied wisdom and lasting change."
  }
];

export default function Home() {
  return (
    <div className="min-h-screen hero-gradient overflow-hidden relative">
      <SEO 
        title="The Genuine Love Project — Heal at Your Own Pace" 
        description="A trauma-informed sanctuary for emotional healing. AI-powered therapy tools, inner child work, nervous system regulation, and parts work—all in complete privacy, on your timeline."
      />

      <div className="decorative-orb decorative-orb-sage w-[600px] h-[600px] -top-40 -left-40 absolute" aria-hidden="true" />
      <div className="decorative-orb decorative-orb-blush w-[450px] h-[450px] top-32 -right-40 absolute" aria-hidden="true" />
      <div className="decorative-orb decorative-orb-gold w-[300px] h-[300px] bottom-32 left-1/4 absolute" aria-hidden="true" />

      <nav 
        className="relative z-10 mx-auto max-w-6xl py-5 px-6 flex items-center justify-between"
        role="banner"
      >
        <Link href="/" className="flex items-center gap-4 min-w-0">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))', boxShadow: '0 4px 16px var(--glp-sage-30)' }}>
            <img 
              src="/brand/logo-mark.png" 
              alt="The Genuine Love Project" 
              className="h-9 w-9 sm:h-10 sm:w-10 object-contain"
              data-testid="img-home-logo"
            />
          </div>
          <span className="text-xl font-bold hidden md:block" style={{ color: 'var(--glp-sage-deep)' }}>
            The Genuine Love Project
          </span>
        </Link>
        <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
          <Link 
            href="/pricing" 
            className="text-sm font-medium transition-colors hidden sm:block hover:opacity-80"
            style={{ color: 'var(--glp-sage)' }}
            data-testid="link-pricing-nav"
          >
            Pricing
          </Link>
          <Link 
            href="/login" 
            className="btn-secondary-premium btn-sm whitespace-nowrap"
            data-testid="link-login"
          >
            Sign in
          </Link>
        </div>
      </nav>

      <main className="relative z-10 content-wrapper content-max-lg pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="content-center space-y-6 animate-fade-in-up">
          <span className="badge badge-sage badge-lg animate-bounce-subtle">
            <Leaf className="w-3.5 h-3.5" />
            Trusted by 50,000+ healing hearts
          </span>
          
          <h1 
            className="text-display-lg text-center max-w-4xl"
            style={{ color: 'var(--glp-sage-deep)' }}
            data-testid="text-headline"
          >
            Your sanctuary for emotional healing—
            <span className="text-gradient-brand block mt-2">where transformation happens at your own pace, on your own terms.</span>
          </h1>

          <p className="text-lead text-center mx-auto max-w-2xl" data-testid="text-subheadline">
            A trauma-informed space built for people who carry more than they show. 
            Process grief, calm your nervous system, heal attachment wounds, meet your inner child—all in complete privacy, with an AI companion that truly understands.
          </p>

          <div className="flex flex-wrap justify-center gap-3 text-body-sm" data-testid="text-not-therapy">
            <span className="px-4 py-2 rounded-full flex items-center gap-2" style={{ background: 'var(--glp-sage-10)' }}>
              <Shield className="w-4 h-4" style={{ color: 'var(--glp-sage)' }} />
              Private by design
            </span>
            <span className="px-4 py-2 rounded-full flex items-center gap-2" style={{ background: 'var(--glp-teal-50)' }}>
              <Heart className="w-4 h-4" style={{ color: 'var(--glp-sage-deep)' }} />
              Trauma-informed
            </span>
            <span className="px-4 py-2 rounded-full flex items-center gap-2" style={{ background: 'var(--glp-gold-10)' }}>
              <Brain className="w-4 h-4" style={{ color: 'var(--glp-gold-dark)' }} />
              Evidence-based
            </span>
            <span className="px-4 py-2 rounded-full flex items-center gap-2" style={{ background: 'var(--glp-rose-15)' }}>
              <Star className="w-4 h-4" style={{ color: 'var(--glp-rose)' }} />
              AI-powered 24/7
            </span>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/register"
              className="btn-premium btn-lg animate-glow-pulse"
              data-testid="button-begin"
            >
              <Heart className="w-5 h-5 mr-2" />
              Begin Your Healing Journey
            </Link>
            <Link
              href="/pricing"
              className="btn-ghost inline-flex items-center gap-2 group"
              data-testid="link-how-it-works"
            >
              See how it works
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="separator-gradient mt-16 md:mt-20" />

        <section className="mt-16 md:mt-20">
          <div className="content-center space-y-4 mb-12">
            <h2 className="text-display-sm text-center" style={{ color: 'var(--glp-sage-deep)' }}>Healing Modalities Grounded in Science</h2>
            <p className="text-lead text-center max-w-3xl mx-auto">
              Not pop psychology or positive thinking platitudes. Real therapeutic approaches—IFS, polyvagal theory, somatic experiencing, attachment science—made accessible for your daily practice.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="features-grid">
            {transformationalFeatures.map((feature, idx) => (
              <div 
                key={idx}
                className="card-elevated group animate-fade-in-scale" 
                style={{ animationDelay: `${idx * 100}ms` }}
                data-testid={`card-feature-${idx}`}
              >
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform"
                  style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))' }}
                >
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-heading-sm mb-2" style={{ color: 'var(--glp-sage-deep)' }}>{feature.title}</h3>
                <p className="text-body-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 md:mt-28 rounded-3xl p-8 md:p-12" style={{ background: 'linear-gradient(135deg, var(--glp-sage-10), var(--glp-teal-50))' }}>
          <div className="content-center space-y-4 mb-10">
            <h2 className="text-display-sm text-center" style={{ color: 'var(--glp-sage-deep)' }}>The Journey of Genuine Healing</h2>
            <p className="text-lead text-center max-w-2xl mx-auto">
              Healing isn't about becoming someone new—it's about coming home to who you've always been, beneath the wounds and adaptations.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {healingApproach.map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full shadow-lg flex items-center justify-center mb-4" style={{ background: 'var(--glp-paper)' }}>
                  <step.icon className="w-8 h-8" style={{ color: 'var(--glp-sage-deep)' }} />
                </div>
                <h3 className="text-heading-sm mb-2" style={{ color: 'var(--glp-sage-deep)' }}>{step.title}</h3>
                <p className="text-body-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 md:mt-28">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {healingPillars.map((pillar, idx) => (
              <div key={idx} className="card-bordered text-center group hover:shadow-xl transition-shadow" style={{ background: 'var(--glp-paper)' }}>
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform"
                  style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))' }}
                >
                  <pillar.icon className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold mb-2" style={{ color: 'var(--glp-sage-deep)' }}>{pillar.stat}</div>
                <h3 className="text-heading-sm mb-2" style={{ color: 'var(--glp-sage-deep)' }}>{pillar.title}</h3>
                <p className="text-body-sm">{pillar.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 md:mt-28">
          <div className="content-center space-y-4 mb-12">
            <h2 className="text-display-sm text-center" style={{ color: 'var(--glp-sage-deep)' }}>Words From The Healing Path</h2>
            <p className="text-lead text-center max-w-2xl mx-auto">
              Real experiences from people using these tools to transform their relationship with themselves.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonialQuotes.map((testimonial, idx) => (
              <div key={idx} className="card-elevated" style={{ borderLeft: '4px solid var(--glp-sage)' }}>
                <blockquote className="text-body italic mb-4" style={{ color: 'var(--glp-ink)' }}>
                  "{testimonial.quote}"
                </blockquote>
                <p className="text-body-sm" style={{ color: 'var(--glp-sage)' }}>— {testimonial.attribution}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 content-center">
          <div className="stat-card text-center">
            <div className="stat-value">50K+</div>
            <div className="stat-label">Healing Journeys Started</div>
          </div>
          <div className="stat-card text-center">
            <div className="stat-value">1000+</div>
            <div className="stat-label">Therapeutic Tools</div>
          </div>
          <div className="stat-card text-center">
            <div className="stat-value">24/7</div>
            <div className="stat-label">AI Companion Available</div>
          </div>
          <div className="stat-card text-center">
            <div className="stat-value">100%</div>
            <div className="stat-label">Private & Encrypted</div>
          </div>
        </div>

        <section className="mt-20 md:mt-28 content-center space-y-8">
          <blockquote className="text-quote max-w-2xl" data-testid="text-philosophy">
            "Your nervous system isn't broken—it's protecting you based on what it learned. Healing is teaching it that you're safe now, that the past is over, that a different way of being is possible."
          </blockquote>
          
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h3 className="text-heading-md" style={{ color: 'var(--glp-sage-deep)' }}>Built for Real, Deep Healing</h3>
            <p className="text-body text-secondary">
              We understand that emotional work isn't linear. Some days you'll feel ready to dive deep into trauma processing. 
              Other days, you might just need a breathing exercise to regulate your nervous system. 
              Some moments call for inner child work; others need grounding and containment.
              This platform meets you wherever you are—with compassion, privacy, and tools that actually work.
            </p>
          </div>

          <div className="rounded-2xl p-6 max-w-3xl mx-auto" style={{ background: 'var(--glp-gold-10)', border: '1px solid var(--glp-gold-30)' }}>
            <p className="text-body-sm text-center" style={{ color: 'var(--glp-gold-dark)' }}>
              <strong>Important:</strong> This platform is designed to support your healing journey but is not a replacement for professional mental health care. 
              If you're in crisis, please reach out to a crisis line or mental health professional. 
              These tools are meant to complement therapy, not replace it.
            </p>
          </div>
        </section>

        <section className="mt-16 md:mt-20 content-center">
          <div className="rounded-3xl p-8 md:p-12 text-white text-center" style={{ background: 'linear-gradient(135deg, var(--glp-sage-deep), var(--glp-sage))' }}>
            <Heart className="w-12 h-12 mx-auto mb-4 opacity-80" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Begin Your Healing Journey Today</h2>
            <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
              You don't need to be ready. You don't need to have it figured out. You just need to show up—the rest unfolds from there.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 font-semibold rounded-xl hover:opacity-90 transition-colors shadow-lg"
              style={{ background: 'var(--glp-paper)', color: 'var(--glp-sage-deep)' }}
              data-testid="button-cta-bottom"
            >
              <Sparkles className="w-5 h-5" />
              Start Free—No Credit Card Required
            </Link>
          </div>
        </section>
      </main>

      <footer className="relative z-10 py-8" style={{ borderTop: '1px solid var(--glp-sage-20)', background: 'var(--glp-sage-10)' }}>
        <div className="content-wrapper flex flex-col md:flex-row items-center justify-between gap-4 text-body-sm">
          <span style={{ color: 'var(--glp-sage-deep)' }}>© {new Date().getFullYear()} The Genuine Love Project</span>
          <div className="flex gap-6">
            <Link href="/pricing" className="transition-colors hover:opacity-80" style={{ color: 'var(--glp-sage)' }} data-testid="link-pricing">
              Pricing
            </Link>
            <Link href="/blog" className="transition-colors hover:opacity-80" style={{ color: 'var(--glp-sage)' }} data-testid="link-blog">
              Writing
            </Link>
            <Link href="/crisis" className="transition-colors hover:opacity-80" style={{ color: 'var(--glp-sage)' }} data-testid="link-crisis">
              Crisis Resources
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
