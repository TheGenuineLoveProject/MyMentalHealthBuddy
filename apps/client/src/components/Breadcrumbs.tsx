import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'wouter';

/**
 * Breadcrumbs Component
 * Provides navigation context showing the current page hierarchy
 */

interface BreadcrumbItem {
  label: string;
  path: string;
}

const routeLabels: Record<string, string> = {
  '': 'Dashboard',
  'chat': 'AI Chat',
  'mood': 'Mood Tracker',
  'journal': 'Journal',
  'studio': 'Content Studio',
  'social': 'Social Calendar',
  'analytics': 'Analytics',
  'performance': 'Performance',
  'productivity': 'Productivity Hub',
  'designs': 'Canva Designs',
  'billing': 'Billing',
  'account': 'Account',
  'resources': 'Resources',
  'crisis': 'Crisis Support',
  'design-system': 'Design System',
};

export function Breadcrumbs() {
  const [location] = useLocation();
  
  // Parse path into breadcrumb items
  const pathSegments = location.split('/').filter(Boolean);
  
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', path: '/' }
  ];

  // Build breadcrumb trail
  let currentPath = '';
  pathSegments.forEach(segment => {
    currentPath += `/${segment}`;
    const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    breadcrumbs.push({ label, path: currentPath });
  });

  // Don't show breadcrumbs on home page
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav 
      aria-label="Breadcrumb" 
      className="mb-4"
      data-testid="breadcrumbs-nav"
    >
      <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const isFirst = index === 0;

          return (
            <li key={crumb.path} className="flex items-center" data-testid={`breadcrumb-${index}`}>
              {index > 0 && (
                <ChevronRight className="h-4 w-4 mx-2" aria-hidden="true" />
              )}
              {isLast ? (
                <span 
                  className="font-medium text-foreground"
                  aria-current="page"
                  data-testid="breadcrumb-current"
                >
                  {isFirst && <Home className="h-4 w-4 inline mr-1" />}
                  {crumb.label}
                </span>
              ) : (
                <Link 
                  href={crumb.path}
                  className="hover:text-foreground transition-colors flex items-center"
                  data-testid={`breadcrumb-link-${index}`}
                >
                  {isFirst && <Home className="h-4 w-4 inline mr-1" />}
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
