// Google Analytics Integration for The Genuine Love Project
// Reference: javascript_google_analytics blueprint

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export const initGA = (): void => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  if (!measurementId) {
    console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
    return;
  }

  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script1);

  const script2 = document.createElement('script');
  script2.textContent = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${measurementId}', {
      'anonymize_ip': true,
      'cookie_flags': 'SameSite=None;Secure'
    });
  `;
  document.head.appendChild(script2);
};

export const trackPageView = (url: string): void => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!measurementId) return;
  
  window.gtag('config', measurementId, {
    page_path: url
  });
};

export const trackEvent = (
  action: string, 
  category?: string, 
  label?: string, 
  value?: number
): void => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

export const trackWellnessEvent = (
  eventName: string,
  properties?: Record<string, string | number | boolean>
): void => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', eventName, {
    event_category: 'wellness',
    ...properties,
  });
};

export const trackToolUsage = (toolName: string, action: string): void => {
  trackEvent(action, 'tools', toolName);
};

export const trackJournalEntry = (): void => {
  trackWellnessEvent('journal_entry_created');
};

export const trackMoodLogged = (mood: string): void => {
  trackWellnessEvent('mood_logged', { mood_type: mood });
};

export const trackCrisisResourceAccessed = (): void => {
  trackWellnessEvent('crisis_resource_accessed', { urgent: true });
};
