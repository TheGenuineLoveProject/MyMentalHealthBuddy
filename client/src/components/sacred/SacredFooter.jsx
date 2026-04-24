/**
 * ============================================================================
 * SACRED FOOTER - HEALING DESIGN
 * ============================================================================
 * 
 * @deprecated SPECIALIZED COMPONENT - Use sparingly
 * 
 * Canonical Footer: import { Footer } from '@/components/ui'
 * Safety Footer: import SafetyFooter from '@/components/ui/SafetyFooter'
 * 
 * This elaborate footer is for marketing/landing pages only.
 * For tool pages, use SafetyFooter instead.
 * 
 * Last audit: 2026-01-23
 * ============================================================================
 */

import { Link } from "wouter";
import { Heart, Mail, Sparkles } from "lucide-react";
import SacredGeometryBg from "@/components/SacredGeometryBg";
import NewsletterSignup from "@/components/NewsletterSignup";
import BuddyAvatar from "@/components/avatar/BuddyAvatar";
import "@/styles/healing-animations.css";

export default function SacredFooter() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    explore: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Newsletter", href: "/newsletter" },
    ],
    support: [
      { label: "Help Center", href: "/faq" },
      { label: "Crisis Resources", href: "/crisis" },
      { label: "Contact", href: "/contact" },
      { label: "Community", href: "/community" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Ethics", href: "/ethics" },
      { label: "Disclaimer", href: "/disclaimer" },
    ],
  };

  const socialLinks = [
    { icon: Heart, href: "/community", label: "Community" },
    { icon: Mail, href: "/contact", label: "Contact" },
    { icon: Sparkles, href: "/affirmations", label: "Affirmations" },
  ];

  return (
    <footer 
      className="relative py-16 lg:py-20 px-6 overflow-hidden"
      style={{ 
        background: 'linear-gradient(180deg, #faf9f7 0%, rgba(47, 93, 93, 0.05) 50%, rgba(47, 93, 93, 0.08) 100%)',
      }}
      role="contentinfo"
      aria-label="Site footer"
      data-component="SacredFooter"
      data-testid="footer-sacred"
    >
      {/* Sacred Geometry Background */}
      <SacredGeometryBg variant="seedOfLife" opacity={0.04} animated={false} />

      {/* Decorative Top Border */}
      <div 
        className="absolute top-0 left-0 right-0 h-px"
        style={{ 
          background: 'linear-gradient(90deg, transparent 10%, rgba(143, 191, 159, 0.3) 50%, transparent 90%)',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-6xl mx-auto">
        {/* Top Section - Brand & Newsletter */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16 pb-12 border-b" style={{ borderColor: 'rgba(143, 191, 159, 0.15)' }}>
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span
                aria-hidden="true"
                className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden animate-breathing"
                style={{ background: 'linear-gradient(135deg, var(--glp-paper) 0%, var(--glp-sage-10) 100%)', boxShadow: '0 2px 10px var(--glp-sage-deep-12)' }}
              >
                <BuddyAvatar state="calm" size={40} className="w-full h-full" />
              </span>
              <span 
                className="font-serif text-xl font-semibold"
                style={{ color: '#2f5d5d', fontFamily: "'Cormorant Garamond', serif" }}
              >
                The Genuine Love Project
              </span>
            </div>
            <p 
              className="text-sm leading-relaxed max-w-md mb-6"
              style={{ color: '#3a3a3a', opacity: 0.75 }}
            >
              A sacred space for healing, growth, and genuine self-love. We believe every soul 
              deserves access to compassionate support on their journey to wholeness.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover-glow"
                  style={{ 
                    background: 'rgba(143, 191, 159, 0.1)',
                    border: '1px solid rgba(143, 191, 159, 0.2)',
                  }}
                  data-testid={`link-social-${social.label.toLowerCase()}`}
                >
                  <social.icon className="w-4 h-4" style={{ color: '#2f5d5d' }} />
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:pl-12">
            <h3 
              className="font-serif text-lg font-semibold mb-3"
              style={{ color: '#2f5d5d', fontFamily: "'Cormorant Garamond', serif" }}
            >
              Stay Connected
            </h3>
            <p 
              className="text-sm mb-4"
              style={{ color: '#3a3a3a', opacity: 0.75 }}
            >
              Receive wellness reflections and gentle reminders. No spam, unsubscribe anytime.
            </p>
            <NewsletterSignup variant="footer" source="sacred-footer-v2" />
          </div>
        </div>

        {/* Links Grid */}
        <nav 
          className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12"
          aria-label="Footer navigation"
        >
          {/* Explore */}
          <div>
            <h4 
              className="font-semibold text-sm uppercase tracking-wider mb-4"
              style={{ color: '#2f5d5d' }}
            >
              Explore
            </h4>
            <ul className="space-y-2">
              {footerLinks.explore.map((link, index) => (
                <li key={index}>
                  <Link href={link.href}>
                    <span 
                      className="text-sm transition-colors duration-300 cursor-pointer hover:opacity-100"
                      style={{ color: '#3a3a3a', opacity: 0.7 }}
                      data-testid={`link-footer-${link.label.toLowerCase().replace(' ', '-')}`}
                    >
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 
              className="font-semibold text-sm uppercase tracking-wider mb-4"
              style={{ color: '#2f5d5d' }}
            >
              Support
            </h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <Link href={link.href}>
                    <span 
                      className="text-sm transition-colors duration-300 cursor-pointer hover:opacity-100"
                      style={{ color: '#3a3a3a', opacity: 0.7 }}
                      data-testid={`link-footer-${link.label.toLowerCase().replace(' ', '-')}`}
                    >
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 
              className="font-semibold text-sm uppercase tracking-wider mb-4"
              style={{ color: '#2f5d5d' }}
            >
              Legal
            </h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <Link href={link.href}>
                    <span 
                      className="text-sm transition-colors duration-300 cursor-pointer hover:opacity-100"
                      style={{ color: '#3a3a3a', opacity: 0.7 }}
                      data-testid={`link-footer-${link.label.toLowerCase().replace(' ', '-')}`}
                    >
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Bottom Section */}
        <div 
          className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t"
          style={{ borderColor: 'rgba(143, 191, 159, 0.1)' }}
        >
          <p 
            className="text-sm text-center md:text-left"
            style={{ color: '#3a3a3a', opacity: 0.6 }}
          >
            © {currentYear} The Genuine Love Project. All rights reserved.
          </p>
          
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" style={{ color: '#eac33b' }} />
            <span 
              className="text-sm italic"
              style={{ color: '#8fbf9f', fontFamily: "'Cormorant Garamond', serif" }}
            >
              Live in Genuine Love
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
