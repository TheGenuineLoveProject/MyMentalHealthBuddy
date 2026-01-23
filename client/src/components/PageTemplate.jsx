/**
 * PageTemplate.jsx - CSS Module-based Page Template Component
 * 
 * Features:
 * - CSS Modules ONLY (no Tailwind)
 * - AOS animations with once:true
 * - GSAP logo animation (disabled for reduced motion)
 * - Semantic HTML with accessibility
 * - Playfair Display + Inter typography
 */

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
  ArrowRight, ChevronRight, Check, User, Play, Wind, RefreshCw
} from 'lucide-react';
import SacredLayout from './sacred/SacredLayout.jsx';
import SacredFooter from './sacred/SacredFooter.jsx';
import SacredSection from './sacred/SacredSection.jsx';
import SEO from './SEO.tsx';
import ContentLevelToggle, { useContentLevel, ContentLevelContent } from './ContentLevelToggle.jsx';
import styles from './PageTemplate.module.css';

const iconMap = {
  Heart, Shield, Brain, Sparkles, Star, Sun, Moon, Leaf,
  BookOpen, MessageCircle, Users, Zap, Target, Compass,
  Activity, TrendingUp, Clock, Eye, Lightbulb, Award,
  FileText, Settings, Lock, CreditCard, HelpCircle, Mail,
  Scale, AlertTriangle, Bookmark, Palette, Layout, PenTool,
  BarChart, Calendar, MapPin, Mic, Camera, Video,
  Database, Code, Terminal, Cloud, Globe, Link: LinkIcon,
  Check, User, Play, Wind, RefreshCw
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
      className={styles.heroSection}
      aria-labelledby="hero-title"
    >
      <div className={styles.heroContent}>
        <div 
          ref={logoRef}
          className={styles.logoBadge}
          data-aos="fade-down"
          data-aos-delay="100"
        >
          <Heart className={styles.logoBadgeIcon} />
          <span className={styles.logoBadgeText}>Genuine Love</span>
        </div>

        {hero.eyebrow && (
          <p 
            className={styles.eyebrow}
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <LinkIcon className={styles.eyebrowIcon} />
            {hero.eyebrow}
          </p>
        )}

        <h1 
          id="hero-title"
          className={styles.heroTitle}
          data-aos="fade-up"
          data-aos-delay="300"
        >
          {hero.title}
          {hero.titleHighlight && (
            <>
              <br />
              <span className={styles.gradientText}>
                {hero.titleHighlight}
              </span>
            </>
          )}
        </h1>

        {hero.subtitle && (
          <p 
            className={styles.heroSubtitle}
            data-aos="fade-up"
            data-aos-delay="400"
          >
            {hero.subtitle}
          </p>
        )}

        {(hero.primaryCta || hero.secondaryCta) && (
          <div 
            className={styles.ctaGroup}
            role="group"
            aria-label="Call to action"
            data-aos="fade-up"
            data-aos-delay="500"
          >
            {hero.primaryCta && (
              <Link
                href={hero.primaryCta.href}
                className={styles.primaryCta}
                data-testid="button-hero-primary"
              >
                {hero.primaryCta.label}
                <ArrowRight className={styles.ctaIcon} />
              </Link>
            )}
            {hero.secondaryCta && (
              <Link
                href={hero.secondaryCta.href}
                className={styles.secondaryCta}
                data-testid="button-hero-secondary"
              >
                {hero.secondaryCta.label}
                <ChevronRight className={styles.ctaIcon} />
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
      className={styles.card}
      data-aos="fade-up"
      data-aos-delay={100 + (index * 100)}
      data-testid={`card-${card.title?.toLowerCase().replace(/\s+/g, '-') || index}`}
    >
      <div className={styles.cardIconWrapper}>
        <IconComponent className={styles.cardIcon} />
      </div>
      <h3 className={styles.cardTitle}>
        {card.title}
      </h3>
      <p className={styles.cardText}>
        {card.text}
      </p>
    </article>
  );
}

function ModuleCard({ module, index }) {
  const IconComponent = getIcon(module.icon);
  
  return (
    <article
      className={styles.moduleCard}
      data-aos="fade-up"
      data-aos-delay={150 + (index * 100)}
      data-testid={`module-${module.title?.toLowerCase().replace(/\s+/g, '-') || index}`}
    >
      <div className={styles.moduleIconWrapper}>
        <IconComponent className={styles.moduleIcon} />
      </div>
      <h3 className={styles.moduleTitle}>
        {module.title}
      </h3>
      <p className={styles.moduleDescription}>
        {module.description}
      </p>
    </article>
  );
}

function ModulesGrid({ modules }) {
  if (!modules || modules.length === 0) return null;
  
  return (
    <section 
      className={styles.modulesSection}
      aria-label="Core features"
    >
      <div className={styles.modulesGrid}>
        {modules.map((module, index) => (
          <ModuleCard key={index} module={module} index={index} />
        ))}
      </div>
    </section>
  );
}

function BulletList({ bullets }) {
  return (
    <ul className={styles.bulletList} role="list">
      {bullets.map((bullet, index) => (
        <li 
          key={index} 
          className={styles.bulletItem}
          data-aos="fade-up"
          data-aos-delay={100 + (index * 50)}
        >
          <Check className={styles.bulletIcon} />
          <span>{bullet}</span>
        </li>
      ))}
    </ul>
  );
}

function ContentSection({ section, index }) {
  return (
    <SacredSection
      id={section.id}
      eyebrow={section.eyebrow}
      title={section.title}
      subtitle={section.subtitle}
      variant={section.variant || 'default'}
      aosDelay={index * 100}
      ariaLabel={section.title}
    >
      {section.bullets && section.bullets.length > 0 && (
        <BulletList bullets={section.bullets} />
      )}
      {section.cards && section.cards.length > 0 && (
        <div 
          className={styles.cardsGrid}
          role="list"
        >
          {section.cards.map((card, cardIndex) => (
            <SacredCard key={cardIndex} card={card} index={cardIndex} />
          ))}
        </div>
      )}
    </SacredSection>
  );
}

export default function PageTemplate({ config, children }) {
  const prefersReducedMotion = useRef(false);
  const [contentLevel, setContentLevel] = useContentLevel();

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
        <div className={styles.errorPage}>
          <p className={styles.errorText}>Page configuration not found.</p>
        </div>
      </SacredLayout>
    );
  }

  const hasContentLevels = config.contentLevels && Object.keys(config.contentLevels).length > 0;

  return (
    <SacredLayout>
      <SEO 
        title={config.title}
        description={config.description}
      />

      <header role="banner">
        <nav 
          className={styles.nav}
          aria-label="Main navigation"
        >
          <Link href="/" className={styles.navLogo} data-testid="link-nav-logo">
            <div className={styles.navLogoIcon}>
              <Heart />
            </div>
            <span className={styles.navLogoText}>
              Genuine Love
            </span>
          </Link>

          <div className={styles.navActions}>
            <Link
              href="/login"
              className={styles.navSignIn}
              data-testid="link-nav-signin"
            >
              Sign in
            </Link>
          </div>
        </nav>
      </header>

      <main id="main-content">
        <HeroSection hero={config.hero} />

        {hasContentLevels && (
          <ContentLevelToggle 
            level={contentLevel} 
            onChange={setContentLevel} 
          />
        )}

        {hasContentLevels && (
          <ContentLevelContent 
            level={contentLevel} 
            contentLevels={config.contentLevels}
          />
        )}

        <ModulesGrid modules={config.modules} />

        {config.sections && config.sections.map((section, index) => (
          <ContentSection key={section.id || index} section={section} index={index} />
        ))}

        {children}
      </main>

      <SacredFooter />
    </SacredLayout>
  );
}
