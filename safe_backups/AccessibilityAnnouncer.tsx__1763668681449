/**
 * Accessibility Announcer
 * Live region for screen reader announcements
 */

import { useEffect, useState } from 'react';

interface AccessibilityAnnouncerProps {
  message: string;
  politeness?: 'polite' | 'assertive';
  clearAfter?: number;
}

export function AccessibilityAnnouncer({
  message,
  politeness = 'polite',
  clearAfter = 1000,
}: AccessibilityAnnouncerProps) {
  const [announcement, setAnnouncement] = useState(message);

  useEffect(() => {
    setAnnouncement(message);
    
    if (clearAfter > 0) {
      const timer = setTimeout(() => {
        setAnnouncement('');
      }, clearAfter);
      
      return () => clearTimeout(timer);
    }
  }, [message, clearAfter]);

  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
      data-testid="accessibility-announcer"
    >
      {announcement}
    </div>
  );
}

/**
 * Global announcer hook
 */
export function useAnnouncer() {
  const announce = (message: string, politeness: 'polite' | 'assertive' = 'polite') => {
    const announcer = document.querySelector('[data-testid="accessibility-announcer"]');
    if (announcer) {
      announcer.textContent = message;
      announcer.setAttribute('aria-live', politeness);
    } else {
      // Fallback: create temporary announcer
      const temp = document.createElement('div');
      temp.setAttribute('role', 'status');
      temp.setAttribute('aria-live', politeness);
      temp.setAttribute('aria-atomic', 'true');
      temp.className = 'sr-only';
      temp.textContent = message;
      document.body.appendChild(temp);
      setTimeout(() => document.body.removeChild(temp), 1000);
    }
  };

  return { announce };
}
