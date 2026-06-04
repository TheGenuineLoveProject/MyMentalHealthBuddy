// =============================================================================
// coreRoutes — public informational SUPPORT & RESOURCES routes.
// Extracted verbatim from routes.js to reduce that file's size WITHOUT changing
// runtime behavior. These are plain-data route objects (no icon-component or
// helper dependencies). Merged back into rawRoutes via `...coreRoutes`.
// =============================================================================
export const coreRoutes = [
  {
    route: '/faq',
    category: 'support',
    pageLabel: 'FAQ',
    title: 'FAQ — The Genuine Love Project',
    description: 'Frequently asked questions about the platform.',
    hero: {
      eyebrow: 'Questions',
      title: 'Common',
      titleHighlight: 'questions.',
      subtitle: 'Find answers to frequently asked questions.',
      primaryCta: { label: 'Browse FAQ', href: '/faq#faq-list' },
      secondaryCta: { label: 'Contact Support', href: '/support' }
    }
  },
  {
    route: '/resources',
    category: 'support',
    pageLabel: 'Resources',
    title: 'Resources — The Genuine Love Project',
    description: 'Additional resources for your healing journey.',
    hero: {
      eyebrow: 'External Resources',
      title: 'More',
      titleHighlight: 'resources.',
      subtitle: 'Curated external resources to support your journey.',
      primaryCta: { label: 'Browse Resources', href: '#resources' },
      secondaryCta: { label: 'Crisis Resources', href: '/crisis' }
    }
  },
  {
    route: '/support',
    category: 'support',
    pageLabel: 'Support',
    title: 'Support — The Genuine Love Project',
    description: 'Get help with the platform or your journey.',
    hero: {
      eyebrow: 'We\'re Here',
      title: 'How can we',
      titleHighlight: 'help?',
      subtitle: 'Get the support you need.',
      primaryCta: { label: 'Contact Us', href: '#contact' },
      secondaryCta: { label: 'Browse FAQ', href: '/faq' }
    }
  },
  {
    route: '/help',
    category: 'support',
    pageLabel: 'Help Center',
    title: 'Help Center — The Genuine Love Project',
    description: 'Find answers to common questions and get support.',
    hero: {
      eyebrow: 'Help Center',
      title: 'How can we',
      titleHighlight: 'help you?',
      subtitle: 'Browse articles, FAQs, and guides to get the most from your experience.',
      primaryCta: { label: 'Browse Articles', href: '#articles' },
      secondaryCta: { label: 'Contact Support', href: '/support' }
    }
  },
  {
    route: '/professional-resources',
    category: 'support',
    pageLabel: 'Professional Resources',
    title: 'Professional Resources — The Genuine Love Project',
    description: 'Resources for mental health professionals.',
    hero: {
      eyebrow: 'For Professionals',
      title: 'Professional',
      titleHighlight: 'resources.',
      subtitle: 'Tools and information for mental health professionals.',
      primaryCta: { label: 'Browse Resources', href: '#resources' },
      secondaryCta: { label: 'Partner With Us', href: '#partner' }
    }
  },
  {
    route: '/qa',
    category: 'support',
    pageLabel: 'Q&A',
    title: 'Q&A — The Genuine Love Project',
    description: 'Ask questions and get answers from the community.',
    hero: {
      eyebrow: 'Ask & Answer',
      title: 'Questions &',
      titleHighlight: 'answers.',
      subtitle: 'Get answers from our community of healers.',
      primaryCta: { label: 'Ask a Question', href: '#ask' },
      secondaryCta: { label: 'Browse Questions', href: '#browse' }
    }
  },
  {
    route: '/contact',
    category: 'support',
    pageLabel: 'Contact Us',
    title: 'Contact Us — The Genuine Love Project',
    description: 'Get in touch with The Genuine Love Project team for support, questions, or feedback.',
    contentLevels: {
      beginner: {
        title: 'Reach Out',
        subtitle: 'We are here to help.',
        bulletPoints: [
          'Send us a message anytime',
          'We respond within 24-48 hours',
          'Your privacy is protected',
          'Your one next step: Share what is on your mind'
        ]
      },
      intermediate: {
        title: 'Get in Touch',
        subtitle: 'Multiple ways to connect with us.',
        bulletPoints: [
          'Email support for general questions',
          'Technical support for platform issues',
          'Partnership inquiries welcome',
          'Your one next step: Choose the best contact method'
        ]
      },
      advanced: {
        title: 'Contact Options',
        subtitle: 'Direct channels for your needs.',
        bulletPoints: [
          'Support tickets for tracked issues',
          'Business inquiries and partnerships',
          'Media and press requests',
          'Your one next step: Submit your inquiry'
        ]
      }
    },
    hero: {
      eyebrow: 'Contact Us',
      title: 'We would love to',
      titleHighlight: 'hear from you.',
      subtitle: 'Whether you have a question, feedback, or just want to say hello—we are here and listening.',
      primaryCta: { label: 'Send a Message', href: '/support/feedback' },
      secondaryCta: { label: 'Browse FAQ', href: '/faq' }
    },
    modules: [
      { icon: 'Mail', title: 'Email Support', description: 'Send us an email and we will respond within 24-48 hours.' },
      { icon: 'MessageCircle', title: 'Community', description: 'Connect with others on the same journey.' },
      { icon: 'HelpCircle', title: 'Help Center', description: 'Browse our FAQ for quick answers.' }
    ],
    sections: [
      {
        id: 'contact-options',
        eyebrow: 'Ways to Connect',
        title: 'Choose how you would like to reach us',
        subtitle: 'We are here to support your journey in whatever way works best for you.',
        variant: 'glow',
        cards: [
          { icon: 'Mail', title: 'General Support', text: 'Questions about your account or the platform.' },
          { icon: 'Heart', title: 'Wellness Feedback', text: 'Share how the tools are working for you.' },
          { icon: 'Shield', title: 'Privacy Concerns', text: 'Questions about your data and privacy.' },
          { icon: 'Sparkles', title: 'Feature Requests', text: 'Ideas for new tools or improvements.' }
        ]
      }
    ]
  },
];
