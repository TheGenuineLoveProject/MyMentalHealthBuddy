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
import SEO, { SITE_URL } from './SEO.tsx';
import ContentLevelToggle, { useContentLevel, ContentLevelContent } from './ContentLevelToggle.jsx';
import { NotMedicalAdvice, CrisisNotice } from './SafetyDisclaimer.jsx';
import SocialShare from './SocialShare.jsx';
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

function NextStepBlock({ nextStep, isProminent = false }) {
  if (!nextStep) return null;
  
  const IconComponent = nextStep.icon ? getIcon(nextStep.icon) : Target;
  
  return (
    <section 
      className={`${styles.nextStepSection} ${isProminent ? styles.nextStepProminent : ''}`}
      aria-label="Your next step"
      data-aos="fade-up"
      data-aos-delay="100"
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

function QuietProfileWrapper({ children, quietProfile }) {
  const maxWidth = quietProfile?.maxWidth || '420px';
  const decorativeIntensity = quietProfile?.decorativeIntensity || 'low';
  
  return (
    <div 
      className={`${styles.quietProfileWrapper} ${styles[`decorative${decorativeIntensity.charAt(0).toUpperCase() + decorativeIntensity.slice(1)}`] || ''}`}
      style={{ '--quiet-max-width': maxWidth }}
    >
      {children}
    </div>
  );
}

function StructuredToolCards({ sections, toolCardsCount = 4 }) {
  if (!sections || sections.length === 0) return null;
  
  const toolSection = sections.find(s => s.id === 'quick-access' || s.cards);
  if (!toolSection || !toolSection.cards) return null;
  
  const displayedCards = toolSection.cards.slice(0, toolCardsCount);
  
  return (
    <section 
      className={styles.structuredToolsSection}
      aria-label={toolSection.title || 'Your tools'}
      data-aos="fade-up"
      data-aos-delay="200"
    >
      {toolSection.eyebrow && (
        <span className={styles.structuredEyebrow}>{toolSection.eyebrow}</span>
      )}
      {toolSection.title && (
        <h2 className={styles.structuredToolsTitle}>{toolSection.title}</h2>
      )}
      <div className={styles.structuredToolsGrid}>
        {displayedCards.map((card, index) => {
          const IconComponent = card.icon ? getIcon(card.icon) : Sparkles;
          return (
            <article 
              key={index}
              className={styles.structuredToolCard}
              data-aos="fade-up"
              data-aos-delay={250 + index * 50}
            >
              <div className={styles.structuredToolIcon}>
                <IconComponent />
              </div>
              <h3 className={styles.structuredToolName}>{card.title}</h3>
              <p className={styles.structuredToolText}>{card.text}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function PauseMicrocopy({ pauseMicrocopy }) {
  if (!pauseMicrocopy) return null;
  
  return (
    <div 
      className={styles.pauseMicrocopy}
      data-aos="fade-up"
      data-aos-delay="300"
    >
      <RefreshCw className={styles.pauseIcon} />
      <p className={styles.pauseText}>{pauseMicrocopy}</p>
    </div>
  );
}

function YourSpaceReassurance({ tone }) {
  if (tone !== 'structured') return null;
  
  return (
    <section 
      className={styles.yourSpaceSection}
      aria-label="Your space"
      data-aos="fade-up"
      data-aos-delay="350"
    >
      <div className={styles.yourSpaceCard}>
        <Shield className={styles.yourSpaceIcon} />
        <div className={styles.yourSpaceContent}>
          <h3 className={styles.yourSpaceTitle}>This is your space</h3>
          <p className={styles.yourSpaceText}>
            Everything here is private. Go at your own pace. There's no judgment.
          </p>
        </div>
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

function TieredPracticeBlock({ practice, microcopy }) {
  if (!practice) return null;
  
  const tiers = [
    { key: 'beginner', tier: practice.beginner, icon: 'Zap', variant: 'beginner' },
    { key: 'intermediate', tier: practice.intermediate, icon: 'Activity', variant: 'intermediate' },
    { key: 'advanced', tier: practice.advanced, icon: 'Brain', variant: 'advanced' }
  ].filter(t => t.tier);
  
  if (tiers.length === 0) return null;

  const mc = microcopy || {};
  
  return (
    <section 
      id="practice"
      className={styles.tieredPracticeSection}
      aria-label="Practice options"
      data-aos="fade-up"
      data-aos-delay="100"
    >
      <div className={styles.tieredPracticeHeader}>
        <p className={styles.permissionNote}>
          {mc.permission || "Go at your pace. You can pause anytime."}
        </p>
        {mc.whatToExpect && (
          <p className={styles.whatToExpect}>
            {mc.whatToExpect}
          </p>
        )}
        {practice.safetyLink && (
          <Link 
            href={practice.safetyLink.href} 
            className={styles.safetyLink}
            data-testid="link-safety-crisis"
          >
            <AlertTriangle className={styles.safetyIcon} />
            {practice.safetyLink.label}
          </Link>
        )}
      </div>
      
      <div className={styles.tieredPracticeGrid}>
        {tiers.map(({ key, tier, icon, variant }) => {
          const IconComponent = getIcon(icon);
          const tierLabel = mc.tierLabels?.[key] || tier.title;
          const tierCta = mc.cta?.[key] || tier.ctaLabel;
          return (
            <article 
              key={key}
              className={`${styles.tierCard} ${styles[`tierCard${variant.charAt(0).toUpperCase() + variant.slice(1)}`]}`}
              data-aos="fade-up"
              data-aos-delay={key === 'beginner' ? 150 : key === 'intermediate' ? 250 : 350}
            >
              <div className={styles.tierHeader}>
                <span className={styles.tierDuration}>
                  <Clock className={styles.timeIcon} />
                  {tier.duration}
                </span>
                <div className={styles.tierIconWrapper}>
                  <IconComponent className={styles.tierIcon} />
                </div>
                <h3 className={styles.tierTitle}>{tierLabel}</h3>
              </div>
              
              {tier.steps && tier.steps.length > 0 && (
                <ol className={styles.tierSteps}>
                  {tier.steps.map((step, index) => (
                    <li key={index} className={styles.tierStep}>
                      <span className={styles.tierStepNumber}>{index + 1}</span>
                      <span className={styles.tierStepText}>{step}</span>
                    </li>
                  ))}
                </ol>
              )}
              
              {tier.reflection && tier.reflection.length > 0 && (
                <div className={styles.tierReflection}>
                  <p className={styles.tierReflectionLabel}>Optional reflection:</p>
                  {tier.reflection.map((prompt, i) => (
                    <p key={i} className={styles.tierReflectionPrompt}>{prompt}</p>
                  ))}
                </div>
              )}
              
              {tier.closer && (
                <p className={styles.tierCloser}>{tier.closer}</p>
              )}
              
              <Link
                href="#practice"
                className={styles.tierCta}
                data-testid={`button-tier-${key}`}
              >
                {tierCta}
                <ArrowRight className={styles.ctaIcon} />
              </Link>
            </article>
          );
        })}
      </div>
      
      {(practice.stopNote || mc.stopNote) && (
        <p className={styles.stopNote}>
          <RefreshCw className={styles.stopNoteIcon} />
          {mc.stopNote || practice.stopNote}
        </p>
      )}

      {mc.closer && (
        <p className={styles.practiceCloser} data-aos="fade-up" data-aos-delay="400">
          {mc.closer}
        </p>
      )}
    </section>
  );
}

function PracticeCrisisLink({ crisisLinkEnabled }) {
  if (!crisisLinkEnabled) return null;
  
  return (
    <aside 
      className={styles.practiceCrisisLink}
      data-aos="fade-up"
      data-aos-delay="400"
    >
      <p className={styles.practiceCrisisText}>
        If this practice brings up difficult feelings, that's okay. You can{' '}
        <Link href="/crisis" className={styles.practiceCrisisAnchor} data-testid="link-practice-crisis">
          visit our crisis resources
        </Link>{' '}
        anytime.
      </p>
    </aside>
  );
}

function PracticeSectionsRenderer({ practiceSections, practiceTiers, microcopy, crisisLinkEnabled }) {
  if (!practiceSections || practiceSections.length === 0) return null;

  return (
    <div className={styles.practiceSectionsWrapper}>
      {practiceSections.map((section, index) => {
        if (section.type === 'tier-cards' && practiceTiers) {
          return (
            <section 
              key={section.id}
              id={section.id}
              className={styles.practiceSection}
              data-aos="fade-up"
              data-aos-delay={100}
            >
              <h2 className={styles.practiceSectionTitle}>{section.title}</h2>
              {section.subtitle && (
                <p className={styles.practiceSectionSubtitle}>{section.subtitle}</p>
              )}
              <div className={styles.tierCardsGrid}>
                {Object.entries(practiceTiers).map(([key, tier], tierIdx) => (
                  <details 
                    key={key} 
                    className={styles.tierCardDetails}
                    data-aos="fade-up"
                    data-aos-delay={150 + tierIdx * 100}
                  >
                    <summary className={styles.tierCardSummary} data-testid={`tier-summary-${key}`}>
                      <div className={styles.tierCardHeader}>
                        <Clock className={styles.tierTimeIcon} />
                        <span className={styles.tierDurationLabel}>{tier.duration}</span>
                      </div>
                      <h3 className={styles.tierCardTitle}>{tier.title}</h3>
                      <ChevronRight className={styles.tierExpandIcon} />
                    </summary>
                    <div className={styles.tierCardContent}>
                      {tier.steps && tier.steps.length > 0 && (
                        <ol className={styles.tierStepsList}>
                          {tier.steps.map((step, stepIdx) => (
                            <li key={stepIdx} className={styles.tierStepItem}>
                              <span className={styles.tierStepNum}>{stepIdx + 1}</span>
                              <span className={styles.tierStepText}>{step}</span>
                            </li>
                          ))}
                        </ol>
                      )}
                      {tier.reflection && tier.reflection.length > 0 && key === 'long3to10' && (
                        <div className={styles.tierReflectionBox}>
                          <p className={styles.tierReflectionLabel}>Optional reflection:</p>
                          {tier.reflection.map((r, rIdx) => (
                            <p key={rIdx} className={styles.tierReflectionText}>{r}</p>
                          ))}
                        </div>
                      )}
                      <button 
                        className={styles.tierStartBtn}
                        data-testid={`button-start-${key}`}
                      >
                        {tier.ctaLabel}
                        <ArrowRight className={styles.tierBtnIcon} />
                      </button>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          );
        }

        if (section.type === 'guidance' && section.content) {
          return (
            <section 
              key={section.id}
              id={section.id}
              className={styles.guidanceSection}
              data-aos="fade-up"
              data-aos-delay={200}
            >
              <h2 className={styles.guidanceSectionTitle}>{section.title}</h2>
              <div className={styles.guidanceCards}>
                {section.content.permission && (
                  <div className={styles.guidanceCard} data-aos="fade-up" data-aos-delay={250}>
                    <Shield className={styles.guidanceIcon} />
                    <p className={styles.guidanceText}>{section.content.permission}</p>
                  </div>
                )}
                {section.content.stopNote && (
                  <div className={styles.guidanceCard} data-aos="fade-up" data-aos-delay={300}>
                    <RefreshCw className={styles.guidanceIcon} />
                    <p className={styles.guidanceText}>{section.content.stopNote}</p>
                  </div>
                )}
                {section.content.whatToExpect && (
                  <div className={styles.guidanceCard} data-aos="fade-up" data-aos-delay={350}>
                    <Sparkles className={styles.guidanceIcon} />
                    <p className={styles.guidanceText}>{section.content.whatToExpect}</p>
                  </div>
                )}
              </div>
            </section>
          );
        }

        if (section.type === 'navigation' && section.links) {
          return (
            <section 
              key={section.id}
              id={section.id}
              className={styles.navigationSection}
              data-aos="fade-up"
              data-aos-delay={300}
            >
              <h2 className={styles.navigationSectionTitle}>{section.title}</h2>
              <div className={styles.navigationLinks}>
                {section.links.map((link, linkIdx) => (
                  <Link
                    key={linkIdx}
                    href={link.href}
                    className={styles.navigationLink}
                    data-testid={`link-next-${linkIdx}`}
                    data-aos="fade-up"
                    data-aos-delay={350 + linkIdx * 50}
                  >
                    {link.label}
                    <ArrowRight className={styles.navLinkIcon} />
                  </Link>
                ))}
              </div>
            </section>
          );
        }

        return null;
      })}
    </div>
  );
}

function GentleDisclaimer({ disclaimer, tone }) {
  if (!disclaimer) return null;
  
  const isPracticeTone = tone === 'practice';
  
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
        {isPracticeTone && (
          <div className={styles.crisisNoticeWrapper}>
            <CrisisNotice />
          </div>
        )}
      </div>
      {isPracticeTone && (
        <div className={styles.notMedicalAdviceWrapper}>
          <NotMedicalAdvice />
        </div>
      )}
    </aside>
  );
}

function GentleBenefitsSection({ gentleBenefits, tone }) {
  if (!gentleBenefits || tone !== 'practice') return null;
  
  const { title, subtitle, bullets, stopPause, crisisLine } = gentleBenefits;
  
  return (
    <section 
      className={styles.gentleBenefitsSection}
      aria-labelledby="gentle-benefits-title"
      data-aos="fade-up"
      data-aos-delay="200"
    >
      <div className={styles.gentleBenefitsCard}>
        <header className={styles.gentleBenefitsHeader}>
          <Sparkles className={styles.gentleBenefitsIcon} />
          <h2 id="gentle-benefits-title" className={styles.gentleBenefitsTitle}>
            {title || 'How it may help'}
          </h2>
        </header>
        {subtitle && (
          <p className={styles.gentleBenefitsSubtitle}>{subtitle}</p>
        )}
        {bullets && bullets.length > 0 && (
          <ul className={styles.gentleBenefitsList} role="list">
            {bullets.map((bullet, idx) => (
              <li key={idx} className={styles.gentleBenefitsItem}>
                <Check className={styles.gentleBenefitsCheck} />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        )}
        <div className={styles.gentleBenefitsFooter}>
          {stopPause && (
            <p className={styles.gentleBenefitsStop}>
              <RefreshCw className={styles.gentleBenefitsStopIcon} />
              {stopPause}
            </p>
          )}
          {crisisLine && (
            <p className={styles.gentleBenefitsCrisis}>
              <Shield className={styles.gentleBenefitsCrisisIcon} />
              {crisisLine.text}{' '}
              <Link 
                href={crisisLine.href || '/crisis'} 
                className={styles.gentleBenefitsCrisisLink}
                data-testid="link-gentle-crisis"
              >
                {crisisLine.linkLabel || 'crisis resources'}
              </Link>
            </p>
          )}
        </div>
      </div>
    </section>
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

  const showSocialShare = tone === 'practice' && config.category === 'wellness';

  return (
    <SacredLayout className={toneClass}>
      <SEO 
        title={config.title}
        description={config.description}
        route={config.route}
        canonicalUrl={config.route ? `${SITE_URL}${config.route}` : undefined}
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
        {config.stimulationProfile === 'quiet' ? (
          <QuietProfileWrapper quietProfile={config.quietProfile}>
            <HeroSection hero={config.hero} />
            <ReassuranceBlock reassurance={config.reassurance} tone={tone} />
            
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
            
            <GentleDisclaimer disclaimer={config.disclaimer} tone={tone} />
            {children}
          </QuietProfileWrapper>
        ) : config.stimulationProfile === 'structured' ? (
          <>
            <HeroSection hero={config.hero} />
            <NextStepBlock 
              nextStep={config.nextStep} 
              isProminent={config.structuredProfile?.nextStepProminent}
            />
            
            <StructuredToolCards 
              sections={config.sections}
              toolCardsCount={config.structuredProfile?.toolCardsCount}
            />
            
            {config.structuredProfile?.pauseMicrocopy && (
              <PauseMicrocopy pauseMicrocopy={config.structuredProfile.pauseMicrocopy} />
            )}
            
            <YourSpaceReassurance tone={tone} />

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

            <GentleDisclaimer disclaimer={config.disclaimer} tone={tone} />
            {children}
          </>
        ) : (
          <>
            <HeroSection hero={config.hero} />
            <ReassuranceBlock reassurance={config.reassurance} tone={tone} />
            <NextStepBlock nextStep={config.nextStep} />
            <TieredPracticeBlock practice={config.practice} microcopy={config.microcopy} />

            {config.stimulationProfile === 'practice' && config.practiceSections && (
              <>
                <PracticeSectionsRenderer 
                  practiceSections={config.practiceSections}
                  practiceTiers={config.practiceTiers}
                  microcopy={config.microcopy}
                  crisisLinkEnabled={config.crisisLinkEnabled}
                />
                <GentleBenefitsSection 
                  gentleBenefits={config.gentleBenefits} 
                  tone={tone} 
                />
                {showSocialShare && (
                  <div className={styles.socialShareWrapper}>
                    <SocialShare 
                      url={config.route ? `${SITE_URL}${config.route}` : undefined}
                      title={config.title}
                      description={config.description}
                    />
                  </div>
                )}
                <PracticeCrisisLink crisisLinkEnabled={config.crisisLinkEnabled} />
              </>
            )}

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

            <GentleDisclaimer disclaimer={config.disclaimer} tone={tone} />
            {children}
          </>
        )}
      </main>

      <SacredFooter />
    </SacredLayout>
  );
}
