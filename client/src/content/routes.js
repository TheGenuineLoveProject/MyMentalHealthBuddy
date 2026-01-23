/**
 * ============================================================================
 * ROUTES.JS - Single Source of Truth for All Platform Routes
 * ============================================================================
 * 
 * Config-driven routing system for The Genuine Love Project
 * 
 * Features:
 * - 119 routes + aliases (120 total)
 * - Category presets with defaults for hero/sections/modules
 * - Alias resolution (/home -> /)
 * - Dynamic pattern matching (/blog/:slug, /community/discussion/:id)
 * - Route protection for authenticated pages
 * - Motion presets (minimal/calm/rich) per category
 * 
 * Usage:
 *   import { getRouteConfig, listRoutesByCategory } from './routes.js';
 *   const config = getRouteConfig('/dashboard');
 *   const grouped = listRoutesByCategory();
 * 
 * ============================================================================
 */

import { 
  Heart, Shield, Brain, Sparkles, Star, Sun, Moon, Leaf, 
  BookOpen, MessageCircle, Users, Zap, Target, Compass,
  Activity, TrendingUp, Clock, Eye, Lightbulb, Award,
  FileText, Settings, Lock, CreditCard, HelpCircle, Mail,
  Scale, AlertTriangle, Bookmark, Palette, Layout, PenTool,
  BarChart, Calendar, MapPin, Mic, Camera, Video,
  Database, Code, Terminal, Cloud, Globe, Link, Home,
  Feather, Layers, Search, Edit, CheckCircle, XCircle
} from 'lucide-react';

// ============================================================================
// CATEGORY DEFINITIONS
// ============================================================================

export const routeCategories = {
  landing: 'Landing & Marketing',
  auth: 'Authentication',
  core: 'Dashboard & Core',
  ai: 'AI & Chat',
  wellness: 'Wellness & Healing Tools',
  advanced: 'Advanced & Mastery',
  content: 'Content & Learning',
  community: 'Community & Social',
  support: 'Support & Resources',
  legal: 'Legal & Policy',
  account: 'Account & Settings',
  admin: 'Admin',
  system: 'System & Utility'
};

// ============================================================================
// CATEGORY PRESETS - Auto-generate defaults per category
// ============================================================================

const categoryPresets = {
  landing: {
    motion: { level: 'rich' },
    protected: false,
    defaultHero: {
      eyebrow: 'Welcome to Genuine Love',
      title: 'Your sanctuary for',
      titleHighlight: 'emotional healing.',
      subtitle: 'A trauma-informed space for healing, growth, and self-discovery.',
      primaryCta: { label: 'Begin Your Journey', href: '/register' },
      secondaryCta: { label: 'Learn More', href: '#features' }
    },
    defaultSections: [
      {
        id: 'features',
        eyebrow: 'What We Offer',
        title: 'Healing tools designed with care',
        subtitle: 'Evidence-based approaches wrapped in compassion.',
        variant: 'glow',
        cards: [
          { icon: 'Heart', title: 'Self-Compassion', text: 'Learn to treat yourself with kindness.' },
          { icon: 'Brain', title: 'Emotional Awareness', text: 'Understand your inner landscape.' },
          { icon: 'Shield', title: 'Safe Space', text: 'A private sanctuary for your journey.' },
          { icon: 'Sparkles', title: 'Guided Support', text: 'Tools and resources when you need them.' }
        ]
      }
    ]
  },
  
  auth: {
    motion: { level: 'minimal' },
    protected: false,
    isAuthPage: true,
    defaultHero: {
      eyebrow: 'Welcome',
      title: 'Continue your',
      titleHighlight: 'healing journey.',
      subtitle: 'A safe space awaits you.',
      primaryCta: { label: 'Continue', href: '#form' },
      secondaryCta: { label: 'Need Help?', href: '/support' }
    },
    defaultSections: []
  },
  
  core: {
    motion: { level: 'calm' },
    protected: true,
    defaultHero: {
      eyebrow: 'Your Sanctuary',
      title: 'Welcome to your',
      titleHighlight: 'healing space.',
      subtitle: 'Everything you need, all in one place.',
      primaryCta: { label: 'Get Started', href: '#main' },
      secondaryCta: { label: 'View Progress', href: '/progress' }
    },
    defaultSections: [
      {
        id: 'quick-actions',
        eyebrow: 'Quick Actions',
        title: 'Your daily tools',
        subtitle: 'Simple steps for meaningful progress.',
        variant: 'plain',
        cards: [
          { icon: 'BookOpen', title: 'Journal', text: 'Reflect and process.' },
          { icon: 'Activity', title: 'Check-In', text: 'Track your state.' },
          { icon: 'MessageCircle', title: 'Chat', text: 'Talk it through.' },
          { icon: 'Target', title: 'Goals', text: 'Small steps forward.' }
        ]
      }
    ]
  },
  
  ai: {
    motion: { level: 'calm' },
    protected: true,
    defaultHero: {
      eyebrow: 'AI Support',
      title: 'Compassionate',
      titleHighlight: 'guidance awaits.',
      subtitle: 'Trauma-informed AI support for your healing journey.',
      primaryCta: { label: 'Start Conversation', href: '#chat' },
      secondaryCta: { label: 'Learn About Safety', href: '/safety' }
    },
    defaultSections: []
  },
  
  wellness: {
    motion: { level: 'calm' },
    protected: false,
    defaultHero: {
      eyebrow: 'Wellness Practice',
      title: 'Nurture your',
      titleHighlight: 'well-being.',
      subtitle: 'Gentle practices for mind, body, and spirit.',
      primaryCta: { label: 'Start Practice', href: '#practice' },
      secondaryCta: { label: 'Browse All', href: '/wellness-hub' }
    },
    defaultSections: [
      {
        id: 'practices',
        eyebrow: 'Available Practices',
        title: 'Choose your path',
        subtitle: 'Find what resonates with you today.',
        variant: 'glow',
        cards: [
          { icon: 'Activity', title: 'Breathwork', text: 'Calm your nervous system.' },
          { icon: 'Leaf', title: 'Grounding', text: 'Return to the present.' },
          { icon: 'Heart', title: 'Self-Care', text: 'Nurture yourself.' },
          { icon: 'Moon', title: 'Rest', text: 'Honor your need for quiet.' }
        ]
      }
    ]
  },
  
  advanced: {
    motion: { level: 'calm' },
    protected: true,
    defaultHero: {
      eyebrow: 'Advanced Practice',
      title: 'Deepen your',
      titleHighlight: 'understanding.',
      subtitle: 'Sophisticated tools for those ready to go deeper.',
      primaryCta: { label: 'Explore Tools', href: '#tools' },
      secondaryCta: { label: 'View Progress', href: '/progress' }
    },
    defaultSections: [
      {
        id: 'modules',
        eyebrow: 'Learning Modules',
        title: 'Advanced concepts',
        subtitle: 'Expand your healing toolkit.',
        variant: 'pattern',
        cards: [
          { icon: 'Brain', title: 'Cognitive Tools', text: 'Reshape thought patterns.' },
          { icon: 'Compass', title: 'Strategy Maps', text: 'Navigate complexity.' },
          { icon: 'Layers', title: 'Systems Thinking', text: 'See the bigger picture.' },
          { icon: 'Lightbulb', title: 'Insights', text: 'Discover new perspectives.' }
        ]
      }
    ]
  },
  
  content: {
    motion: { level: 'calm' },
    protected: false,
    defaultHero: {
      eyebrow: 'Learning Resources',
      title: 'Knowledge for',
      titleHighlight: 'your journey.',
      subtitle: 'Articles, guides, and resources to support your growth.',
      primaryCta: { label: 'Start Reading', href: '#content' },
      secondaryCta: { label: 'Browse Topics', href: '#topics' }
    },
    defaultSections: [
      {
        id: 'topics',
        eyebrow: 'Topics',
        title: 'Explore by theme',
        subtitle: 'Find what speaks to you.',
        variant: 'plain',
        cards: [
          { icon: 'BookOpen', title: 'Articles', text: 'In-depth explorations.' },
          { icon: 'FileText', title: 'Guides', text: 'Step-by-step support.' },
          { icon: 'Bookmark', title: 'Resources', text: 'Curated collections.' },
          { icon: 'Search', title: 'Search', text: 'Find what you need.' }
        ]
      }
    ]
  },
  
  community: {
    motion: { level: 'calm' },
    protected: true,
    defaultHero: {
      eyebrow: 'Community',
      title: 'You are',
      titleHighlight: 'not alone.',
      subtitle: 'Connect with others on similar journeys in a safe, moderated space.',
      primaryCta: { label: 'Join Community', href: '#community' },
      secondaryCta: { label: 'Community Guidelines', href: '/ethics' }
    },
    defaultSections: []
  },
  
  support: {
    motion: { level: 'minimal' },
    protected: false,
    defaultHero: {
      eyebrow: 'We\'re Here to Help',
      title: 'Get the support',
      titleHighlight: 'you need.',
      subtitle: 'Clear answers and resources for your questions.',
      primaryCta: { label: 'Find Answers', href: '#faq' },
      secondaryCta: { label: 'Contact Us', href: '/support' }
    },
    defaultSections: []
  },
  
  legal: {
    motion: { level: 'minimal' },
    protected: false,
    defaultHero: {
      eyebrow: 'Legal Information',
      title: 'Clear and',
      titleHighlight: 'transparent.',
      subtitle: 'Our policies explained in plain language.',
      primaryCta: { label: 'Read Document', href: '#content' },
      secondaryCta: { label: 'Contact Legal', href: '/support' }
    },
    defaultSections: []
  },
  
  account: {
    motion: { level: 'minimal' },
    protected: true,
    defaultHero: {
      eyebrow: 'Your Account',
      title: 'Manage your',
      titleHighlight: 'settings.',
      subtitle: 'Control your experience and preferences.',
      primaryCta: { label: 'Edit Settings', href: '#settings' },
      secondaryCta: { label: 'Get Help', href: '/support' }
    },
    defaultSections: []
  },
  
  admin: {
    motion: { level: 'minimal' },
    protected: true,
    adminOnly: true,
    defaultHero: {
      eyebrow: 'Administration',
      title: 'Platform',
      titleHighlight: 'management.',
      subtitle: 'Tools for platform administration.',
      primaryCta: { label: 'View Dashboard', href: '#dashboard' },
      secondaryCta: { label: 'View Logs', href: '#logs' }
    },
    defaultSections: []
  },
  
  system: {
    motion: { level: 'minimal' },
    protected: false,
    defaultHero: {
      eyebrow: 'System',
      title: 'Platform',
      titleHighlight: 'utilities.',
      subtitle: 'System information and tools.',
      primaryCta: { label: 'View Status', href: '#status' },
      secondaryCta: { label: 'Get Help', href: '/support' }
    },
    defaultSections: []
  }
};

