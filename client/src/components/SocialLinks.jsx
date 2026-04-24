/**
 * SocialLinks.jsx - Verified Social Media Links Component
 * 
 * Displays official social media channels with verified handles
 */

import { MessageCircle } from "lucide-react";
import { Youtube, Instagram, Twitter, Facebook } from "../lib/lucide-brands";
import { VERIFIED_CHANNELS } from '../config/social';
import { SEO } from "@/components/SEO";
import SafetyFooter from "@/components/ui/SafetyFooter";

const PLATFORM_ICONS = {
  youtube: Youtube,
  tiktok: MessageCircle,
  instagram: Instagram,
  facebook: Facebook,
  x: Twitter,
};

const PLATFORM_COLORS = {
  youtube: '#FF0000',
  tiktok: '#000000',
  instagram: '#E4405F',
  facebook: '#1877F2',
  x: '#000000',
};

export default function SocialLinks({ 
  variant = 'icons', 
  showHandles = false,
  className = '',
  iconSize = 20,
}) {
  const channels = Object.entries(VERIFIED_CHANNELS);

  if (variant === 'icons') {
    return (
      <nav 
        aria-label="Social media links" 
        className={`flex items-center gap-3 ${className}`}
        data-testid="social-links"
      >
        {channels.map(([id, channel]) => {
          const Icon = PLATFORM_ICONS[id] || MessageCircle;
          return (
            <a
              key={id}
              href={channel.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Follow us on ${channel.name}`}
              title={`${channel.name}: ${channel.handle}`}
              className="p-2 rounded-lg transition-all hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--glp-sage)]"
              style={{ color: 'var(--glp-sage-dark, #5A8A6E)' }}
              data-testid={`social-link-${id}`}
            >
              <Icon size={iconSize} aria-hidden="true" />
            </a>
          );
        })}
      </nav>
    );
  }

  if (variant === 'list') {
    return (
      <nav 
        aria-label="Social media links" 
        className={`space-y-2 ${className}`}
        data-testid="social-links-list"
      >
        {channels.map(([id, channel]) => {
          const Icon = PLATFORM_ICONS[id] || MessageCircle;
          const color = PLATFORM_COLORS[id] || '#5A8A6E';
          return (
            <a
              key={id}
              href={channel.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Follow us on ${channel.name}`}
              className="flex items-center gap-2 text-sm transition-colors hover:text-[var(--glp-sage)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--glp-sage)]"
              data-testid={`social-link-${id}`}
            >
              <Icon size={16} aria-hidden="true" style={{ color }} />
              <span>{channel.name}</span>
              {showHandles && (
                <span className="text-xs opacity-60">{channel.handle}</span>
              )}
            </a>
          );
        })}
      </nav>
    );
  }

  if (variant === 'compact') {
    return (
      <div 
        className={`flex items-center gap-2 ${className}`}
        data-testid="social-links-compact"
      >
        {channels.map(([id, channel]) => {
          const Icon = PLATFORM_ICONS[id] || MessageCircle;
          return (
            <a
              key={id}
              href={channel.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Follow us on ${channel.name}`}
              className="p-1.5 rounded transition-opacity hover:opacity-70"
              style={{ color: 'var(--glp-text-secondary, #666)' }}
              data-testid={`social-link-${id}`}
            >
              <Icon size={16} aria-hidden="true" />
            </a>
          );
        })}
      </div>
    );
  }

  return null;
}

export { VERIFIED_CHANNELS };
