import { Link } from "wouter";
import { Heart, Shield, ExternalLink } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className="bg-gradient-to-b from-[var(--glp-paper)] via-[var(--glp-sage-10)] to-[var(--glp-teal-10)] text-gray-700 dark:text-gray-300 pt-16 pb-6 relative overflow-hidden"
      data-testid="footer"
    >
      <div className="absolute inset-0 opacity-5 bg-[url('/icons/flower-of-life.svg')] bg-center bg-cover pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--glp-gold)] to-[var(--glp-teal)] flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <span className="font-serif text-xl font-bold text-gray-900 dark:text-white">
              The Genuine Love Project
            </span>
          </div>

          <nav className="flex flex-wrap gap-6 text-sm font-medium" aria-label="Footer navigation">
            <Link href="/tools" className="hover:text-[var(--glp-teal)] transition" data-testid="link-footer-tools">
              Wellness Tools
            </Link>
            <Link href="/journal" className="hover:text-[var(--glp-teal)] transition" data-testid="link-footer-journal">
              Journal
            </Link>
            <Link href="/wisdom" className="hover:text-[var(--glp-teal)] transition" data-testid="link-footer-wisdom">
              Wisdom
            </Link>
            <Link href="/crisis" className="hover:text-[var(--glp-teal)] transition flex items-center gap-1" data-testid="link-footer-crisis">
              <Shield className="w-4 h-4" aria-hidden="true" />
              Crisis Support
            </Link>
          </nav>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <p>© {currentYear} The Genuine Love Project. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:underline" data-testid="link-privacy">Privacy Policy</Link>
            <Link href="/terms" className="hover:underline" data-testid="link-terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
