import { Link } from "wouter";
import { Heart, Shield, ExternalLink, BookOpen, Mail } from "lucide-react";
import { Instagram, Youtube } from "../lib/lucide-brands";
import BuddyAvatar from "./avatar/BuddyAvatar";

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
            <span
              aria-hidden="true"
              className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden"
              style={{ background: 'linear-gradient(135deg, var(--glp-paper) 0%, var(--glp-sage-10) 100%)', boxShadow: '0 2px 10px rgba(38,79,79,0.12)' }}
            >
              <BuddyAvatar state="calm" size={40} className="w-full h-full" />
            </span>
            <span className="font-serif text-xl font-bold text-gray-900 dark:text-white">
              MyMentalHealthBuddy
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
            <Link href="/blog" className="hover:text-[var(--glp-teal)] transition flex items-center gap-1" data-testid="link-footer-blog">
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              Blog
            </Link>
            <Link href="/newsletter" className="hover:text-[var(--glp-teal)] transition flex items-center gap-1" data-testid="link-footer-newsletter">
              <Mail className="w-4 h-4" aria-hidden="true" />
              Newsletter
            </Link>
            <Link href="/crisis" className="hover:text-[var(--glp-teal)] transition flex items-center gap-1" data-testid="link-footer-crisis">
              <Shield className="w-4 h-4" aria-hidden="true" />
              Crisis Support
            </Link>
          </nav>
        </div>

        <div className="flex justify-center gap-5 mb-8">
          <a href="https://instagram.com/thegenuineloveproject" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:opacity-80" style={{ background: 'var(--glp-sage-20)', color: 'var(--glp-sage-deep)' }} aria-label="Instagram" data-testid="link-social-instagram">
            <Instagram className="w-4 h-4" />
          </a>
          <a href="https://youtube.com/@GenuineLoveProject" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:opacity-80" style={{ background: 'var(--glp-sage-20)', color: 'var(--glp-sage-deep)' }} aria-label="YouTube" data-testid="link-social-youtube">
            <Youtube className="w-4 h-4" />
          </a>
          <a href="https://tiktok.com/@genuineloveproject" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:opacity-80" style={{ background: 'var(--glp-sage-20)', color: 'var(--glp-sage-deep)' }} aria-label="TikTok" data-testid="link-social-tiktok">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.49a8.21 8.21 0 0 0 4.8 1.54V6.69h-1.04z"/></svg>
          </a>
          <a href="https://x.com/GenuineLoveProj" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:opacity-80" style={{ background: 'var(--glp-sage-20)', color: 'var(--glp-sage-deep)' }} aria-label="X" data-testid="link-social-x">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <p>© {currentYear} MyMentalHealthBuddy by The Genuine Love Project. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:underline" data-testid="link-privacy">Privacy Policy</Link>
            <Link href="/terms" className="hover:underline" data-testid="link-terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
