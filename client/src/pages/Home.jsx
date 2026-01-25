import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { gsap } from 'gsap';
import AOS from 'aos';
import 'aos/dist/aos.css';
import SEO from '../components/SEO';
import { 
  SacredLayout, 
  SacredSection, 
  Hero, 
  PlatformComponent, 
  SacredFooter 
} from '../components/sacred';
import { BenefitsStrip, BeforeAfter, TrustSignals } from '../components/benefits';
import { IdentityMirror } from '../components/share';
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import { 
  Shield, Sparkles, Brain, ArrowRight, Star, Leaf, 
  Heart, Compass, BookOpen, Moon, Zap, Target, 
  Lightbulb, Feather, Eye, Anchor 
} from 'lucide-react';

const transformationalFeatures = [
  {
    icon: Brain,
    title: "AI-Powered Reflective Companion",
    description: "A supportive AI trained in evidence-informed approaches including DBT, ACT, and IFS principles. A compassionate presence that meets you exactly where you are."
  },
  {
    icon: Heart,
    title: "Inner Child Work",
    description: "Gentle self-compassion exercises to reconnect with younger parts of yourself. Offer your past self the understanding they needed."
  },
  {
    icon: Shield,
    title: "Nervous System Education",
    description: "Evidence-informed tools grounded in polyvagal theory to help you notice and shift your internal state. Expand your window of tolerance."
  },
  {
    icon: Compass,
    title: "Parts Work & Self-Understanding",
    description: "IFS-inspired practices to explore and befriend all parts of yourself—even the ones you've tried to hide."
  },
  {
    icon: Eye,
    title: "Somatic Awareness",
    description: "Gentle body-based practices to notice sensations and reconnect with embodied wisdom through somatic experiencing."
  },
  {
    icon: Anchor,
    title: "Attachment Patterns",
    description: "Understand your attachment patterns and explore ways to build more secure connections at any age through psychoeducation."
  }
];

const wellnessPillars = [
  {
    title: "Private By Design",
    icon: Shield,
    description: "End-to-end encryption, no social features. Complete privacy for complete honesty.",
    stat: "Zero data shared"
  },
  {
    title: "Consent-First",
    icon: Heart,
    description: "Trauma-informed design in every interaction. Pause or stop anytime. We respect your pace.",
    stat: "100% consent-based"
  },
  {
    title: "Evidence-Informed",
    icon: BookOpen,
    description: "Educational tools grounded in IFS, polyvagal theory, attachment science, DBT, and ACT principles.",
    stat: "Research-grounded"
  },
  {
    title: "Available Always",
    icon: Moon,
    description: "Whether it's 3 AM anxiety or a Sunday breakthrough, we're here.",
    stat: "24/7 availability"
  }
];

const wellnessApproach = [
  {
    icon: Lightbulb,
    title: "Understand",
    description: "Psychoeducation helps you make sense of your experience. When you understand why, shame dissolves into compassion."
  },
  {
    icon: Feather,
    title: "Feel",
    description: "Gentle practices to safely access emotions that were too overwhelming to feel at the time."
  },
  {
    icon: Zap,
    title: "Regulate",
    description: "Nervous system tools to expand your window of tolerance and move from survival into presence."
  },
  {
    icon: Target,
    title: "Integrate",
    description: "Transform intellectual understanding into embodied wisdom and lasting healing."
  }
];

const testimonialQuotes = [
  {
    quote: "For the first time, I understand why I react the way I do. This platform helped me see my patterns not as flaws, but as adaptations.",
    attribution: "From someone exploring attachment patterns"
  },
  {
    quote: "The inner child work brought up tears I'd been holding for decades. The way it's structured made it feel safe for the first time.",
    attribution: "From someone on a growth journey"
  },
  {
    quote: "This platform gives me tools to reflect and practice self-understanding between my weekly sessions with a professional.",
    attribution: "From someone building daily wellness habits"
  }
];

