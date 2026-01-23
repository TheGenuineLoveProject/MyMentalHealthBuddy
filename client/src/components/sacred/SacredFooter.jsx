/**
 * SacredFooter.jsx - CSS Module-based Sacred Footer Component
 * 
 * Features:
 * - CSS Modules ONLY (no Tailwind)
 * - Icons scaled ~0.7
 * - Semantic HTML with accessibility
 * - Playfair Display + Inter typography
 */

import { Link } from 'wouter';
import { Heart } from 'lucide-react';
import styles from './SacredFooter.module.css';

const footerLinks = {
  platform: [
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/about' },
  ],
  resources: [
    { label: 'Crisis Resources', href: '/crisis' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Support', href: '/support' },
    { label: 'Contact', href: '/contact' },
  ],
  legal: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Ethics', href: '/ethics' },
    { label: 'Accessibility', href: '/accessibility' },
  ],
};

export default function SacredFooter({ className = '' }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`${styles.footer} ${className}`}
      role="contentinfo"
      aria-label="Site footer"
      data-testid="sacred-footer"
    >
      <div className={styles.footerInner}>
        <div className={styles.footerGrid}>
          <div className={styles.brandColumn}>
            <Link 
              href="/" 
              className={styles.brandLogo}
              data-testid="footer-logo-link"
            >
              <span className={styles.brandLogoIcon}>
                <Heart aria-hidden="true" />
              </span>
              <span className={styles.brandName}>
                The Genuine Love Project
              </span>
            </Link>
            <p className={styles.brandTagline}>
              A trauma-informed sanctuary for emotional healing. AI-powered therapy tools, 
              inner child work, and nervous system regulation—all in complete privacy.
            </p>
          </div>

          <div className={styles.linkColumn}>
            <h4>Platform</h4>
            <nav aria-label="Platform links">
              <ul>
                {footerLinks.platform.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      data-testid={`footer-link-${link.label.toLowerCase()}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className={styles.linkColumn}>
            <h4>Resources</h4>
            <nav aria-label="Resources links">
              <ul>
                {footerLinks.resources.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      data-testid={`footer-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className={styles.linkColumn}>
            <h4>Legal</h4>
            <nav aria-label="Legal links">
              <ul>
                {footerLinks.legal.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      data-testid={`footer-link-${link.label.toLowerCase()}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className={styles.divider} aria-hidden="true" />

        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            &copy; {currentYear} The Genuine Love Project. All rights reserved.
          </p>
          <p className={styles.madeWith}>
            Made with <Heart aria-hidden="true" /> for healing hearts
          </p>
        </div>
      </div>
    </footer>
  );
}
