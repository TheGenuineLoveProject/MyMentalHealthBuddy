import { Info, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react';

const variants = {
  info: {
    bg: 'bg-[var(--glp-sage-10)]',
    border: 'border-[var(--glp-sage-30)]',
    icon: Info,
    iconColor: 'text-[var(--glp-sage-deep)]',
  },
  warning: {
    bg: 'bg-[var(--glp-gold-10)]',
    border: 'border-[var(--glp-gold-30)]',
    icon: AlertTriangle,
    iconColor: 'text-[var(--glp-gold-600)]',
  },
  success: {
    bg: 'bg-[var(--glp-sage-10)]',
    border: 'border-[var(--glp-sage-40)]',
    icon: CheckCircle,
    iconColor: 'text-[var(--glp-sage-600)]',
  },
  tip: {
    bg: 'bg-[var(--glp-rose-10)]',
    border: 'border-[var(--glp-rose-20)]',
    icon: Lightbulb,
    iconColor: 'text-[var(--glp-blush-600)]',
  },
};

export function Callout({ variant = 'info', title, children, className = '' }) {
  const config = variants[variant] || variants.info;
  const Icon = config.icon;

  return (
    <aside
      className={`p-5 rounded-xl border ${config.bg} ${config.border} ${className}`}
      role="note"
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.iconColor}`} aria-hidden="true" />
        <div>
          {title && (
            <h4 className="font-semibold text-[var(--glp-ink)] mb-1">{title}</h4>
          )}
          <div className="text-sm text-[var(--glp-ink)]/80 leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Callout;
