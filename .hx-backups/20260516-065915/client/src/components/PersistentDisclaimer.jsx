/**
 * PersistentDisclaimer.jsx
 * Persistent footer disclaimer component
 * 
 * Always visible on wellness pages:
 * - 18+ only
 * - Educational support — not medical advice
 * - Pause or stop anytime
 * - /crisis link
 */

import { Link } from 'wouter';
import { AlertCircle, Heart, Pause, Phone } from 'lucide-react';

export default function PersistentDisclaimer({ 
  variant = 'bar',
  className = "" 
}) {
  if (variant === 'compact') {
    return (
      <div 
        className={`text-xs text-[var(--neutral-500)] text-center py-2 ${className}`}
        data-testid="persistent-disclaimer-compact"
        role="complementary"
        aria-label="Important notices"
      >
        18+ only · Educational support only · Not medical advice ·{' '}
        <Link 
          href="/crisis" 
          className="text-[var(--teal-600)] hover:underline font-medium"
          data-testid="link-crisis-compact"
        >
          Crisis Support
        </Link>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <p 
        className={`text-xs text-[var(--neutral-500)] ${className}`}
        data-testid="persistent-disclaimer-inline"
      >
        This is educational wellness support for adults 18+, not medical or mental health treatment. 
        You can pause or stop anytime. Need immediate help?{' '}
        <Link 
          href="/crisis" 
          className="text-[var(--teal-600)] hover:underline font-medium"
        >
          Access crisis resources
        </Link>
      </p>
    );
  }

  return (
    <div 
      className={`bg-[var(--cream-50)] border-t border-[var(--sage-200)] py-3 px-4 ${className}`}
      data-testid="persistent-disclaimer-bar"
      role="complementary"
      aria-label="Important platform notices"
    >
      <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[var(--neutral-600)]">
        <div className="flex items-center gap-1.5">
          <Heart className="w-3 h-3 text-[var(--rose-500)]" aria-hidden="true" />
          <span>18+ only</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <AlertCircle className="w-3 h-3 text-[var(--amber-500)]" aria-hidden="true" />
          <span>Educational support — not medical advice</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <Pause className="w-3 h-3 text-[var(--neutral-500)]" aria-hidden="true" />
          <span>Pause or stop anytime</span>
        </div>
        
        <Link 
          href="/crisis"
          className="flex items-center gap-1.5 text-[var(--teal-600)] hover:text-[var(--teal-700)] font-medium"
          data-testid="link-crisis-bar"
        >
          <Phone className="w-3 h-3" aria-hidden="true" />
          <span>Crisis Support</span>
        </Link>
      </div>
    </div>
  );
}

export function CrisisNotice({ className = "" }) {
  return (
    <div 
      className={`bg-[var(--amber-50)] border border-[var(--amber-200)] rounded-lg p-4 ${className}`}
      data-testid="crisis-notice"
      role="alert"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-[var(--amber-600)] flex-shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <p className="text-sm font-medium text-[var(--amber-800)]">
            Need immediate support?
          </p>
          <p className="text-sm text-[var(--amber-700)] mt-1">
            If you're experiencing a mental health crisis, please reach out:
          </p>
          <div className="mt-2 space-y-1 text-sm">
            <p>
              <strong>988 Suicide & Crisis Lifeline:</strong>{' '}
              <a href="tel:988" className="text-[var(--teal-600)] hover:underline font-medium">
                Call or text 988
              </a>
            </p>
            <p>
              <strong>Crisis Text Line:</strong>{' '}
              <span className="text-[var(--teal-600)] font-medium">Text HOME to 741741</span>
            </p>
          </div>
          <Link 
            href="/crisis"
            className="inline-block mt-3 text-sm text-[var(--teal-600)] hover:text-[var(--teal-700)] font-medium underline"
            data-testid="link-crisis-full"
          >
            View all crisis resources
          </Link>
        </div>
      </div>
    </div>
  );
}

export function SafetyReminder({ onDismiss, className = "" }) {
  return (
    <div 
      className={`bg-[var(--sage-50)] border border-[var(--sage-200)] rounded-lg p-4 ${className}`}
      data-testid="safety-reminder"
      role="complementary"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Heart className="w-5 h-5 text-[var(--sage-600)] flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="text-sm font-medium text-[var(--sage-800)]">
              A gentle reminder
            </p>
            <p className="text-sm text-[var(--sage-700)] mt-1">
              This is your space. You control the pace. It's okay to take breaks, 
              skip exercises, or come back another time. Your wellbeing comes first.
            </p>
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-[var(--sage-500)] hover:text-[var(--sage-700)] text-sm"
            aria-label="Dismiss reminder"
            data-testid="button-dismiss-reminder"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
