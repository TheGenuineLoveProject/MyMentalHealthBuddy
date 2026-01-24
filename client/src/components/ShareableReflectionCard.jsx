/**
 * ShareableReflectionCard.jsx
 * Generates beautiful shareable cards for social media
 * 
 * Viral Loop Pattern:
 * - After any prompt → generate a beautiful card → share to IG/TikTok
 * - Includes watermark + URL + CTA ("Try a 60-second reset")
 * - No medical claims; no "healed me" language
 */

import { useState, useRef } from 'react';
import { Share2, Download, Copy, Check, Heart, Sparkles } from 'lucide-react';

const CARD_THEMES = {
  sage: {
    bg: 'linear-gradient(135deg, hsl(145, 30%, 94%) 0%, hsl(145, 35%, 88%) 100%)',
    text: 'hsl(145, 25%, 20%)',
    accent: 'hsl(145, 40%, 45%)',
    border: 'hsl(145, 30%, 85%)'
  },
  cream: {
    bg: 'linear-gradient(135deg, hsl(45, 40%, 96%) 0%, hsl(45, 35%, 90%) 100%)',
    text: 'hsl(30, 30%, 20%)',
    accent: 'hsl(30, 50%, 50%)',
    border: 'hsl(45, 35%, 88%)'
  },
  rose: {
    bg: 'linear-gradient(135deg, hsl(350, 40%, 96%) 0%, hsl(350, 35%, 90%) 100%)',
    text: 'hsl(350, 25%, 25%)',
    accent: 'hsl(350, 45%, 55%)',
    border: 'hsl(350, 35%, 88%)'
  },
  teal: {
    bg: 'linear-gradient(135deg, hsl(175, 35%, 94%) 0%, hsl(175, 40%, 88%) 100%)',
    text: 'hsl(175, 30%, 20%)',
    accent: 'hsl(175, 50%, 40%)',
    border: 'hsl(175, 35%, 85%)'
  }
};

const WATERMARK_CTA = 'Try a 60-second reset';
const SITE_URL = 'thegenuineloveproject.com';

export default function ShareableReflectionCard({
  reflection = '',
  category = 'Reflection',
  date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  theme = 'sage',
  onShare = null,
  className = ''
}) {
  const [copied, setCopied] = useState(false);
  const cardRef = useRef(null);
  const themeStyles = CARD_THEMES[theme] || CARD_THEMES.sage;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reflection);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Reflection',
          text: `${reflection}\n\n— ${WATERMARK_CTA} at ${SITE_URL}`,
          url: `https://${SITE_URL}`
        });
        onShare?.();
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    } else {
      handleCopy();
    }
  };

  const truncatedReflection = reflection.length > 280 
    ? reflection.slice(0, 277) + '...' 
    : reflection;

  return (
    <div className={`max-w-md mx-auto ${className}`}>
      <div
        ref={cardRef}
        className="rounded-2xl p-6 shadow-lg relative overflow-hidden"
        style={{
          background: themeStyles.bg,
          border: `1px solid ${themeStyles.border}`
        }}
        data-testid="shareable-card"
        role="article"
        aria-label="Shareable reflection card"
      >
        <div className="absolute top-4 right-4 opacity-20">
          <Sparkles 
            className="w-8 h-8" 
            style={{ color: themeStyles.accent }}
            aria-hidden="true"
          />
        </div>

        <div className="mb-4 flex items-center gap-2">
          <span 
            className="text-xs font-medium uppercase tracking-wide px-2 py-1 rounded-full"
            style={{ 
              backgroundColor: `${themeStyles.accent}20`,
              color: themeStyles.accent 
            }}
          >
            {category}
          </span>
          <span 
            className="text-xs opacity-60"
            style={{ color: themeStyles.text }}
          >
            {date}
          </span>
        </div>

        <p 
          className="text-lg leading-relaxed mb-6 font-serif"
          style={{ color: themeStyles.text }}
        >
          "{truncatedReflection}"
        </p>

        <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: themeStyles.border }}>
          <div className="flex items-center gap-2 opacity-60">
            <Heart className="w-4 h-4" style={{ color: themeStyles.accent }} aria-hidden="true" />
            <span className="text-xs" style={{ color: themeStyles.text }}>
              {SITE_URL}
            </span>
          </div>
          <span 
            className="text-xs italic opacity-50"
            style={{ color: themeStyles.text }}
          >
            {WATERMARK_CTA}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 mt-4">
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition hover:opacity-80 focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{ 
            backgroundColor: themeStyles.accent,
            color: 'white'
          }}
          data-testid="button-share"
          aria-label="Share reflection"
        >
          <Share2 className="w-4 h-4" aria-hidden="true" />
          Share
        </button>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition hover:opacity-80 focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{ 
            borderColor: themeStyles.border,
            color: themeStyles.text
          }}
          data-testid="button-copy"
          aria-label={copied ? 'Copied!' : 'Copy text'}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" aria-hidden="true" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" aria-hidden="true" />
              Copy
            </>
          )}
        </button>
      </div>

      <p className="text-center text-xs text-[var(--text-tertiary)] mt-3">
        No medical claims • Educational support only
      </p>
    </div>
  );
}

export function ReflectionCardPreview({ reflection, onThemeChange, selectedTheme = 'sage' }) {
  const themes = Object.keys(CARD_THEMES);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-2">
        {themes.map((theme) => (
          <button
            key={theme}
            onClick={() => onThemeChange?.(theme)}
            className={`w-6 h-6 rounded-full border-2 transition ${
              selectedTheme === theme ? 'ring-2 ring-offset-2 ring-[var(--primary)]' : ''
            }`}
            style={{ 
              background: CARD_THEMES[theme].bg,
              borderColor: CARD_THEMES[theme].border
            }}
            aria-label={`${theme} theme`}
            data-testid={`button-theme-${theme}`}
          />
        ))}
      </div>
      <ShareableReflectionCard reflection={reflection} theme={selectedTheme} />
    </div>
  );
}
