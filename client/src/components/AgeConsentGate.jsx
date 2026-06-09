import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Shield, Heart, AlertCircle, ExternalLink, ArrowLeft } from 'lucide-react';

const CONSENT_STORAGE_KEY = 'glp_age_confirmed';

const S = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1rem',
    background: 'linear-gradient(135deg, #ecf6ee 0%, #f4faf4 100%)',
  },
  card: {
    width: '100%',
    maxWidth: '46rem',
    background: '#ffffff',
    borderRadius: '1.5rem',
    border: '1px solid var(--glp-sage-20, #d8e6d3)',
    boxShadow: '0 20px 55px rgba(31, 71, 51, 0.10)',
    padding: '2.25rem 1.75rem',
  },
  shieldCircle: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '64px',
    height: '64px',
    borderRadius: '9999px',
    background: 'rgba(168, 201, 160, 0.28)',
    marginBottom: '1rem',
  },
  infoRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    padding: '1rem',
    background: '#fdf6e9',
    borderRadius: '0.75rem',
  },
  confirmItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.75rem 1rem',
    background: 'rgba(168, 201, 160, 0.16)',
    border: '1px solid var(--glp-sage-20, #d8e6d3)',
    borderRadius: '0.75rem',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '34px',
    height: '34px',
    flexShrink: 0,
    borderRadius: '9999px',
    background: 'var(--glp-sage-deep, #2f6b4f)',
    color: '#ffffff',
    fontWeight: 700,
    fontSize: '0.8rem',
  },
  btnBase: {
    width: '100%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.8rem 1.5rem',
    borderRadius: '0.6rem',
    fontWeight: 600,
    fontSize: '0.95rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'opacity 0.18s ease',
    textDecoration: 'none',
  },
};

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
    try { localStorage.setItem(CONSENT_STORAGE_KEY, 'true'); } catch (err) { console.warn("[storage-safe-write]", err); }
    setHasConsented(true);
    onConsent?.();
  };

  if (isLoading) {
    return (
      <div style={S.page} data-testid="consent-loading">
        <div className="animate-pulse motion-reduce:animate-none" style={{ color: 'var(--glp-ink, #4a5a4f)' }}>Loading...</div>
      </div>
    );
  }

  if (hasConsented) {
    return children;
  }

  return (
    <div style={S.page} data-testid="age-consent-gate">
      <div style={S.card}>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={S.shieldCircle}>
            <Shield style={{ width: '32px', height: '32px' }} color="var(--glp-sage-deep, #2f6b4f)" aria-hidden="true" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif, Georgia, serif)', fontWeight: 700, fontSize: '1.6rem', color: 'var(--glp-sage-deep, #2f6b4f)', margin: '0 0 0.5rem' }}>
            Welcome to The Genuine Love Project
          </h1>
          <p style={{ color: 'var(--glp-ink, #5a6b5f)', margin: 0 }}>
            A safe space for emotional wellness and self-discovery
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          <div style={S.infoRow}>
            <Heart style={{ width: '20px', height: '20px', flexShrink: 0, marginTop: '0.15rem' }} color="#e8736b" aria-hidden="true" />
            <div>
              <h2 style={{ fontWeight: 600, color: 'var(--glp-ink, #36443b)', margin: '0 0 0.25rem' }}>What We Offer</h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--glp-ink, #5a6b5f)', margin: 0 }}>
                Educational wellness tools, journaling prompts, self-reflection exercises,
                and AI-assisted emotional guidance.
              </p>
            </div>
          </div>

          <div style={S.infoRow}>
            <AlertCircle style={{ width: '20px', height: '20px', flexShrink: 0, marginTop: '0.15rem' }} color="#c98a2e" aria-hidden="true" />
            <div>
              <h2 style={{ fontWeight: 600, color: 'var(--glp-ink, #36443b)', margin: '0 0 0.25rem' }}>Important Notice</h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--glp-ink, #5a6b5f)', margin: 0 }}>
                This platform provides educational wellness support, not medical or mental
                health treatment. It is not a substitute for professional care.
              </p>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--glp-sage-20, #d8e6d3)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--glp-ink, #36443b)', textAlign: 'center', margin: '0 0 1.25rem' }}>
            By continuing, you confirm:
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li style={S.confirmItem}>
              <span style={S.badge} aria-hidden="true">18+</span>
              <span style={{ fontSize: '1rem', color: 'var(--glp-ink, #36443b)', fontWeight: 500 }}>You are 18 years of age or older</span>
            </li>
            <li style={S.confirmItem}>
              <span style={S.badge} aria-hidden="true">
                <Heart style={{ width: '16px', height: '16px' }} color="#ffffff" />
              </span>
              <span style={{ fontSize: '1rem', color: 'var(--glp-ink, #36443b)', fontWeight: 500 }}>You understand this is educational wellness support only</span>
            </li>
            <li style={S.confirmItem}>
              <span style={S.badge} aria-hidden="true">
                <Shield style={{ width: '16px', height: '16px' }} color="#ffffff" />
              </span>
              <span style={{ fontSize: '1rem', color: 'var(--glp-ink, #36443b)', fontWeight: 500 }}>You may pause or stop using the platform at any time</span>
            </li>
          </ul>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', justifyContent: 'center' }}>
          <button
            onClick={handleConsent}
            style={{ ...S.btnBase, background: 'var(--glp-sage-deep, #2f6b4f)', color: '#ffffff' }}
            data-testid="button-confirm-consent"
          >
            I Confirm &amp; Continue
          </button>

          <Link
            href="/dashboard"
            style={{ ...S.btnBase, background: 'rgba(168, 201, 160, 0.18)', color: 'var(--glp-sage-deep, #2f6b4f)', border: '1px solid var(--glp-sage-20, #d8e6d3)' }}
            data-testid="link-back-to-dashboard"
          >
            <ArrowLeft style={{ width: '16px', height: '16px' }} aria-hidden="true" />
            Back to Dashboard
          </Link>

          <Link
            href="/"
            style={{ ...S.btnBase, background: '#f1f3f1', color: '#55615a' }}
            data-testid="button-exit"
          >
            Exit
          </Link>
        </div>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--glp-ink, #5a6b5f)', margin: '0 0 0.5rem' }}>
            Need immediate support?
          </p>
          <Link
            href="/crisis"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.875rem', color: 'var(--glp-sage-deep, #2f6b4f)', fontWeight: 600 }}
            data-testid="link-crisis-resources"
          >
            Access Crisis Resources
            <ExternalLink style={{ width: '12px', height: '12px' }} aria-hidden="true" />
          </Link>
        </div>

        <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--glp-ink, #5a6b5f)', textAlign: 'center' }}>
          By clicking "I Confirm &amp; Continue," you agree to our{' '}
          <Link href="/terms" style={{ textDecoration: 'underline', color: 'inherit' }}>Terms</Link>
          {' '}and{' '}
          <Link href="/privacy" style={{ textDecoration: 'underline', color: 'inherit' }}>Privacy Policy</Link>
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
  try { localStorage.removeItem(CONSENT_STORAGE_KEY); } catch (err) { console.warn("[storage-safe-write]", err); }
}
