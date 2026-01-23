/**
 * CRM Lead Magnet Configuration
 * Consent-based opt-ins with trauma-informed language
 */

export interface LeadMagnet {
  id: string;
  title: string;
  description: string;
  format: 'pdf' | 'guide' | 'worksheet' | 'audio';
  ctaText: string;
  disclaimerRequired: boolean;
  tags: string[];
}

export const leadMagnets: LeadMagnet[] = [
  {
    id: 'grounding-guide',
    title: '5 Gentle Grounding Techniques',
    description: 'A free guide to simple practices that may help you feel more present and settled.',
    format: 'pdf',
    ctaText: 'Get the free guide',
    disclaimerRequired: true,
    tags: ['grounding', 'regulation', 'beginner']
  },
  {
    id: 'journaling-prompts',
    title: '30 Reflective Journal Prompts',
    description: 'Gentle prompts for self-reflection and emotional processing. No experience needed.',
    format: 'pdf',
    ctaText: 'Download prompts',
    disclaimerRequired: true,
    tags: ['journaling', 'reflection', 'self-discovery']
  },
  {
    id: 'breathing-basics',
    title: 'Calm Breathing Basics',
    description: 'Simple breathing patterns that may support nervous system regulation.',
    format: 'guide',
    ctaText: 'Get breathing guide',
    disclaimerRequired: true,
    tags: ['breathing', 'regulation', 'stress']
  }
];

export const optInForms = {
  default: {
    headline: 'Join our gentle community',
    subheadline: 'Receive occasional wellness resources. Unsubscribe anytime.',
    ctaText: 'Join gently',
    placeholder: 'Your email',
    consent: 'I agree to receive emails. I can unsubscribe at any time.',
    disclaimer: 'We respect your privacy. No spam, ever.',
    privacyLink: '/privacy'
  },
  leadMagnet: {
    headline: 'Get your free resource',
    subheadline: "We'll send it to your inbox along with occasional gentle updates.",
    ctaText: 'Send it to me',
    placeholder: 'Email address',
    consent: 'I agree to receive emails. I can unsubscribe at any time.',
    disclaimer: 'Educational content only—not medical advice.',
    privacyLink: '/privacy'
  }
};

export const emailSequence = {
  name: 'Welcome Sequence',
  description: 'A 7-email series introducing the platform gently',
  emails: [
    {
      day: 0,
      subject: 'Welcome to The Genuine Love Project',
      preview: "You're here, and that matters.",
      type: 'welcome'
    },
    {
      day: 2,
      subject: 'A gentle first step',
      preview: 'One small practice to try (only if you want)',
      type: 'value'
    },
    {
      day: 4,
      subject: 'Why going slow matters',
      preview: 'The science of gentle change',
      type: 'education'
    },
    {
      day: 7,
      subject: 'Your free tool is ready',
      preview: 'A grounding exercise for anytime',
      type: 'resource'
    },
    {
      day: 10,
      subject: 'What people are finding helpful',
      preview: 'Stories from our community (anonymized)',
      type: 'social-proof'
    },
    {
      day: 14,
      subject: 'Ready for more?',
      preview: 'Explore our full wellness toolkit',
      type: 'soft-cta'
    },
    {
      day: 21,
      subject: 'Checking in gently',
      preview: "How are you doing? (No pressure to reply)",
      type: 'engagement'
    }
  ]
};

export const segmentationTags = [
  { id: 'beginner', label: 'New to wellness practices' },
  { id: 'regulation', label: 'Interested in nervous system regulation' },
  { id: 'journaling', label: 'Interested in journaling' },
  { id: 'relationships', label: 'Interested in relationship health' },
  { id: 'sleep', label: 'Interested in sleep improvement' },
  { id: 'healing', label: 'On a healing journey' },
  { id: 'professional', label: 'Wellness professional' }
];

export const unsubscribeCopy = {
  headline: "We're sorry to see you go",
  message: "You've been unsubscribed. If this was a mistake, you can rejoin anytime.",
  cta: 'Return home',
  feedback: "If you'd like to share why you're leaving, we'd appreciate it (optional)."
};

export function getLeadMagnet(id: string): LeadMagnet | undefined {
  return leadMagnets.find(lm => lm.id === id);
}

export function getLeadMagnetsByTag(tag: string): LeadMagnet[] {
  return leadMagnets.filter(lm => lm.tags.includes(tag));
}

export default {
  leadMagnets,
  optInForms,
  emailSequence,
  segmentationTags,
  unsubscribeCopy,
  getLeadMagnet,
  getLeadMagnetsByTag
};
