import { Heart, Mail } from 'lucide-react';
import { SiX, SiInstagram, SiLinkedin, SiYoutube, SiFacebook } from 'react-icons/si';
import { Link } from 'wouter';

/**
 * Canonical site footer.
 *
 * Brand handle (verified in client/index.html OG metadata): @genuineloveproj
 * Update the SOCIALS array below if your live handles differ on a given platform.
 */
const SOCIALS = [
  { name: 'X / Twitter', href: 'https://twitter.com/genuineloveproj',                   Icon: SiX,         testId: 'footer-social-twitter'   },
  { name: 'Instagram',   href: 'https://instagram.com/genuineloveproj',                 Icon: SiInstagram, testId: 'footer-social-instagram' },
  { name: 'LinkedIn',    href: 'https://www.linkedin.com/company/the-genuine-love-project', Icon: SiLinkedin, testId: 'footer-social-linkedin' },
  { name: 'YouTube',     href: 'https://www.youtube.com/@genuineloveproj',              Icon: SiYoutube,   testId: 'footer-social-youtube'   },
  { name: 'Facebook',    href: 'https://www.facebook.com/genuineloveproj',              Icon: SiFacebook,  testId: 'footer-social-facebook'  },
];

export function Footer({ className = '' }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`py-12 bg-[var(--glp-sage-deep)] text-white ${className}`}
      role="contentinfo"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[var(--glp-gold)]" aria-hidden="true" />
            <span className="font-sacred text-lg">MyMentalHealthBuddy</span>
          </div>

          <nav aria-label="Footer navigation" className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/about"   className="hover:text-[var(--glp-gold)] transition-colors" data-testid="footer-about">About</Link>
            <Link href="/blog"    className="hover:text-[var(--glp-gold)] transition-colors" data-testid="footer-blog">Blog</Link>
            <Link href="/privacy" className="hover:text-[var(--glp-gold)] transition-colors" data-testid="footer-privacy">Privacy</Link>
            <Link href="/terms"   className="hover:text-[var(--glp-gold)] transition-colors" data-testid="footer-terms">Terms</Link>
            <Link href="/contact" className="hover:text-[var(--glp-gold)] transition-colors" data-testid="footer-contact">Contact</Link>
          </nav>

          <p className="text-sm text-white/70">
            © {currentYear} The Genuine Love Project
          </p>
        </div>

        {/* Social row */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <ul
            aria-label="Follow MyMentalHealthBuddy on social media"
            className="flex items-center gap-3"
          >
            {SOCIALS.map(({ name, href, Icon, testId }) => (
              <li key={name}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer me"
                  aria-label={`MyMentalHealthBuddy on ${name} (opens in new tab)`}
                  title={name}
                  data-testid={testId}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-[var(--glp-gold)] hover:text-[var(--glp-sage-deep)] focus:outline-none focus:ring-2 focus:ring-[var(--glp-gold)] focus:ring-offset-2 focus:ring-offset-[var(--glp-sage-deep)] transition-colors"
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </a>
              </li>
            ))}
            <li>
              <a
                href="mailto:support@thegenuineloveproject.com"
                aria-label="Email support@thegenuineloveproject.com"
                title="Email"
                data-testid="footer-social-email"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-[var(--glp-gold)] hover:text-[var(--glp-sage-deep)] focus:outline-none focus:ring-2 focus:ring-[var(--glp-gold)] focus:ring-offset-2 focus:ring-offset-[var(--glp-sage-deep)] transition-colors"
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
              </a>
            </li>
          </ul>
        </div>

        <div className="mt-8 pt-6 border-t border-white/20 text-center">
          <p className="text-sm text-white/60">
            If you're in crisis, call{' '}
            <a
              href="tel:988"
              className="text-[var(--glp-gold)] hover:underline font-medium"
              data-testid="footer-crisis-link"
            >
              988
            </a>{' '}
            (Suicide &amp; Crisis Lifeline) — available 24/7.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
