import { ChevronRight } from "lucide-react";
import { Link } from "wouter";

export default function DashboardCard({ 
  title, 
  icon: Icon,
  children, 
  footer,
  href,
  variant = "default",
  className = "",
}) {
  const variants = {
    default: "card-elevated",
    premium: "card-elevated hover-glow-sage",
    accent: "card-elevated border-[var(--primary)]/20 bg-gradient-to-br from-[var(--primary-soft)] to-transparent",
    gold: "card-elevated hover-glow-gold border-[var(--accent-gold)]/20",
  };

  const Content = () => (
    <>
      {(title || Icon) && (
        <header className="flex-between mb-4">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="icon-badge icon-badge-sage icon-circle-md">
                <Icon className="icon-sm" aria-hidden="true" />
              </div>
            )}
            {title && (
              <h2 className="text-heading-sm text-brand">{title}</h2>
            )}
          </div>
          {href && (
            <ChevronRight className="icon-sm text-secondary" aria-hidden="true" />
          )}
        </header>
      )}
      <div className="text-secondary">{children}</div>
      {footer && (
        <>
          <div className="border-t border-[var(--border)] my-4" />
          <footer>{footer}</footer>
        </>
      )}
    </>
  );

  if (href) {
    return (
      <Link 
        href={href}
        className={`block p-5 transition-all ${variants[variant]} ${className}`}
        data-testid={`dashboard-card-${title?.toLowerCase().replace(/\s+/g, '-') || 'untitled'}`}
      >
        <Content />
      </Link>
    );
  }

  return (
    <section 
      className={`p-5 ${variants[variant]} ${className}`}
      data-testid={`dashboard-card-${title?.toLowerCase().replace(/\s+/g, '-') || 'untitled'}`}
    >
      <Content />
    </section>
  );
}

export function DashboardCardGrid({ children, columns = 2 }) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4`}>
      {children}
    </div>
  );
}

export function DashboardCardSkeleton({ hasIcon = true }) {
  return (
    <div className="card-elevated p-5 animate-pulse motion-reduce:animate-none">
      <div className="flex items-center gap-3 mb-4">
        {hasIcon && (
          <div className="w-10 h-10 rounded-xl bg-[var(--surface-hover)]" />
        )}
        <div className="h-5 w-24 rounded bg-[var(--surface-hover)]" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-full rounded bg-[var(--surface-hover)]" />
        <div className="h-4 w-3/4 rounded bg-[var(--surface-hover)]" />
      </div>
    </div>
  );
}
