import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Heart, Home, BookOpen, LayoutDashboard, Sparkles, LogOut, Wrench, Newspaper, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";

// Public navigation order, advisor-aligned: Home → Wellness → Tools →
// Community → Blog → Pricing.  Auth-only items (Journal, Dashboard) are
// appended below when a user is signed in.  Each link uses a distinct,
// brand-aligned icon so the nav reads at a glance.
const PUBLIC_NAV_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/wellness", label: "Wellness", icon: Heart },
  { href: "/tools", label: "Tools", icon: Wrench },
  { href: "/affirmations", label: "Community", icon: Sparkles },
  { href: "/blog", label: "Blog", icon: Newspaper },
  { href: "/premium", label: "Pricing", icon: Crown },
];

const AUTH_NAV_LINKS = [
  { href: "/journal", label: "Journal", icon: BookOpen },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export default function SacredNav({ className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { user, isLoading, logout } = useAuth();

  const handleSignOut = () => {
    logout();
    window.location.href = "/";
  };
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-500 ${
        isVisible ? "animate-in fade-in slide-in-from-top-4 duration-700" : "opacity-0 -translate-y-4"
      } ${
        isScrolled 
          ? "backdrop-blur-lg bg-background/90 shadow-lg shadow-black/5 border-b border-border/30" 
          : "backdrop-blur-md bg-background/80 border-b border-border/50"
      } ${className}`}
      role="navigation"
      aria-label="Main navigation"
      style={{
        boxShadow: isScrolled 
          ? "0 4px 30px rgba(0, 0, 0, 0.05), 0 0 40px rgba(212, 175, 55, 0.05)" 
          : "none"
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group" data-testid="link-logo">
            <div 
              className="relative w-10 h-10 rounded-full flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-3"
              style={{
                background: "linear-gradient(135deg, #d4af37 0%, #ffd700 50%, #d4af37 100%)",
                boxShadow: "0 0 25px rgba(212, 175, 55, 0.5), 0 0 50px rgba(212, 175, 55, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.3)"
              }}
            >
              <Heart className="w-5 h-5 text-white drop-shadow-md" aria-hidden="true" />
              <div 
                className="absolute inset-0 rounded-full animate-pulse"
                style={{
                  background: "radial-gradient(circle, rgba(255, 215, 0, 0.7) 0%, rgba(212, 175, 55, 0.3) 40%, transparent 70%)",
                  animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
                }}
                aria-hidden="true"
              />
              <div 
                className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: "radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, transparent 70%)",
                  filter: "blur(4px)"
                }}
                aria-hidden="true"
              />
            </div>
            <span className="font-serif text-lg font-semibold hidden sm:block">
              <span className="text-[#2f5d5d] dark:text-[#8fbf9f]">Genuine</span>
              <span className="text-[#d4af37]"> Love</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {[...PUBLIC_NAV_LINKS, ...(user ? AUTH_NAV_LINKS : [])].map(({ href, label, icon: Icon }) => {
              const isActive = location === href || (href !== "/" && location.startsWith(href));
              
              return (
                <Link
                  key={href}
                  href={href}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#d4af37]
                    ${isActive 
                      ? 'bg-[#8fbf9f]/20 text-[#2f5d5d] dark:text-[#8fbf9f]' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }
                  `}
                  aria-current={isActive ? "page" : undefined}
                  data-testid={`nav-${label.toLowerCase()}`}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  {label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            {!isLoading && user && (
              <div className="hidden sm:flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  Welcome, <span className="font-medium text-foreground">{user.username || 'Friend'}</span>
                </span>
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-muted-foreground" data-testid="button-logout">
                  <LogOut className="w-4 h-4 mr-1" aria-hidden="true" />
                  Sign out
                </Button>
              </div>
            )}

            {!isLoading && !user && (
              <a href="/login">
                <Button 
                  size="sm"
                  className="bg-gradient-to-r from-[#d4af37] to-[#ffd700] text-white hover:opacity-90"
                  data-testid="button-login"
                >
                  Sign In
                </Button>
              </a>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="md:hidden"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle menu"
              data-testid="button-menu-toggle"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {isOpen && (
          <div 
            id="mobile-menu"
            className="md:hidden py-4 border-t border-border/50 animate-in slide-in-from-top-2 duration-200"
          >
            <div className="flex flex-col gap-1">
              {[...PUBLIC_NAV_LINKS, ...(user ? AUTH_NAV_LINKS : [])].map(({ href, label, icon: Icon }) => {
                const isActive = location === href || (href !== "/" && location.startsWith(href));
                
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                      ${isActive 
                        ? 'bg-[#8fbf9f]/20 text-[#2f5d5d] dark:text-[#8fbf9f]' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }
                    `}
                    aria-current={isActive ? "page" : undefined}
                    data-testid={`nav-mobile-${label.toLowerCase()}`}
                  >
                    <Icon className="w-5 h-5" aria-hidden="true" />
                    {label}
                  </Link>
                );
              })}
              
              {!isLoading && user && (
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="mt-2 pt-2 border-t border-border/50 w-full text-left"
                  data-testid="button-logout-mobile"
                >
                  <div className="flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground">
                    <LogOut className="w-5 h-5" aria-hidden="true" />
                    Sign out ({user.username || 'User'})
                  </div>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