function TrustBadge({ icon: Icon, label, bgColor }) {
  return (
  <WellnessPageShell
    title="Home"
    subtitle="Educational reflection tools. Choose what feels safe and supportive."
    benefits={pickBenefits(["agency","calm","clarity","selfRespect","meaning"], 5)}
    clarity={{
      what: "A self-paced reflection tool you control.",
      why: "To support clarity, values alignment, and gentle next steps.",
      who: "For adults (18+) who want educational wellness tools (not medical care).",
      when: "Anytime you want a small reset or a thoughtful pause.",
      where: "Anywhere you can breathe and write for 1–5 minutes.",
      how: "Pick one prompt, answer briefly, stop whenever you want."
    }}
    examples={[
      { label: "Beginner", examples: ["Write one honest sentence about how you feel.", "Name one value you want to protect today."] },
      { label: "Intermediate", examples: ["Describe the situation + the need underneath it.", "Write a boundary you could try in one sentence."] },
      { label: "Advanced", examples: ["Identify a pattern and the smallest experiment to change it.", "Write a compassionate reframe and one measurable step."] }
    ]}
  >

    <span 
      className="px-4 py-2 rounded-full flex items-center gap-2 sacred-body text-sm"
      style={{ background: bgColor }}
      role="listitem"
    >
      <Icon className="w-4 h-4 sacred-icon" style={{ color: 'var(--sacred-teal, #2f5d5d)' }} />
      {label}
    </span>
  );
}

