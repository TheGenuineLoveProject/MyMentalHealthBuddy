import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { allNavItems } from '@/lib/navigationStructure';

/**
 * Enhanced Breadcrumbs Component
 * Provides navigation context with mobile support and category awareness
 */

interface BreadcrumbItem {
  label: string;
  path: string;
  category?: string;
}

export function Breadcrumbs() {
  const [location] = useLocation();
  
  // Parse path into breadcrumb items
  const pathSegments = location.split('/').filter(Boolean);
  
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', path: '/' }
  ];

  // Build breadcrumb trail using unified navigation structure
  let currentPath = '';
  pathSegments.forEach(segment => {
    currentPath += `/${segment}`;
    
    // Find the page in our navigation structure for accurate labeling
    const navItem = allNavItems.find(item => item.path === currentPath);
    
    if (navItem) {
      breadcrumbs.push({
        label: navItem.label,
        path: currentPath,
        category: navItem.category
      });
    } else {
      // Fallback for dynamic routes not in navigation
      breadcrumbs.push({
        label: segment.charAt(0).toUpperCase() + segment.slice(1),
        path: currentPath
      });
    }
  });

  // Don't show breadcrumbs on home page
  if (breadcrumbs.length <= 1) {
    return null;
  }

  // Mobile: Show only last 2 items for space efficiency
  const mobileBreadcrumbs = breadcrumbs.length > 2 
    ? [breadcrumbs[0], breadcrumbs[breadcrumbs.length - 1]]
    : breadcrumbs;

  return (
    <>
      {/* Desktop Breadcrumbs - Full trail */}
      <nav 
        aria-label="Breadcrumb" 
        className="mb-4 hidden lg:block"
        data-testid="breadcrumbs-nav"
      >
        <ol className="flex items-center flex-wrap gap-2 text-sm text-muted-foreground">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            const isFirst = index === 0;

            return (
              <li 
                key={crumb.path} 
                className="flex items-center"
                data-testid={`breadcrumb-${index}`}
              >
                {index > 0 && (
                  <ChevronRight className="h-4 w-4 mx-2 flex-shrink-0" aria-hidden="true" />
                )}
                {isLast ? (
                  <span 
                    className="font-medium text-foreground flex items-center"
                    aria-current="page"
                    data-testid="breadcrumb-current"
                  >
                    {isFirst && <Home className="h-4 w-4 inline mr-1.5 flex-shrink-0" aria-hidden="true" />}
                    <span className="truncate max-w-[200px]">{crumb.label}</span>
                    {crumb.category && (
                      <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary capitalize">
                        {crumb.category}
                      </span>
                    )}
                  </span>
                ) : (
                  <Link 
                    href={crumb.path}
                    className="hover:text-foreground transition-colors flex items-center group"
                    data-testid={`breadcrumb-link-${index}`}
                    aria-label={`Navigate to ${crumb.label}`}
                  >
                    {isFirst && <Home className="h-4 w-4 inline mr-1.5 flex-shrink-0 group-hover:scale-110 transition-transform" aria-hidden="true" />}
                    <span className="truncate max-w-[150px]">{crumb.label}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Mobile Breadcrumbs - Compact version */}
      <nav 
        aria-label="Breadcrumb" 
        className="mb-3 lg:hidden"
        data-testid="breadcrumbs-nav-mobile"
      >
        <ol className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {mobileBreadcrumbs.map((crumb, index) => {
            const isLast = index === mobileBreadcrumbs.length - 1;
            const isFirst = index === 0;
            const showEllipsis = breadcrumbs.length > 2 && index === 0 && mobileBreadcrumbs.length === 2;

            return (
              <li 
                key={crumb.path} 
                className="flex items-center"
                data-testid={`breadcrumb-mobile-${index}`}
              >
                {showEllipsis && <span className="mx-1">...</span>}
                {index > 0 && !showEllipsis && (
                  <ChevronRight className="h-3 w-3 mx-1 flex-shrink-0" aria-hidden="true" />
                )}
                {isLast ? (
                  <span 
                    className="font-medium text-foreground flex items-center truncate max-w-[150px]"
                    aria-current="page"
                    data-testid="breadcrumb-mobile-current"
                  >
                    {isFirst && !showEllipsis && <Home className="h-3 w-3 inline mr-1 flex-shrink-0" aria-hidden="true" />}
                    {crumb.label}
                  </span>
                ) : (
                  <Link 
                    href={crumb.path}
                    className="hover:text-foreground transition-colors flex items-center"
                    data-testid={`breadcrumb-mobile-link-${index}`}
                    aria-label={`Navigate to ${crumb.label}`}
                  >
                    {isFirst && <Home className="h-3 w-3 inline mr-1 flex-shrink-0" aria-hidden="true" />}
                    <span className="truncate max-w-[100px]">{!isFirst || crumb.label}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
