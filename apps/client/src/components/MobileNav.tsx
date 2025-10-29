import { useState } from 'react';
import { Menu, X, Home, MessageCircle, Heart, BookOpen, Briefcase, BarChart3, Zap, Settings } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/Button';

/**
 * Mobile Navigation Component
 * Responsive bottom navigation for mobile devices
 */

interface NavItem {
  path: string;
  icon: typeof Home;
  label: string;
}

const mainNavItems: NavItem[] = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/chat', icon: MessageCircle, label: 'Chat' },
  { path: '/mood', icon: Heart, label: 'Mood' },
  { path: '/journal', icon: BookOpen, label: 'Journal' },
];

const moreNavItems: NavItem[] = [
  { path: '/studio', icon: Briefcase, label: 'Studio' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/productivity', icon: Zap, label: 'Productivity' },
  { path: '/account', icon: Settings, label: 'Settings' },
];

export function MobileNav() {
  const [location] = useLocation();
  const [showMore, setShowMore] = useState(false);

  return (
    <>
      {/* Bottom Navigation Bar (Mobile) */}
      <nav 
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-40 safe-bottom"
        data-testid="mobile-nav"
      >
        <div className="grid grid-cols-5 h-16">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                  isActive 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                data-testid={`mobile-nav-${item.label.toLowerCase()}`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}

          {/* More Button */}
          <button
            onClick={() => setShowMore(!showMore)}
            className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            data-testid="mobile-nav-more"
          >
            {showMore ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="text-xs font-medium">More</span>
          </button>
        </div>
      </nav>

      {/* More Menu Overlay */}
      {showMore && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setShowMore(false)}
          data-testid="mobile-nav-overlay"
        >
          <div
            className="absolute bottom-16 left-0 right-0 bg-background border-t border-border p-4"
            onClick={(e) => e.stopPropagation()}
            data-testid="mobile-nav-more-menu"
          >
            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
              {moreNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.path;

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setShowMore(false)}
                    className={`flex items-center gap-3 p-4 rounded-lg border transition-colors ${
                      isActive
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                    data-testid={`mobile-more-${item.label.toLowerCase()}`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Spacer for fixed mobile nav */}
      <div className="lg:hidden h-16" />
    </>
  );
}
