import { Link } from "wouter";
import { 
  Youtube, Instagram, Twitter, Linkedin, Facebook,
  Github, ExternalLink
} from "lucide-react";
import { SiTiktok, SiPinterest, SiMedium, SiSubstack, SiThreads } from "react-icons/si";

const SOCIAL_LINKS = [
  { id: "youtube", name: "YouTube", url: "", icon: Youtube, enabled: false },
  { id: "instagram", name: "Instagram", url: "", icon: Instagram, enabled: false },
  { id: "tiktok", name: "TikTok", url: "", icon: SiTiktok, enabled: false },
  { id: "x", name: "X", url: "", icon: Twitter, enabled: false },
  { id: "linkedin", name: "LinkedIn", url: "", icon: Linkedin, enabled: false },
  { id: "facebook", name: "Facebook", url: "", icon: Facebook, enabled: false },
  { id: "threads", name: "Threads", url: "", icon: SiThreads, enabled: false },
  { id: "pinterest", name: "Pinterest", url: "", icon: SiPinterest, enabled: false },
  { id: "medium", name: "Medium", url: "", icon: SiMedium, enabled: false },
  { id: "substack", name: "Substack", url: "", icon: SiSubstack, enabled: false },
  { id: "github", name: "GitHub", url: "", icon: Github, enabled: false },
];

const FOOTER_LINKS = {
  platform: [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Journal", href: "/journal" },
    { name: "AI Chat", href: "/chat" },
    { name: "Wellness Tools", href: "/wellness" },
    { name: "Content Studio", href: "/content-studio" },
  ],
  resources: [
    { name: "Blog", href: "/blog" },
    { name: "Crisis Resources", href: "/crisis" },
    { name: "Study Vault", href: "/study-vault" },
    { name: "Knowledge System", href: "/knowledge" },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Ethics", href: "/ethics" },
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
    { name: "Disclaimer", href: "/disclaimer" },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-[var(--glp-ink)] text-white py-12 px-6" data-testid="footer">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/brand/logo.png" 
                alt="The Genuine Love Project" 
                className="h-12 w-auto"
                data-testid="img-footer-logo"
              />
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Empowering humanity to heal, grow, and thrive through AI-assisted mental wellness.
            </p>
            <div className="flex flex-wrap gap-3" data-testid="social-links">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.id}
                    href={social.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-lg transition-colors ${
                      social.enabled 
                        ? "bg-white/10 hover:bg-white/20 text-white" 
                        : "bg-white/5 text-gray-500 cursor-not-allowed"
                    }`}
                    aria-label={social.name}
                    title={social.enabled ? social.name : `${social.name} (Coming Soon)`}
                    data-testid={`link-social-${social.id}`}
                    onClick={(e) => !social.enabled && e.preventDefault()}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-300">Platform</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.platform.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                    data-testid={`link-footer-${link.name.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-300">Resources</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.resources.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                    data-testid={`link-footer-${link.name.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-300">Company</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                    data-testid={`link-footer-${link.name.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400" data-testid="text-copyright">
            © {currentYear} The Genuine Love Project. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <Link href="/crisis" className="hover:text-white transition-colors flex items-center gap-1" data-testid="link-crisis-footer">
              <ExternalLink className="w-3 h-3" />
              Crisis Resources
            </Link>
            <span className="text-gray-600">|</span>
            <span data-testid="text-disclaimer">Not medical advice</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
