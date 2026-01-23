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

function NextStepBlock({ nextStep }) {
  if (!nextStep) return null;
  
  const IconComponent = nextStep.icon ? getIcon(nextStep.icon) : Target;
  
  return (
    <section 
      className={styles.nextStepSection}
      aria-label="Your next step"
      data-aos="fade-up"
      data-aos-delay="200"
    >
      <div className={styles.nextStepCard}>
        <div className={styles.nextStepHeader}>
          <div className={styles.nextStepIconWrapper}>
            <IconComponent className={styles.nextStepIcon} />
          </div>
          <div className={styles.nextStepContent}>
            <span className={styles.nextStepLabel}>Your one next step</span>
            <h2 className={styles.nextStepTitle}>{nextStep.title}</h2>
            {nextStep.description && (
              <p className={styles.nextStepDescription}>{nextStep.description}</p>
            )}
          </div>
        </div>
        {nextStep.cta && (
          <Link
            href={nextStep.cta.href}
            className={styles.nextStepCta}
            data-testid="button-next-step"
          >
            {nextStep.cta.label}
            <ArrowRight className={styles.ctaIcon} />
          </Link>
        )}
      </div>
    </section>
  );
}

function PracticeSection({ practice }) {
  if (!practice) return null;
  
  const IconComponent = practice.icon ? getIcon(practice.icon) : Play;
  
  return (
    <section 
      className={styles.practiceSection}
      aria-label={practice.title || 'Practice'}
      data-aos="fade-up"
      data-aos-delay="150"
    >
      <div className={styles.practiceCard}>
        <div className={styles.practiceHeader}>
          {practice.timeTag && (
            <span className={styles.practiceTimeTag}>
              <Clock className={styles.timeIcon} />
              {practice.timeTag}
            </span>
          )}
          <div className={styles.practiceTitleRow}>
            <div className={styles.practiceIconWrapper}>
              <IconComponent className={styles.practiceIcon} />
            </div>
            <h2 className={styles.practiceTitle}>{practice.title}</h2>
          </div>
          {practice.subtitle && (
            <p className={styles.practiceSubtitle}>{practice.subtitle}</p>
          )}
        </div>
        
        {practice.steps && practice.steps.length > 0 && (
          <ol className={styles.practiceSteps} role="list">
            {practice.steps.map((step, index) => (
              <li 
                key={index} 
                className={styles.practiceStep}
                data-aos="fade-up"
                data-aos-delay={200 + (index * 100)}
              >
                <span className={styles.stepNumber}>{index + 1}</span>
                <span className={styles.stepText}>{step}</span>
              </li>
            ))}
          </ol>
        )}
        
        {practice.cta && (
          <Link
            href={practice.cta.href}
            className={styles.practiceCta}
            data-testid={`button-practice-${practice.timeTag?.replace(/\s+/g, '-') || 'start'}`}
          >
            {practice.cta.label}
            <ArrowRight className={styles.ctaIcon} />
          </Link>
        )}
      </div>
    </section>
  );
}

function GentleDisclaimer({ disclaimer }) {
  if (!disclaimer) return null;
  
  return (
    <aside 
      className={styles.disclaimerSection}
      aria-label="Important notice"
      data-aos="fade-up"
      data-aos-delay="300"
    >
      <div className={styles.disclaimerCard}>
        <div className={styles.disclaimerHeader}>
          <AlertTriangle className={styles.disclaimerIcon} />
          <h3 className={styles.disclaimerTitle}>
            {disclaimer.title || 'If this feels hard'}
          </h3>
        </div>
        <p className={styles.disclaimerText}>
          {disclaimer.text}
        </p>
        {disclaimer.resources && disclaimer.resources.length > 0 && (
          <ul className={styles.disclaimerResources}>
            {disclaimer.resources.map((resource, index) => (
              <li key={index} className={styles.disclaimerResource}>
                <a 
                  href={resource.href}
                  className={styles.disclaimerLink}
                  target={resource.external ? '_blank' : undefined}
                  rel={resource.external ? 'noopener noreferrer' : undefined}
                >
                  {resource.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}

function ReassuranceBlock({ reassurance, tone }) {
  if (!reassurance || tone !== 'quiet') return null;
  
  return (
    <aside 
      className={styles.reassuranceSection}
      aria-label="Reassurance"
      data-aos="fade-up"
      data-aos-delay="100"
    >
      <div className={styles.reassuranceCard}>
        <Heart className={styles.reassuranceIcon} />
        <p className={styles.reassuranceText}>{reassurance}</p>
      </div>
    </aside>
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
  const tone = config.tone || 'default';
  const toneClass = tone === 'quiet' ? styles.toneQuiet : tone === 'structured' ? styles.toneStructured : '';

  return (
    <SacredLayout className={toneClass}>
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

      <main id="main-content" className={toneClass}>
        <HeroSection hero={config.hero} />

        <ReassuranceBlock reassurance={config.reassurance} tone={tone} />

        <NextStepBlock nextStep={config.nextStep} />

        {config.practices && config.practices.map((practice, index) => (
          <PracticeSection key={practice.timeTag || index} practice={practice} />
        ))}

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

        <GentleDisclaimer disclaimer={config.disclaimer} />

        {children}
      </main>

      <SacredFooter />
    </SacredLayout>
  );
}
