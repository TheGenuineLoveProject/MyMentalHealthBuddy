// =============================================================================
// legalRoutes — public LEGAL & POLICY routes.
// Extracted verbatim from routes.js to reduce that file's size WITHOUT changing
// runtime behavior. Plain-data route objects (no icon-component or helper deps).
// Merged back into rawRoutes via `...legalRoutes`, preserving array order.
// =============================================================================
export const legalRoutes = [
  {
    route: '/terms',
    category: 'legal',
    pageLabel: 'Terms of Service',
    title: 'Terms of Service — The Genuine Love Project',
    description: 'Our terms of service and usage agreement.',
    hero: {
      eyebrow: 'Legal',
      title: 'Terms of',
      titleHighlight: 'Service.',
      subtitle: 'Please read these terms carefully.',
      primaryCta: { label: 'Read Terms', href: '#terms' },
      secondaryCta: { label: 'Contact Legal', href: '/support' }
    }
  },
  {
    route: '/privacy',
    category: 'legal',
    pageLabel: 'Privacy Policy',
    title: 'Privacy Policy — The Genuine Love Project',
    description: 'How we protect and handle your data.',
    hero: {
      eyebrow: 'Your Privacy',
      title: 'Privacy',
      titleHighlight: 'Policy.',
      subtitle: 'Your privacy is important to us. Here\'s how we protect it.',
      primaryCta: { label: 'Read Policy', href: '#policy' },
      secondaryCta: { label: 'Data Request', href: '/support' }
    }
  },
  {
    route: '/cookies',
    category: 'legal',
    pageLabel: 'Cookie Policy',
    title: 'Cookie Policy — The Genuine Love Project',
    description: 'How we use cookies and similar technologies.',
    hero: {
      eyebrow: 'Transparency',
      title: 'Cookie',
      titleHighlight: 'Policy.',
      subtitle: 'We use cookies to improve your experience. Here is how.',
      primaryCta: { label: 'Read Policy', href: '#cookies' },
      secondaryCta: { label: 'Manage Preferences', href: '#preferences' }
    }
  },
  {
    route: '/tos',
    category: 'legal',
    pageLabel: 'Terms of Service',
    title: 'Terms of Service — The Genuine Love Project',
    description: 'Terms and conditions for using our platform.',
    hero: {
      eyebrow: 'Agreement',
      title: 'Terms of',
      titleHighlight: 'Service.',
      subtitle: 'The terms that govern your use of our wellness platform.',
      primaryCta: { label: 'Read Terms', href: '#terms' },
      secondaryCta: { label: 'Contact Legal', href: '/support' }
    }
  },
  {
    route: '/legal',
    category: 'legal',
    pageLabel: 'Legal',
    title: 'Legal Information — The Genuine Love Project',
    description: 'Legal notices and information.',
    hero: {
      eyebrow: 'Legal',
      title: 'Legal',
      titleHighlight: 'Information.',
      subtitle: 'Important legal notices and information.',
      primaryCta: { label: 'View All', href: '#legal' },
      secondaryCta: { label: 'Contact', href: '/support' }
    }
  },
  {
    route: '/ethics',
    category: 'legal',
    pageLabel: 'Ethics',
    title: 'Ethics & Guidelines — The Genuine Love Project',
    description: 'Our ethical guidelines and community standards.',
    hero: {
      eyebrow: 'Our Values',
      title: 'Ethics &',
      titleHighlight: 'Guidelines.',
      subtitle: 'The principles that guide our platform and community.',
      primaryCta: { label: 'Read Guidelines', href: '#guidelines' },
      secondaryCta: { label: 'Report Issue', href: '/support' }
    }
  },
  {
    route: '/disclaimer',
    category: 'legal',
    pageLabel: 'Disclaimer',
    title: 'Disclaimer — The Genuine Love Project',
    description: 'Important disclaimers about our services.',
    hero: {
      eyebrow: 'Important',
      title: 'Disclaimer.',
      titleHighlight: '',
      subtitle: 'Important information about the nature of our services.',
      primaryCta: { label: 'Read Disclaimer', href: '#disclaimer' },
      secondaryCta: { label: 'Questions?', href: '/support' }
    }
  },
  {
    route: '/accessibility',
    category: 'legal',
    pageLabel: 'Accessibility',
    title: 'Accessibility — The Genuine Love Project',
    description: 'Our commitment to making mental wellness accessible to everyone.',
    hero: {
      eyebrow: 'Inclusive Design',
      title: 'Accessibility',
      titleHighlight: 'Statement.',
      subtitle: 'Our commitment to making wellness tools available to everyone.',
      primaryCta: { label: 'Learn More', href: '#accessibility' },
      secondaryCta: { label: 'Report Issue', href: '/support' }
    }
  },
];
