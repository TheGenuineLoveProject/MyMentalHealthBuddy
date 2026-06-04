// =============================================================================
// toolRoutes — public ADVANCED & MASTERY informational routes.
// Extracted verbatim from routes.js to reduce that file's size WITHOUT changing
// runtime behavior. Plain-data route objects (no icon-component or helper deps).
// Merged back into rawRoutes via `...toolRoutes`, preserving array order.
// =============================================================================
export const toolRoutes = [
  {
    route: '/tools',
    category: 'advanced',
    pageLabel: 'Tools',
    title: 'Advanced Tools — The Genuine Love Project',
    description: 'Sophisticated tools for deeper healing work.',
    hero: {
      eyebrow: 'Advanced Toolkit',
      title: 'Powerful tools for',
      titleHighlight: 'deep work.',
      subtitle: 'Advanced resources for those ready to go deeper.',
      primaryCta: { label: 'Explore Tools', href: '#tools' },
      secondaryCta: { label: 'Recommended', href: '#recommended' }
    }
  },
  {
    route: '/advanced',
    category: 'advanced',
    pageLabel: 'Advanced',
    title: 'Advanced Practices — The Genuine Love Project',
    description: 'Advanced healing practices for experienced practitioners.',
    hero: {
      eyebrow: 'Deep Dive',
      title: 'Advanced practices for',
      titleHighlight: 'profound healing.',
      subtitle: 'For those ready to explore deeper dimensions.',
      primaryCta: { label: 'Start Advanced', href: '#advanced' },
      secondaryCta: { label: 'Prerequisites', href: '#prerequisites' }
    }
  },
  {
    route: '/mastery',
    category: 'advanced',
    pageLabel: 'Mastery',
    title: 'Mastery Path — The Genuine Love Project',
    description: 'The path to emotional and psychological mastery.',
    hero: {
      eyebrow: 'Excellence',
      title: 'Walk the path of',
      titleHighlight: 'mastery.',
      subtitle: 'Develop deep competence in emotional intelligence.',
      primaryCta: { label: 'Begin Mastery', href: '#mastery' },
      secondaryCta: { label: 'View Progress', href: '/progress' }
    }
  },
  {
    route: '/elite-tools',
    category: 'advanced',
    pageLabel: 'Elite Tools',
    title: 'Elite Tools — The Genuine Love Project',
    description: 'Premium tools for advanced practitioners.',
    hero: {
      eyebrow: 'Premium Access',
      title: 'Elite tools for',
      titleHighlight: 'serious practitioners.',
      subtitle: 'The most powerful tools in our collection.',
      primaryCta: { label: 'Access Tools', href: '#tools' },
      secondaryCta: { label: 'Upgrade', href: '/upgrade' }
    }
  },
  {
    route: '/atlas',
    category: 'advanced',
    pageLabel: 'Intellectual Atlas',
    title: 'Intellectual Atlas — The Genuine Love Project',
    description: 'Navigate the landscape of healing knowledge.',
    hero: {
      eyebrow: 'Knowledge Map',
      title: 'Navigate the',
      titleHighlight: 'healing landscape.',
      subtitle: 'A comprehensive map of healing concepts and connections.',
      primaryCta: { label: 'Explore Atlas', href: '#atlas' },
      secondaryCta: { label: 'Start Here', href: '#start' }
    }
  },
  {
    route: '/strategy-maps',
    category: 'advanced',
    pageLabel: 'Strategy Maps',
    title: 'Strategy Maps — The Genuine Love Project',
    description: 'Visual maps for navigating complex healing journeys.',
    hero: {
      eyebrow: 'Strategic Navigation',
      title: 'Map your',
      titleHighlight: 'healing strategy.',
      subtitle: 'Visual tools for planning and tracking complex journeys.',
      primaryCta: { label: 'View Maps', href: '#maps' },
      secondaryCta: { label: 'Create Map', href: '#create' }
    }
  },
  {
    route: '/collaborative-lab',
    category: 'advanced',
    pageLabel: 'Collaborative Lab',
    title: 'Collaborative Lab — The Genuine Love Project',
    description: 'Explore and experiment with healing practices together.',
    hero: {
      eyebrow: 'Experimentation',
      title: 'The healing',
      titleHighlight: 'laboratory.',
      subtitle: 'A space to explore and experiment with new approaches.',
      primaryCta: { label: 'Enter Lab', href: '#lab' },
      secondaryCta: { label: 'Current Projects', href: '#projects' }
    }
  },
  {
    route: '/resilience',
    category: 'advanced',
    pageLabel: 'Resilience',
    title: 'Resilience Building — The Genuine Love Project',
    description: 'Build lasting resilience and emotional strength.',
    hero: {
      eyebrow: 'Inner Strength',
      title: 'Build unshakeable',
      titleHighlight: 'resilience.',
      subtitle: 'Develop the capacity to weather life\'s storms.',
      primaryCta: { label: 'Start Building', href: '#build' },
      secondaryCta: { label: 'Assessment', href: '#assessment' }
    }
  },
  {
    route: '/knowledge-synthesis',
    category: 'advanced',
    pageLabel: 'Knowledge Synthesis',
    title: 'Knowledge Synthesis — The Genuine Love Project',
    description: 'Integrate and synthesize your learning.',
    hero: {
      eyebrow: 'Integration',
      title: 'Connect the dots of',
      titleHighlight: 'your knowledge.',
      subtitle: 'Synthesize insights from across your journey.',
      primaryCta: { label: 'Begin Synthesis', href: '#synthesis' },
      secondaryCta: { label: 'Review Learning', href: '#review' }
    }
  },
  {
    route: '/cognitive-architecture',
    category: 'advanced',
    pageLabel: 'Cognitive Architecture',
    title: 'Cognitive Architecture — The Genuine Love Project',
    description: 'Understand and reshape your cognitive patterns.',
    hero: {
      eyebrow: 'Mind Design',
      title: 'Architect your',
      titleHighlight: 'cognitive patterns.',
      subtitle: 'Understand and deliberately shape how you think.',
      primaryCta: { label: 'Explore Architecture', href: '#architecture' },
      secondaryCta: { label: 'Assessment', href: '#assessment' }
    }
  },
  {
    route: '/philosophical-inquiry',
    category: 'advanced',
    pageLabel: 'Philosophical Inquiry',
    title: 'Philosophical Inquiry — The Genuine Love Project',
    description: 'Deep philosophical exploration for meaning and purpose.',
    hero: {
      eyebrow: 'Deep Questions',
      title: 'Explore life\'s',
      titleHighlight: 'big questions.',
      subtitle: 'Philosophical tools for meaning and purpose.',
      primaryCta: { label: 'Begin Inquiry', href: '#inquiry' },
      secondaryCta: { label: 'Reading List', href: '#reading' }
    }
  },
  {
    route: '/systems-thinking',
    category: 'advanced',
    pageLabel: 'Systems Thinking',
    title: 'Systems Thinking — The Genuine Love Project',
    description: 'See patterns and connections in your life systems.',
    hero: {
      eyebrow: 'Holistic View',
      title: 'See the',
      titleHighlight: 'whole system.',
      subtitle: 'Understand how all the pieces of your life connect.',
      primaryCta: { label: 'Start Mapping', href: '#mapping' },
      secondaryCta: { label: 'Examples', href: '#examples' }
    }
  },
  {
    route: '/meta-learning',
    category: 'advanced',
    pageLabel: 'Meta-Learning',
    title: 'Meta-Learning — The Genuine Love Project',
    description: 'Learn how to learn more effectively.',
    hero: {
      eyebrow: 'Learning to Learn',
      title: 'Master the art of',
      titleHighlight: 'learning itself.',
      subtitle: 'Become more effective at acquiring new skills and knowledge.',
      primaryCta: { label: 'Start Learning', href: '#learning' },
      secondaryCta: { label: 'Strategies', href: '#strategies' }
    }
  },
  {
    route: '/daily-wisdom',
    category: 'advanced',
    pageLabel: 'Daily Wisdom',
    title: 'Daily Wisdom — The Genuine Love Project',
    description: 'Advanced daily wisdom practices.',
    hero: {
      eyebrow: 'Daily Practice',
      title: 'Wisdom for',
      titleHighlight: 'every day.',
      subtitle: 'Start each day with meaningful insight.',
      primaryCta: { label: 'Today\'s Wisdom', href: '#today' },
      secondaryCta: { label: 'Archive', href: '#archive' }
    }
  },
];
