import { Quote as QuoteIcon } from 'lucide-react';

export function Quote({ children, author, source, className = '' }) {
  return (
    <figure className={`relative ${className}`}>
      <QuoteIcon
        className="absolute -top-2 -left-2 w-8 h-8 text-[var(--glp-sage-20)]"
        aria-hidden="true"
      />
      <blockquote className="pl-8 border-l-4 border-[var(--glp-sage-30)] py-2">
        <p className="font-sacred text-xl md:text-2xl text-[var(--glp-ink)] italic leading-relaxed">
          {children}
        </p>
      </blockquote>
      {(author || source) && (
        <figcaption className="pl-8 mt-3 text-sm text-[var(--glp-ink)]/60">
          {author && <span className="font-medium">— {author}</span>}
          {source && <span>, {source}</span>}
        </figcaption>
      )}
    </figure>
  );
}

export default Quote;
