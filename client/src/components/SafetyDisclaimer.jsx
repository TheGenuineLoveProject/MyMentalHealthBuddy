/**
 * SafetyDisclaimer.jsx - Legal-safe wellness disclaimer component
 * 
 * Features:
 * - Not medical advice notice
 * - Crisis routing link
 * - Stop/pause messaging
 * - Trauma-informed, permission-based language
 */

import { Link } from 'wouter';
import { AlertTriangle, Phone, ExternalLink } from 'lucide-react';
import styles from './SafetyDisclaimer.module.css';
import lumiIconUrl from "@assets/mmhb_buddy_interactive_fullbody_1777538625498.png";

export function SafetyDisclaimer({
  variant = 'default',
  showCrisisLink = true,
  customMessage,
  className = ''
}) {
  const messages = {
    default: "This content is for educational and supportive purposes only, not medical advice. If you're experiencing a mental health crisis, please seek professional help.",
    practice: "These practices are supportive tools, not medical treatment. If you feel overwhelmed, it's okay to pause or stop.",
    content: "This information is educational and may not apply to everyone. Consider consulting a healthcare provider for personalized guidance."
  };

  return (
    <aside 
      className={`${styles.disclaimer} ${styles[variant]} ${className}`}
      role="complementary"
      aria-label="Important safety information"
    >
      <div className={styles.iconWrapper} aria-hidden="true">
        <img
          src={lumiIconUrl}
          alt=""
          width={32}
          height={32}
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            objectFit: 'contain',
            background: 'radial-gradient(circle at 50% 55%, var(--glp-sage-10, #e8efe8) 0%, transparent 72%)',
            flexShrink: 0,
          }}
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
          data-testid="img-disclaimer-lumi"
        />
      </div>
      
      <div className={styles.content}>
        <p className={styles.text}>
          {customMessage || messages[variant]}
        </p>
        
        {showCrisisLink && (
          <div className={styles.crisisLinks}>
            <Link href="/crisis" className={styles.crisisLink} data-testid="link-crisis-resources">
              <Phone className={styles.linkIcon} aria-hidden="true" />
              Crisis Resources
            </Link>
            <a 
              href="tel:988" 
              className={styles.crisisLink}
              data-testid="link-crisis-988"
            >
              <ExternalLink className={styles.linkIcon} aria-hidden="true" />
              988 Lifeline
            </a>
          </div>
        )}
      </div>
    </aside>
  );
}

export function NotMedicalAdvice({ className = '' }) {
  return (
    <p className={`${styles.notMedicalAdvice} ${className}`}>
      <AlertTriangle className={styles.smallIcon} aria-hidden="true" />
      <span>Not medical advice. For informational purposes only.</span>
    </p>
  );
}

export function CrisisNotice({ className = '' }) {
  return (
    <div className={`${styles.crisisNotice} ${className}`}>
      <p>
        <strong>If you're in crisis:</strong> Call or text{' '}
        <a href="tel:988" className={styles.crisisNumber}>988</a>{' '}
        (Suicide & Crisis Lifeline) or go to{' '}
        <Link href="/crisis" className={styles.crisisPageLink}>
          Crisis Resources
        </Link>
      </p>
    </div>
  );
}

export default SafetyDisclaimer;
