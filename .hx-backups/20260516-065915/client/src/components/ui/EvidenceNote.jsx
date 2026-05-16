import { BookOpen } from 'lucide-react';

export function EvidenceNote({ children, source, className = '' }) {
  return (
    <aside
      className={`p-4 rounded-xl bg-[var(--glp-sage-10)] border border-[var(--glp-sage-20)] ${className}`}
      role="note"
      aria-label="Research note"
    >
      <div className="flex items-start gap-3">
        <BookOpen className="w-5 h-5 text-[var(--glp-sage-deep)] flex-shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <p className="text-sm text-[var(--glp-ink)]/80 leading-relaxed">
            {children}
          </p>
          {source && (
            <p className="text-xs text-[var(--glp-ink)]/50 mt-2 italic">
              Source: {source}
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}

export default EvidenceNote;
