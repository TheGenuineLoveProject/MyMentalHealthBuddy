import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import AOS from 'aos';
import { gsap } from 'gsap';
import { 
  Heart, Shield, Brain, Sparkles, Star, Sun, Moon, Leaf,
  BookOpen, MessageCircle, Users, Zap, Target, Compass,
  Activity, TrendingUp, Clock, Eye, Lightbulb, Award,
  FileText, Settings, Lock, CreditCard, HelpCircle, Mail,
  Scale, AlertTriangle, Bookmark, Palette, Layout, PenTool,
  BarChart, Calendar, MapPin, Mic, Camera, Video,
  Database, Code, Terminal, Cloud, Globe, Link as LinkIcon,
  ArrowRight, ChevronRight
} from 'lucide-react';
import SacredLayout from './sacred/SacredLayout.jsx';
import SacredFooter from './sacred/SacredFooter.jsx';
import SEO from './SEO.tsx';

const iconMap = {
  Heart, Shield, Brain, Sparkles, Star, Sun, Moon, Leaf,
  BookOpen, MessageCircle, Users, Zap, Target, Compass,
  Activity, TrendingUp, Clock, Eye, Lightbulb, Award,
  FileText, Settings, Lock, CreditCard, HelpCircle, Mail,
  Scale, AlertTriangle, Bookmark, Palette, Layout, PenTool,
  BarChart, Calendar, MapPin, Mic, Camera, Video,
  Database, Code, Terminal, Cloud, Globe, Link: LinkIcon
};

function getIcon(iconName) {
  return iconMap[iconName] || Heart;
}