// ============================================================================
// HELPER: Apply category preset to route
// ============================================================================

function applyPreset(route) {
  const preset = categoryPresets[route.category] || categoryPresets.system;
  
  return {
    ...route,
    motion: route.motion || preset.motion,
    protected: route.protected ?? preset.protected,
    adminOnly: route.adminOnly ?? preset.adminOnly,
    isAuthPage: route.isAuthPage ?? preset.isAuthPage,
    hero: route.hero || {
      ...preset.defaultHero,
      title: route.pageLabel || preset.defaultHero.title,
    },
    sections: route.sections || preset.defaultSections,
    modules: route.modules || []
  };
}

// ============================================================================
// ROUTES REGISTRY - ALL 119 ROUTES + ALIASES
// ============================================================================

const rawRoutes = [
  // =========================================================================
  // LANDING & MARKETING (7 routes)
  // =========================================================================
  {
    route: '/',
    category: 'landing',
    pageLabel: 'Main Landing',
    title: 'The Genuine Love Project — A Gentle Space for Healing',
    description: 'A private, trauma-informed sanctuary for emotional healing. Evidence-based tools for inner child work, nervous system regulation, and self-compassion—available whenever you need them.',
    hero: {
      eyebrow: 'A safe place to begin',
      title: 'You deserve a gentle space',
      titleHighlight: 'to heal at your own pace.',
      subtitle: 'This is a quiet corner of the internet built for people who carry more than they show. Here, you can process grief, calm your nervous system, reconnect with your inner child, and learn to hold yourself with compassion—all in complete privacy.',
      primaryCta: { label: 'Begin when you\'re ready', href: '/register' },
      secondaryCta: { label: 'Explore at your pace', href: '#how-it-works' }
    },
    modules: [
      { icon: 'Heart', title: 'Inner Child Work', description: 'Gentle exercises to reconnect with younger parts of yourself that may still need comfort.' },
      { icon: 'Brain', title: 'Nervous System Care', description: 'Simple somatic practices to help you find calm when everything feels like too much.' },
      { icon: 'MessageCircle', title: 'AI Companion', description: 'A patient, trauma-informed presence available whenever you need someone to talk to.' }
    ],
    sections: [
      {
        id: 'how-it-works',
        eyebrow: 'How It Works',
        title: 'A gentle path, one step at a time',
        subtitle: 'There is no rush. Each step unfolds naturally when you are ready.',
        variant: 'glow',
        cards: [
          { icon: 'User', title: 'Step 1: Create Your Space', text: 'Sign up in moments. Your private sanctuary is ready—no credit card, no commitments.' },
          { icon: 'Compass', title: 'Step 2: Choose Your Path', text: 'Explore journaling, breathing exercises, or simply talk to your AI companion. Start wherever feels right.' },
          { icon: 'Activity', title: 'Step 3: Notice Small Shifts', text: 'Over time, gentle check-ins help you see patterns and celebrate quiet progress.' },
          { icon: 'Sun', title: 'Step 4: Return Whenever', text: 'This space is always here. Come back daily or once a month—there is no streak guilt.' }
        ]
      },
      {
        id: 'pathways',
        eyebrow: 'Gentle Pathways',
        title: 'Evidence-based tools wrapped in compassion',
        subtitle: 'Each practice here is grounded in research and designed with your nervous system in mind.',
        variant: 'pattern',
        cards: [
          { icon: 'Heart', title: 'Inner Child Work', text: 'Gentle exercises to reconnect with and comfort younger parts of yourself.' },
          { icon: 'Brain', title: 'Nervous System Care', text: 'Simple somatic practices to help you find calm when you feel overwhelmed.' },
          { icon: 'Shield', title: 'Parts Work', text: 'IFS-inspired tools to understand the different voices within you.' },
          { icon: 'Sparkles', title: 'AI Companion', text: 'A patient, trauma-informed presence available whenever you need support.' }
        ]
      },
      {
        id: 'features',
        eyebrow: 'What You\'ll Find Here',
        title: 'Tools that meet you where you are',
        subtitle: 'No pressure. No judgment. Just resources waiting when you\'re ready.',
        variant: 'plain',
        bullets: [
          'Guided journaling with gentle, open-ended prompts',
          'Breathing exercises for moments of overwhelm',
          'Mood and state tracking without judgment',
          'Grounding techniques for when you feel untethered',
          'AI companion conversations available anytime',
          'Evidence-based healing modalities explained simply'
        ]
      },
      {
        id: 'trust',
        eyebrow: 'Built With Care',
        title: 'Your privacy and safety come first',
        subtitle: 'This space was created by people who understand what it means to need a safe place.',
        variant: 'glow',
        cards: [
          { icon: 'Lock', title: 'Completely Private', text: 'Your reflections and progress are yours alone. We never share your data.' },
          { icon: 'Shield', title: 'Trauma-Informed', text: 'Every feature is designed to feel safe and never overwhelming.' },
          { icon: 'Clock', title: 'Your Timeline', text: 'There is no rush here. Move at whatever pace feels right for you.' }
        ]
      }
    ]
  },
  {
    route: '/home',
    aliasOf: '/',
    category: 'landing',
    pageLabel: 'Home (Alias)'
  },
  {
    route: '/welcome',
    aliasOf: '/',
    category: 'landing',
    pageLabel: 'Welcome (Alias)'
  },
  {
    route: '/original-home',
    category: 'landing',
    pageLabel: 'Original Home',
    title: 'Welcome Home — The Genuine Love Project',
    description: 'The original vision of Genuine Love: a quiet sanctuary for those seeking peace, healing, and self-understanding. Begin wherever you are.',
    motion: { level: 'calm' },
    hero: {
      eyebrow: 'Where it all began',
      title: 'A quiet place for',
      titleHighlight: 'weary hearts.',
      subtitle: 'This is where Genuine Love started—a simple idea that everyone deserves a safe space to heal. That vision hasn\'t changed.',
      primaryCta: { label: 'Come in', href: '/dashboard' },
      secondaryCta: { label: 'Our story', href: '#story' }
    },
    modules: [
      { icon: 'Heart', title: 'Self-Compassion', description: 'Learn to hold yourself with the same kindness you would offer a dear friend.' },
      { icon: 'Leaf', title: 'Grounding Practices', description: 'Simple techniques to help you feel present and connected to this moment.' },
      { icon: 'Sun', title: 'Daily Rituals', description: 'Gentle morning and evening practices to bookend your days with intention.' }
    ],
    sections: [
      {
        id: 'story',
        eyebrow: 'Our Beginning',
        title: 'Built by people who understand',
        subtitle: 'Genuine Love was created by people who needed a space like this themselves.',
        variant: 'plain',
        cards: [
          { icon: 'Heart', title: 'Born from Need', text: 'We built what we wished existed when we were struggling.' },
          { icon: 'Users', title: 'Community First', text: 'Every feature was shaped by real people sharing real experiences.' },
          { icon: 'Shield', title: 'Always Safe', text: 'Privacy and gentleness have been core values from day one.' }
        ]
      },
      {
        id: 'values',
        eyebrow: 'What We Believe',
        title: 'Healing happens in relationship',
        subtitle: 'With yourself, with others, with the present moment.',
        variant: 'glow',
        cards: [
          { icon: 'Eye', title: 'Self-Understanding', text: 'Knowing yourself is the foundation of change.' },
          { icon: 'Activity', title: 'Embodied Presence', text: 'Your body holds wisdom. We help you listen.' },
          { icon: 'Leaf', title: 'Patient Growth', text: 'Real transformation unfolds slowly, like seasons.' },
          { icon: 'Sun', title: 'Radical Compassion', text: 'You are worthy of kindness, especially from yourself.' }
        ]
      },
      {
        id: 'invitation',
        eyebrow: 'An Invitation',
        title: 'This space is here whenever you need it',
        subtitle: 'There is no right time to begin. You are welcome exactly as you are.',
        variant: 'pattern',
        cards: [
          { icon: 'Clock', title: 'No Rush', text: 'Take as long as you need. Healing unfolds in its own time.' },
          { icon: 'Lock', title: 'Complete Privacy', text: 'What you share here stays here. Always.' },
          { icon: 'Sparkles', title: 'Gentle Support', text: 'When you want guidance, compassionate tools are waiting.' }
        ]
      }
    ]
  },
  {
    route: '/healing',
    category: 'landing',
    pageLabel: 'Healing Landing',
    title: 'Healing Resources — The Genuine Love Project',
    description: 'Explore gentle, evidence-based approaches to emotional healing. Somatic practices, inner child work, and nervous system regulation—all designed with your safety in mind.',
    hero: {
      eyebrow: 'Healing happens in small moments',
      title: 'There is no wrong way',
      titleHighlight: 'to begin healing.',
      subtitle: 'Whether you are just starting to explore or have been on this path for years, these resources are here to support you. Each tool is grounded in research and designed to feel safe, not overwhelming.',
      primaryCta: { label: 'Explore healing tools', href: '/wellness-hub' },
      secondaryCta: { label: 'See how it works', href: '#how-it-works' }
    },
    modules: [
      { icon: 'Activity', title: 'Somatic Practices', description: 'Body-based exercises to help release what words cannot express.' },
      { icon: 'Eye', title: 'Inner Child Work', description: 'Gentle reconnection with younger parts of yourself that need comfort.' },
      { icon: 'Brain', title: 'Nervous System Regulation', description: 'Tools to widen your window of tolerance and find more moments of calm.' }
    ],
    sections: [
      {
        id: 'how-it-works',
        eyebrow: 'How It Works',
        title: 'Your healing journey, step by step',
        subtitle: 'Each step is optional. Take what resonates and leave what does not.',
        variant: 'glow',
        cards: [
          { icon: 'Compass', title: 'Step 1: Choose a Starting Point', text: 'Browse our modalities—somatic work, journaling, breathwork—and pick what calls to you.' },
          { icon: 'Play', title: 'Step 2: Try a Gentle Practice', text: 'Each exercise is designed to be short and safe. You can stop anytime.' },
          { icon: 'Activity', title: 'Step 3: Notice What Arises', text: 'There is no right or wrong. Simply observe how your body and mind respond.' },
          { icon: 'RefreshCw', title: 'Step 4: Return and Repeat', text: 'Healing unfolds over time. Come back whenever you feel ready.' }
        ]
      },
      {
        id: 'philosophy',
        eyebrow: 'Our Approach',
        title: 'Healing that respects your pace',
        subtitle: 'We believe real healing happens when you feel safe enough to show up as you are.',
        variant: 'plain',
        bullets: [
          'Every tool begins with kindness toward yourself, exactly as you are today',
          'Nothing here will push you faster than your nervous system is ready for',
          'Healing is not linear—we celebrate small steps and honor difficult days',
          'You are the expert on your own experience; we simply offer support',
          'All practices are grounded in trauma-informed, evidence-based research'
        ]
      },
      {
        id: 'modalities',
        eyebrow: 'Evidence-Based Modalities',
        title: 'Gentle tools grounded in research',
        subtitle: 'These approaches have helped many people. They might help you too.',
        variant: 'pattern',
        cards: [
          { icon: 'Activity', title: 'Somatic Practices', text: 'Simple body-based exercises to help release tension you may be holding.' },
          { icon: 'Brain', title: 'Nervous System Care', text: 'Learn to recognize your window of tolerance and expand it gently over time.' },
          { icon: 'Eye', title: 'Inner Child Work', text: 'Reconnect with younger parts of yourself that may still need comfort.' },
          { icon: 'Leaf', title: 'Mindful Awareness', text: 'Present-moment practices to help you feel more grounded.' }
        ]
      },
      {
        id: 'start',
        eyebrow: 'Where to Begin',
        title: 'You do not need to know where to start',
        subtitle: 'If you are not sure what you need, that is okay. Here are some gentle entry points.',
        variant: 'glow',
        cards: [
          { icon: 'Wind', title: 'Breathing Exercises', text: 'A simple place to begin. Just a few minutes can shift how you feel.' },
          { icon: 'MapPin', title: 'Grounding Techniques', text: 'Helpful when you feel disconnected or overwhelmed.' },
          { icon: 'BookOpen', title: 'Journaling Prompts', text: 'Gentle questions to help you process what you are carrying.' },
          { icon: 'MessageCircle', title: 'Talk to AI Companion', text: 'Share what is on your mind with a patient, understanding presence.' }
        ]
      }
    ]
  },
  {
    route: '/pricing',
    category: 'landing',
    pageLabel: 'Pricing',
    title: 'Pricing — The Genuine Love Project',
    description: 'Transparent, accessible pricing for your healing journey. Start free with no pressure to upgrade. Premium features available when you are ready.',
    hero: {
      eyebrow: 'Transparent and accessible',
      title: 'Healing support should be',
      titleHighlight: 'available to everyone.',
      subtitle: 'We believe cost should not be a barrier to emotional wellness. Start with our free tools for as long as you need. Upgrade only when it feels right for you.',
      primaryCta: { label: 'Start free today', href: '/register' },
      secondaryCta: { label: 'See how it works', href: '#how-it-works' }
    },
    modules: [
      { icon: 'Heart', title: 'Free Core Tools', description: 'Journaling, mood tracking, and grounding practices—free forever, no strings attached.' },
      { icon: 'Star', title: 'Premium Support', description: 'Unlimited AI companion, advanced healing journeys, and personalized insights.' },
      { icon: 'Sparkles', title: 'Lifetime Access', description: 'One payment, forever access. No recurring charges, complete peace of mind.' }
    ],
    sections: [
      {
        id: 'how-it-works',
        eyebrow: 'How It Works',
        title: 'Getting started is simple',
        subtitle: 'No pressure, no commitments. Just support when you need it.',
        variant: 'glow',
        cards: [
          { icon: 'User', title: 'Step 1: Create Your Account', text: 'Sign up in under a minute. No credit card required for free access.' },
          { icon: 'Compass', title: 'Step 2: Explore Free Tools', text: 'Use journaling, breathing exercises, and grounding practices as long as you like.' },
          { icon: 'Star', title: 'Step 3: Upgrade If You Wish', text: 'When you want more, Premium unlocks unlimited AI companion and advanced features.' },
          { icon: 'Heart', title: 'Step 4: Heal at Your Pace', text: 'Whether free or Premium, this space is here whenever you need it.' }
        ]
      },
      {
        id: 'plans',
        eyebrow: 'Simple Options',
        title: 'Take what you need, when you need it',
        subtitle: 'There is no pressure here. Many people find the free tools are enough.',
        variant: 'pattern',
        cards: [
          { icon: 'Heart', title: 'Free Forever', text: 'Core journaling, mood tracking, breathing exercises, and grounding practices. No credit card needed.' },
          { icon: 'Star', title: 'Premium', text: 'Unlimited AI companion conversations, advanced healing journeys, and personalized insights. $12/month.' },
          { icon: 'Sparkles', title: 'Lifetime Access', text: 'Everything in Premium, forever. One payment, no recurring charges. $149 once.' }
        ]
      },
      {
        id: 'philosophy',
        eyebrow: 'Our Promise',
        title: 'We are not here to sell you anything',
        subtitle: 'Our goal is to support your healing, not pressure you into purchases.',
        variant: 'plain',
        bullets: [
          'We will never use urgency tactics or manipulative pricing',
          'Cancel Premium anytime with one click—no questions, no guilt',
          'Your data stays yours. Export everything, even if you leave',
          'If cost is a barrier, reach out. We will find a way to help',
          'Free tools are genuinely free—no trial periods, no hidden fees'
        ]
      },
      {
        id: 'faq',
        eyebrow: 'Common Questions',
        title: 'You might be wondering',
        subtitle: 'Here are answers to questions we hear often.',
        variant: 'glow',
        cards: [
          { icon: 'HelpCircle', title: 'Is the free version really free?', text: 'Yes. No trial period, no hidden fees. Use it as long as you like.' },
          { icon: 'CreditCard', title: 'Can I try Premium first?', text: 'Absolutely. Your first 7 days of Premium are free to explore.' },
          { icon: 'Users', title: 'Do you offer reduced pricing?', text: 'Yes. If cost is a barrier, reach out and we will find a way to help.' }
        ]
      }
    ]
  },
  {
    route: '/landing',
    category: 'landing',
    pageLabel: 'Marketing Landing',
    title: 'A Space for Healing — The Genuine Love Project',
    description: 'Discover a trauma-informed mental wellness platform with AI-powered support, journaling, and evidence-based healing tools. Free to start, private by design.',
    motion: { level: 'rich' },
    hero: {
      eyebrow: 'For those ready to begin',
      title: 'Finally, a wellness space that',
      titleHighlight: 'actually feels safe.',
      subtitle: 'No toxic positivity. No pressure to be fixed. Just evidence-based tools, compassionate AI support, and a community that understands—available whenever you need it.',
      primaryCta: { label: 'Start for free', href: '/register' },
      secondaryCta: { label: 'See how it works', href: '#how' }
    },
    modules: [
      { icon: 'MessageCircle', title: 'AI Companion', description: 'A patient, trauma-informed presence available whenever you need someone to listen.' },
      { icon: 'BookOpen', title: 'Guided Journaling', description: 'Thoughtful prompts to help you process and make sense of your experiences.' },
      { icon: 'Activity', title: 'State Tracking', description: 'Simple check-ins that help you notice patterns and celebrate small progress.' }
    ],
    sections: [
      {
        id: 'how',
        eyebrow: 'How It Works',
        title: 'Simple tools for complex feelings',
        subtitle: 'We\'ve made healing accessible without making it shallow.',
        variant: 'glow',
        cards: [
          { icon: 'MessageCircle', title: 'Talk to AI Companion', text: 'Share what\'s on your mind with a patient, trauma-informed presence. No appointments needed.' },
          { icon: 'BookOpen', title: 'Journal Your Way', text: 'Guided prompts help you process. Free-write when you need to. Your words stay private.' },
          { icon: 'Activity', title: 'Track Your State', text: 'Simple check-ins help you notice patterns and celebrate small wins over time.' },
          { icon: 'Leaf', title: 'Practice Regulation', text: 'Breathing exercises, grounding techniques, and somatic practices for difficult moments.' }
        ]
      },
      {
        id: 'different',
        eyebrow: 'Why We\'re Different',
        title: 'Built with your nervous system in mind',
        subtitle: 'Most apps want you to hustle toward happiness. We want you to feel safe first.',
        variant: 'pattern',
        cards: [
          { icon: 'Shield', title: 'Trauma-Informed', text: 'Everything is designed to avoid re-triggering or overwhelming you.' },
          { icon: 'Lock', title: 'Genuinely Private', text: 'We don\'t sell your data. Your reflections belong to you alone.' },
          { icon: 'Clock', title: 'No Timelines', text: 'Use it daily or once a month. There\'s no streak guilt here.' },
          { icon: 'Heart', title: 'Actually Gentle', text: 'The tone, the colors, the pacing—all designed to feel calm.' }
        ]
      },
      {
        id: 'cta',
        eyebrow: 'Ready When You Are',
        title: 'Start with the free tools',
        subtitle: 'No credit card. No commitment. Just support waiting when you need it.',
        variant: 'plain',
        cards: [
          { icon: 'Sparkles', title: 'Free Forever', text: 'Core features never expire. Upgrade only if you want more.' },
          { icon: 'Users', title: 'Join Quietly', text: 'No social features required. Be as anonymous as you like.' },
          { icon: 'Target', title: 'Your Pace', text: 'We\'ll never push you. You lead your own journey.' }
        ]
      }
    ]
  },
  
  // =========================================================================
  // AUTHENTICATION (6 routes)
  // =========================================================================
  {
    route: '/login',
    category: 'auth',
    pageLabel: 'Sign In',
    title: 'Sign In — The Genuine Love Project',
    description: 'Welcome back to your healing sanctuary. Sign in to continue your journey.',
    hero: {
      eyebrow: 'Welcome Back',
      title: 'Continue your',
      titleHighlight: 'healing journey.',
      subtitle: 'Your progress and insights are waiting for you.',
      primaryCta: { label: 'Sign In', href: '#login-form' },
      secondaryCta: { label: 'Create Account', href: '/register' }
    }
  },
  {
    route: '/login/callback',
    category: 'auth',
    pageLabel: 'Login Callback',
    title: 'Completing Sign In — The Genuine Love Project',
    description: 'Completing your sign in process.',
    hero: {
      eyebrow: 'One Moment',
      title: 'Completing',
      titleHighlight: 'sign in...',
      subtitle: 'Please wait while we securely complete your authentication.',
      primaryCta: { label: 'Go to Dashboard', href: '/dashboard' },
      secondaryCta: { label: 'Need Help?', href: '/support' }
    }
  },
  {
    route: '/register',
    category: 'auth',
    pageLabel: 'Create Account',
    title: 'Create Account — The Genuine Love Project',
    description: 'Join thousands on their healing journey. Create your free account today.',
    hero: {
      eyebrow: 'Begin Your Journey',
      title: 'Create your',
      titleHighlight: 'healing sanctuary.',
      subtitle: 'A safe, private space designed just for you.',
      primaryCta: { label: 'Get Started Free', href: '#register-form' },
      secondaryCta: { label: 'Already have an account?', href: '/login' }
    }
  },
  {
    route: '/forgot-password',
    category: 'auth',
    pageLabel: 'Forgot Password',
    title: 'Reset Password — The Genuine Love Project',
    description: 'Reset your password to regain access to your healing sanctuary.',
    hero: {
      eyebrow: 'Password Recovery',
      title: 'Reset your',
      titleHighlight: 'password.',
      subtitle: 'We\'ll send you a secure link to create a new password.',
      primaryCta: { label: 'Send Reset Link', href: '#reset-form' },
      secondaryCta: { label: 'Back to Sign In', href: '/login' }
    }
  },
  {
    route: '/reset-password',
    category: 'auth',
    pageLabel: 'Reset Password',
    title: 'Create New Password — The Genuine Love Project',
    description: 'Create a new password for your account.',
    hero: {
      eyebrow: 'New Password',
      title: 'Create a new',
      titleHighlight: 'password.',
      subtitle: 'Choose a secure password to protect your account.',
      primaryCta: { label: 'Reset Password', href: '#form' },
      secondaryCta: { label: 'Back to Sign In', href: '/login' }
    }
  },
  {
    route: '/onboarding',
    category: 'auth',
    pageLabel: 'Onboarding',
    title: 'Welcome — The Genuine Love Project',
    description: 'Let\'s personalize your healing journey.',
    hero: {
      eyebrow: 'Welcome',
      title: 'Let\'s personalize your',
      titleHighlight: 'journey.',
      subtitle: 'A few questions to help us support you better.',
      primaryCta: { label: 'Continue', href: '#onboarding' },
      secondaryCta: { label: 'Skip for Now', href: '/dashboard' }
    }
  },
  
  // =========================================================================
  // DASHBOARD & CORE (10 routes)
  // =========================================================================
  {
    route: '/dashboard',
    category: 'core',
    pageLabel: 'Dashboard',
    title: 'Dashboard — The Genuine Love Project',
    description: 'Your personal healing dashboard. Track progress, access tools, and continue your journey.',
    hero: {
      eyebrow: 'Your Sanctuary',
      title: 'Welcome to your',
      titleHighlight: 'healing space.',
      subtitle: 'Everything you need, all in one place.',
      primaryCta: { label: 'Start Today\'s Practice', href: '/today' },
      secondaryCta: { label: 'View Progress', href: '/progress' }
    },
    sections: [
      {
        id: 'quick-access',
        eyebrow: 'Quick Access',
        title: 'Your daily tools',
        subtitle: 'Jump right into your healing practice.',
        variant: 'plain',
        cards: [
          { icon: 'BookOpen', title: 'Journal', text: 'Reflect and process with guided prompts.' },
          { icon: 'Activity', title: 'State Check', text: 'Track your emotional state.' },
          { icon: 'MessageCircle', title: 'AI Chat', text: 'Talk through what\'s on your mind.' },
          { icon: 'Target', title: 'Daily Goals', text: 'Small steps, big progress.' }
        ]
      }
    ]
  },
  {
    route: '/crm',
    category: 'core',
    pageLabel: 'Relationship Manager',
    title: 'Relationship Manager — The Genuine Love Project',
    description: 'Track and nurture your important relationships.',
    hero: {
      eyebrow: 'Connections',
      title: 'Nurture your',
      titleHighlight: 'relationships.',
      subtitle: 'Tools to strengthen the bonds that matter most.',
      primaryCta: { label: 'View Connections', href: '#connections' },
      secondaryCta: { label: 'Add Relationship', href: '#add' }
    }
  },
  {
    route: '/today',
    category: 'core',
    pageLabel: 'Today',
    title: 'Today — The Genuine Love Project',
    description: 'Your daily healing ritual. Check in, reflect, and nurture yourself.',
    hero: {
      eyebrow: 'Daily Practice',
      title: 'How are you',
      titleHighlight: 'feeling today?',
      subtitle: 'Take a moment to check in with yourself.',
      primaryCta: { label: 'Begin Check-In', href: '#checkin' },
      secondaryCta: { label: 'Skip to Journal', href: '/journal' }
    }
  },
  {
    route: '/mood',
    category: 'core',
    pageLabel: 'Mood Tracker',
    title: 'Mood Tracking — The Genuine Love Project',
    description: 'Track and understand your emotional patterns over time.',
    hero: {
      eyebrow: 'Emotional Awareness',
      title: 'Understand your',
      titleHighlight: 'emotional patterns.',
      subtitle: 'Gain insights into your mood fluctuations and triggers.',
      primaryCta: { label: 'Log Mood', href: '#log' },
      secondaryCta: { label: 'View Trends', href: '#trends' }
    }
  },
  {
    route: '/state',
    category: 'core',
    pageLabel: 'State Tracker',
    title: 'State Tracker — The Genuine Love Project',
    description: 'Monitor your nervous system state and learn regulation techniques.',
    hero: {
      eyebrow: 'Nervous System Awareness',
      title: 'Know your',
      titleHighlight: 'window of tolerance.',
      subtitle: 'Track your nervous system states and build regulation capacity.',
      primaryCta: { label: 'Check State', href: '#check' },
      secondaryCta: { label: 'Learn Regulation', href: '/grounding' }
    }
  },
  {
    route: '/journal',
    category: 'core',
    pageLabel: 'Journal',
    title: 'Journal — The Genuine Love Project',
    description: 'A safe space for reflection and emotional processing through guided journaling.',
    hero: {
      eyebrow: 'Sacred Writing',
      title: 'Your words hold',
      titleHighlight: 'healing power.',
      subtitle: 'Express, process, and release through the art of journaling.',
      primaryCta: { label: 'Start Writing', href: '#new-entry' },
      secondaryCta: { label: 'View Past Entries', href: '#entries' }
    },
    sections: [
      {
        id: 'prompts',
        eyebrow: 'Writing Prompts',
        title: 'Guided reflection',
        subtitle: 'Therapeutic prompts to guide your writing.',
        variant: 'glow',
        cards: [
          { icon: 'Heart', title: 'Self-Compassion', text: 'Write a letter to your younger self.' },
          { icon: 'Leaf', title: 'Gratitude', text: 'Notice the small blessings in your day.' },
          { icon: 'Eye', title: 'Shadow Work', text: 'Explore the parts you keep hidden.' },
          { icon: 'Sun', title: 'Future Self', text: 'Envision who you\'re becoming.' }
        ]
      }
    ]
  },
  {
    route: '/analytics',
    category: 'core',
    pageLabel: 'Analytics',
    title: 'Analytics — The Genuine Love Project',
    description: 'Deep insights into your healing journey with data visualization.',
    hero: {
      eyebrow: 'Your Progress',
      title: 'See how far',
      titleHighlight: 'you\'ve come.',
      subtitle: 'Visual insights into your growth and patterns.',
      primaryCta: { label: 'View Analytics', href: '#analytics' },
      secondaryCta: { label: 'Export Data', href: '#export' }
    }
  },
  {
    route: '/progress',
    category: 'core',
    pageLabel: 'Progress',
    title: 'Your Progress — The Genuine Love Project',
    description: 'Track your healing journey milestones and achievements.',
    hero: {
      eyebrow: 'Celebrate Growth',
      title: 'Every step',
      titleHighlight: 'matters.',
      subtitle: 'Review your milestones and celebrate your progress.',
      primaryCta: { label: 'View Milestones', href: '#milestones' },
      secondaryCta: { label: 'Set New Goals', href: '#goals' }
    }
  },
  {
    route: '/growth-analytics',
    category: 'core',
    pageLabel: 'Growth Analytics',
    title: 'Growth Analytics — The Genuine Love Project',
    description: 'Advanced analytics for tracking personal growth patterns.',
    hero: {
      eyebrow: 'Deep Insights',
      title: 'Understand your',
      titleHighlight: 'growth patterns.',
      subtitle: 'Advanced analytics to illuminate your journey.',
      primaryCta: { label: 'Explore Insights', href: '#insights' },
      secondaryCta: { label: 'Compare Periods', href: '#compare' }
    }
  },
  {
    route: '/guided-journaling',
    category: 'core',
    pageLabel: 'Guided Journaling',
    title: 'Guided Journaling — The Genuine Love Project',
    description: 'Structured journaling exercises for deeper self-reflection.',
    hero: {
      eyebrow: 'Guided Practice',
      title: 'Journaling with',
      titleHighlight: 'intention.',
      subtitle: 'Structured exercises to guide your reflective writing.',
      primaryCta: { label: 'Start Session', href: '#session' },
      secondaryCta: { label: 'Browse Prompts', href: '#prompts' }
    }
  },
  
  // =========================================================================
  // AI & CHAT (3 routes)
  // =========================================================================
  {
    route: '/chat',
    category: 'ai',
    pageLabel: 'AI Chat',
    title: 'AI Companion — The Genuine Love Project',
    description: 'Your 24/7 trauma-informed AI companion for emotional support and guidance.',
    hero: {
      eyebrow: 'Always Here For You',
      title: 'A compassionate ear',
      titleHighlight: 'whenever you need it.',
      subtitle: 'Talk through anything with our trauma-informed AI companion.',
      primaryCta: { label: 'Start Conversation', href: '#chat' },
      secondaryCta: { label: 'Learn About AI Safety', href: '/safety' }
    }
  },
  {
    route: '/crisis',
    category: 'ai',
    pageLabel: 'Crisis Support',
    title: 'Crisis Support — The Genuine Love Project',
    description: 'Immediate support and resources if you\'re in crisis.',
    hero: {
      eyebrow: 'You\'re Not Alone',
      title: 'Immediate',
      titleHighlight: 'support.',
      subtitle: 'If you\'re in crisis, we\'re here to help you find support right now.',
      primaryCta: { label: 'Get Support Now', href: '#support' },
      secondaryCta: { label: 'Crisis Resources', href: '#resources' }
    }
  },
  {
    route: '/companion',
    category: 'ai',
    pageLabel: 'AI Companion',
    title: 'Your AI Companion — The Genuine Love Project',
    description: 'A personalized AI companion for your healing journey.',
    hero: {
      eyebrow: 'Your Personal Guide',
      title: 'Meet your',
      titleHighlight: 'healing companion.',
      subtitle: 'An AI designed to understand and support your unique journey.',
      primaryCta: { label: 'Start Chat', href: '#companion' },
      secondaryCta: { label: 'Customize Companion', href: '#settings' }
    }
  },
  
  // =========================================================================
  // WELLNESS & HEALING TOOLS (24 routes)
  // =========================================================================
  {
    route: '/wellness',
    category: 'landing',
    pageLabel: 'Wellness Home',
    title: 'Wellness — The Genuine Love Project',
    description: 'Your complete wellness toolkit for mind, body, and spirit.',
    hero: {
      eyebrow: 'Holistic Wellness',
      title: 'Nurture every part of',
      titleHighlight: 'yourself.',
      subtitle: 'Tools and practices for complete well-being.',
      primaryCta: { label: 'Explore Tools', href: '#tools' },
      secondaryCta: { label: 'Today\'s Practice', href: '/today' }
    }
  },
  {
    route: '/wellness-hub',
    category: 'landing',
    pageLabel: 'Wellness Hub',
    title: 'Wellness Hub — The Genuine Love Project',
    description: 'Central hub for all wellness tools and practices.',
    hero: {
      eyebrow: 'All-in-One',
      title: 'Your wellness',
      titleHighlight: 'headquarters.',
      subtitle: 'Everything you need for holistic well-being in one place.',
      primaryCta: { label: 'Browse All', href: '#all' },
      secondaryCta: { label: 'Recommended', href: '#recommended' }
    }
  },
  {
    route: '/healing-library',
    category: 'landing',
    pageLabel: 'Healing Library',
    title: 'Healing Library — The Genuine Love Project',
    description: 'A comprehensive library of healing resources and modalities.',
    hero: {
      eyebrow: 'Knowledge Base',
      title: 'Your library of',
      titleHighlight: 'healing wisdom.',
      subtitle: 'Evidence-based resources for your healing journey.',
      primaryCta: { label: 'Browse Library', href: '#library' },
      secondaryCta: { label: 'Recommended', href: '#recommended' }
    }
  },
  {
    route: '/calming-scenes',
    category: 'landing',
    pageLabel: 'Calming Scenes',
    title: 'Calming Scenes — The Genuine Love Project',
    description: 'Immersive visual and audio experiences for relaxation.',
    hero: {
      eyebrow: 'Peaceful Escapes',
      title: 'Find serenity in',
      titleHighlight: 'beautiful places.',
      subtitle: 'Immersive scenes to calm your mind and soothe your soul.',
      primaryCta: { label: 'Explore Scenes', href: '#scenes' },
      secondaryCta: { label: 'Sleep Sounds', href: '#sounds' }
    }
  },
  {
    route: '/breathing',
    category: 'landing',
    pageLabel: 'Breathing Exercises',
    title: 'Breathing Exercises — The Genuine Love Project',
    description: 'Calming breath practices to regulate your nervous system.',
    hero: {
      eyebrow: 'Breathwork',
      title: 'Find calm through',
      titleHighlight: 'conscious breathing.',
      subtitle: 'Simple yet powerful techniques to soothe your nervous system.',
      primaryCta: { label: 'Start Breathing', href: '#exercises' },
      secondaryCta: { label: 'Learn the Science', href: '#science' }
    },
    sections: [
      {
        id: 'techniques',
        eyebrow: 'Techniques',
        title: 'Breathwork practices',
        subtitle: 'Choose the right breath for your current state.',
        variant: 'glow',
        cards: [
          { icon: 'Activity', title: 'Box Breathing', text: '4-4-4-4 pattern for grounding and focus.' },
          { icon: 'Moon', title: '4-7-8 Sleep Breath', text: 'Calming breath for rest and relaxation.' },
          { icon: 'Zap', title: 'Energizing Breath', text: 'Quick practices to boost alertness.' },
          { icon: 'Heart', title: 'Heart Coherence', text: 'Sync breath with heart for emotional balance.' }
        ]
      }
    ]
  },
  {
    route: '/grounding',
    category: 'landing',
    pageLabel: 'Grounding',
    title: 'Grounding Techniques — The Genuine Love Project',
    description: 'Somatic grounding practices to anchor you in the present moment.',
    hero: {
      eyebrow: 'Present Moment',
      title: 'Return to',
      titleHighlight: 'the here and now.',
      subtitle: 'Gentle techniques to bring you back when you feel unmoored.',
      primaryCta: { label: 'Start Grounding', href: '#techniques' },
      secondaryCta: { label: 'Emergency Grounding', href: '#emergency' }
    },
    sections: [
      {
        id: 'methods',
        eyebrow: 'Methods',
        title: 'Grounding practices',
        subtitle: 'Multiple pathways back to presence.',
        variant: 'pattern',
        cards: [
          { icon: 'Eye', title: '5-4-3-2-1 Senses', text: 'Engage all senses to anchor to now.' },
          { icon: 'Leaf', title: 'Body Scan', text: 'Progressive awareness through your body.' },
          { icon: 'MapPin', title: 'Feet on Ground', text: 'Feel the earth supporting you.' },
          { icon: 'Activity', title: 'Cold Water Reset', text: 'Shock the nervous system back to baseline.' }
        ]
      }
    ]
  },
  {
    route: '/affirmations',
    category: 'landing',
    pageLabel: 'Affirmations',
    title: 'Affirmations — The Genuine Love Project',
    description: 'Positive affirmations for healing, self-love, and personal growth.',
    hero: {
      eyebrow: 'Positive Self-Talk',
      title: 'Rewire your mind with',
      titleHighlight: 'loving words.',
      subtitle: 'Affirmations that speak to your healing journey.',
      primaryCta: { label: 'Daily Affirmation', href: '#daily' },
      secondaryCta: { label: 'Create Your Own', href: '#custom' }
    }
  },
  {
    route: '/meditation',
    category: 'landing',
    pageLabel: 'Meditation',
    title: 'Meditation Guide — The Genuine Love Project',
    description: 'Guided meditations for healing, relaxation, and inner peace.',
    hero: {
      eyebrow: 'Inner Stillness',
      title: 'Discover peace',
      titleHighlight: 'within yourself.',
      subtitle: 'Guided meditations for every mood and moment.',
      primaryCta: { label: 'Start Meditating', href: '#meditations' },
      secondaryCta: { label: 'Quick 3-Minute', href: '#quick' }
    }
  },
  {
    route: '/self-care',
    category: 'landing',
    pageLabel: 'Self-Care',
    title: 'Self-Care Toolkit — The Genuine Love Project',
    description: 'Practical self-care tools and practices for daily wellness.',
    hero: {
      eyebrow: 'Nurturing Yourself',
      title: 'Self-care is',
      titleHighlight: 'not selfish.',
      subtitle: 'Practical tools to nurture your body, mind, and spirit.',
      primaryCta: { label: 'Build Your Toolkit', href: '#toolkit' },
      secondaryCta: { label: 'Quick Self-Care', href: '#quick' }
    }
  },
  {
    route: '/emotional-intelligence',
    category: 'landing',
    pageLabel: 'Emotional Intelligence',
    title: 'Emotional Intelligence — The Genuine Love Project',
    description: 'Develop your emotional awareness and regulation skills.',
    hero: {
      eyebrow: 'EQ Development',
      title: 'Master the art of',
      titleHighlight: 'emotional wisdom.',
      subtitle: 'Build skills for understanding and managing emotions.',
      primaryCta: { label: 'Start Learning', href: '#modules' },
      secondaryCta: { label: 'EQ Assessment', href: '#assessment' }
    }
  },
  {
    route: '/sleep-guide',
    category: 'landing',
    pageLabel: 'Sleep Guide',
    title: 'Sleep Guide — The Genuine Love Project',
    description: 'Tools and techniques for better, more restful sleep.',
    hero: {
      eyebrow: 'Restful Nights',
      title: 'Embrace deep,',
      titleHighlight: 'healing sleep.',
      subtitle: 'Evidence-based approaches to improve your sleep quality.',
      primaryCta: { label: 'Sleep Assessment', href: '#assessment' },
      secondaryCta: { label: 'Tonight\'s Routine', href: '#routine' }
    }
  },
  {
    route: '/stress-response',
    category: 'landing',
    pageLabel: 'Stress Response',
    title: 'Stress Response Guide — The Genuine Love Project',
    description: 'Understand and regulate your stress response system.',
    hero: {
      eyebrow: 'Nervous System Education',
      title: 'Understand your',
      titleHighlight: 'stress response.',
      subtitle: 'Learn about fight, flight, freeze, and fawn responses.',
      primaryCta: { label: 'Take Assessment', href: '#assessment' },
      secondaryCta: { label: 'Learn Regulation', href: '#regulation' }
    }
  },
  {
    route: '/inner-child',
    category: 'landing',
    pageLabel: 'Inner Child',
    title: 'Inner Child Work — The Genuine Love Project',
    description: 'Reconnect with and heal your inner child through guided exercises.',
    hero: {
      eyebrow: 'Inner Child Healing',
      title: 'Reconnect with your',
      titleHighlight: 'younger self.',
      subtitle: 'Gentle exercises to heal childhood wounds and reclaim lost joy.',
      primaryCta: { label: 'Meet Your Inner Child', href: '#exercises' },
      secondaryCta: { label: 'Learn About Inner Child', href: '#learn' }
    }
  },
  {
    route: '/body-wellness',
    category: 'landing',
    pageLabel: 'Body Wellness',
    title: 'Body Wellness — The Genuine Love Project',
    description: 'Mind-body connection practices for physical and emotional healing.',
    hero: {
      eyebrow: 'Embodiment',
      title: 'Listen to your',
      titleHighlight: 'body\'s wisdom.',
      subtitle: 'Practices to reconnect with and honor your physical self.',
      primaryCta: { label: 'Body Check-In', href: '#checkin' },
      secondaryCta: { label: 'Movement Practices', href: '#movement' }
    }
  },
  {
    route: '/soul-wellness',
    category: 'landing',
    pageLabel: 'Soul Wellness',
    title: 'Soul Wellness — The Genuine Love Project',
    description: 'Spiritual practices for meaning, purpose, and transcendence.',
    hero: {
      eyebrow: 'Spiritual Care',
      title: 'Nourish your',
      titleHighlight: 'spirit.',
      subtitle: 'Practices for meaning, purpose, and connection to something greater.',
      primaryCta: { label: 'Explore Practices', href: '#practices' },
      secondaryCta: { label: 'Daily Reflection', href: '#reflection' }
    }
  },
  {
    route: '/healing-journeys',
    category: 'landing',
    pageLabel: 'Healing Journeys',
    title: 'Healing Journeys — The Genuine Love Project',
    description: 'Structured healing pathways for specific challenges.',
    hero: {
      eyebrow: 'Guided Pathways',
      title: 'Structured paths to',
      titleHighlight: 'lasting healing.',
      subtitle: 'Multi-week journeys designed for specific healing goals.',
      primaryCta: { label: 'Choose Your Path', href: '#paths' },
      secondaryCta: { label: 'Continue Journey', href: '#continue' }
    }
  },
  {
    route: '/behavior-change',
    category: 'landing',
    pageLabel: 'Behavior Change',
    title: 'Behavior Change — The Genuine Love Project',
    description: 'Evidence-based tools for creating lasting positive changes.',
    hero: {
      eyebrow: 'Lasting Change',
      title: 'Build habits that',
      titleHighlight: 'serve you.',
      subtitle: 'Science-backed approaches to behavioral transformation.',
      primaryCta: { label: 'Start Tracking', href: '#track' },
      secondaryCta: { label: 'Habit Library', href: '#library' }
    }
  },
  {
    route: '/daily-routines',
    category: 'landing',
    pageLabel: 'Daily Routines',
    title: 'Daily Routines — The Genuine Love Project',
    description: 'Create nurturing daily routines for consistent well-being.',
    hero: {
      eyebrow: 'Structure for Peace',
      title: 'Routines that',
      titleHighlight: 'nurture you.',
      subtitle: 'Build a daily structure that supports your healing.',
      primaryCta: { label: 'Build Routine', href: '#build' },
      secondaryCta: { label: 'Templates', href: '#templates' }
    }
  },
  {
    route: '/cognitive-tools',
    category: 'landing',
    pageLabel: 'Cognitive Tools',
    title: 'Cognitive Tools — The Genuine Love Project',
    description: 'Tools for reframing thoughts and managing cognitive patterns.',
    hero: {
      eyebrow: 'Mind Tools',
      title: 'Reshape your',
      titleHighlight: 'thought patterns.',
      subtitle: 'Evidence-based cognitive techniques for mental wellness.',
      primaryCta: { label: 'Explore Tools', href: '#tools' },
      secondaryCta: { label: 'Thought Record', href: '#record' }
    }
  },
  {
    route: '/mirror',
    category: 'landing',
    pageLabel: 'Mirror Work',
    title: 'Mirror Work — The Genuine Love Project',
    description: 'Self-love practices using mirror work techniques.',
    hero: {
      eyebrow: 'Self-Reflection',
      title: 'See yourself with',
      titleHighlight: 'loving eyes.',
      subtitle: 'Powerful self-love practices using the mirror.',
      primaryCta: { label: 'Start Practice', href: '#practice' },
      secondaryCta: { label: 'Learn More', href: '#learn' }
    }
  },
  {
    route: '/ritual',
    category: 'landing',
    pageLabel: 'Sacred Rituals',
    title: 'Sacred Rituals — The Genuine Love Project',
    description: 'Create meaningful rituals for healing and transition.',
    hero: {
      eyebrow: 'Intentional Practice',
      title: 'Create rituals that',
      titleHighlight: 'hold meaning.',
      subtitle: 'Mark transitions and honor your journey with sacred practices.',
      primaryCta: { label: 'Explore Rituals', href: '#rituals' },
      secondaryCta: { label: 'Create Your Own', href: '#create' }
    }
  },
  {
    route: '/wisdom',
    category: 'landing',
    pageLabel: 'Wisdom',
    title: 'Wisdom — The Genuine Love Project',
    description: 'Curated wisdom for daily inspiration and reflection.',
    hero: {
      eyebrow: 'Daily Wisdom',
      title: 'Ancient wisdom for',
      titleHighlight: 'modern healing.',
      subtitle: 'Timeless insights to illuminate your path.',
      primaryCta: { label: 'Today\'s Wisdom', href: '#today' },
      secondaryCta: { label: 'Browse Collection', href: '#collection' }
    }
  },
  {
    route: '/wisdom-practices',
    category: 'landing',
    pageLabel: 'Wisdom Practices',
    title: 'Wisdom Practices — The Genuine Love Project',
    description: 'Practical applications of timeless wisdom traditions.',
    hero: {
      eyebrow: 'Applied Wisdom',
      title: 'Practice the',
      titleHighlight: 'ancient arts.',
      subtitle: 'Turn wisdom into daily practice.',
      primaryCta: { label: 'Start Practice', href: '#practice' },
      secondaryCta: { label: 'Browse Traditions', href: '#traditions' }
    }
  },
  {
    route: '/wisdom-synthesis',
    category: 'landing',
    pageLabel: 'Wisdom Synthesis',
    title: 'Wisdom Synthesis — The Genuine Love Project',
    description: 'Integrate wisdom from multiple traditions into your practice.',
    hero: {
      eyebrow: 'Integration',
      title: 'Synthesize wisdom from',
      titleHighlight: 'many sources.',
      subtitle: 'Draw from the best of all traditions.',
      primaryCta: { label: 'Explore Synthesis', href: '#synthesis' },
      secondaryCta: { label: 'Create Your Path', href: '#create' }
    }
  },
  
  // =========================================================================
  // ADVANCED & MASTERY (14 routes)
  // =========================================================================
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
  
  // =========================================================================
  // CONTENT & LEARNING (13 routes)
  // =========================================================================
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
      primaryCta: { label: 'Read Latest', href: '#latest' },
      secondaryCta: { label: 'Browse Topics', href: '#topics' }
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
    description: 'Create and manage your personal content.',
    hero: {
      eyebrow: 'Create',
      title: 'Your creative',
      titleHighlight: 'studio.',
      subtitle: 'Tools for creating and organizing your personal content.',
      primaryCta: { label: 'Open Studio', href: '#studio' },
      secondaryCta: { label: 'My Content', href: '#my-content' }
    }
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
  
  // =========================================================================
  // COMMUNITY & SOCIAL (3 routes)
  // =========================================================================
  {
    route: '/social',
    category: 'community',
    pageLabel: 'Social',
    title: 'Social — The Genuine Love Project',
    description: 'Connect with your healing community.',
    hero: {
      eyebrow: 'Connection',
      title: 'You\'re not',
      titleHighlight: 'alone.',
      subtitle: 'Connect with others walking similar paths.',
      primaryCta: { label: 'Join Community', href: '#community' },
      secondaryCta: { label: 'Find Groups', href: '#groups' }
    }
  },
  {
    route: '/community',
    category: 'community',
    pageLabel: 'Community',
    title: 'Community — The Genuine Love Project',
    description: 'A safe, moderated space for shared healing.',
    hero: {
      eyebrow: 'Together',
      title: 'Healing',
      titleHighlight: 'together.',
      subtitle: 'A safe, moderated community of healing hearts.',
      primaryCta: { label: 'Enter Community', href: '#community' },
      secondaryCta: { label: 'Guidelines', href: '/ethics' }
    }
  },
  {
    route: '/community/discussion/:id',
    category: 'community',
    pageLabel: 'Discussion',
    isDynamic: true,
    title: 'Discussion — The Genuine Love Project',
    description: 'Join this community discussion.',
    hero: {
      eyebrow: 'Discussion',
      title: 'Join the',
      titleHighlight: 'conversation.',
      subtitle: 'Share your thoughts in a safe space.',
      primaryCta: { label: 'Add Reply', href: '#reply' },
      secondaryCta: { label: 'Back to Community', href: '/community' }
    }
  },
  
  // =========================================================================
  // SUPPORT & RESOURCES (5 routes)
  // =========================================================================
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
      primaryCta: { label: 'Browse FAQ', href: '#faq' },
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
  
  // =========================================================================
  // LEGAL & POLICY (5 routes)
  // =========================================================================
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
  
  // =========================================================================
  // ACCOUNT & SETTINGS (6 routes)
  // =========================================================================
  {
    route: '/settings',
    category: 'account',
    pageLabel: 'Settings',
    title: 'Settings — The Genuine Love Project',
    description: 'Customize your healing sanctuary.',
    hero: {
      eyebrow: 'Personalization',
      title: 'Your',
      titleHighlight: 'settings.',
      subtitle: 'Customize your experience.',
      primaryCta: { label: 'Edit Settings', href: '#settings' },
      secondaryCta: { label: 'Account', href: '/account/profile' }
    }
  },
  {
    route: '/premium',
    category: 'account',
    pageLabel: 'Premium',
    title: 'Premium — The Genuine Love Project',
    description: 'Unlock the full power of your healing journey.',
    hero: {
      eyebrow: 'Upgrade',
      title: 'Go',
      titleHighlight: 'Premium.',
      subtitle: 'Unlock all features and accelerate your healing.',
      primaryCta: { label: 'Upgrade Now', href: '#upgrade' },
      secondaryCta: { label: 'Compare Plans', href: '/pricing' }
    }
  },
  {
    route: '/upgrade',
    category: 'account',
    pageLabel: 'Upgrade',
    title: 'Upgrade — The Genuine Love Project',
    description: 'Upgrade your account for full access.',
    hero: {
      eyebrow: 'Full Access',
      title: 'Upgrade your',
      titleHighlight: 'journey.',
      subtitle: 'Get access to all premium features.',
      primaryCta: { label: 'Choose Plan', href: '#plans' },
      secondaryCta: { label: 'Learn More', href: '/pricing' }
    }
  },
  {
    route: '/account/profile',
    category: 'account',
    pageLabel: 'Profile',
    title: 'Profile — The Genuine Love Project',
    description: 'Manage your profile information.',
    hero: {
      eyebrow: 'Your Profile',
      title: 'Profile',
      titleHighlight: 'settings.',
      subtitle: 'Manage your personal information.',
      primaryCta: { label: 'Edit Profile', href: '#profile' },
      secondaryCta: { label: 'View Public Profile', href: '#public' }
    }
  },
  {
    route: '/account/billing',
    category: 'account',
    pageLabel: 'Billing',
    title: 'Billing — The Genuine Love Project',
    description: 'Manage your subscription and billing.',
    hero: {
      eyebrow: 'Billing',
      title: 'Billing &',
      titleHighlight: 'subscription.',
      subtitle: 'Manage your payment and subscription details.',
      primaryCta: { label: 'Manage Billing', href: '#billing' },
      secondaryCta: { label: 'View History', href: '#history' }
    }
  },
  {
    route: '/account/settings',
    category: 'account',
    pageLabel: 'Account Settings',
    title: 'Account Settings — The Genuine Love Project',
    description: 'Manage your account settings and preferences.',
    hero: {
      eyebrow: 'Account',
      title: 'Account',
      titleHighlight: 'settings.',
      subtitle: 'Security, notifications, and account preferences.',
      primaryCta: { label: 'Edit Settings', href: '#settings' },
      secondaryCta: { label: 'Security', href: '#security' }
    }
  },
  
  // =========================================================================
  // ADMIN (3 routes)
  // =========================================================================
  {
    route: '/admin',
    category: 'admin',
    pageLabel: 'Admin Dashboard',
    title: 'Admin — The Genuine Love Project',
    description: 'Platform administration dashboard.',
    hero: {
      eyebrow: 'Administration',
      title: 'Admin',
      titleHighlight: 'Dashboard.',
      subtitle: 'Platform management and oversight.',
      primaryCta: { label: 'View Stats', href: '#stats' },
      secondaryCta: { label: 'User Management', href: '#users' }
    }
  },
  {
    route: '/content-admin',
    category: 'admin',
    pageLabel: 'Content Admin',
    title: 'Content Admin — The Genuine Love Project',
    description: 'Manage platform content.',
    hero: {
      eyebrow: 'Content Management',
      title: 'Content',
      titleHighlight: 'Admin.',
      subtitle: 'Manage and moderate platform content.',
      primaryCta: { label: 'Manage Content', href: '#content' },
      secondaryCta: { label: 'Moderation Queue', href: '#queue' }
    }
  },
  {
    route: '/control',
    category: 'admin',
    pageLabel: 'Control Panel',
    title: 'Control Panel — The Genuine Love Project',
    description: 'Platform control panel.',
    hero: {
      eyebrow: 'Control',
      title: 'Control',
      titleHighlight: 'Panel.',
      subtitle: 'System controls and configuration.',
      primaryCta: { label: 'View Controls', href: '#controls' },
      secondaryCta: { label: 'System Status', href: '/health' }
    }
  },
  
  // =========================================================================
  // SYSTEM & UTILITY (7 routes)
  // =========================================================================
  {
    route: '/health',
    category: 'system',
    pageLabel: 'Health Check',
    title: 'System Health — The Genuine Love Project',
    description: 'Platform health and status.',
    hero: {
      eyebrow: 'Status',
      title: 'System',
      titleHighlight: 'Health.',
      subtitle: 'Current platform status and health metrics.',
      primaryCta: { label: 'View Status', href: '#status' },
      secondaryCta: { label: 'Report Issue', href: '/support' }
    }
  },
  {
    route: '/publishing',
    category: 'system',
    pageLabel: 'Publishing',
    title: 'Publishing — The Genuine Love Project',
    description: 'Content publishing tools.',
    hero: {
      eyebrow: 'Publish',
      title: 'Publishing',
      titleHighlight: 'Tools.',
      subtitle: 'Tools for publishing and managing content.',
      primaryCta: { label: 'Start Publishing', href: '#publish' },
      secondaryCta: { label: 'Drafts', href: '#drafts' }
    }
  },
  {
    route: '/design-system',
    category: 'system',
    pageLabel: 'Design System',
    title: 'Design System — The Genuine Love Project',
    description: 'Platform design system and component library.',
    hero: {
      eyebrow: 'Design',
      title: 'Design',
      titleHighlight: 'System.',
      subtitle: 'Our component library and design guidelines.',
      primaryCta: { label: 'Browse Components', href: '#components' },
      secondaryCta: { label: 'Guidelines', href: '#guidelines' }
    }
  },
  {
    route: '/wireframes',
    category: 'system',
    pageLabel: 'Wireframes',
    title: 'Wireframes — The Genuine Love Project',
    description: 'Platform wireframes and prototypes.',
    hero: {
      eyebrow: 'Prototypes',
      title: 'Wireframes.',
      titleHighlight: '',
      subtitle: 'View platform wireframes and design prototypes.',
      primaryCta: { label: 'View Wireframes', href: '#wireframes' },
      secondaryCta: { label: 'Design System', href: '/design-system' }
    }
  },
  {
    route: '/design-dashboard',
    category: 'system',
    pageLabel: 'Design Dashboard',
    title: 'Design Dashboard — The Genuine Love Project',
    description: 'Design metrics and overview.',
    hero: {
      eyebrow: 'Design Metrics',
      title: 'Design',
      titleHighlight: 'Dashboard.',
      subtitle: 'Overview of design system usage and metrics.',
      primaryCta: { label: 'View Metrics', href: '#metrics' },
      secondaryCta: { label: 'Component Stats', href: '#stats' }
    }
  },
  {
    route: '/safety',
    category: 'system',
    pageLabel: 'Safety',
    title: 'Safety — The Genuine Love Project',
    description: 'Platform safety information and resources.',
    hero: {
      eyebrow: 'Your Safety',
      title: 'Safety',
      titleHighlight: 'First.',
      subtitle: 'Information about how we keep you safe.',
      primaryCta: { label: 'Learn More', href: '#safety' },
      secondaryCta: { label: 'Crisis Resources', href: '/crisis' }
    }
  },
  
  // =========================================================================
  // ADDITIONAL WELLNESS ROUTES (5 routes to reach 119)
  // =========================================================================
  {
    route: '/wellness/sleep',
    category: 'wellness',
    pageLabel: 'Sleep Wellness',
    title: 'Sleep Wellness — The Genuine Love Project',
    description: 'Tools and resources for better sleep and rest.',
    hero: {
      eyebrow: 'Rest & Recovery',
      title: 'Better',
      titleHighlight: 'Sleep.',
      subtitle: 'Gentle practices for restful, healing sleep.',
      primaryCta: { label: 'Start Sleep Journey', href: '#sleep' },
      secondaryCta: { label: 'Evening Routine', href: '#routine' }
    }
  },
  {
    route: '/wellness/nutrition',
    category: 'wellness',
    pageLabel: 'Nutrition & Nourishment',
    title: 'Nutrition — The Genuine Love Project',
    description: 'Mindful eating and nutritional wellness.',
    hero: {
      eyebrow: 'Nourish',
      title: 'Mindful',
      titleHighlight: 'Eating.',
      subtitle: 'Develop a healthy relationship with food and nourishment.',
      primaryCta: { label: 'Explore Nutrition', href: '#nutrition' },
      secondaryCta: { label: 'Meal Ideas', href: '#meals' }
    }
  },
  {
    route: '/wellness/movement',
    category: 'wellness',
    pageLabel: 'Gentle Movement',
    title: 'Movement — The Genuine Love Project',
    description: 'Gentle movement practices for body and mind.',
    hero: {
      eyebrow: 'Move Gently',
      title: 'Healing',
      titleHighlight: 'Movement.',
      subtitle: 'Gentle exercises that honor your body\'s needs.',
      primaryCta: { label: 'Start Moving', href: '#movement' },
      secondaryCta: { label: 'Yoga Flows', href: '#yoga' }
    }
  },
  {
    route: '/wellness/nature',
    category: 'wellness',
    pageLabel: 'Nature Connection',
    title: 'Nature Connection — The Genuine Love Project',
    description: 'Connect with nature for healing and grounding.',
    hero: {
      eyebrow: 'Earth Connection',
      title: 'Nature',
      titleHighlight: 'Healing.',
      subtitle: 'Find peace and grounding in the natural world.',
      primaryCta: { label: 'Connect with Nature', href: '#nature' },
      secondaryCta: { label: 'Grounding Practices', href: '#grounding' }
    }
  },
  {
    route: '/wellness/creativity',
    category: 'wellness',
    pageLabel: 'Creative Expression',
    title: 'Creative Expression — The Genuine Love Project',
    description: 'Use creativity as a path to healing.',
    hero: {
      eyebrow: 'Express',
      title: 'Creative',
      titleHighlight: 'Healing.',
      subtitle: 'Explore art, music, and writing as healing tools.',
      primaryCta: { label: 'Start Creating', href: '#create' },
      secondaryCta: { label: 'Art Therapy', href: '#art' }
    }
  },
  
  // =========================================================================
  // ADDITIONAL AI ROUTES (3 routes)
  // =========================================================================
  {
    route: '/ai/insights',
    category: 'ai',
    pageLabel: 'AI Insights',
    title: 'AI Insights — The Genuine Love Project',
    description: 'AI-generated insights about your wellness journey.',
    hero: {
      eyebrow: 'Your Insights',
      title: 'AI',
      titleHighlight: 'Insights.',
      subtitle: 'Personalized insights from your wellness data.',
      primaryCta: { label: 'View Insights', href: '#insights' },
      secondaryCta: { label: 'Recommendations', href: '#recommendations' }
    }
  },
  {
    route: '/ai/coach',
    category: 'ai',
    pageLabel: 'AI Wellness Coach',
    title: 'AI Coach — The Genuine Love Project',
    description: 'Your personal AI wellness coaching companion.',
    hero: {
      eyebrow: 'Personalized Coaching',
      title: 'AI',
      titleHighlight: 'Coach.',
      subtitle: 'Compassionate AI guidance for your healing journey.',
      primaryCta: { label: 'Meet Your Coach', href: '#coach' },
      secondaryCta: { label: 'Coaching Plans', href: '#plans' }
    }
  },
  {
    route: '/ai/meditation',
    category: 'ai',
    pageLabel: 'AI Meditation',
    title: 'AI Meditation — The Genuine Love Project',
    description: 'AI-guided meditation sessions.',
    hero: {
      eyebrow: 'Guided Peace',
      title: 'AI',
      titleHighlight: 'Meditation.',
      subtitle: 'Personalized meditation sessions created just for you.',
      primaryCta: { label: 'Start Meditation', href: '#meditate' },
      secondaryCta: { label: 'Session Library', href: '#library' }
    }
  },
  
  // =========================================================================
  // ADDITIONAL COMMUNITY ROUTES (4 routes)
  // =========================================================================
  {
    route: '/community/events',
    category: 'community',
    pageLabel: 'Community Events',
    title: 'Events — The Genuine Love Project',
    description: 'Community events and gatherings.',
    hero: {
      eyebrow: 'Connect',
      title: 'Community',
      titleHighlight: 'Events.',
      subtitle: 'Join healing circles, workshops, and community gatherings.',
      primaryCta: { label: 'Browse Events', href: '#events' },
      secondaryCta: { label: 'Host Event', href: '#host' }
    }
  },
  {
    route: '/community/stories',
    category: 'community',
    pageLabel: 'Healing Stories',
    title: 'Stories — The Genuine Love Project',
    description: 'Read and share healing journeys.',
    hero: {
      eyebrow: 'Shared Journeys',
      title: 'Healing',
      titleHighlight: 'Stories.',
      subtitle: 'Read inspiring stories from fellow travelers.',
      primaryCta: { label: 'Read Stories', href: '#stories' },
      secondaryCta: { label: 'Share Yours', href: '#share' }
    }
  },
  {
    route: '/community/mentors',
    category: 'community',
    pageLabel: 'Mentorship',
    title: 'Mentorship — The Genuine Love Project',
    description: 'Connect with experienced mentors.',
    hero: {
      eyebrow: 'Guidance',
      title: 'Find a',
      titleHighlight: 'Mentor.',
      subtitle: 'Connect with those who\'ve walked the path before.',
      primaryCta: { label: 'Find Mentor', href: '#mentors' },
      secondaryCta: { label: 'Become Mentor', href: '#become' }
    }
  },
  {
    route: '/community/challenges',
    category: 'community',
    pageLabel: 'Wellness Challenges',
    title: 'Challenges — The Genuine Love Project',
    description: 'Join community wellness challenges.',
    hero: {
      eyebrow: 'Grow Together',
      title: 'Wellness',
      titleHighlight: 'Challenges.',
      subtitle: 'Join supportive challenges with the community.',
      primaryCta: { label: 'Join Challenge', href: '#challenges' },
      secondaryCta: { label: 'Create Challenge', href: '#create' }
    }
  },
  
  // =========================================================================
  // ADDITIONAL SUPPORT ROUTES (3 routes)
  // =========================================================================
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
  
  // =========================================================================
  // 404 AND WILDCARD FALLBACK
  // =========================================================================
  {
    route: '/not-found',
    category: 'system',
    pageLabel: '404 Not Found',
    title: 'Page Not Found — The Genuine Love Project',
    description: 'The page you\'re looking for couldn\'t be found.',
    hero: {
      eyebrow: 'Oops',
      title: 'Page not',
      titleHighlight: 'found.',
      subtitle: 'The page you\'re looking for doesn\'t exist or has been moved.',
      primaryCta: { label: 'Go Home', href: '/' },
      secondaryCta: { label: 'Contact Support', href: '/support' }
    }
  }
];

