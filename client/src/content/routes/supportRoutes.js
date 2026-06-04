// =============================================================================
// supportRoutes — additional public informational SUPPORT sub-pages.
// Extracted verbatim from routes.js to reduce that file's size WITHOUT changing
// runtime behavior. Plain-data route objects (no icon-component or helper deps).
// Merged back into rawRoutes via `...supportRoutes`, preserving array order.
// =============================================================================
export const supportRoutes = [
  {
    route: '/support/guides',
    category: 'support',
    pageLabel: 'User Guides',
    title: 'Guides — The Genuine Love Project',
    description: 'Helpful guides and tutorials.',
    hero: {
      eyebrow: 'Learn',
      title: 'User',
      titleHighlight: 'Guides.',
      subtitle: 'Step-by-step guides to help you use the platform.',
      primaryCta: { label: 'Browse Guides', href: '#guides' },
      secondaryCta: { label: 'Video Tutorials', href: '#videos' }
    }
  },
  {
    route: '/support/feedback',
    category: 'support',
    pageLabel: 'Feedback',
    title: 'Feedback — The Genuine Love Project',
    description: 'Share your feedback with us.',
    hero: {
      eyebrow: 'Your Voice',
      title: 'Share',
      titleHighlight: 'Feedback.',
      subtitle: 'Help us improve your experience.',
      primaryCta: { label: 'Give Feedback', href: '#feedback' },
      secondaryCta: { label: 'Feature Requests', href: '#requests' }
    }
  },
  {
    route: '/support/accessibility',
    category: 'support',
    pageLabel: 'Accessibility',
    title: 'Accessibility — The Genuine Love Project',
    description: 'Our commitment to accessibility.',
    hero: {
      eyebrow: 'Inclusive Design',
      title: 'Accessibility',
      titleHighlight: 'First.',
      subtitle: 'Our commitment to making healing accessible to all.',
      primaryCta: { label: 'Learn More', href: '#accessibility' },
      secondaryCta: { label: 'Report Issue', href: '#report' }
    }
  },
];
