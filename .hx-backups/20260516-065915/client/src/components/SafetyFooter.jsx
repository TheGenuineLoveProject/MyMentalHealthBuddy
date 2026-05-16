/**
 * SafetyFooter.jsx
 * Persistent safety disclaimer for all wellness pages
 * 
 * Required on: Every wellness/tool page
 * Content: "18+ only • Educational support — not medical advice • Pause/stop anytime • /crisis"
 */

import { Link } from 'wouter';
import { Pause, Heart } from 'lucide-react';

export default function SafetyFooter({ className = '', variant = 'default' }) {
  const isCompact = variant === 'compact';

  return (
    <footer 
      className={`border-t border-[var(--border)] bg-[var(--bg-secondary)] ${className}`}
      role="contentinfo"
      aria-label="Safety information"
      data-testid="safety-footer"
    >
      <div className={`max-w-4xl mx-auto ${isCompact ? 'py-3 px-4' : 'py-4 px-6'}`}>
        <div className={`flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-[var(--text-tertiary)] ${isCompact ? '' : 'sm:text-sm'}`}>
          <span className="flex items-center gap-1">
            <span aria-hidden="true">18+</span>
            <span className="sr-only">Adults only</span>
          </span>
          
          <span aria-hidden="true">•</span>
          
          <span>Educational support — not medical advice</span>
          
          <span aria-hidden="true">•</span>
          
          <span className="flex items-center gap-1">
            <Pause className="w-3 h-3" aria-hidden="true" />
            Pause/stop anytime
          </span>
          
          <span aria-hidden="true">•</span>
          
          <Link 
            href="/crisis"
            className="flex items-center gap-1 text-[var(--primary)] hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--primary)] rounded"
            data-testid="link-crisis"
          >
            <Heart className="w-3 h-3" aria-hidden="true" />
            /crisis
          </Link>
        </div>
      </div>
    </footer>
  );
}

export function SafetyBanner({ className = '' }) {
  return (
    <div 
      className={`bg-[var(--bg-tertiary)] border-b border-[var(--border)] py-2 px-4 ${className}`}
      role="banner"
      aria-label="Safety notice"
      data-testid="safety-banner"
    >
      <p className="text-xs text-center text-[var(--text-tertiary)]">
        <span className="font-medium">18+ only</span>
        <span className="mx-2">•</span>
        Educational wellness support — not medical advice
        <span className="mx-2">•</span>
        <Link 
          href="/crisis" 
          className="text-[var(--primary)] hover:underline"
          data-testid="link-crisis-banner"
        >
          If you're in crisis, visit /crisis
        </Link>
      </p>
    </div>
  );
}

export function InlineSafetyNote({ className = '' }) {
  return (
    <p 
      className={`text-xs text-[var(--text-tertiary)] text-center ${className}`}
      data-testid="inline-safety-note"
    >
      Educational wellness support — not medical advice. 
      {' '}
      <Link 
        href="/crisis" 
        className="text-[var(--primary)] hover:underline"
      >
        Crisis support
      </Link>
    </p>
  );
}

export { SafetyFooter };
