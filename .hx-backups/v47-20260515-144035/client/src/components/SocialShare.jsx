import { useState, useCallback } from 'react';
import { Link as LinkIcon, Check, Heart } from 'lucide-react';
import styles from './SocialShare.module.css';

export function SocialShare({ 
  url,
  title,
  description,
  showLabel = true,
  variant = 'default'
}) {
  const [copied, setCopied] = useState(false);

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (copyErr) {
        console.error('Failed to copy link');
      }
      document.body.removeChild(textArea);
    }
  }, [shareUrl]);

  return (
    <div 
      className={`${styles.socialShare} ${styles[variant]}`}
      data-testid="social-share"
    >
      {showLabel && (
        <p className={styles.shareLabel}>
          <Heart className={styles.labelIcon} aria-hidden="true" />
          <span>Share if it resonates</span>
        </p>
      )}

      <div className={styles.shareButtons}>
        <button
          onClick={handleCopyLink}
          className={`${styles.shareButton} ${copied ? styles.copied : ''}`}
          aria-label={copied ? 'Link copied' : 'Copy link to clipboard'}
          data-testid="button-copy-link"
        >
          {copied ? (
            <>
              <Check className={styles.buttonIcon} aria-hidden="true" />
              <span className={styles.buttonText}>Copied</span>
            </>
          ) : (
            <>
              <LinkIcon className={styles.buttonIcon} aria-hidden="true" />
              <span className={styles.buttonText}>Copy link</span>
            </>
          )}
        </button>
      </div>

      <p className={styles.shareNote}>
        No pressure to share—only if you genuinely find it helpful.
      </p>
    </div>
  );
}

export default SocialShare;