// ============================================================================
// PROCESS ROUTES - Apply presets and create final routes array
// ============================================================================

export const routes = rawRoutes.map(route => {
  if (route.aliasOf) {
    return route;
  }
  return applyPreset(route);
});

// ============================================================================
// ROUTE UTILITIES
// ============================================================================

const aliasRoutes = routes.filter(r => r.aliasOf);
const dynamicRoutes = routes.filter(r => r.isDynamic);
const staticRoutes = routes.filter(r => !r.aliasOf && !r.isDynamic);

function matchDynamicRoute(path) {
  for (const route of dynamicRoutes) {
    const pattern = route.route.replace(/:[\w]+/g, '([^/]+)');
    const regex = new RegExp(`^${pattern}$`);
    if (regex.test(path)) {
      return route;
    }
  }
  return null;
}

export function matchDynamic(pattern, path) {
  const regexPattern = pattern.replace(/:[\w]+/g, '([^/]+)');
  const regex = new RegExp(`^${regexPattern}$`);
  const match = path.match(regex);
  if (match) {
    const paramNames = [...pattern.matchAll(/:(\w+)/g)].map(m => m[1]);
    const params = {};
    paramNames.forEach((name, i) => {
      params[name] = match[i + 1];
    });
    return { matched: true, params };
  }
  return null;
}

