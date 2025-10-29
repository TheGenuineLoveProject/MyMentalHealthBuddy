import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { 
  getMobileVisibleItems, 
  getMobileMoreItems, 
  type NavCategory 
} from '@/lib/navigationStructure';

/**
 * Mobile Navigation Component
 * Responsive bottom navigation for mobile devices with categorized "More" menu
 */

export function MobileNav() {
  const [location] = useLocation();
  const [showMore, setShowMore] = useState(false);

  const mainItems = getMobileVisibleItems();
  const moreCategories = getMobileMoreItems();

  return (
    <>
      {/* Bottom Navigation Bar (Mobile) */}
      <nav 
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-40 safe-bottom"
        data-testid="mobile-nav"
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div className="grid grid-cols-5 h-16">
          {mainItems.map((item) => {
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
                data-testid={`mobile-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                aria-label={`Navigate to ${item.label}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}

          {/* More Button */}
          <button
            onClick={() => setShowMore(!showMore)}
            className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            data-testid="mobile-nav-more"
            aria-label={showMore ? 'Close more menu' : 'Open more menu'}
            aria-expanded={showMore}
          >
            {showMore ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
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
          role="presentation"
        >
          <div
            className="absolute bottom-16 left-0 right-0 bg-background border-t border-border p-4 max-h-[70vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            data-testid="mobile-nav-more-menu"
          >
            <div className="max-w-md mx-auto space-y-6">
              {moreCategories.map((category: NavCategory) => (
                <div key={category.id}>
                  <h3 
                    className="text-sm font-semibold text-muted-foreground mb-3 px-2"
                    data-testid={`mobile-category-${category.id}`}
                  >
                    {category.label}
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {category.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = location === item.path;

                      return (
                        <Link
                          key={item.path}
                          href={item.path}
                          onClick={() => setShowMore(false)}
                          className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors ${
                            isActive
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-border hover:border-primary/50'
                          }`}
                          data-testid={`mobile-more-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                          aria-label={`Navigate to ${item.label}`}
                          aria-current={isActive ? 'page' : undefined}
                        >
                          <Icon className="h-6 w-6" aria-hidden="true" />
                          <span className="text-sm font-medium text-center">{item.label}</span>
                          {item.description && (
                            <span className="text-xs text-muted-foreground text-center line-clamp-2">
                              {item.description}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Spacer for fixed mobile nav */}
      <div className="lg:hidden h-16" aria-hidden="true" />
    </>
  );
}
