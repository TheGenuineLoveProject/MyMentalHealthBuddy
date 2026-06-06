/**
 * 6 Benefit Pillars - Sitewide Language System
 * Use these consistently across Home, Pricing, Onboarding, Dashboard, Tools, Share Cards
 * 
 * Each pillar represents a core benefit that users can experience
 * through the platform's educational wellness tools.
 */

export const benefitPillars = {
  calmRegulation: {
    id: 'calm',
    label: 'Calm & Regulation',
    description: 'Steady body + mind',
    shortForm: 'Regulation',
    microcopy: [
      'Find your calm center',
      'Steady your nervous system',
      'Return to a grounded state',
      'Practice gentle regulation'
    ],
    icon: 'Leaf'
  },
  clarityInsight: {
    id: 'clarity',
    label: 'Clarity & Insight',
    description: 'Name what\'s real',
    shortForm: 'Clarity',
    microcopy: [
      'See things more clearly',
      'Name what you\'re feeling',
      'Gain perspective',
      'Understand your patterns'
    ],
    icon: 'Eye'
  },
  confidenceAgency: {
    id: 'confidence',
    label: 'Confidence & Agency',
    description: 'One next step',
    shortForm: 'Agency',
    microcopy: [
      'Take your next step',
      'Feel empowered to act',
      'Trust your own judgment',
      'Build self-trust'
    ],
    icon: 'Compass'
  },
  connectionSupport: {
    id: 'connection',
    label: 'Connection & Support',
    description: 'Belonging, community prompts',
    shortForm: 'Connection',
    microcopy: [
      'Feel less alone',
      'Connect with yourself',
      'Build supportive habits',
      'Remember you belong'
    ],
    icon: 'Heart'
  },
  consistencyGrowth: {
    id: 'growth',
    label: 'Consistency & Growth',
    description: 'Gentle routines, progress snapshots',
    shortForm: 'Growth',
    microcopy: [
      'Build gentle routines',
      'See your progress',
      'Celebrate small wins',
      'Grow at your pace'
    ],
    icon: 'TrendingUp'
  },
  meaningPurpose: {
    id: 'purpose',
    label: 'Meaning & Purpose',
    description: 'Values + identity',
    shortForm: 'Purpose',
    microcopy: [
      'Clarify your values',
      'Connect to what matters',
      'Live more intentionally',
      'Align with your purpose'
    ],
    icon: 'Star'
  }
};

export const benefitPillarsList = Object.values(benefitPillars);

export function getPillarById(id) {
  return benefitPillarsList.find(p => p.id === id) || null;
}

export function getPillarMicrocopy(pillarId, index = 0) {
  const pillar = getPillarById(pillarId);
  if (!pillar) return '';
  return pillar.microcopy[index % pillar.microcopy.length];
}

export function getRandomPillarMicrocopy(pillarId) {
  const pillar = getPillarById(pillarId);
  if (!pillar) return '';
  return pillar.microcopy[Math.floor(Math.random() * pillar.microcopy.length)];
}

export const antiLiabilityProof = {
  processProof: [
    'Built with consent-based prompts, opt-out language, and crisis routing.',
    'Evidence-informed, written in original language.',
    'Accessible calm design (WCAG AA), sensory-respecting motion.'
  ],
  noClaimsCopy: [
    'Educational wellness support — not medical advice.',
    'Self-directed tools for personal reflection.',
    'No diagnosis, no treatment claims, no medical is designed to support.'
  ]
};

export const benefitBlockDefaults = {
  benefit: 'Clarity, calm, and one next step',
  time: '30–90 seconds',
  control: 'Pause or stop anytime',
  note: 'Educational wellness support — not medical advice. If you\'re in crisis, visit /crisis.'
};

export default {
  pillars: benefitPillars,
  list: benefitPillarsList,
  getById: getPillarById,
  getMicrocopy: getPillarMicrocopy,
  getRandom: getRandomPillarMicrocopy,
  antiLiability: antiLiabilityProof,
  blockDefaults: benefitBlockDefaults
};
