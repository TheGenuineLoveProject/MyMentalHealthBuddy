import { Heart } from 'lucide-react';
import { Link } from 'wouter';

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
            <Link href="/about" className="hover:text-[var(--glp-gold)] transition-colors" data-testid="footer-about">About</Link>
            <Link href="/privacy" className="hover:text-[var(--glp-gold)] transition-colors" data-testid="footer-privacy">Privacy</Link>
            <Link href="/terms" className="hover:text-[var(--glp-gold)] transition-colors" data-testid="footer-terms">Terms</Link>
            <Link href="/contact" className="hover:text-[var(--glp-gold)] transition-colors" data-testid="footer-contact">Contact</Link>
          </nav>

          <p className="text-sm text-white/70">
            © {currentYear} MyMentalHealthBuddy by The Genuine Love Project
          </p>
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
            (Suicide & Crisis Lifeline) — available 24/7.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