export function getRouteConfig(path) {
  const directMatch = staticRoutes.find(r => r.route === path);
  if (directMatch) return directMatch;
  
  const aliasMatch = aliasRoutes.find(r => r.route === path);
  if (aliasMatch) {
    const target = staticRoutes.find(r => r.route === aliasMatch.aliasOf);
    return target ? { ...target, route: path, aliasOf: aliasMatch.aliasOf } : null;
  }
  
  const dynamicMatch = matchDynamicRoute(path);
  if (dynamicMatch) return dynamicMatch;
  
  const notFound = routes.find(r => r.route === '/not-found' || r.route === '/404');
  return notFound ? { ...notFound, is404: true } : { route: path, title: 'Page Not Found', is404: true };
}

export function getRoutesByCategory(category) {
  return routes.filter(r => r.category === category && !r.aliasOf);
}

export function getAllCategories() {
  return [...new Set(routes.filter(r => !r.aliasOf).map(r => r.category))];
}

export function listRoutesByCategory() {
  const grouped = {};
  for (const route of routes) {
    if (route.aliasOf) continue;
    const category = routeCategories[route.category] || route.category;
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push({
      route: route.route,
      label: route.pageLabel,
      protected: route.protected,
      isDynamic: route.isDynamic
    });
  }
  return grouped;
}

export function isProtectedRoute(path) {
  const config = getRouteConfig(path);
  return config?.protected ?? false;
}

export function isAdminRoute(path) {
  const config = getRouteConfig(path);
  return config?.adminOnly ?? false;
}

export default routes;
