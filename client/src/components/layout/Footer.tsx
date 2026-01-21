import { Link } from "wouter";
import { Heart, Mail, Shield, FileText } from "lucide-react";
import { BRAND } from "@shared/brand";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-100 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Heart 
                className="h-6 w-6" 
                style={{ color: BRAND.colors.primary }}
                fill={BRAND.colors.primary}
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
                <Link href="/crisis" className="text-sm text-gray-600 hover:text-gray-900 transition-colors" data-testid="link-footer-crisis">
                  Crisis Support
                </Link>
              </li>
              <li>
                <Link href="/journal" className="text-sm text-gray-600 hover:text-gray-900 transition-colors" data-testid="link-footer-journal">
                  Journal
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
