/**
 * @deprecated DUPLICATE COMPONENT
 * 
 * Canonical Footer: import { Footer } from '@/components/ui'
 * Safety Footer: import SafetyFooter from '@/components/ui/SafetyFooter'
 * 
 * This file is kept for backwards compatibility but should not be used
 * for new development. Please migrate to the canonical version.
 * 
 * Last audit: 2026-01-23
 */
import { Link } from "wouter";
import { Heart, Mail, Shield, FileText, HelpCircle, BookOpen, LifeBuoy, Newspaper, Library, Wind, Sparkles, Anchor, Brain } from "lucide-react";
import { BRAND } from "@shared/brand";
import BuddyAvatar from "@/components/avatar/BuddyAvatar";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-100 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-6">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <BuddyAvatar
                state="calm"
                colorMode="default"
                size="sm"
                data-testid="img-footer-lumi"
              />
              <span className="font-serif text-xl font-semibold text-gray-900">
                {BRAND.name}
              </span>
            </div>
            <p className="text-sm text-gray-600 max-w-md mb-4">
              {BRAND.tagline}. {BRAND.mission}
            </p>
            <p className="text-xs text-gray-500">
              This platform provides supportive tools for emotional wellness but is not a substitute for professional mental health care.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/wellness" className="text-sm text-gray-600 hover:text-gray-900 transition-colors" data-testid="link-footer-wellness">
                  Wellness Tools
                </Link>
              </li>
              <li>
                <Link href="/wellness-hub" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors" data-testid="link-footer-wellness-hub">
                  <Heart className="h-4 w-4" />
                  Wellness Hub
                </Link>
              </li>
              <li>
                <Link href="/glossary" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors" data-testid="link-footer-glossary">
                  <BookOpen className="h-4 w-4" />
                  Wellness Glossary
                </Link>
              </li>
              <li>
                <Link href="/healing-library" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors" data-testid="link-footer-healing-library">
                  <Library className="h-4 w-4" />
                  Healing Library
                </Link>
              </li>
              <li>
                <Link href="/news" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors" data-testid="link-footer-news">
                  <Newspaper className="h-4 w-4" />
                  News & Insights
                </Link>
              </li>
              <li>
                <Link href="/crisis" className="text-sm text-gray-600 hover:text-gray-900 transition-colors" data-testid="link-footer-crisis">
                  Crisis Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Help & Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/faq" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors" data-testid="link-footer-faq">
                  <HelpCircle className="h-4 w-4" />
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/resources" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors" data-testid="link-footer-resources">
                  <BookOpen className="h-4 w-4" />
                  Professional Resources
                </Link>
              </li>
              <li>
                <Link href="/support" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors" data-testid="link-footer-support">
                  <LifeBuoy className="h-4 w-4" />
                  Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Wellness Practices</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/breathing" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors" data-testid="link-footer-breathing">
                  <Wind className="h-4 w-4" />
                  Breathing Exercises
                </Link>
              </li>
              <li>
                <Link href="/meditation" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors" data-testid="link-footer-meditation">
                  <Brain className="h-4 w-4" />
                  Meditation Guide
                </Link>
              </li>
              <li>
                <Link href="/grounding" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors" data-testid="link-footer-grounding">
                  <Anchor className="h-4 w-4" />
                  Grounding Techniques
                </Link>
              </li>
              <li>
                <Link href="/affirmations" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors" data-testid="link-footer-affirmations">
                  <Sparkles className="h-4 w-4" />
                  Affirmations
                </Link>
              </li>
              <li>
                <Link href="/calming-scenes" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors" data-testid="link-footer-calming">
                  <Heart className="h-4 w-4" />
                  Calming Scenes
                </Link>
              </li>
              <li>
                <Link href="/self-care" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors" data-testid="link-footer-selfcare">
                  <Sparkles className="h-4 w-4" />
                  Self-Care Toolkit
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors" data-testid="link-footer-privacy">
                  <Shield className="h-4 w-4" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors" data-testid="link-footer-terms">
                  <FileText className="h-4 w-4" />
                  Terms of Service
                </Link>
              </li>
              <li>
                <a href={`mailto:support@${BRAND.name.toLowerCase().replace(/\s+/g, '')}.com`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors" data-testid="link-footer-contact">
                  <Mail className="h-4 w-4" />
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-xs text-gray-500">
            &copy; {currentYear} {BRAND.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
