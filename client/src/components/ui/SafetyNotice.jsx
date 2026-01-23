import { Phone, Heart } from 'lucide-react';

export function SafetyNotice({ className = '' }) {
  return (
    <aside
      className={`relative p-6 rounded-2xl bg-[var(--glp-rose-10)] border border-[var(--glp-blush-300)] ${className}`}
      role="complementary"
      aria-label="Crisis support resources"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--glp-rose-20)] flex items-center justify-center">
          <Heart className="w-5 h-5 text-[var(--glp-blush-600)]" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-[var(--glp-ink)] mb-2">
            Need immediate support?
          </h3>
          <p className="text-sm text-[var(--glp-ink)]/70 mb-3">
            If you're in crisis or need to talk to someone right now, help is available 24/7.
          </p>
          <a
            href="tel:988"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-[var(--glp-blush-300)] text-[var(--glp-blush-700)] font-medium text-sm hover:bg-[var(--glp-rose-10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glp-gold)] focus-visible:ring-offset-2 transition-colors"
            data-testid="crisis-line-link"
          >
            <Phone className="w-4 h-4" aria-hidden="true" />
            988 Suicide & Crisis Lifeline
          </a>
        </div>
      </div>
    </aside>
  );
}

export default SafetyNotice;