export default function Home() {
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50,
      disable: prefersReducedMotion.current,
    });
  }, []);

  const trustBadges = (
    <>
      <TrustBadge icon={Shield} label="Private by design" bgColor="rgba(143, 191, 159, 0.15)" />
      <TrustBadge icon={Heart} label="Consent-first" bgColor="rgba(47, 93, 93, 0.1)" />
      <TrustBadge icon={Brain} label="Evidence-informed" bgColor="rgba(234, 195, 59, 0.15)" />
      <TrustBadge icon={Star} label="AI-powered 24/7" bgColor="rgba(244, 199, 195, 0.2)" />
    </>
  );

  return (
    <SacredLayout>
      <SEO 
        title="The Genuine Love Project — Grow at Your Own Pace" 
        description="A supportive space for emotional wellness, conscious awareness, and healing. Evidence-informed tools including inner child work, nervous system education, and trauma-informed practices—all in complete privacy."
      />

      <header role="banner">
        <nav 
          className="relative z-10 mx-auto max-w-6xl py-5 px-6 flex items-center justify-between"
          aria-label="Main navigation"
        >
          <Link href="/" className="flex items-center gap-4 min-w-0">
            <div 
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0 sacred-animate-breathe" 
              style={{ 
                background: 'linear-gradient(135deg, var(--sacred-sage, #8fbf9f), var(--sacred-teal, #2f5d5d))', 
                boxShadow: '0 4px 16px rgba(143, 191, 159, 0.3)' 
              }}
            >
              <img 
                src="/brand/logo.svg" 
                alt="The Genuine Love Project" 
                className="h-9 w-9 sm:h-10 sm:w-10 object-contain"
                data-testid="img-home-logo"
              />
            </div>
            <span 
              className="sacred-heading text-xl hidden md:block"
              style={{ color: 'var(--sacred-teal, #2f5d5d)' }}
            >
              The Genuine Love Project
            </span>
          </Link>
          <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0" role="group" aria-label="Account actions">
            <Link 
              href="/pricing" 
              className="sacred-body text-sm font-medium transition-opacity hidden sm:block hover:opacity-70"
              style={{ color: 'var(--sacred-sage, #8fbf9f)' }}
              data-testid="link-pricing-nav"
            >
              Pricing
            </Link>
            <Link 
              href="/login" 
              className="sacred-button sacred-button--secondary py-2 px-4 text-sm"
              data-testid="link-login"
            >
              Sign in
            </Link>
          </div>
        </nav>
      </header>

      <main id="main-content" className="relative z-10">
        <Hero
          logo={
            <div 
              className="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center sacred-animate-rotate-glow"
              style={{ 
                background: 'linear-gradient(135deg, var(--sacred-sage, #8fbf9f), var(--sacred-teal, #2f5d5d))',
                boxShadow: '0 8px 32px rgba(143, 191, 159, 0.4)'
              }}
            >
              <img 
                src="/brand/logo.svg" 
                alt="" 
                className="w-12 h-12 md:w-14 md:h-14 object-contain"
                aria-hidden="true"
              />
            </div>
          }
          badge={
            <span 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full sacred-body text-sm font-medium"
              style={{ 
                background: 'rgba(143, 191, 159, 0.15)',
                color: 'var(--sacred-teal, #2f5d5d)'
              }}
            >
              <Leaf className="w-4 h-4 sacred-icon" />
              Trusted by 50,000+ growing hearts
            </span>
          }
          title="Your sanctuary for emotional wellness—"
          titleHighlight="where growth happens at your own pace."
          subtitle="A supportive space built for people who carry more than they show. Process grief, calm your nervous system, understand attachment patterns, reconnect with yourself—all in complete privacy."
          primaryCta={{ 
            href: '/register', 
            label: 'Begin Your Wellness Journey',
            icon: <Heart className="w-5 h-5" />
          }}
          secondaryCta={{ 
            href: '/pricing', 
            label: 'See how it works',
            icon: <ArrowRight className="w-4 h-4" />
          }}
          trustBadges={trustBadges}
        />

        <BenefitsStrip className="bg-[var(--glp-sage-10)] dark:bg-slate-900" />

        <div className="sacred-divider" aria-hidden="true" />

        <SacredSection 
          id="features" 
          variant="paper"
          ariaLabel="Healing modalities"
        >
          <div className="text-center mb-12" data-aos="sacred-fade-up">
            <h2 
              className="sacred-subtitle mb-4"
              style={{ color: 'var(--sacred-teal, #2f5d5d)' }}
            >
              Wellness Approaches Grounded in Research
            </h2>
            <p 
              className="sacred-body max-w-3xl mx-auto"
              style={{ color: 'var(--sacred-charcoal, #3a3a3a)' }}
            >
              Evidence-informed approaches—IFS-inspired parts work, nervous system education, somatic awareness, attachment science—made accessible for your daily practice.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="features-grid">
            {transformationalFeatures.map((feature, idx) => (
              <PlatformComponent
                key={idx}
                icon={<feature.icon className="w-6 h-6" />}
                title={feature.title}
                description={feature.description}
                aosDelay={idx * 100}
                variant="default"
              />
            ))}
          </div>
        </SacredSection>

        <SacredSection 
          id="approach" 
          variant="sage"
          ariaLabel="Our healing approach"
        >
          <div className="text-center mb-10" data-aos="sacred-fade-up">
            <h2 
              className="sacred-subtitle mb-4"
              style={{ color: 'var(--sacred-teal, #2f5d5d)' }}
            >
              The Journey of Genuine Healing
            </h2>
            <p 
              className="sacred-body max-w-2xl mx-auto"
              style={{ color: 'var(--sacred-charcoal, #3a3a3a)' }}
            >
              Healing isn't about becoming someone new—it's about coming home to who you've always been.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {wellnessApproach.map((step, idx) => (
              <div 
                key={idx} 
                className="text-center"
                data-aos="sacred-fade-up"
                data-aos-delay={idx * 100}
              >
                <div 
                  className="w-16 h-16 mx-auto rounded-full shadow-lg flex items-center justify-center mb-4"
                  style={{ background: 'var(--sacred-white, #faf9f7)' }}
                >
                  <step.icon 
                    className="w-8 h-8 sacred-icon" 
                    style={{ color: 'var(--sacred-teal, #2f5d5d)' }} 
                  />
                </div>
                <h3 
                  className="sacred-section-header mb-2"
                  style={{ color: 'var(--sacred-teal, #2f5d5d)' }}
                >
                  {step.title}
                </h3>
                <p 
                  className="sacred-body text-sm"
                  style={{ color: 'var(--sacred-charcoal, #3a3a3a)' }}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </SacredSection>

        <SacredSection 
          id="pillars" 
          variant="paper"
          ariaLabel="Our commitments"
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {wellnessPillars.map((pillar, idx) => (
              <article
                key={idx}
                className="text-center p-6 rounded-2xl transition-shadow hover:shadow-lg"
                style={{ 
                  background: 'var(--sacred-white, #faf9f7)',
                  border: '1px solid rgba(143, 191, 159, 0.2)'
                }}
                data-aos="sacred-fade-up"
                data-aos-delay={idx * 100}
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white mx-auto mb-4"
                  style={{ background: 'linear-gradient(135deg, var(--sacred-sage, #8fbf9f), var(--sacred-teal, #2f5d5d))' }}
                >
                  <pillar.icon className="w-6 h-6 sacred-icon" />
                </div>
                <div 
                  className="sacred-subtitle text-2xl mb-2"
                  style={{ color: 'var(--sacred-teal, #2f5d5d)' }}
                >
                  {pillar.stat}
                </div>
                <h3 
                  className="sacred-section-header mb-2"
                  style={{ color: 'var(--sacred-teal, #2f5d5d)' }}
                >
                  {pillar.title}
                </h3>
                <p 
                  className="sacred-body text-sm"
                  style={{ color: 'var(--sacred-charcoal, #3a3a3a)' }}
                >
                  {pillar.description}
                </p>
              </article>
            ))}
          </div>
        </SacredSection>

        <SacredSection 
          id="testimonials" 
          variant="rose"
          ariaLabel="Testimonials"
        >
          <div className="text-center mb-12" data-aos="sacred-fade-up">
            <h2 
              className="sacred-subtitle mb-4"
              style={{ color: 'var(--sacred-teal, #2f5d5d)' }}
            >
              Words From The Healing Path
            </h2>
            <p 
              className="sacred-body max-w-2xl mx-auto"
              style={{ color: 'var(--sacred-charcoal, #3a3a3a)' }}
            >
              Real experiences from people transforming their relationship with themselves.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonialQuotes.map((testimonial, idx) => (
              <blockquote
                key={idx}
                className="p-6 rounded-2xl"
                style={{ 
                  background: 'var(--sacred-white, #faf9f7)',
                  borderLeft: '4px solid var(--sacred-sage, #8fbf9f)'
                }}
                data-aos="sacred-fade-up"
                data-aos-delay={idx * 100}
              >
                <p 
                  className="sacred-quote mb-4"
                  style={{ color: 'var(--sacred-charcoal, #3a3a3a)' }}
                >
                  "{testimonial.quote}"
                </p>
                <cite 
                  className="sacred-caption not-italic"
                  style={{ color: 'var(--sacred-sage, #8fbf9f)' }}
                >
                  — {testimonial.attribution}
                </cite>
              </blockquote>
            ))}
          </div>
        </SacredSection>

        <SacredSection id="stats" variant="paper">
          <div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            role="list"
            aria-label="Platform statistics"
          >
            {[
              { value: '50K+', label: 'Healing Journeys Started' },
              { value: '1000+', label: 'Therapeutic Tools' },
              { value: '24/7', label: 'AI Companion Available' },
              { value: '100%', label: 'Private & Encrypted' },
            ].map((stat, idx) => (
              <div 
                key={idx}
                className="text-center p-6 rounded-2xl"
                style={{ 
                  background: 'rgba(143, 191, 159, 0.08)',
                  border: '1px solid rgba(143, 191, 159, 0.15)'
                }}
                role="listitem"
                data-aos="sacred-scale"
                data-aos-delay={idx * 50}
              >
                <div 
                  className="sacred-title text-3xl mb-1"
                  style={{ color: 'var(--sacred-teal, #2f5d5d)' }}
                >
                  {stat.value}
                </div>
                <div 
                  className="sacred-caption"
                  style={{ color: 'var(--sacred-charcoal, #3a3a3a)' }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </SacredSection>

        <SacredSection id="philosophy" variant="teal">
          <div className="text-center max-w-3xl mx-auto" data-aos="sacred-fade-up">
            <blockquote 
              className="sacred-quote text-xl md:text-2xl mb-8"
              style={{ color: 'var(--sacred-teal, #2f5d5d)' }}
            >
              "Your nervous system isn't broken—it's protecting you based on what it learned. Healing is teaching it that you're safe now."
            </blockquote>
            
            <h3 
              className="sacred-heading mb-4"
              style={{ color: 'var(--sacred-teal, #2f5d5d)' }}
            >
              Built for Real, Deep Healing
            </h3>
            <p 
              className="sacred-body mb-6"
              style={{ color: 'var(--sacred-charcoal, #3a3a3a)' }}
            >
              We understand that emotional work isn't linear. Some days you'll feel ready to dive deep. Other days, you might just need a breathing exercise. This platform meets you wherever you are.
            </p>

            <div 
              className="rounded-xl p-4"
              style={{ 
                background: 'rgba(234, 195, 59, 0.15)',
                border: '1px solid rgba(234, 195, 59, 0.3)'
              }}
            >
              <p 
                className="sacred-caption"
                style={{ color: 'var(--sacred-charcoal, #3a3a3a)' }}
              >
                <strong>Important:</strong> This platform supports your wellness journey but is not a replacement for professional mental health care. If you're in crisis, please reach out to a crisis line or mental health professional.
              </p>
            </div>
          </div>
        </SacredSection>

        <SacredSection id="cta" variant="paper">
          <div 
            className="rounded-3xl p-8 md:p-12 text-center"
            style={{ 
              background: 'linear-gradient(135deg, var(--sacred-teal, #2f5d5d), var(--sacred-sage, #8fbf9f))'
            }}
            data-aos="sacred-scale"
          >
            <Heart 
              className="w-12 h-12 mx-auto mb-4 text-white opacity-80" 
              aria-hidden="true"
            />
            <h2 
              className="sacred-subtitle text-white mb-4"
            >
              Begin Your Wellness Journey Today
            </h2>
            <p 
              className="sacred-body text-white opacity-90 mb-8 max-w-xl mx-auto"
            >
              You don't need to be ready. You don't need to have it figured out. You just need to show up—the rest unfolds from there.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 font-semibold rounded-xl transition-opacity hover:opacity-90 shadow-lg"
              style={{ 
                background: 'var(--sacred-white, #faf9f7)', 
                color: 'var(--sacred-teal, #2f5d5d)' 
              }}
              data-testid="button-cta-bottom"
            >
              <Sparkles className="w-5 h-5 sacred-icon" />
              Start Free—No Credit Card Required
            </Link>
          </div>
        </SacredSection>

        <SacredSection id="identity-mirror" variant="paper">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h2 className="sacred-subtitle mb-3">Who Are You Becoming?</h2>
            <p className="sacred-body text-slate-600">
              Reflect on the identity you're growing into. Share if it resonates.
            </p>
          </div>
          <IdentityMirror className="max-w-xl mx-auto" />
          <p className="text-center text-xs text-slate-400 mt-6">
            Educational support only.{" "}
            <a href="/crisis" className="text-[var(--glp-sage)] hover:underline">
              If you're in crisis, get help now →
            </a>
          </p>
        </SacredSection>

        <TrustSignals />
      </main>

      <SacredFooter />
    </SacredLayout>
  </WellnessPageShell>
  );
}
