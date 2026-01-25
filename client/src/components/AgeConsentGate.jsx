/**
 * AgeConsentGate.jsx
 * 18+ age verification and consent component
 * 
 * Mandatory gating for wellness content
 * Educational support only - not medical advice
 */

import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Shield, Heart, AlertCircle, ExternalLink } from 'lucide-react';

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
        <div className="animate-pulse text-[var(--sage-600)]">Loading...</div>
      </div>
    );
  }

  if (hasConsented) {
    return children;
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[var(--cream-50)] to-[var(--sage-50)]"
      data-testid="age-consent-gate"
    >
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 border border-[var(--sage-200)]">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--sage-100)] mb-4">
            <Shield className="w-8 h-8 text-[var(--sage-600)]" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-[var(--neutral-900)] mb-2">
            Welcome to The Genuine Love Project
          </h1>
          <p className="text-[var(--neutral-600)]">
            A safe space for emotional wellness and self-discovery
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-3 p-4 bg-[var(--cream-50)] rounded-lg">
            <Heart className="w-5 h-5 text-[var(--rose-500)] mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div>
              <h2 className="font-medium text-[var(--neutral-900)]">What We Offer</h2>
              <p className="text-sm text-[var(--neutral-600)]">
                Educational wellness tools, journaling prompts, self-reflection exercises, 
                and AI-assisted emotional guidance.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-[var(--amber-50)] rounded-lg">
            <AlertCircle className="w-5 h-5 text-[var(--amber-600)] mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div>
              <h2 className="font-medium text-[var(--neutral-900)]">Important Notice</h2>
              <p className="text-sm text-[var(--neutral-600)]">
                This platform provides educational wellness support, not medical or mental 
                health treatment. It is not a substitute for professional care.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--sage-200)] pt-6 mb-6">
          <p className="text-sm text-[var(--neutral-700)] text-center mb-4">
            By continuing, you confirm:
          </p>
          <ul className="text-sm text-[var(--neutral-600)] space-y-2 mb-6">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--sage-500)]" aria-hidden="true"></span>
              You are 18 years of age or older
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--sage-500)]" aria-hidden="true"></span>
              You understand this is educational wellness support only
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--sage-500)]" aria-hidden="true"></span>
              You may pause or stop using the platform at any time
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleConsent}
            className="w-full py-3 px-6 bg-[var(--sage-600)] hover:bg-[var(--sage-700)] text-white font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-500)] focus-visible:ring-offset-2"
            data-testid="button-confirm-consent"
          >
            I Confirm & Continue
          </button>

          <Link
            href="/"
            className="w-full py-3 px-6 bg-[var(--neutral-100)] hover:bg-[var(--neutral-200)] text-[var(--neutral-700)] font-medium rounded-lg transition-colors text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--neutral-400)] focus-visible:ring-offset-2"
            data-testid="button-exit"
          >
            Exit
          </Link>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-[var(--neutral-500)] mb-2">
            Need immediate support?
          </p>
          <Link
            href="/crisis"
            className="inline-flex items-center gap-1 text-sm text-[var(--teal-600)] hover:text-[var(--teal-700)] font-medium"
            data-testid="link-crisis-resources"
          >
            Access Crisis Resources
            <ExternalLink className="w-3 h-3" aria-hidden="true" />
          </Link>
        </div>

        <p className="mt-4 text-xs text-[var(--neutral-400)] text-center">
          By clicking "I Confirm & Continue," you agree to our{' '}
          <Link href="/terms" className="underline hover:text-[var(--neutral-600)]">Terms</Link>
          {' '}and{' '}
          <Link href="/privacy" className="underline hover:text-[var(--neutral-600)]">Privacy Policy</Link>
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
