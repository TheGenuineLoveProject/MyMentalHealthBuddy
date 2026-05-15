import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Shield, Heart, AlertCircle, ExternalLink, ArrowLeft } from 'lucide-react';

const CONSENT_STORAGE_KEY = 'glp_age_confirmed';

export default function AgeConsentGate({ children, onConsent }) {
  const [hasConsented, setHasConsented] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (stored === 'true') {
      setHasConsented(true);
    }
    setIsLoading(false);
  }, []);

  const handleConsent = () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, 'true');
    setHasConsented(true);
    onConsent?.();
  };

  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        data-testid="consent-loading"
      >
        <div className="animate-pulse motion-reduce:animate-none text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (hasConsented) {
    return children;
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30"
      data-testid="age-consent-gate"
    >
      <div className="max-w-lg w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-emerald-200 dark:border-emerald-800">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/50 mb-4">
            <Shield className="w-8 h-8 text-emerald-700 dark:text-emerald-300" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-foreground mb-2">
            Welcome to The Genuine Love Project
          </h1>
          <p className="text-muted-foreground">
            A safe space for emotional wellness and self-discovery
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
            <Heart className="w-5 h-5 text-rose-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div>
              <h2 className="font-medium text-foreground">What We Offer</h2>
              <p className="text-sm text-muted-foreground">
                Educational wellness tools, journaling prompts, self-reflection exercises, 
                and AI-assisted emotional guidance.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div>
              <h2 className="font-medium text-foreground">Important Notice</h2>
              <p className="text-sm text-muted-foreground">
                This platform provides educational wellness support, not medical or mental 
                health treatment. It is not a substitute for professional care.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-emerald-200 dark:border-emerald-800 pt-6 mb-6">
          <p className="text-base font-medium text-foreground text-center mb-5">
            By continuing, you confirm:
          </p>
          <ul className="space-y-4 mb-6">
            <li className="flex items-center gap-4 p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-sm flex-shrink-0" aria-hidden="true">18+</span>
              <span className="text-base text-foreground font-medium">You are 18 years of age or older</span>
            </li>
            <li className="flex items-center gap-4 p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-600 flex-shrink-0" aria-hidden="true">
                <Heart className="w-4 h-4 text-white" />
              </span>
              <span className="text-base text-foreground font-medium">You understand this is educational wellness support only</span>
            </li>
            <li className="flex items-center gap-4 p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-600 flex-shrink-0" aria-hidden="true">
                <Shield className="w-4 h-4 text-white" />
              </span>
              <span className="text-base text-foreground font-medium">You may pause or stop using the platform at any time</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleConsent}
            className="w-full py-3 px-6 bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            data-testid="button-confirm-consent"
          >
            I Confirm & Continue
          </button>

          <Link
            href="/dashboard"
            className="w-full py-3 px-6 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 font-medium rounded-lg transition-colors text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 inline-flex items-center justify-center gap-2 border border-emerald-200 dark:border-emerald-800"
            data-testid="link-back-to-dashboard"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Back to Dashboard
          </Link>

          <Link
            href="/"
            className="w-full py-3 px-6 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
            data-testid="button-exit"
          >
            Exit
          </Link>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground mb-2">
            Need immediate support?
          </p>
          <Link
            href="/crisis"
            className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 font-medium"
            data-testid="link-crisis-resources"
          >
            Access Crisis Resources
            <ExternalLink className="w-3 h-3" aria-hidden="true" />
          </Link>
        </div>

        <p className="mt-4 text-xs text-muted-foreground text-center">
          By clicking "I Confirm & Continue," you agree to our{' '}
          <Link href="/terms" className="underline hover:text-foreground">Terms</Link>
          {' '}and{' '}
          <Link href="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}

export function useHasConsented() {
  const [hasConsented, setHasConsented] = useState(false);
  
  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    setHasConsented(stored === 'true');
  }, []);

  return hasConsented;
}

export function clearConsent() {
  localStorage.removeItem(CONSENT_STORAGE_KEY);
}
