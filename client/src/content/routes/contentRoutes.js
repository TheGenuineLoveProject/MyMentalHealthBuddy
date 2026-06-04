// =============================================================================
// contentRoutes — public CONTENT & LEARNING routes (blog, glossary, research, etc.).
// Extracted verbatim from routes.js to reduce that file's size WITHOUT changing
// runtime behavior. Plain-data route objects; customComponent strings (e.g.
// 'ContentStudio') are preserved verbatim and resolved by the registry, not imported here.
// Merged back into rawRoutes via `...contentRoutes`, preserving array order.
// =============================================================================
export const contentRoutes = [
  {
    route: '/blog',
    category: 'content',
    pageLabel: 'Blog',
    title: 'Blog — The Genuine Love Project',
    description: 'Articles and insights on healing, growth, and emotional wellness.',
    hero: {
      eyebrow: 'Latest Insights',
      title: 'Stories of',
      titleHighlight: 'healing.',
      subtitle: 'Articles, essays, and insights to support your journey.',
      primaryCta: { label: 'Read Latest', href: '/blog' },
      secondaryCta: { label: 'All Articles', href: '#main-content' }
    }
  },
  {
    route: '/blog/:slug',
    category: 'content',
    pageLabel: 'Blog Post',
    isDynamic: true,
    title: 'Article — The Genuine Love Project',
    description: 'Read this article on healing and growth.',
    hero: {
      eyebrow: 'Article',
      title: 'Reading',
      titleHighlight: 'in progress.',
      subtitle: 'Take your time with this content.',
      primaryCta: { label: 'Continue Reading', href: '#content' },
      secondaryCta: { label: 'More Articles', href: '/blog' }
    }
  },
  {
    route: '/write',
    category: 'content',
    pageLabel: 'Write',
    title: 'Write — The Genuine Love Project',
    description: 'Share your healing story with the community.',
    hero: {
      eyebrow: 'Share Your Story',
      title: 'Your voice',
      titleHighlight: 'matters.',
      subtitle: 'Contribute to our community of healing.',
      primaryCta: { label: 'Start Writing', href: '#editor' },
      secondaryCta: { label: 'Writing Guidelines', href: '#guidelines' }
    }
  },
  {
    route: '/content-index',
    category: 'content',
    pageLabel: 'Content Index',
    title: 'Content Index — The Genuine Love Project',
    description: 'Browse all content organized by topic.',
    hero: {
      eyebrow: 'All Content',
      title: 'Find what',
      titleHighlight: 'you need.',
      subtitle: 'Our complete content library, organized for easy browsing.',
      primaryCta: { label: 'Browse All', href: '#index' },
      secondaryCta: { label: 'Search', href: '#search' }
    }
  },
  {
    route: '/content-studio',
    category: 'content',
    pageLabel: 'Content Studio',
    title: 'Content Studio — The Genuine Love Project',
    description: 'Create supportive, trauma-informed social media content with brand-aligned templates. Generate posts, carousels, threads, and newsletters that prioritize safety and warmth.',
    customComponent: 'ContentStudio',
    hero: {
      eyebrow: 'Content Creation',
      title: 'Create content that',
      titleHighlight: 'supports, not harms.',
      subtitle: 'Generate warm, grounded social media content with built-in safety guidelines. Every template is trauma-informed and evidence-based—no medical claims, just supportive guidance.',
      primaryCta: { label: 'Start Creating', href: '#studio' },
      secondaryCta: { label: 'Content Guidelines', href: '#guidelines' }
    },
    modules: [
      { icon: 'FileText', title: 'Multiple Formats', description: 'Short posts, carousel outlines, thread structures, and newsletter snippets.' },
      { icon: 'Shield', title: 'Safety Built In', description: 'Every template includes appropriate disclaimers and crisis resources.' },
      { icon: 'Heart', title: 'Warm & Grounded', description: 'Tone that is supportive without being clinical or making promises.' }
    ],
    sections: [
      {
        id: 'guidelines',
        eyebrow: 'Content Philosophy',
        title: 'Our content principles',
        subtitle: 'Every piece of content we create follows these guidelines.',
        variant: 'glow',
        bullets: [
          'No medical claims or diagnoses—we share supportive information, not treatment',
          'Always include safety disclaimers and crisis resources where relevant',
          'Warm, grounded tone—not clinical, not toxic positivity',
          'Evidence-informed but accessible—cite research without overwhelming',
          'Meet people where they are—beginner, intermediate, and advanced content levels',
          'Respect autonomy—invite engagement without pressure'
        ]
      }
    ]
  },
  {
    route: '/study-vault',
    category: 'content',
    pageLabel: 'Study Vault',
    title: 'Study Vault — The Genuine Love Project',
    description: 'Research-backed resources and studies on healing.',
    hero: {
      eyebrow: 'Research',
      title: 'Evidence-based',
      titleHighlight: 'resources.',
      subtitle: 'Scientific research supporting our healing approaches.',
      primaryCta: { label: 'Browse Studies', href: '#studies' },
      secondaryCta: { label: 'Topic Search', href: '#search' }
    }
  },
  {
    route: '/research',
    category: 'content',
    pageLabel: 'Research',
    title: 'Research — The Genuine Love Project',
    description: 'The science behind healing and emotional wellness.',
    hero: {
      eyebrow: 'The Science',
      title: 'Research-backed',
      titleHighlight: 'healing.',
      subtitle: 'Understanding the evidence behind what we do.',
      primaryCta: { label: 'Explore Research', href: '#research' },
      secondaryCta: { label: 'Key Findings', href: '#findings' }
    }
  },
  {
    route: '/how-to-guides',
    category: 'content',
    pageLabel: 'How-To Guides',
    title: 'How-To Guides — The Genuine Love Project',
    description: 'Step-by-step guides for healing practices.',
    hero: {
      eyebrow: 'Practical Guides',
      title: 'Step-by-step',
      titleHighlight: 'instructions.',
      subtitle: 'Clear, actionable guides for every practice.',
      primaryCta: { label: 'Browse Guides', href: '#guides' },
      secondaryCta: { label: 'Getting Started', href: '#start' }
    }
  },
  {
    route: '/glossary',
    category: 'content',
    pageLabel: 'Glossary',
    title: 'Glossary — The Genuine Love Project',
    description: 'Definitions of key healing and wellness terms.',
    hero: {
      eyebrow: 'Definitions',
      title: 'Understand the',
      titleHighlight: 'terminology.',
      subtitle: 'Clear explanations of key concepts and terms.',
      primaryCta: { label: 'Browse Terms', href: '#terms' },
      secondaryCta: { label: 'Search', href: '#search' }
    }
  },
  {
    route: '/glossary-full',
    category: 'content',
    pageLabel: 'Full Glossary',
    title: 'Complete Glossary — The Genuine Love Project',
    description: 'Comprehensive glossary of all healing terms.',
    hero: {
      eyebrow: 'Complete Reference',
      title: 'Every term',
      titleHighlight: 'explained.',
      subtitle: 'Our complete reference of healing terminology.',
      primaryCta: { label: 'Browse All', href: '#all' },
      secondaryCta: { label: 'By Category', href: '#categories' }
    }
  },
  {
    route: '/insight-cards',
    category: 'content',
    pageLabel: 'Insight Cards',
    title: 'Insight Cards — The Genuine Love Project',
    description: 'Quick insights and wisdom in card format.',
    hero: {
      eyebrow: 'Quick Wisdom',
      title: 'Bite-sized',
      titleHighlight: 'insights.',
      subtitle: 'Powerful ideas in a digestible format.',
      primaryCta: { label: 'Draw a Card', href: '#draw' },
      secondaryCta: { label: 'Browse All', href: '#all' }
    }
  },
  {
    route: '/news',
    category: 'content',
    pageLabel: 'News',
    title: 'News — The Genuine Love Project',
    description: 'Updates and announcements from the platform.',
    hero: {
      eyebrow: 'Latest Updates',
      title: 'What\'s',
      titleHighlight: 'new.',
      subtitle: 'Platform updates, new features, and announcements.',
      primaryCta: { label: 'Read Latest', href: '#latest' },
      secondaryCta: { label: 'Subscribe', href: '#subscribe' }
    }
  },
  {
    route: '/examples',
    category: 'content',
    pageLabel: 'Examples',
    title: 'Examples — The Genuine Love Project',
    description: 'Real examples of healing practices in action.',
    hero: {
      eyebrow: 'See It In Action',
      title: 'Real',
      titleHighlight: 'examples.',
      subtitle: 'See how others use these tools in their practice.',
      primaryCta: { label: 'Browse Examples', href: '#examples' },
      secondaryCta: { label: 'Submit Your Own', href: '#submit' }
    }
  },
];