function HeroSection({ hero }) {
  const logoRef = useRef(null);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion.current && logoRef.current) {
      gsap.to(logoRef.current, {
        scale: 1.02,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }
  }, []);

  if (!hero) return null;

  return (
    <section 
      className="relative min-h-[70vh] flex items-center justify-center py-20 px-6"
      aria-labelledby="hero-title"
    >
      <div className="text-center max-w-4xl mx-auto">
        <div 
          ref={logoRef}
          className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl mb-8"
          style={{ 
            background: 'linear-gradient(135deg, var(--sacred-sage, #8fbf9f), var(--sacred-teal, #2f5d5d))',
            boxShadow: '0 8px 32px rgba(143, 191, 159, 0.25)'
          }}
          data-aos="fade-down"
          data-aos-delay="100"
        >
          <Heart className="w-5 h-5 text-white sacred-icon" style={{ transform: 'scale(0.7)' }} />
          <span className="text-white font-medium text-sm tracking-wide">Genuine Love</span>
        </div>

        {hero.eyebrow && (
          <p 
            className="sacred-eyebrow mb-4 flex items-center justify-center gap-2"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <LinkIcon className="w-4 h-4 sacred-icon" style={{ color: 'var(--sacred-teal, #2f5d5d)' }} />
            {hero.eyebrow}
          </p>
        )}

        <h1 
          id="hero-title"
          className="sacred-title mb-8"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          {hero.title}
          {hero.titleHighlight && (
            <>
              <br />
              <span 
                className="sacred-gradient-text"
                style={{
                  background: 'linear-gradient(135deg, var(--sacred-sage, #8fbf9f), var(--sacred-teal, #2f5d5d))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                {hero.titleHighlight}
              </span>
            </>
          )}
        </h1>

        {hero.subtitle && (
          <p 
            className="sacred-body text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: 'var(--sacred-body, #4a5e5a)' }}
            data-aos="fade-up"
            data-aos-delay="400"
          >
            {hero.subtitle}
          </p>
        )}

        {(hero.primaryCta || hero.secondaryCta) && (
          <div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            role="group"
            aria-label="Call to action"
            data-aos="fade-up"
            data-aos-delay="500"
          >
            {hero.primaryCta && (
              <Link
                href={hero.primaryCta.href}
                className="sacred-button-primary inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{
                  background: 'linear-gradient(135deg, var(--sacred-sage, #8fbf9f), var(--sacred-teal, #2f5d5d))',
                  color: 'white',
                  boxShadow: '0 4px 16px rgba(143, 191, 159, 0.3)'
                }}
                data-testid="button-hero-primary"
              >
                {hero.primaryCta.label}
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
            {hero.secondaryCta && (
              <Link
                href={hero.secondaryCta.href}
                className="sacred-button-secondary inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{
                  border: '2px solid var(--sacred-sage, #8fbf9f)',
                  color: 'var(--sacred-teal, #2f5d5d)'
                }}
                data-testid="button-hero-secondary"
              >
                {hero.secondaryCta.label}
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function SacredCard({ card, index }) {
  const IconComponent = getIcon(card.icon);
  
  return (
    <article
      className="sacred-card p-8 rounded-3xl transition-all duration-300 hover:scale-[1.02]"
      style={{
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(143, 191, 159, 0.2)',
        boxShadow: '0 4px 24px rgba(47, 93, 93, 0.08)'
      }}
      data-aos="fade-up"
      data-aos-delay={100 + (index * 100)}
      data-testid={`card-${card.title?.toLowerCase().replace(/\s+/g, '-') || index}`}
    >
      <div 
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
        style={{
          background: 'linear-gradient(135deg, rgba(143, 191, 159, 0.15), rgba(47, 93, 93, 0.1))'
        }}
      >
        <IconComponent 
          className="w-7 h-7 sacred-icon" 
          style={{ color: 'var(--sacred-teal, #2f5d5d)', transform: 'scale(0.7)' }} 
        />
      </div>
      <h3 
        className="sacred-subheading mb-3"
        style={{ color: 'var(--sacred-heading, #1a3a3a)' }}
      >
        {card.title}
      </h3>
      <p 
        className="sacred-body leading-relaxed"
        style={{ color: 'var(--sacred-body, #4a5e5a)' }}
      >
        {card.text}
      </p>
    </article>
  );
}

function ContentSection({ section, index }) {
  const getVariantStyles = (variant) => {
    switch (variant) {
      case 'glow':
        return {
          background: 'radial-gradient(ellipse at center, rgba(143, 191, 159, 0.08), transparent 70%)'
        };
      case 'pattern':
        return {
          backgroundImage: 'url(/sacred-pattern.svg)',
          backgroundSize: '200px',
          backgroundRepeat: 'repeat',
          opacity: 0.03
        };
      default:
        return {};
    }
  };

  return (
    <section
      id={section.id}
      className="relative py-24 px-6"
      aria-labelledby={`section-title-${section.id}`}
      style={section.variant === 'glow' ? getVariantStyles('glow') : {}}
    >
      {section.variant === 'pattern' && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={getVariantStyles('pattern')}
          aria-hidden="true"
        />
      )}
      
      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-16">
          {section.eyebrow && (
            <p 
              className="sacred-eyebrow mb-4"
              data-aos="fade-up"
            >
              {section.eyebrow}
            </p>
          )}
          <h2 
            id={`section-title-${section.id}`}
            className="sacred-heading mb-4"
            style={{ color: 'var(--sacred-heading, #1a3a3a)' }}
            data-aos="fade-up"
            data-aos-delay="100"
          >
            {section.title}
          </h2>
          {section.subtitle && (
            <p 
              className="sacred-body text-lg max-w-2xl mx-auto"
              style={{ color: 'var(--sacred-body, #4a5e5a)' }}
              data-aos="fade-up"
              data-aos-delay="200"
            >
              {section.subtitle}
            </p>
          )}
        </div>

        {section.cards && section.cards.length > 0 && (
          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            role="list"
          >
            {section.cards.map((card, cardIndex) => (
              <SacredCard key={cardIndex} card={card} index={cardIndex} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function PageTemplate({ config, children }) {
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50,
      disable: prefersReducedMotion.current
    });
  }, []);

  if (!config) {
    return (
      <SacredLayout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="sacred-body">Page configuration not found.</p>
        </div>
      </SacredLayout>
    );
  }

  return (
    <SacredLayout>
      <SEO 
        title={config.title}
        description={config.description}
      />

      <header role="banner">
        <nav 
          className="relative z-10 mx-auto max-w-6xl py-5 px-6 flex items-center justify-between"
          aria-label="Main navigation"
        >
          <Link href="/" className="flex items-center gap-4 min-w-0">
            <div 
              className="w-14 h-14 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0" 
              style={{ 
                background: 'linear-gradient(135deg, var(--sacred-sage, #8fbf9f), var(--sacred-teal, #2f5d5d))', 
                boxShadow: '0 4px 16px rgba(143, 191, 159, 0.3)' 
              }}
            >
              <Heart className="h-7 w-7 text-white" />
            </div>
            <span 
              className="sacred-subheading hidden sm:block"
              style={{ color: 'var(--sacred-heading, #1a3a3a)' }}
            >
              Genuine Love
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="px-6 py-3 rounded-full transition-all duration-300 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                border: '2px solid var(--sacred-sage, #8fbf9f)',
                color: 'var(--sacred-teal, #2f5d5d)'
              }}
              data-testid="link-nav-signin"
            >
              Sign in
            </Link>
          </div>
        </nav>
      </header>

      <main id="main">
        <HeroSection hero={config.hero} />

        {config.sections && config.sections.map((section, index) => (
          <ContentSection key={section.id || index} section={section} index={index} />
        ))}

        {children}
      </main>

      <SacredFooter />
    </SacredLayout>
  );
}
