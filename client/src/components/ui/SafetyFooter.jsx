/**
 * SafetyFooter - Unified safety messaging component
 * Variants: default, compact, prominent
 * 
 * Usage:
 *   <SafetyFooter /> - default variant
 *   <SafetyFooter variant="compact" /> - minimal for small tools
 *   <SafetyFooter variant="prominent" /> - highlighted for high-emotion pages
 */
import { Link } from 'wouter';

const DISCLAIMER = {
  default: "This tool supports self-reflection and emotional awareness. It is not therapy, medical advice, or crisis intervention. You can pause or stop at any time.",
  compact: "For reflection support, not clinical care. Stop anytime.",
  prominent: "Important: The Genuine Love Project provides educational and reflective tools only. We do not diagnose, treat, or provide therapy. You are in control — skip any step that doesn't feel right, and pause or stop at any time. If you are experiencing a mental health crisis, please contact a professional or crisis service immediately."
};

export default function SafetyFooter({ 
  variant = "default", 
  showCrisis = true, 
  showDisclaimer = true,
  className = "" 
}) {
  const baseStyles = {
    default: "mt-8 p-4 bg-[var(--glp-sage-10)] rounded-lg text-sm text-[var(--glp-text-secondary)]",
    compact: "mt-4 p-2 text-xs text-[var(--glp-text-muted)] text-center",
    prominent: "mt-8 p-6 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl"
  };

  return (
    <footer 
      role="contentinfo" 
      aria-label="Safety information"
      data-testid="safety-footer"
      className={`${baseStyles[variant]} ${className}`}
    >
      {showDisclaimer && (
        <p className={variant === "prominent" ? "font-medium mb-3" : "mb-2"}>
          {DISCLAIMER[variant]}
        </p>
      )}
      
      {showCrisis && (
        <div className={`flex flex-wrap gap-4 mt-3 ${variant === "compact" ? "justify-center" : ""}`}>
          <span className="font-medium">Need support?</span>
          <a 
            href="tel:988" 
            className="text-[var(--glp-gold)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glp-gold)] rounded"
            data-testid="crisis-988"
          >
            Call or text 988
          </a>
          <span className="text-[var(--glp-text-muted)]">|</span>
          <a 
            href="sms:741741&body=HOME" 
            className="text-[var(--glp-gold)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glp-gold)] rounded"
            data-testid="crisis-741741"
          >
            Text HOME to 741741
          </a>
        </div>
      )}
      
      <div className={`flex gap-4 mt-3 text-xs ${variant === "compact" ? "justify-center" : ""}`}>
        <Link href="/disclaimer" className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glp-gold)] rounded">
          Disclaimer
        </Link>
        <Link href="/privacy" className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glp-gold)] rounded">
          Privacy
        </Link>
        <Link href="/crisis" className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glp-gold)] rounded">
          Crisis Resources
        </Link>
      </div>
    </footer>
  );
}
