import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Heart, Home, BookOpen, LayoutDashboard, Sparkles, LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button.jsx";
import { useAuth } from "../context/AuthContext";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/journal", label: "Journal", icon: BookOpen },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tools", label: "Tools", icon: Sparkles }
];

export default function SacredNav({ className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { user, isLoading } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav 
      className={`sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50 ${className}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <a className="flex items-center gap-2 group" data-testid="link-logo">
              <div 
                className="relative w-10 h-10 rounded-full flex items-center justify-center transition-all group-hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #d4af37, #ffd700)",
                  boxShadow: "0 0 20px rgba(212, 175, 55, 0.4)"
                }}
              >
                <Heart className="w-5 h-5 text-white" aria-hidden="true" />
                <div 
                  className="absolute inset-0 rounded-full animate-pulse opacity-50"
                  style={{
                    background: "radial-gradient(circle, rgba(255, 215, 0, 0.6) 0%, transparent 70%)"
                  }}
                  aria-hidden="true"
                />
              </div>
              <span className="font-serif text-lg font-semibold hidden sm:block">
                <span className="text-[#2f5d5d] dark:text-[#8fbf9f]">Genuine</span>
                <span className="text-[#d4af37]"> Love</span>
              </span>
            </a>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const isActive = location === href || (href !== "/" && location.startsWith(href));
              
              return (
                <Link key={href} href={href}>
                  <a
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
                  </a>
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
                <a href="/api/logout">
                  <Button variant="ghost" size="sm" className="text-muted-foreground" data-testid="button-logout">
                    <LogOut className="w-4 h-4 mr-1" aria-hidden="true" />
                    Sign out
                  </Button>
                </a>
              </div>
            )}

            {!isLoading && !user && (
              <a href="/api/login">
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
              {NAV_LINKS.map(({ href, label, icon: Icon }) => {
                const isActive = location === href || (href !== "/" && location.startsWith(href));
                
                return (
                  <Link key={href} href={href}>
                    <a
                      onClick={() => setIsOpen(false)}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                        ${isActive 
                          ? 'bg-[#8fbf9f]/20 text-[#2f5d5d] dark:text-[#8fbf9f]' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }
                      `}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <Icon className="w-5 h-5" aria-hidden="true" />
                      {label}
                    </a>
                  </Link>
                );
              })}
              
              {!isLoading && user && (
                <a href="/api/logout" className="mt-2 pt-2 border-t border-border/50">
                  <div className="flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground">
                    <LogOut className="w-5 h-5" aria-hidden="true" />
                    Sign out ({user.username || 'User'})
                  </div>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
