import { Link } from "wouter";
import { Heart, Sparkles, Mail } from "lucide-react";

const SACRED_QUOTES = [
  "Healing is the new success.",
  "Live in Genuine Love",
  "Healing is not linear, but it is always forward",
  "You are worthy of the peace you seek",
  "Every breath is a new beginning",
  "Your journey matters, and so do you"
];

export default function GlowFooter({ className = "" }) {
  const randomQuote = SACRED_QUOTES[Math.floor(Math.random() * SACRED_QUOTES.length)];
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { href: "/about", label: "About" },
    { href: "/privacy", label: "Privacy" },
    { href: "/contact", label: "Contact" },
    { href: "/journal", label: "Journal" },
    { href: "/crisis", label: "Crisis Support" }
  ];

  return (
    <footer 
      className={`relative py-12 px-6 overflow-hidden ${className}`}
      style={{
        background: 'linear-gradient(180deg, rgba(143, 191, 159, 0.05) 0%, rgba(212, 175, 55, 0.03) 50%, rgba(143, 191, 159, 0.08) 100%)'
      }}
      role="contentinfo"
      aria-label="Site footer"
      data-testid="footer-glow"
    >
      <SacredGeometryPattern />
      
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8fbf9f]/30 to-transparent" aria-hidden="true" />
      
      <div className="relative max-w-4xl mx-auto text-center space-y-8">
        <div className="flex items-center justify-center gap-3">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center glow-logo"
            style={{
              background: 'linear-gradient(135deg, #d4af37, #ffd700)',
              boxShadow: '0 0 30px rgba(212, 175, 55, 0.5), 0 0 60px rgba(212, 175, 55, 0.2)'
            }}
          >
            <Heart className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
          <span 
            className="font-serif text-xl font-semibold"
            style={{ color: '#2f5d5d' }}
          >
            The Genuine Love Project
          </span>
        </div>
        
        <p 
          className="font-serif text-lg italic max-w-md mx-auto"
          style={{ color: '#8fbf9f' }}
        >
          "{randomQuote}"
        </p>
        
        <nav 
          className="flex flex-wrap justify-center gap-x-6 gap-y-2"
          aria-label="Footer navigation"
        >
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <span 
                className="text-sm transition-colors hover:text-[#2f5d5d] cursor-pointer"
                style={{ color: 'rgba(58, 58, 58, 0.7)' }}
                data-testid={`link-footer-${link.label.toLowerCase().replace(' ', '-')}`}
              >
                {link.label}
              </span>
            </Link>
          ))}
        </nav>
        
        <div 
          className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderColor: 'rgba(143, 191, 159, 0.15)' }}
        >
          <p className="text-xs" style={{ color: 'rgba(58, 58, 58, 0.5)' }}>
            © {currentYear} The Genuine Love Project. All rights reserved.
          </p>
          
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#d4af37]" aria-hidden="true" />
            <span className="text-xs text-[#8fbf9f] italic font-serif">
              Made with love for your healing journey
            </span>
          </div>
        </div>
      </div>
      
      <style>{`
        .glow-logo {
          animation: logoGlow 3s ease-in-out infinite;
        }
        
        @keyframes logoGlow {
          0%, 100% {
            box-shadow: 0 0 30px rgba(212, 175, 55, 0.5), 0 0 60px rgba(212, 175, 55, 0.2);
          }
          50% {
            box-shadow: 0 0 40px rgba(212, 175, 55, 0.7), 0 0 80px rgba(212, 175, 55, 0.3);
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          .glow-logo {
            animation: none;
          }
        }
      `}</style>
    </footer>
  );
}

function SacredGeometryPattern() {
  return (
    <div 
      className="absolute inset-0 pointer-events-none opacity-[0.03]"
      aria-hidden="true"
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="sacredGeometry" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <circle cx="30" cy="30" r="25" fill="none" stroke="#8fbf9f" strokeWidth="0.5" />
            <circle cx="30" cy="30" r="15" fill="none" stroke="#d4af37" strokeWidth="0.5" />
            <circle cx="30" cy="30" r="5" fill="none" stroke="#8fbf9f" strokeWidth="0.5" />
            <line x1="5" y1="30" x2="55" y2="30" stroke="#8fbf9f" strokeWidth="0.3" />
            <line x1="30" y1="5" x2="30" y2="55" stroke="#8fbf9f" strokeWidth="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#sacredGeometry)" />
      </svg>
    </div>
  );
}
