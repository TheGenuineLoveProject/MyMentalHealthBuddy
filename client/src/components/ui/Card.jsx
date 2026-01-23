import * as LucideIcons from 'lucide-react';

// Composable card primitives (shadcn-style)
export function CardHeader({ children, className = '' }) {
  return (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`} data-testid="card-header">
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-lg font-semibold leading-none tracking-tight text-[var(--glp-ink)] ${className}`} data-testid="card-title">
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '' }) {
  return (
    <p className={`text-sm text-[var(--glp-ink)]/70 ${className}`} data-testid="card-description">
      {children}
    </p>
  );
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={`p-6 pt-0 ${className}`} data-testid="card-content">
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`flex items-center p-6 pt-0 ${className}`} data-testid="card-footer">
      {children}
    </div>
  );
}

// Full card wrapper for composable usage
export function CardWrapper({ children, className = '' }) {
  return (
    <div className={`rounded-2xl border border-[var(--glp-sage-20)] bg-white shadow-sm ${className}`} data-testid="card-wrapper">
      {children}
    </div>
  );
}

// Legacy Card component with icon/title/text props
export function Card({
  icon,
  title,
  text,
  href,
  className = '',
}) {
  const IconComponent = icon && LucideIcons[icon] ? LucideIcons[icon] : null;

  const content = (
    <div
      className={`group relative p-6 rounded-2xl bg-white border border-[var(--glp-sage-20)] shadow-sm hover:shadow-md hover:border-[var(--glp-sage-40)] focus-within:ring-2 focus-within:ring-[var(--glp-gold)] focus-within:ring-offset-2 transition-all motion-safe:transition-transform motion-safe:hover:-translate-y-1 ${className}`}
    >
      {IconComponent && (
        <div className="w-12 h-12 rounded-xl bg-[var(--glp-sage-10)] flex items-center justify-center mb-4">
          <IconComponent className="w-6 h-6 text-[var(--glp-sage-deep)]" aria-hidden="true" />
        </div>
      )}
      {title && (
        <h3 className="text-lg font-semibold text-[var(--glp-ink)] mb-2" data-testid={`card-title-${title?.toLowerCase().replace(/\s+/g, '-') || 'untitled'}`}>
          {title}
        </h3>
      )}
      {text && (
        <p className="text-[var(--glp-ink)]/70 text-sm leading-relaxed" data-testid={`card-text-${title?.toLowerCase().replace(/\s+/g, '-') || 'untitled'}`}>
          {text}
        </p>
      )}
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        className="block focus:outline-none"
        data-testid={`card-${title?.toLowerCase().replace(/\s+/g, '-') || 'link'}`}
      >
        {content}
      </a>
    );
  }

  return content;
}

export function CardGrid({ children, columns = 3, className = '' }) {
  const colClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }[columns] || 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <div className={`grid ${colClass} gap-6 ${className}`}>
      {children}
    </div>
  );
}

export default Card;
