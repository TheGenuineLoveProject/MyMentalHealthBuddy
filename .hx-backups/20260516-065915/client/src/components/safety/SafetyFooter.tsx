import { Link } from "wouter";
import {
  AGE_REQUIREMENT_TEXT,
  NOT_THERAPY_TEXT,
  NOT_MEDICAL_ADVICE_TEXT,
  CRISIS_TEXT,
  LEGAL_LINKS
} from "@/policy/platformPolicy";

interface SafetyFooterProps {
  showCrisisLink?: boolean;
  className?: string;
}

export function SafetyFooter({ showCrisisLink = true, className = "" }: SafetyFooterProps) {
  return (
    <footer
      className={`mt-auto py-6 px-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 ${className}`}
      role="contentinfo"
      data-testid="safety-footer"
    >
      <div className="max-w-4xl mx-auto text-center space-y-3">
        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
          <p data-testid="age-requirement">{AGE_REQUIREMENT_TEXT}</p>
          <p data-testid="not-therapy">{NOT_THERAPY_TEXT}</p>
          <p data-testid="not-medical">{NOT_MEDICAL_ADVICE_TEXT}</p>
        </div>

        {showCrisisLink && (
          <div className="pt-2" data-testid="crisis-section">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              {CRISIS_TEXT}
            </p>
            <Link
              href={LEGAL_LINKS.crisis}
              className="text-sm font-medium text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 underline"
              data-testid="link-crisis"
            >
              View Crisis Resources
            </Link>
          </div>
        )}

        <nav className="pt-4 flex flex-wrap justify-center gap-4 text-xs text-gray-500 dark:text-gray-400" aria-label="Legal links">
          <Link href={LEGAL_LINKS.privacy} className="hover:underline" data-testid="link-privacy">
            Privacy Policy
          </Link>
          <Link href={LEGAL_LINKS.terms} className="hover:underline" data-testid="link-terms">
            Terms of Service
          </Link>
          <Link href={LEGAL_LINKS.disclaimer} className="hover:underline" data-testid="link-disclaimer">
            Disclaimer
          </Link>
        </nav>

        <p className="text-xs text-gray-400 dark:text-gray-500 pt-2">
          You may pause or leave at any time.
        </p>
      </div>
    </footer>
  );
}

export default SafetyFooter;
