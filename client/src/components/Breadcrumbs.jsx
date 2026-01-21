import { Link } from "wouter";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumbs({ items }) {
  if (!items || items.length === 0) return null;
  
  return (
    <nav 
      aria-label="Breadcrumb" 
      className="mb-6"
      data-testid="nav-breadcrumbs"
    >
      <ol className="flex items-center gap-1 text-sm text-[var(--text-2)] flex-wrap">
        <li className="flex items-center">
          <Link 
            href="/" 
            className="flex items-center gap-1 hover:text-[var(--glp-primary)] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded"
            data-testid="breadcrumb-home"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.path || index} className="flex items-center">
              <ChevronRight className="w-4 h-4 mx-1 text-[var(--text-3)]" aria-hidden="true" />
              {isLast ? (
                <span 
                  className="text-[var(--text-1)] font-medium" 
                  aria-current="page"
                  data-testid={`breadcrumb-current-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {item.label}
                </span>
              ) : (
                <Link 
                  href={item.path} 
                  className="hover:text-[var(--glp-primary)] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded"
                  data-testid={`breadcrumb-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
