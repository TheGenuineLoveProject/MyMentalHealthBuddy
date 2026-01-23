import { Link } from 'wouter';
import { Heart } from 'lucide-react';

const footerLinks = {
  platform: [
    { label: 'Pricing', href: '/pricing' },
    { label: 'Features', href: '/features' },
    { label: 'Blog', href: '/blog' },
    { label: 'Crisis Resources', href: '/crisis' },
  ],
  legal: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Ethics', href: '/ethics' },
  ],
};

export default function SacredFooter({ className = '' }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`sacred-footer ${className}`}
      role="contentinfo"
      aria-label="Site footer"
      data-testid="sacred-footer"
      style={{
        background: 'linear-gradient(180deg, rgba(143, 191, 159, 0.08) 0%, rgba(47, 93, 93, 0.05) 100%)',
        borderTop: '1px solid rgba(143, 191, 159, 0.2)',
      }}
    >
      <div className="sacred-section-inner py-12 md:py-16">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2">
            <Link 
              href="/" 
              className="flex items-center gap-3 mb-4"
              data-testid="footer-logo-link"
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ 
                  background: 'linear-gradient(135deg, var(--sacred-teal, #2f5d5d), #3d7a7a)',
                  boxShadow: '0 4px 12px rgba(47, 93, 93, 0.25)'
                }}
              >
                <Heart className="w-6 h-6 text-white" style={{ transform: 'scale(0.7)' }} />
              </div>
              <span 
                className="sacred-heading text-xl"
                style={{ color: 'var(--sacred-teal, #2f5d5d)' }}
              >
                The Genuine Love Project
              </span>
            </Link>
            <p 
              className="sacred-body max-w-sm"
              style={{ color: 'var(--sacred-charcoal, #3a3a3a)', opacity: 0.8 }}
            >
              A trauma-informed sanctuary for emotional healing. AI-powered therapy tools, 
              inner child work, and nervous system regulation—all in complete privacy.
            </p>
          </div>

          <div>
            <h3 
              className="sacred-section-header mb-4 text-sm"
              style={{ color: 'var(--sacred-teal, #2f5d5d)' }}
            >
              Platform
            </h3>
            <nav aria-label="Platform links">
              <ul className="space-y-2">
                {footerLinks.platform.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="sacred-body text-sm transition-opacity hover:opacity-70"
                      style={{ color: 'var(--sacred-charcoal, #3a3a3a)' }}
                      data-testid={`footer-link-${link.label.toLowerCase()}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div>
            <h3 
              className="sacred-section-header mb-4 text-sm"
              style={{ color: 'var(--sacred-teal, #2f5d5d)' }}
            >
              Legal
            </h3>
            <nav aria-label="Legal links">
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="sacred-body text-sm transition-opacity hover:opacity-70"
                      style={{ color: 'var(--sacred-charcoal, #3a3a3a)' }}
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

        <div className="sacred-divider" aria-hidden="true" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6">
          <p 
            className="sacred-caption"
            style={{ color: 'var(--sacred-charcoal, #3a3a3a)', opacity: 0.7 }}
          >
            © {currentYear} The Genuine Love Project. All rights reserved.
          </p>
          <p 
            className="sacred-caption flex items-center gap-1"
            style={{ color: 'var(--sacred-charcoal, #3a3a3a)', opacity: 0.7 }}
          >
            Made with <Heart className="w-3 h-3 sacred-icon" style={{ color: 'var(--sacred-rose, #f4c7c3)' }} /> for healing hearts
          </p>
        </div>
      </div>
    </footer>
  );
}
