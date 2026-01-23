import { Check } from 'lucide-react';

export function Steps({ steps = [], className = '' }) {
  return (
    <ol className={`space-y-4 ${className}`} role="list">
      {steps.map((step, index) => (
        <li key={index} className="flex items-start gap-4">
          <span
            className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--glp-sage-deep)] text-white flex items-center justify-center text-sm font-semibold"
            aria-hidden="true"
          >
            {index + 1}
          </span>
          <div className="flex-1 pt-1">
            {typeof step === 'string' ? (
              <p className="text-[var(--glp-ink)]/80">{step}</p>
            ) : (
              <>
                {step.title && (
                  <h4 className="font-medium text-[var(--glp-ink)] mb-1">{step.title}</h4>
                )}
                {step.text && (
                  <p className="text-sm text-[var(--glp-ink)]/70">{step.text}</p>
                )}
              </>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

export function StepsCompact({ steps = [], className = '' }) {
  return (
    <ul className={`space-y-3 ${className}`} role="list">
      {steps.map((step, index) => (
        <li key={index} className="flex items-start gap-3">
          <Check className="w-5 h-5 text-[var(--glp-sage-deep)] flex-shrink-0 mt-0.5" aria-hidden="true" />
          <span className="text-[var(--glp-ink)]/80">{step}</span>
        </li>
      ))}
    </ul>
  );
}

export default Steps;
