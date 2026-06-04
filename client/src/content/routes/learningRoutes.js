// =============================================================================
// learningRoutes — public LEARNING & EDUCATION routes.
// Extracted verbatim from routes.js to reduce that file's size WITHOUT changing
// runtime behavior. Plain-data route objects (no icon-component or helper deps).
// Merged back into rawRoutes via `...learningRoutes`, preserving array order.
// =============================================================================
export const learningRoutes = [
  {
    route: '/learn',
    category: 'learning',
    pageLabel: 'Learning Hub',
    title: 'Learning Hub — The Genuine Love Project',
    description: 'Educational resources for your healing journey.',
    hero: {
      eyebrow: 'Grow Your Understanding',
      title: 'Learn &',
      titleHighlight: 'Grow.',
      subtitle: 'Evidence-based articles, guides, and courses to support your healing journey.',
      primaryCta: { label: 'Explore Topics', href: '#topics' },
      secondaryCta: { label: 'Featured Guides', href: '#guides' }
    }
  },
  {
    route: '/learn/guides',
    category: 'learning',
    pageLabel: 'Guides',
    title: 'Healing Guides — The Genuine Love Project',
    description: 'Step-by-step guides for your wellness journey.',
    hero: {
      eyebrow: 'Step by Step',
      title: 'Healing',
      titleHighlight: 'Guides.',
      subtitle: 'Comprehensive guides to help you navigate your healing path.',
      primaryCta: { label: 'Browse Guides', href: '#guides' },
      secondaryCta: { label: 'Quick Start', href: '#start' }
    }
  },
  {
    route: '/learn/articles',
    category: 'learning',
    pageLabel: 'Articles',
    title: 'Articles — The Genuine Love Project',
    description: 'Insightful articles on emotional wellness.',
    hero: {
      eyebrow: 'Insights & Wisdom',
      title: 'Wellness',
      titleHighlight: 'Articles.',
      subtitle: 'Evidence-based articles to deepen your understanding of healing.',
      primaryCta: { label: 'Read Articles', href: '#articles' },
      secondaryCta: { label: 'Popular Topics', href: '#topics' }
    }
  },
];
