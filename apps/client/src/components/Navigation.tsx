import { Link, useLocation } from "wouter";
import { ThemeToggle } from "@/components/ThemeToggle";
import { allNavItems } from "@/lib/navigationStructure";

export function Navigation() {
  const [location] = useLocation();

  // Show ALL navigation items on desktop (14 total)
  // System items (Billing, Account) can be accessed from nav
  const mainNavItems = allNavItems;

  return (
    <nav className="bg-blue-600 dark:bg-blue-900 text-white shadow-lg" role="navigation" aria-label="Main navigation">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <h1 className="text-lg font-bold flex-shrink-0">
            <Link href="/" aria-label="MyMentalHealthBuddy - Home" data-testid="link-logo">
              <span className="hidden xl:inline">MyMentalHealthBuddy</span>
              <span className="xl:hidden">MMHB</span>
            </Link>
          </h1>

          {/* Main Navigation - All 14 items, scrollable on medium screens */}
          <div 
            className="hidden lg:flex items-center gap-1 flex-1 justify-center overflow-x-auto scrollbar-hide" 
            role="menubar" 
            aria-label="Main menu"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {mainNavItems.map(({ path, label, icon: Icon, category }) => {
              const isActive = location === path;
              
              return (
                <Link
                  key={path}
                  href={path}
                  data-testid={`link-${label.toLowerCase().replace(/\s+/g, '-')}`}
                  aria-label={`Navigate to ${label}`}
                  aria-current={isActive ? 'page' : undefined}
                  role="menuitem"
                >
                  <span
                    className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg transition text-xs xl:text-sm whitespace-nowrap ${
                      isActive
                        ? "bg-blue-700 dark:bg-blue-800 font-semibold"
                        : "hover:bg-blue-500 dark:hover:bg-blue-700"
                    } ${
                      // Add visual separator between categories
                      category === 'professional' && mainNavItems.findIndex(item => item.path === path) === 4
                        ? 'ml-2'
                        : category === 'tools' && mainNavItems.findIndex(item => item.path === path) === 8
                        ? 'ml-2'
                        : category === 'system' && mainNavItems.findIndex(item => item.path === path) === 12
                        ? 'ml-2'
                        : ''
                    }`}
                    title={label}
                  >
                    <Icon size={14} aria-hidden="true" className="flex-shrink-0" />
                    <span className="hidden 2xl:inline">{label}</span>
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Theme Toggle */}
          <div className="flex-shrink-0" aria-label="Theme settings">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Category Labels for very wide screens */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </nav>
  );
}
