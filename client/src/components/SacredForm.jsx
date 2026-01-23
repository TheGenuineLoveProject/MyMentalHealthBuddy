import { useState } from 'react';
import { Link } from 'wouter';
import { Mail, Heart, Check, AlertCircle } from 'lucide-react';
import styles from './SacredForm.module.css';

export function SacredForm({ 
  heading = "If you'd like occasional updates",
  subheading = "We share gentle reflections and new resources—only when we have something meaningful to offer.",
  successMessage = "Thank you. We'll be in touch with care.",
  showInFooter = false
}) {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !consent) {
      setError('Please enter your email and confirm consent.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setError('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, consent })
      });

      if (response.ok) {
        setStatus('success');
        setEmail('');
        setConsent(false);
      } else {
        throw new Error('Subscription failed');
      }
    } catch (err) {
      setStatus('error');
      setError('Something went wrong. Please try again later.');
    }
  };

  if (status === 'success') {
    return (
      <div 
        className={`${styles.sacredForm} ${showInFooter ? styles.footerVariant : ''}`}
        data-testid="sacred-form-success"
      >
        <div className={styles.successState}>
          <div className={styles.successIcon}>
            <Check className={styles.icon} aria-hidden="true" />
          </div>
          <p className={styles.successMessage}>{successMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`${styles.sacredForm} ${showInFooter ? styles.footerVariant : ''}`}
      data-testid="sacred-form"
    >
      <div className={styles.formHeader}>
        <Heart className={styles.headerIcon} aria-hidden="true" />
        <h3 className={styles.heading}>{heading}</h3>
        <p className={styles.subheading}>{subheading}</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="sacred-email" className={styles.srOnly}>
            Email address
          </label>
          <div className={styles.inputWrapper}>
            <Mail className={styles.inputIcon} aria-hidden="true" />
            <input
              type="email"
              id="sacred-email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className={styles.input}
              disabled={status === 'loading'}
              data-testid="input-email"
              aria-describedby="email-hint"
            />
          </div>
          <p id="email-hint" className={styles.hint}>
            We never share your information.
          </p>
        </div>

        <div className={styles.consentGroup}>
          <label className={styles.consentLabel}>
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className={styles.checkbox}
              disabled={status === 'loading'}
              data-testid="checkbox-consent"
            />
            <span className={styles.consentText}>
              I'd like to receive occasional updates. I can unsubscribe anytime.
            </span>
          </label>
          <p className={styles.privacyNote}>
            Your privacy matters.{' '}
            <Link 
              href="/privacy" 
              className={styles.privacyLink}
              data-testid="link-privacy"
            >
              Read our privacy policy
            </Link>
          </p>
        </div>

        {error && (
          <div className={styles.errorMessage} role="alert" data-testid="text-form-error">
            <AlertCircle className={styles.errorIcon} aria-hidden="true" />
            {error}
          </div>
        )}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={status === 'loading' || !consent}
          data-testid="button-subscribe"
        >
          {status === 'loading' ? 'Sending...' : 'Stay connected'}
        </button>

        <p className={styles.noObligation}>
          No pressure—this is entirely optional.
        </p>
      </form>
    </div>
  );
}

export default SacredForm;
