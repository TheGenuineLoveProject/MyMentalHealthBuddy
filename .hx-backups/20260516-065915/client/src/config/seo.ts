/**
 * SEO Configuration for MyMentalHealthBuddy by The Genuine Love Project
 * Topic pillars, meta templates, and content architecture
 */

export const SITE_NAME = 'MyMentalHealthBuddy by The Genuine Love Project';
export const SITE_TAGLINE = 'Self-Love, Healing & Emotional Growth';
export const DEFAULT_DESCRIPTION = 'A trauma-informed mental wellness platform offering AI-assisted emotional guidance, mood tracking, journaling, and evidence-based healing tools.';

export const topicPillars = [
  {
    id: 'regulation',
    name: 'Nervous System Regulation',
    slug: 'regulation',
    description: 'Tools for calming the nervous system and building resilience',
    keywords: ['breathing exercises', 'grounding techniques', 'stress relief', 'nervous system'],
    clusterPages: [
      '/breathing', '/grounding', '/calming-scenes', '/stress-response',
      '/body-wellness', '/movement-snacks', '/coherence-ladder'
    ]
  },
  {
    id: 'emotional',
    name: 'Emotional Intelligence',
    slug: 'emotional-intelligence', 
    description: 'Understanding and working with emotions skillfully',
    keywords: ['emotional awareness', 'feelings', 'emotional regulation', 'self-awareness'],
    clusterPages: [
      '/emotional-intelligence', '/mood', '/state', '/inner-child'
    ]
  },
  {
    id: 'reflection',
    name: 'Reflection & Journaling',
    slug: 'reflection',
    description: 'Practices for self-reflection and personal insight',
    keywords: ['journaling prompts', 'self-reflection', 'personal growth', 'mindfulness'],
    clusterPages: [
      '/journal', '/values-finder', '/meditation', '/affirmations'
    ]
  },
  {
    id: 'relationships',
    name: 'Healthy Relationships',
    slug: 'relationships',
    description: 'Building and maintaining healthy connections',
    keywords: ['boundaries', 'communication', 'relationships', 'attachment'],
    clusterPages: [
      '/boundaries', '/relationship-dynamics', '/social-intelligence'
    ]
  },
  {
    id: 'healing',
    name: 'Trauma-Informed Healing',
    slug: 'healing',
    description: 'Gentle approaches to healing and recovery',
    keywords: ['trauma healing', 'recovery', 'self-compassion', 'inner healing'],
    clusterPages: [
      '/healing', '/healing-library', '/healing-journeys', '/post-trauma'
    ]
  },
  {
    id: 'sleep',
    name: 'Sleep & Rest',
    slug: 'sleep-wellness',
    description: 'Supporting healthy sleep and restoration',
    keywords: ['sleep tips', 'relaxation', 'wind down', 'rest'],
    clusterPages: [
      '/sleep-guide', '/calming-scenes'
    ]
  },
  {
    id: 'purpose',
    name: 'Purpose & Meaning',
    slug: 'purpose',
    description: 'Discovering personal values and life direction',
    keywords: ['life purpose', 'values', 'meaning', 'personal mission'],
    clusterPages: [
      '/values-finder', '/purpose-compass', '/life-design', '/life-purpose'
    ]
  },
  {
    id: 'growth',
    name: 'Personal Growth',
    slug: 'personal-growth',
    description: 'Continuous development and self-improvement',
    keywords: ['personal development', 'growth mindset', 'self-improvement'],
    clusterPages: [
      '/personal-growth', '/self-mastery', '/peak-performance', '/human-potential'
    ]
  }
];

export const metaTemplates = {
  toolPage: {
    title: (toolName: string) => `${toolName} - Free Wellness Tool | ${SITE_NAME}`,
    description: (toolName: string, benefit: string) => 
      `Try our free ${toolName.toLowerCase()} tool. ${benefit} Evidence-informed, trauma-aware approach. No account required.`
  },
  guidePage: {
    title: (topic: string) => `${topic} Guide | ${SITE_NAME}`,
    description: (topic: string) => 
      `Learn about ${topic.toLowerCase()} with our gentle, evidence-informed approach. Free resources for emotional wellness.`
  },
  blogPost: {
    title: (headline: string) => `${headline} | ${SITE_NAME}`,
    description: (summary: string) => summary.slice(0, 155) + '...'
  }
};

export const internalLinkingRules = {
  maxLinksPerPage: 5,
  priorityOrder: ['pillar', 'cluster', 'related', 'cta'],
  alwaysLink: ['/crisis', '/about'],
  contextualLinks: {
    breathing: ['/grounding', '/stress-response', '/calming-scenes'],
    grounding: ['/breathing', '/body-wellness', '/meditation'],
    journaling: ['/values-finder', '/affirmations', '/reflection'],
    boundaries: ['/relationship-dynamics', '/self-care', '/values-finder'],
    sleep: ['/calming-scenes', '/breathing', '/meditation']
  }
};

export const schemaTypes = {
  article: 'Article',
  howTo: 'HowTo',
  faq: 'FAQPage',
  webPage: 'WebPage',
  organization: 'Organization'
};

export const urlConventions = {
  tools: '/tools/:slug',
  guides: '/guides/:topic',
  blog: '/blog/:slug',
  wellness: '/:category',
  admin: '/admin/:section'
};

export function generateMetaTitle(pageName: string, category?: string): string {
  if (category) {
    return `${pageName} - ${category} | ${SITE_NAME}`;
  }
  return `${pageName} | ${SITE_NAME}`;
}

export function generateMetaDescription(content: string, maxLength = 155): string {
  if (content.length <= maxLength) return content;
  return content.slice(0, maxLength - 3) + '...';
}

export function getRelatedLinks(currentPath: string): string[] {
  for (const [key, links] of Object.entries(internalLinkingRules.contextualLinks)) {
    if (currentPath.includes(key)) {
      return links.slice(0, internalLinkingRules.maxLinksPerPage);
    }
  }
  return internalLinkingRules.alwaysLink;
}

export default {
  SITE_NAME,
  SITE_TAGLINE,
  DEFAULT_DESCRIPTION,
  topicPillars,
  metaTemplates,
  internalLinkingRules,
  schemaTypes,
  urlConventions,
  generateMetaTitle,
  generateMetaDescription,
  getRelatedLinks
};
