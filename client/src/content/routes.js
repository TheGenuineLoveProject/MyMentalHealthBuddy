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
    contentLevels: {
      beginner: {
        title: 'A Safe Place to Start',
        subtitle: 'This is a quiet, kind space just for you.',
        bulletPoints: [
          'You can take breaks whenever you need—no pressure',
          'Everything here moves at your speed, not ours',
          'It\'s okay if you don\'t know where to begin',
          'Your one next step: Just look around and see what feels right'
        ]
      },
      intermediate: {
        title: 'Tools That Meet You Where You Are',
        subtitle: 'Practical exercises for when you\'re ready to explore a bit more.',
        bulletPoints: [
          'Guided journaling helps you process what you\'re carrying',
          'Breathing exercises can shift how you feel in moments',
          'AI companion conversations available whenever you need support',
          'Your one next step: Try one tool today—just one'
        ]
      },
      advanced: {
        title: 'Evidence-Based Healing Modalities',
        subtitle: 'Deeper exploration grounded in trauma-informed research.',
        bulletPoints: [
          'Inner child work draws from attachment theory and IFS (Internal Family Systems)',
          'Nervous system practices incorporate polyvagal theory and somatic experiencing',
          'All approaches respect your window of tolerance and pace of healing',
          'Your one next step: Explore a modality that resonates with your current needs'
        ]
      }
    },
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
    contentLevels: {
      beginner: {
        title: 'You\'re Welcome Here',
        subtitle: 'This is a safe, quiet place where you can just be.',
        bulletPoints: [
          'There\'s nothing you have to do or prove here',
          'Take your time looking around—no rush',
          'You can leave and come back anytime',
          'Your one next step: Just breathe and notice how you feel'
        ]
      },
      intermediate: {
        title: 'Where Genuine Love Began',
        subtitle: 'The original vision: simple tools for real healing.',
        bulletPoints: [
          'Self-compassion practices to treat yourself with kindness',
          'Grounding techniques for when you feel overwhelmed',
          'Daily rituals to anchor your mornings and evenings',
          'Your one next step: Try one grounding practice today'
        ]
      },
      advanced: {
        title: 'The Philosophy Behind Our Approach',
        subtitle: 'Understanding the values that shape everything here.',
        bulletPoints: [
          'Rooted in self-compassion research by Kristin Neff and Christopher Germer',
          'Draws from contemplative traditions and evidence-based psychology',
          'Emphasizes relational healing—with yourself, others, and the present moment',
          'Your one next step: Reflect on what self-compassion means for you right now'
        ]
      }
    },
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
    contentLevels: {
      beginner: {
        title: 'Healing Can Start Small',
        subtitle: 'You don\'t need to know what you need. That\'s okay.',
        bulletPoints: [
          'Healing isn\'t about fixing—it\'s about listening to yourself',
          'Even tiny steps count, like taking a deep breath right now',
          'You can go slow and still be making progress',
          'Your one next step: Notice one feeling you\'re having right now'
        ]
      },
      intermediate: {
        title: 'Gentle Tools for Your Journey',
        subtitle: 'Practical exercises you can try when you\'re ready.',
        bulletPoints: [
          'Breathing exercises calm your nervous system in minutes',
          'Grounding techniques help when you feel disconnected',
          'Journaling prompts help you process what you\'re carrying',
          'Your one next step: Pick one tool and give it three minutes'
        ]
      },
      advanced: {
        title: 'Evidence-Based Healing Modalities',
        subtitle: 'Deeper understanding of the approaches available here.',
        bulletPoints: [
          'Somatic practices based on Peter Levine\'s Somatic Experiencing',
          'Nervous system regulation grounded in Stephen Porges\' polyvagal theory',
          'Inner child work informed by attachment theory and IFS',
          'Your one next step: Explore one modality that aligns with your current needs'
        ]
      }
    },
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
    description: 'Simple, transparent pricing. Start free and stay free as long as you need. Upgrade only when it feels right.',
    contentLevels: {
      beginner: {
        title: 'It\'s Free to Start',
        subtitle: 'No tricks, no pressure. Really.',
        bulletPoints: [
          'You can use our core tools forever without paying',
          'No credit card needed to sign up',
          'If you ever upgrade, you can cancel anytime',
          'Your one next step: Create your free account when you\'re ready'
        ]
      },
      intermediate: {
        title: 'What\'s Included at Each Level',
        subtitle: 'A clear breakdown so you can decide what\'s right for you.',
        bulletPoints: [
          'Free: Journaling, mood tracking, breathing exercises, grounding tools',
          'Premium: Unlimited AI companion, deeper healing journeys, advanced analytics',
          'Lifetime option: One-time payment for forever access',
          'Your one next step: Start with free and see how it feels'
        ]
      },
      advanced: {
        title: 'Our Pricing Philosophy',
        subtitle: 'Transparent, trauma-informed, and designed for your nervous system.',
        bulletPoints: [
          'No urgency tactics, countdown timers, or manufactured scarcity',
          'If cost is a barrier, reach out—we\'ll find a way',
          'Data export available even if you leave, because your data is yours',
          'Your one next step: Review the tiers and reach out if you have questions'
        ]
      }
    },
    hero: {
      eyebrow: 'Simple and clear',
      title: 'Start free.',
      titleHighlight: 'Stay as long as you need.',
      subtitle: 'Our free tools are genuinely free—no trials, no hidden fees. If you ever want more, options are here. No pressure either way.',
      primaryCta: { label: 'Create free account', href: '/register' },
      secondaryCta: { label: 'Explore what is included', href: '#how-it-works' }
    },
    modules: [
      { icon: 'Heart', title: 'Begin with free tools', description: 'Journaling, mood tracking, and grounding—yours to keep.' },
      { icon: 'Star', title: 'Expand when ready', description: 'Unlock unlimited AI companion and deeper healing journeys.' },
      { icon: 'Sparkles', title: 'One-time option available', description: 'Lifetime access with a single payment, if that feels better.' }
    ],
    sections: [
      {
        id: 'safety',
        eyebrow: 'What to Expect',
        title: 'No surprises, no pressure',
        subtitle: 'We want you to feel safe here—including around money.',
        variant: 'plain',
        bullets: [
          'Free means free. No credit card required, no trial countdown.',
          'Cancel anytime with one click. No hoops, no guilt.',
          'Your data stays yours. Export everything, even if you leave.',
          'If cost is a barrier, reach out. We will find a way.'
        ]
      },
      {
        id: 'how-it-works',
        eyebrow: 'How It Works',
        title: 'Three simple steps',
        subtitle: 'Start where you are. Move at your own pace.',
        variant: 'glow',
        cards: [
          { icon: 'User', title: 'Create your account', text: 'Sign up in under a minute. Free access starts immediately.' },
          { icon: 'Compass', title: 'Explore the tools', text: 'Use journaling, breathing exercises, and grounding practices.' },
          { icon: 'Heart', title: 'Upgrade if you wish', text: 'Premium unlocks more when you are ready. No rush.' }
        ]
      },
      {
        id: 'trust',
        eyebrow: 'Our Approach',
        title: 'Built on evidence, not hype',
        subtitle: 'We draw from trauma-informed research and respect your boundaries.',
        variant: 'pattern',
        bullets: [
          'Tools grounded in somatic, cognitive, and compassion-based practices.',
          'No urgency tactics. No countdown timers. No guilt.',
          'Designed by people who understand healing takes time.',
          'Your nervous system deserves a calm experience—even on a pricing page.'
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
    contentLevels: {
      beginner: {
        title: 'A Calm Place for You',
        subtitle: 'If you\'re looking for something gentler, you found it.',
        bulletPoints: [
          'No toxic positivity—just honest, kind support',
          'Tools designed to feel safe, not overwhelming',
          'You can use this space however works for you',
          'Your one next step: Scroll down and see what feels interesting'
        ]
      },
      intermediate: {
        title: 'What Makes This Different',
        subtitle: 'Practical tools that respect your pace and boundaries.',
        bulletPoints: [
          'AI companion available 24/7 for trauma-informed conversation',
          'Guided journaling with prompts that help you process',
          'State tracking to notice patterns over time',
          'Your one next step: Try the AI companion or a journaling prompt'
        ]
      },
      advanced: {
        title: 'Built with Your Nervous System in Mind',
        subtitle: 'Every design decision is intentional and research-backed.',
        bulletPoints: [
          'Colors, pacing, and tone designed for nervous system regulation',
          'No streak guilt or gamification that creates anxiety',
          'Privacy-first architecture—your data stays yours',
          'Your one next step: Explore the modalities and see what resonates'
        ]
      }
    },
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
    contentLevels: {
      beginner: {
        title: 'Welcome Back',
        subtitle: 'Your space is ready for you.',
        bulletPoints: [
          'Just enter your email and password',
          'If you forgot your password, we can help with that',
          'Take your time—there\'s no rush',
          'Your one next step: Enter your email to sign in'
        ]
      },
      intermediate: {
        title: 'Continue Where You Left Off',
        subtitle: 'Your progress and insights are waiting.',
        bulletPoints: [
          'Your journal entries and reflections are safe',
          'Pick up your healing journey right where you left it',
          'All your tools and settings are preserved',
          'Your one next step: Sign in to access your dashboard'
        ]
      },
      advanced: {
        title: 'Secure Access to Your Sanctuary',
        subtitle: 'Privacy-first authentication for your peace of mind.',
        bulletPoints: [
          'End-to-end encrypted sessions protect your data',
          'OAuth options available for passwordless convenience',
          'Session management lets you control access across devices',
          'Your one next step: Choose your preferred sign-in method'
        ]
      }
    },
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
    contentLevels: {
      beginner: {
        title: 'Almost There',
        subtitle: 'We\'re finishing up your sign in.',
        bulletPoints: [
          'This only takes a moment',
          'You\'ll be in your space soon',
          'If it takes too long, you can try again',
          'Your one next step: Wait just a moment while we complete sign in'
        ]
      },
      intermediate: {
        title: 'Verifying Your Identity',
        subtitle: 'Securely completing your authentication.',
        bulletPoints: [
          'We\'re confirming your login with our secure system',
          'Your session is being created safely',
          'You\'ll be redirected to your dashboard shortly',
          'Your one next step: Wait for automatic redirect to your dashboard'
        ]
      },
      advanced: {
        title: 'OAuth Callback Processing',
        subtitle: 'Completing secure token exchange.',
        bulletPoints: [
          'Exchanging authorization code for access tokens',
          'Validating session and creating secure cookies',
          'Syncing your profile with the authentication provider',
          'Your one next step: The system will redirect you automatically'
        ]
      }
    },
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
    contentLevels: {
      beginner: {
        title: 'Create Your Free Account',
        subtitle: 'It only takes a minute.',
        bulletPoints: [
          'You just need an email and a password',
          'It\'s completely free to start',
          'You can explore at your own pace',
          'Your one next step: Enter your email to begin'
        ]
      },
      intermediate: {
        title: 'Start Your Healing Journey',
        subtitle: 'A private sanctuary designed just for you.',
        bulletPoints: [
          'Immediate access to journaling, breathing exercises, and grounding tools',
          'Your own AI companion available whenever you need to talk',
          'Track your progress and notice patterns over time',
          'Your one next step: Create your account to access all free tools'
        ]
      },
      advanced: {
        title: 'Join a Trauma-Informed Community',
        subtitle: 'Evidence-based tools with privacy at the core.',
        bulletPoints: [
          'All data encrypted and stored securely—never shared or sold',
          'Built on attachment theory, IFS, and polyvagal principles',
          'Upgrade path available when you\'re ready for deeper work',
          'Your one next step: Create your account to join thousands on their healing path'
        ]
      }
    },
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
    contentLevels: {
      beginner: {
        title: 'Forgot Your Password?',
        subtitle: 'No worries—it happens to everyone.',
        bulletPoints: [
          'We\'ll send you an email with a link to reset it',
          'Check your inbox (and spam folder) after you submit',
          'You\'ll be back in your space soon',
          'Your one next step: Enter your email address'
        ]
      },
      intermediate: {
        title: 'Reset Your Password',
        subtitle: 'Regain access to your healing sanctuary.',
        bulletPoints: [
          'Enter the email you used when you signed up',
          'We\'ll send a secure reset link within minutes',
          'The link expires after 24 hours for your security',
          'Your one next step: Enter your email to receive the reset link'
        ]
      },
      advanced: {
        title: 'Secure Password Recovery',
        subtitle: 'Privacy-first account recovery process.',
        bulletPoints: [
          'One-time token sent via encrypted email',
          'Token expires after 24 hours for security',
          'No password hints stored—we never see your password',
          'Your one next step: Request the secure reset link'
        ]
      }
    },
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
    contentLevels: {
      beginner: {
        title: 'Create a New Password',
        subtitle: 'Pick something you\'ll remember.',
        bulletPoints: [
          'Type your new password twice to confirm',
          'Make it at least 8 characters',
          'You\'ll be signed in right after',
          'Your one next step: Enter your new password'
        ]
      },
      intermediate: {
        title: 'Set Your New Password',
        subtitle: 'Secure your account with a strong password.',
        bulletPoints: [
          'Use a mix of letters, numbers, and symbols for strength',
          'Avoid common words or patterns',
          'Consider using a password manager',
          'Your one next step: Create a password you\'ll remember'
        ]
      },
      advanced: {
        title: 'Secure Password Update',
        subtitle: 'Best practices for account security.',
        bulletPoints: [
          'Minimum 8 characters with mixed character types recommended',
          'All passwords hashed with bcrypt—we never store plaintext',
          'Consider enabling two-factor authentication after reset',
          'Your one next step: Set a strong, unique password'
        ]
      }
    },
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
    contentLevels: {
      beginner: {
        title: 'Let\'s Get to Know You',
        subtitle: 'A few simple questions to help us help you.',
        bulletPoints: [
          'Answer only what feels comfortable',
          'You can skip anything you\'re not sure about',
          'We use this to show you the right tools',
          'Your one next step: Answer the first question when you\'re ready'
        ]
      },
      intermediate: {
        title: 'Personalize Your Experience',
        subtitle: 'Help us tailor your healing journey.',
        bulletPoints: [
          'Tell us what areas you\'d like to focus on',
          'Share your preferences for how we communicate with you',
          'Let us know your experience level with healing practices',
          'Your one next step: Complete onboarding to unlock personalized recommendations'
        ]
      },
      advanced: {
        title: 'Configure Your Healing Path',
        subtitle: 'Detailed customization for your unique journey.',
        bulletPoints: [
          'Select from evidence-based modalities that resonate with you',
          'Set notification and reminder preferences',
          'Choose content complexity level (this setting)',
          'Your one next step: Complete all steps to fully personalize your experience'
        ]
      }
    },
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
    contentLevels: {
      beginner: {
        title: 'Your Home Base',
        subtitle: 'This is your safe space. Everything you need is right here.',
        bulletPoints: [
          'All your tools are in one place—no searching needed.',
          'Start with a quick check-in or write in your journal.',
          'See your progress at a glance anytime.',
          'Your one next step: Tap "Start Today\'s Practice" to begin.'
        ]
      },
      intermediate: {
        title: 'Your Daily Dashboard',
        subtitle: 'Quick access to all your healing tools and progress tracking.',
        bulletPoints: [
          'Jump between journal, mood tracking, and AI chat from here.',
          'Your streak and daily goals update in real-time.',
          'Customize your dashboard widgets to match your needs.',
          'Your one next step: Set up your first daily goal.'
        ]
      },
      advanced: {
        title: 'Command Center for Growth',
        subtitle: 'Research shows that tracking progress increases follow-through by 40% (Harkin et al., 2016).',
        bulletPoints: [
          'Dashboard design follows habit-loop psychology: cue → routine → reward.',
          'Widget-based architecture supports personalized therapeutic workflows.',
          'Progress visualization activates intrinsic motivation circuits.',
          'Your one next step: Explore the analytics section for deeper pattern recognition.'
        ]
      }
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
    },
    contentLevels: {
      beginner: {
        title: 'Keep Track of People You Love',
        subtitle: 'A simple way to remember who matters to you.',
        bulletPoints: [
          'Add the names of people important to you.',
          'Set reminders to reach out and say hello.',
          'Note little things—birthdays, favorite snacks, inside jokes.',
          'Your one next step: Add one person you want to connect with more.'
        ]
      },
      intermediate: {
        title: 'Relationship Health Tracker',
        subtitle: 'Intentionally nurture your connections with gentle reminders.',
        bulletPoints: [
          'Track the last time you connected with each person.',
          'Set relationship goals—weekly calls, monthly coffee dates.',
          'Reflect on relationship patterns and areas for growth.',
          'Your one next step: Schedule a check-in with someone you miss.'
        ]
      },
      advanced: {
        title: 'Attachment & Connection Science',
        subtitle: 'Attachment theory shows secure relationships are built through consistent, attuned contact (Bowlby, 1969).',
        bulletPoints: [
          'Uses relationship science to help you maintain healthy attachment patterns.',
          'Tracks bidirectionality: giving and receiving support in balance.',
          'Identifies relationships that may need repair or boundary-setting.',
          'Your one next step: Review your relationship dashboard for patterns.'
        ]
      }
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
    },
    contentLevels: {
      beginner: {
        title: 'Start Your Day Gently',
        subtitle: 'A few minutes to notice how you feel right now.',
        bulletPoints: [
          'No pressure—just notice what\'s happening inside you.',
          'Pick a word or emoji that matches your mood.',
          'Take three slow breaths before you start.',
          'Your one next step: Tap "Begin Check-In" and answer honestly.'
        ]
      },
      intermediate: {
        title: 'Daily Check-In Practice',
        subtitle: 'Build self-awareness through consistent daily reflection.',
        bulletPoints: [
          'Track your emotional state each morning to spot patterns.',
          'Connect how you slept with how you feel today.',
          'Set one small intention for the day ahead.',
          'Your one next step: Complete your check-in and set today\'s intention.'
        ]
      },
      advanced: {
        title: 'Circadian Emotional Rhythm',
        subtitle: 'Research shows morning check-ins improve emotional regulation throughout the day (Lyubomirsky & Layous, 2013).',
        bulletPoints: [
          'Morning reflection primes the prefrontal cortex for better decision-making.',
          'Naming emotions (affect labeling) reduces amygdala reactivity.',
          'Consistent timing builds automaticity, reducing willpower drain.',
          'Your one next step: Notice your body sensations during today\'s check-in.'
        ]
      }
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
    },
    contentLevels: {
      beginner: {
        title: 'How Do You Feel?',
        subtitle: 'Just pick a color or emoji that matches your mood.',
        bulletPoints: [
          'There are no wrong answers—every feeling is valid.',
          'You can log as many times a day as you want.',
          'Over time, you\'ll see your patterns in a pretty chart.',
          'Your one next step: Log how you feel right now—it takes 5 seconds.'
        ]
      },
      intermediate: {
        title: 'Track Your Emotional Waves',
        subtitle: 'See patterns in your moods across days and weeks.',
        bulletPoints: [
          'Notice what triggers mood shifts—sleep, food, people, events.',
          'Use tags to categorize moods (work stress, family joy, etc.).',
          'Spot your high-energy and low-energy times of day.',
          'Your one next step: Log your mood with a context tag today.'
        ]
      },
      advanced: {
        title: 'Emotional Granularity Science',
        subtitle: 'Studies show that precise emotion labeling improves emotional regulation (Barrett, 2017).',
        bulletPoints: [
          'Emotional granularity: the more precise your labels, the better your coping.',
          'Mood tracking reveals circadian, weekly, and seasonal patterns.',
          'Correlate mood data with sleep, activity, and journal entries.',
          'Your one next step: Try using a more specific emotion word in your next log.'
        ]
      }
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
    },
    contentLevels: {
      beginner: {
        title: 'Notice Your Body\'s Signals',
        subtitle: 'Your body tells you how it feels—let\'s learn to listen.',
        bulletPoints: [
          'Are you feeling calm, wound up, or shut down right now?',
          'Check in with your shoulders, belly, and jaw for clues.',
          'There\'s no "wrong" state—we\'re just noticing.',
          'Your one next step: Tap "Check State" and pick what feels closest.'
        ]
      },
      intermediate: {
        title: 'Window of Tolerance Tracking',
        subtitle: 'Learn to recognize when you\'re in or out of your comfort zone.',
        bulletPoints: [
          'Track whether you feel hyper-aroused (anxious) or hypo-aroused (numb).',
          'Notice what activities or people shift your state.',
          'Build a toolkit of go-to regulation strategies.',
          'Your one next step: After logging, try one grounding technique.'
        ]
      },
      advanced: {
        title: 'Polyvagal-Informed Tracking',
        subtitle: 'Based on Polyvagal Theory, which maps nervous system states to social engagement (Porges, 2011).',
        bulletPoints: [
          'Three states: ventral vagal (safe), sympathetic (fight/flight), dorsal vagal (shutdown).',
          'State awareness is the first step in expanding your window of tolerance.',
          'Co-regulation (safe relationships) helps shift states faster than self-regulation alone.',
          'Your one next step: Note which state you\'re in and what cue triggered it.'
        ]
      }
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
    contentLevels: {
      beginner: {
        title: 'Write What You Feel',
        subtitle: 'No rules—just put words on the page.',
        bulletPoints: [
          'You can write anything: one sentence or ten pages.',
          'Nobody else will see this unless you choose to share.',
          'Spelling and grammar don\'t matter here.',
          'Your one next step: Write one sentence about how you feel right now.'
        ]
      },
      intermediate: {
        title: 'Guided Journaling Practice',
        subtitle: 'Use prompts to explore your inner world with intention.',
        bulletPoints: [
          'Choose from self-compassion, gratitude, or shadow-work prompts.',
          'Write for 5–15 minutes without stopping to edit.',
          'Revisit past entries to notice growth and patterns.',
          'Your one next step: Pick a prompt and write freely for 5 minutes.'
        ]
      },
      advanced: {
        title: 'Expressive Writing Science',
        subtitle: 'Pennebaker\'s research shows expressive writing improves immune function and emotional well-being (Pennebaker & Chung, 2011).',
        bulletPoints: [
          'Write about difficult experiences for 15–20 minutes to unlock therapeutic benefits.',
          'Coherence-building: linking events to emotions creates narrative meaning.',
          'Shadow work journaling helps integrate disowned parts of self (Jung, 1959).',
          'Your one next step: Try a timed free-write about something you\'ve been avoiding.'
        ]
      }
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
    },
    contentLevels: {
      beginner: {
        title: 'See Your Journey',
        subtitle: 'Pretty charts that show how you\'re doing over time.',
        bulletPoints: [
          'See how many days in a row you\'ve checked in.',
          'Watch your mood patterns in colorful graphs.',
          'Celebrate the small wins—every entry counts.',
          'Your one next step: Look at your streak counter and smile.'
        ]
      },
      intermediate: {
        title: 'Pattern Recognition',
        subtitle: 'Spot trends in your moods, habits, and growth.',
        bulletPoints: [
          'Compare weeks and months to see what\'s changing.',
          'Find connections between activities and emotional states.',
          'Use filters to focus on specific tools or time periods.',
          'Your one next step: Compare this week to last week on the mood chart.'
        ]
      },
      advanced: {
        title: 'Behavioral Data Science',
        subtitle: 'Self-tracking + reflection = metacognitive growth (Quantified Self research).',
        bulletPoints: [
          'Multi-dimensional data: mood, state, journal sentiment, streaks, goals.',
          'Time-series analysis reveals circadian, weekly, and seasonal cycles.',
          'Export data for personal use or to share with a therapist.',
          'Your one next step: Export a monthly summary to review with support.'
        ]
      }
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
    },
    contentLevels: {
      beginner: {
        title: 'You\'re Doing Great',
        subtitle: 'Every little step forward is worth celebrating.',
        bulletPoints: [
          'See the badges and milestones you\'ve earned.',
          'Look back at where you started—you\'ve grown.',
          'No need to rush; healing is not a race.',
          'Your one next step: Find one milestone you\'re proud of.'
        ]
      },
      intermediate: {
        title: 'Milestones & Achievements',
        subtitle: 'Track your journey markers and set meaningful goals.',
        bulletPoints: [
          'Unlock achievements as you build consistency.',
          'Set SMART goals for the week or month ahead.',
          'Reflect on challenges you\'ve overcome.',
          'Your one next step: Set one small goal for this week.'
        ]
      },
      advanced: {
        title: 'Progress Monitoring Theory',
        subtitle: 'Goal-progress monitoring increases goal attainment by 25% (Harkin et al., 2016).',
        bulletPoints: [
          'Visible progress activates dopamine reward pathways.',
          'Milestones create "fresh start" motivation (temporal landmarks).',
          'Balance process goals (daily habits) and outcome goals (results).',
          'Your one next step: Review your weekly goal completion rate.'
        ]
      }
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
    },
    contentLevels: {
      beginner: {
        title: 'Watch Yourself Grow',
        subtitle: 'See how you\'ve changed over weeks and months.',
        bulletPoints: [
          'Simple charts show your progress in easy-to-read colors.',
          'Compare "you now" to "you before" and see the difference.',
          'Celebrate patterns of improvement—even tiny ones.',
          'Your one next step: Look at your 30-day summary.'
        ]
      },
      intermediate: {
        title: 'Growth Pattern Analysis',
        subtitle: 'Uncover the deeper trends in your healing journey.',
        bulletPoints: [
          'Compare different time periods: week-over-week, month-over-month.',
          'See which tools and practices are having the biggest impact.',
          'Identify plateaus and breakthroughs in your growth.',
          'Your one next step: Compare the last two months side by side.'
        ]
      },
      advanced: {
        title: 'Longitudinal Growth Science',
        subtitle: 'Long-term tracking reveals non-linear healing patterns (Van der Kolk, 2014).',
        bulletPoints: [
          'Growth follows spiral patterns—revisiting themes at deeper levels.',
          'Regression is often a sign of integration, not failure.',
          'Multi-metric correlation: mood, state, journal themes, behavior.',
          'Your one next step: Look for spiral patterns in your growth data.'
        ]
      }
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
    },
    contentLevels: {
      beginner: {
        title: 'Writing with Help',
        subtitle: 'Prompts and questions to guide your writing—no blank-page fear.',
        bulletPoints: [
          'Each session gives you a question to answer.',
          'Write as much or as little as you want.',
          'There\'s no wrong way to do this.',
          'Your one next step: Pick a prompt that sounds interesting and start writing.'
        ]
      },
      intermediate: {
        title: 'Structured Reflection Sessions',
        subtitle: 'Themed journaling exercises for deeper exploration.',
        bulletPoints: [
          'Choose from gratitude, self-compassion, shadow work, or future visioning.',
          'Follow step-by-step prompts for a complete session.',
          'Track which themes help you most over time.',
          'Your one next step: Complete one full guided session today.'
        ]
      },
      advanced: {
        title: 'Therapeutic Journaling Protocols',
        subtitle: 'Based on evidence-based practices like Cognitive Processing Therapy and IFS journaling.',
        bulletPoints: [
          'Structured protocols help process trauma safely (Resick et al., 2016).',
          'Internal Family Systems journaling: dialogue with different parts of self.',
          'Narrative coherence: building a meaningful story of your experiences.',
          'Your one next step: Try the IFS-inspired "parts dialogue" prompt.'
        ]
      }
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
    description: 'Evidence-based breathing practices to help regulate your nervous system. Grounded in research on vagal tone and respiratory science.',
    safetyNotice: {
      type: 'supportive',
      text: 'These practices are supportive tools, not medical treatment. If you feel dizzy or uncomfortable, stop and breathe normally. For persistent breathing difficulties, please consult a healthcare provider.'
    },
    contentLevels: {
      beginner: {
        summary: 'Breathing exercises help you feel calmer. When you breathe slowly, your body relaxes. You can do this anytime, anywhere.',
        steps: [
          'Find a comfortable place to sit or stand.',
          'Put one hand on your belly.',
          'Breathe in slowly through your nose. Feel your belly rise.',
          'Breathe out slowly through your mouth. Feel your belly fall.',
          'Do this 5 times. That is it!'
        ],
        reassurance: 'There is no wrong way to breathe. If your mind wanders, that is okay. Just gently come back to noticing your breath.'
      },
      intermediate: {
        summary: 'Controlled breathing activates your parasympathetic nervous system, shifting your body from stress mode to rest mode. Regular practice builds this skill.',
        guidance: [
          'Practice daily for 2–5 minutes, ideally at the same time each day.',
          'Box breathing (4-4-4-4) is excellent for focus and grounding.',
          'The 4-7-8 pattern is best used before sleep or during anxiety.',
          'Track your practice to notice patterns and progress.',
          'Combine with grounding techniques when overwhelmed.'
        ],
        examples: [
          'Morning routine: 3 minutes of belly breathing before starting your day.',
          'Work break: 1 minute of box breathing between tasks.',
          'Evening wind-down: 4-7-8 breathing for 5 cycles before bed.'
        ]
      },
      advanced: {
        summary: 'Respiratory regulation is a gateway to autonomic nervous system modulation. Extended practice develops interoceptive awareness and vagal tone optimization.',
        deeperDive: [
          'Heart rate variability (HRV) training uses breath to maximize parasympathetic tone. Target 5–6 breaths per minute for coherence.',
          'Extended exhales (inhale 4, exhale 8) strongly activate the vagus nerve via stretch receptors in the lungs.',
          'Breath retention (kumbhaka) practices should be approached gradually and only after establishing a stable daily practice.',
          'Consider biofeedback devices to measure HRV response to different techniques.'
        ],
        references: [
          'Porges, S. (2011). The Polyvagal Theory.',
          'Brown, R. & Gerbarg, P. (2012). The Healing Power of the Breath.',
          'Lehrer, P. & Gevirtz, R. (2014). Heart rate variability biofeedback.'
        ]
      }
    },
    hero: {
      eyebrow: 'Breathwork',
      title: 'Find calm through',
      titleHighlight: 'conscious breathing.',
      subtitle: 'Your breath is always with you. These simple techniques, supported by research on the nervous system, can help you feel more grounded in moments of stress.',
      primaryCta: { label: 'Try a Quick Exercise', href: '#exercises' },
      secondaryCta: { label: 'Learn How It Works', href: '#science' }
    },
    modules: [
      { icon: 'Activity', title: 'Activates Rest Response', description: 'Slow, deep breathing stimulates the parasympathetic nervous system.' },
      { icon: 'Heart', title: 'Supports Heart Coherence', description: 'Rhythmic breathing helps synchronize heart rate variability.' },
      { icon: 'Brain', title: 'Calms the Mind', description: 'Focused breath interrupts racing thoughts and grounds attention.' }
    ],
    sections: [
      {
        id: 'exercises',
        eyebrow: 'Micro-Exercises',
        title: 'Three practices for right now',
        subtitle: 'Each takes 30–120 seconds. Start with whichever feels most approachable.',
        variant: 'glow',
        cards: [
          { icon: 'Activity', title: 'Box Breathing (60 sec)', text: 'Inhale 4 counts, hold 4, exhale 4, hold 4. Repeat 3 times. Used by first responders for calm under pressure.' },
          { icon: 'Moon', title: '4-7-8 Relaxation (90 sec)', text: 'Inhale 4 counts, hold 7, exhale slowly for 8. Repeat 3 times. Helpful before sleep or when anxious.' },
          { icon: 'Leaf', title: 'Simple Belly Breath (30 sec)', text: 'Place hand on belly. Breathe so your belly rises, not your chest. 5 slow breaths. The gentlest entry point.' }
        ]
      },
      {
        id: 'levels',
        eyebrow: 'Skill Levels',
        title: 'Progress at your own pace',
        subtitle: 'There is no rush. Many people stay at beginner level for months—that is completely fine.',
        variant: 'pattern',
        cards: [
          { icon: 'Smile', title: 'Beginner', text: 'Simple belly breathing, 3-breath resets, counting inhales. Focus on noticing breath, not controlling it.' },
          { icon: 'Star', title: 'Intermediate', text: 'Box breathing, 4-7-8 pattern, coherent breathing (5 breaths per minute). Build consistency.' },
          { icon: 'Sparkles', title: 'Advanced', text: 'Extended exhales, breath holds, heart rate variability training. Only after months of practice.' }
        ]
      },
      {
        id: 'stop-rule',
        eyebrow: 'Safety First',
        title: 'The pause rule',
        subtitle: 'If you feel overwhelmed, lightheaded, or uncomfortable at any point, stop immediately.',
        variant: 'plain',
        bullets: [
          'Return to normal breathing—no special technique needed.',
          'Place your feet firmly on the ground.',
          'If discomfort persists, step away and take a break.',
          'You can always come back later. There is no pressure.'
        ]
      },
      {
        id: 'science',
        eyebrow: 'The Research',
        title: 'Why breathing works',
        subtitle: 'The science behind breath regulation—explained simply.',
        variant: 'glow',
        bullets: [
          'Slow exhales activate the vagus nerve, which signals safety to your brain.',
          'Rhythmic breathing reduces cortisol (the stress hormone) over time.',
          'Heart rate variability improves with consistent practice, linked to emotional resilience.',
          'Even one minute of focused breathing can shift your nervous system state.'
        ]
      }
    ]
  },
  {
    route: '/grounding',
    category: 'landing',
    pageLabel: 'Grounding',
    title: 'Grounding Techniques — The Genuine Love Project',
    description: 'Evidence-based grounding practices to anchor you in the present moment. Drawn from somatic therapy and mindfulness research.',
    safetyNotice: {
      type: 'supportive',
      text: 'Grounding is a supportive skill, not therapy. If you experience persistent dissociation, flashbacks, or distress, please reach out to a mental health professional.'
    },
    hero: {
      eyebrow: 'Present Moment',
      title: 'Return to',
      titleHighlight: 'the here and now.',
      subtitle: 'When you feel disconnected, overwhelmed, or far away from yourself, these gentle techniques can help you feel more present. You can use them anytime, anywhere.',
      primaryCta: { label: 'Try a Grounding Exercise', href: '#exercises' },
      secondaryCta: { label: 'Quick Reset', href: '#quick' }
    },
    modules: [
      { icon: 'Eye', title: 'Engages Your Senses', description: 'Sensory focus interrupts spiraling thoughts and anchors attention.' },
      { icon: 'Leaf', title: 'Calms the Nervous System', description: 'Body-based practices signal safety to your brain.' },
      { icon: 'MapPin', title: 'Reconnects You to Now', description: 'When the mind wanders to past or future, the body is always here.' }
    ],
    sections: [
      {
        id: 'exercises',
        eyebrow: 'Micro-Exercises',
        title: 'Three practices for right now',
        subtitle: 'Each takes 30–120 seconds. Choose the one that feels most doable.',
        variant: 'glow',
        cards: [
          { icon: 'Eye', title: '5-4-3-2-1 Senses (90 sec)', text: 'Name 5 things you see, 4 you hear, 3 you can touch, 2 you smell, 1 you taste. A classic grounding technique from trauma-informed care.' },
          { icon: 'MapPin', title: 'Feet on Floor (30 sec)', text: 'Press your feet into the ground. Notice the pressure. Feel the floor holding you. Breathe. You are here.' },
          { icon: 'Hand', title: 'Hold Something Cold (60 sec)', text: 'Hold ice, cold water, or a frozen object. Focus on the sensation. The cold brings attention back to the present.' }
        ]
      },
      {
        id: 'levels',
        eyebrow: 'Skill Levels',
        title: 'Build your grounding practice',
        subtitle: 'Start simple. Over time, grounding becomes faster and more automatic.',
        variant: 'pattern',
        cards: [
          { icon: 'Smile', title: 'Beginner', text: 'Feet on floor, hold an object, name what you see. Focus on one sense at a time. No rush.' },
          { icon: 'Star', title: 'Intermediate', text: '5-4-3-2-1 full sequence, body scan, orienting to the room. Practice daily, even when calm.' },
          { icon: 'Sparkles', title: 'Advanced', text: 'Grounding in motion, eyes-open meditation, somatic tracking. Helpful for ongoing regulation.' }
        ]
      },
      {
        id: 'stop-rule',
        eyebrow: 'Safety First',
        title: 'The pause rule',
        subtitle: 'Grounding should feel calming. If it brings up distress, it is okay to stop.',
        variant: 'plain',
        bullets: [
          'If you feel more overwhelmed, pause the exercise.',
          'Return to simple breathing or open your eyes.',
          'You do not have to finish any exercise.',
          'If distress continues, consider reaching out for support.'
        ]
      },
      {
        id: 'quick',
        eyebrow: 'Emergency Reset',
        title: 'When you need to ground quickly',
        subtitle: 'For moments when you feel very disconnected or overwhelmed.',
        variant: 'glow',
        bullets: [
          'Splash cold water on your face or hold ice.',
          'Press your feet firmly into the ground and push.',
          'Name 3 things you can see right now, out loud.',
          'If safe to do so, step outside and feel the air.'
        ]
      }
    ]
  },
  {
    route: '/affirmations',
    category: 'landing',
    pageLabel: 'Affirmations',
    title: 'Affirmations — The Genuine Love Project',
    description: 'Supportive self-statements rooted in self-compassion research. A gentle practice for building a kinder inner voice.',
    safetyNotice: {
      type: 'supportive',
      text: 'Affirmations are one tool among many. If positive statements feel forced or bring up difficult feelings, that is normal—go gently. This is not a substitute for professional support.'
    },
    hero: {
      eyebrow: 'Compassionate Self-Talk',
      title: 'Speak to yourself with',
      titleHighlight: 'kindness.',
      subtitle: 'Affirmations are not about forcing positivity. They are small reminders that you are allowed to be gentle with yourself. Research on self-compassion suggests this practice can reduce self-criticism over time.',
      primaryCta: { label: 'Try an Affirmation', href: '#exercises' },
      secondaryCta: { label: 'Learn the Approach', href: '#approach' }
    },
    modules: [
      { icon: 'Heart', title: 'Builds Self-Compassion', description: 'Kind self-talk reduces the harshness of your inner critic.' },
      { icon: 'RefreshCw', title: 'Creates New Patterns', description: 'Repeated gentle words can slowly shift habitual thoughts.' },
      { icon: 'Shield', title: 'Provides a Buffer', description: 'Self-compassion helps you weather difficult moments with more resilience.' }
    ],
    sections: [
      {
        id: 'exercises',
        eyebrow: 'Micro-Exercises',
        title: 'Three ways to practice',
        subtitle: 'Each takes 30–90 seconds. Choose what feels authentic to you.',
        variant: 'glow',
        cards: [
          { icon: 'Heart', title: 'Mirror Moment (60 sec)', text: 'Look at yourself and say: "I am doing my best, and that is enough." Notice how it feels without judgment.' },
          { icon: 'Hand', title: 'Hand on Heart (30 sec)', text: 'Place your hand on your chest. Say: "I am allowed to feel what I feel." Breathe.' },
          { icon: 'Pencil', title: 'Write Three Kind Words (90 sec)', text: 'Write three things you would say to comfort a friend. Then read them to yourself.' }
        ]
      },
      {
        id: 'levels',
        eyebrow: 'Skill Levels',
        title: 'Find your entry point',
        subtitle: 'If affirmations feel uncomfortable, start with neutral statements and build from there.',
        variant: 'pattern',
        cards: [
          { icon: 'Smile', title: 'Beginner', text: 'Neutral statements: "I am learning." "I am allowed to rest." "I am here." No forced positivity.' },
          { icon: 'Star', title: 'Intermediate', text: 'Compassionate statements: "I deserve kindness." "My feelings are valid." "I am enough as I am."' },
          { icon: 'Sparkles', title: 'Advanced', text: 'Personalized affirmations written for your specific challenges. Regular journaling practice.' }
        ]
      },
      {
        id: 'stop-rule',
        eyebrow: 'Safety First',
        title: 'The pause rule',
        subtitle: 'Affirmations should not feel like pressure. If they bring up resistance, that is information, not failure.',
        variant: 'plain',
        bullets: [
          'If an affirmation feels false, try a more neutral statement.',
          'It is okay to modify or skip any affirmation.',
          'Resistance often signals a belief worth exploring—gently.',
          'If distress continues, consider talking to someone supportive.'
        ]
      },
      {
        id: 'approach',
        eyebrow: 'The Research',
        title: 'Why self-compassion works',
        subtitle: 'Affirmations rooted in self-compassion research—not toxic positivity.',
        variant: 'glow',
        bullets: [
          'Dr. Kristin Neff\'s research shows self-compassion reduces anxiety and depression symptoms.',
          'Neutral affirmations work better than overly positive ones for people with low self-esteem.',
          'Regular practice (not intensity) creates gradual shifts in self-talk patterns.',
          'Self-compassion is a skill—it can be learned and strengthened over time.'
        ]
      }
    ]
  },
  {
    route: '/meditation',
    category: 'landing',
    pageLabel: 'Meditation',
    title: 'Meditation Guide — The Genuine Love Project',
    description: 'Accessible meditation practices grounded in mindfulness research. Start with just one minute—no experience needed.',
    safetyNotice: {
      type: 'supportive',
      text: 'Meditation is a practice, not a cure. If meditation brings up difficult emotions or memories, it is okay to stop. For trauma-related experiences, please work with a trained professional.'
    },
    hero: {
      eyebrow: 'Mindful Awareness',
      title: 'A few moments of',
      titleHighlight: 'stillness.',
      subtitle: 'Meditation does not require emptying your mind. It is simply noticing what is already here. Research shows even brief daily practice can reduce stress and improve focus over time.',
      primaryCta: { label: 'Try a Short Practice', href: '#exercises' },
      secondaryCta: { label: 'Learn the Basics', href: '#basics' }
    },
    modules: [
      { icon: 'Brain', title: 'Supports Focus', description: 'Regular practice strengthens attention and reduces mind-wandering.' },
      { icon: 'Heart', title: 'Builds Emotional Awareness', description: 'Noticing thoughts and feelings without reacting to them.' },
      { icon: 'Moon', title: 'Improves Rest', description: 'Mindfulness before sleep can support relaxation and sleep quality.' }
    ],
    sections: [
      {
        id: 'exercises',
        eyebrow: 'Micro-Practices',
        title: 'Three meditations for right now',
        subtitle: 'Each takes 60–120 seconds. You do not need to be good at this.',
        variant: 'glow',
        cards: [
          { icon: 'Wind', title: 'Breath Awareness (60 sec)', text: 'Close your eyes. Notice your breath. When your mind wanders, gently return to breath. That is the practice.' },
          { icon: 'Eye', title: 'Open-Eye Presence (90 sec)', text: 'Soften your gaze. Notice colors, shapes, movement. Let thoughts pass like clouds. Stay curious.' },
          { icon: 'Heart', title: 'Loving-Kindness (120 sec)', text: 'Silently say: "May I be safe. May I be well. May I be at ease." Then extend to someone you care about.' }
        ]
      },
      {
        id: 'levels',
        eyebrow: 'Skill Levels',
        title: 'Build your practice gradually',
        subtitle: 'One minute counts. Consistency matters more than duration.',
        variant: 'pattern',
        cards: [
          { icon: 'Smile', title: 'Beginner', text: '1–3 minutes. Breath awareness, body scan, or open-eye gazing. Expect a wandering mind—that is normal.' },
          { icon: 'Star', title: 'Intermediate', text: '5–10 minutes. Guided meditation, loving-kindness, or noting practice. Build a daily habit.' },
          { icon: 'Sparkles', title: 'Advanced', text: '15+ minutes. Unguided sits, body-based awareness, or silent retreats. After months of practice.' }
        ]
      },
      {
        id: 'stop-rule',
        eyebrow: 'Safety First',
        title: 'The pause rule',
        subtitle: 'Meditation should feel supportive. If it does not, it is okay to stop.',
        variant: 'plain',
        bullets: [
          'If you feel more anxious or distressed, open your eyes.',
          'Movement-based practices may be easier for some people.',
          'You can meditate for 30 seconds. There is no minimum.',
          'If meditation brings up trauma responses, please seek support.'
        ]
      },
      {
        id: 'basics',
        eyebrow: 'The Research',
        title: 'Why meditation helps',
        subtitle: 'Decades of research support mindfulness practice—here is what we know.',
        variant: 'glow',
        bullets: [
          'Mindfulness-Based Stress Reduction (MBSR) has strong evidence for reducing anxiety and stress.',
          'Regular practice changes brain structure in areas related to attention and emotion regulation.',
          'Even brief daily practice (5–10 minutes) produces measurable benefits over time.',
          'The key is consistency, not intensity. Start small and stay steady.'
        ]
      }
    ]
  },
  {
    route: '/self-care',
    category: 'landing',
    pageLabel: 'Self-Care',
    title: 'Self-Care Toolkit — The Genuine Love Project',
    description: 'Practical, evidence-informed self-care practices. Small actions that support your nervous system and wellbeing.',
    safetyNotice: {
      type: 'supportive',
      text: 'Self-care supports wellbeing but does not replace professional care. If you are struggling with your mental health, please reach out to a qualified provider.'
    },
    hero: {
      eyebrow: 'Nurturing Yourself',
      title: 'Self-care is',
      titleHighlight: 'not selfish.',
      subtitle: 'Self-care is not about luxury or indulgence. It is about small, consistent actions that help your body and mind feel safer. Research shows even micro-moments of care can reduce stress.',
      primaryCta: { label: 'Find a Practice', href: '#exercises' },
      secondaryCta: { label: 'Learn the Approach', href: '#approach' }
    },
    modules: [
      { icon: 'Battery', title: 'Restores Energy', description: 'Small acts of care prevent depletion and burnout.' },
      { icon: 'Heart', title: 'Signals Self-Worth', description: 'Taking care of yourself reinforces that you matter.' },
      { icon: 'Shield', title: 'Builds Resilience', description: 'Regular self-care creates a buffer against stress.' }
    ],
    sections: [
      {
        id: 'exercises',
        eyebrow: 'Micro-Practices',
        title: 'Three self-care moments',
        subtitle: 'Each takes 30–120 seconds. Start with what feels easiest.',
        variant: 'glow',
        cards: [
          { icon: 'Droplet', title: 'Hydration Check (30 sec)', text: 'Drink a glass of water slowly. Notice how it feels. Basic needs are self-care.' },
          { icon: 'Sun', title: 'Sunlight Moment (60 sec)', text: 'Step near a window or outside. Feel the light on your skin. Even brief daylight supports mood.' },
          { icon: 'Hand', title: 'Self-Touch (90 sec)', text: 'Place a hand on your heart or give yourself a gentle squeeze. Touch activates the calming nervous system.' }
        ]
      },
      {
        id: 'levels',
        eyebrow: 'Skill Levels',
        title: 'Build your self-care practice',
        subtitle: 'Start with the basics. Add more as you have capacity.',
        variant: 'pattern',
        cards: [
          { icon: 'Smile', title: 'Beginner', text: 'Basic needs: hydration, rest, one small pleasure daily. No elaborate rituals needed.' },
          { icon: 'Star', title: 'Intermediate', text: 'Boundaries, saying no, scheduling rest. Recognizing when you are depleted.' },
          { icon: 'Sparkles', title: 'Advanced', text: 'Preventive self-care, regular rhythms, supporting others from a place of fullness.' }
        ]
      },
      {
        id: 'stop-rule',
        eyebrow: 'Safety First',
        title: 'The pause rule',
        subtitle: 'Self-care should feel nourishing. If it feels like another obligation, simplify.',
        variant: 'plain',
        bullets: [
          'If self-care feels exhausting, you may need rest more than activity.',
          'It is okay to do less. Basic needs count as self-care.',
          'Guilt about self-care is common—notice it without acting on it.',
          'If you cannot care for yourself, please ask for support.'
        ]
      },
      {
        id: 'approach',
        eyebrow: 'The Research',
        title: 'Why self-care works',
        subtitle: 'Evidence-informed approaches to caring for yourself.',
        variant: 'glow',
        bullets: [
          'Behavioral activation research shows small positive actions improve mood over time.',
          'Meeting basic needs (sleep, food, water, movement) is foundational to mental health.',
          'Self-compassion research links self-care with reduced anxiety and depression.',
          'Consistency matters more than intensity—one minute daily beats one hour weekly.'
        ]
      }
    ]
  },
  {
    route: '/emotional-intelligence',
    category: 'landing',
    pageLabel: 'Emotional Intelligence',
    title: 'Emotional Intelligence — The Genuine Love Project',
    description: 'Develop awareness and regulation skills. Based on research in emotional intelligence, DBT, and affect science.',
    safetyNotice: {
      type: 'supportive',
      text: 'Emotional awareness is a skill that develops over time. If exploring emotions brings up significant distress, please work with a mental health professional.'
    },
    hero: {
      eyebrow: 'Emotional Awareness',
      title: 'Understand and navigate',
      titleHighlight: 'your emotions.',
      subtitle: 'Emotional intelligence is not about controlling feelings. It is about noticing them, naming them, and responding with awareness. These skills can be learned at any age.',
      primaryCta: { label: 'Try an Exercise', href: '#exercises' },
      secondaryCta: { label: 'Learn the Framework', href: '#framework' }
    },
    modules: [
      { icon: 'Eye', title: 'Awareness', description: 'Noticing emotions as they arise, without judgment.' },
      { icon: 'MessageCircle', title: 'Naming', description: 'Putting words to feelings reduces their intensity.' },
      { icon: 'Compass', title: 'Responding', description: 'Choosing how to act, rather than reacting automatically.' }
    ],
    sections: [
      {
        id: 'exercises',
        eyebrow: 'Micro-Exercises',
        title: 'Three practices for emotional awareness',
        subtitle: 'Each takes 30–90 seconds. Start with noticing—no action required.',
        variant: 'glow',
        cards: [
          { icon: 'Eye', title: 'Body Check (30 sec)', text: 'Pause. Notice where you feel tension or sensation. This is often where emotion lives in the body.' },
          { icon: 'MessageCircle', title: 'Name It (60 sec)', text: 'Ask: "What am I feeling right now?" Name it simply: sad, frustrated, anxious, tired. Naming calms the brain.' },
          { icon: 'Scale', title: 'Rate It (30 sec)', text: 'On a scale of 1–10, how intense is this feeling? This creates distance and perspective.' }
        ]
      },
      {
        id: 'levels',
        eyebrow: 'Skill Levels',
        title: 'Build emotional skills gradually',
        subtitle: 'Awareness comes before regulation. Start where you are.',
        variant: 'pattern',
        cards: [
          { icon: 'Smile', title: 'Beginner', text: 'Notice emotions after they pass. Name basic feelings: happy, sad, angry, scared. No judgment.' },
          { icon: 'Star', title: 'Intermediate', text: 'Notice emotions in real-time. Expand vocabulary: frustrated, overwhelmed, disappointed. Pause before reacting.' },
          { icon: 'Sparkles', title: 'Advanced', text: 'Notice triggers and patterns. Respond rather than react. Support others in navigating emotions.' }
        ]
      },
      {
        id: 'stop-rule',
        eyebrow: 'Safety First',
        title: 'The pause rule',
        subtitle: 'Emotional work should feel manageable. If it becomes overwhelming, stop.',
        variant: 'plain',
        bullets: [
          'If exploring emotions brings up intense distress, pause.',
          'You do not have to process everything at once.',
          'Grounding exercises can help if you feel flooded.',
          'If this work feels too big, please seek professional support.'
        ]
      },
      {
        id: 'framework',
        eyebrow: 'The Research',
        title: 'Understanding emotional intelligence',
        subtitle: 'Evidence-based frameworks for emotional awareness.',
        variant: 'glow',
        bullets: [
          'Research by Salovey and Mayer defines EQ as perceiving, using, understanding, and managing emotions.',
          'DBT teaches that emotions are not good or bad—they are information about our needs.',
          'Naming emotions activates the prefrontal cortex and calms the amygdala (affect labeling research).',
          'Emotional skills can be learned and strengthened at any age with practice.'
        ]
      }
    ]
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
    description: 'Understand fight, flight, freeze, and fawn responses. Polyvagal-informed education for nervous system awareness.',
    safetyNotice: {
      type: 'supportive',
      text: 'Understanding your stress response is educational, not diagnostic. If you experience chronic dysregulation, panic attacks, or trauma symptoms, please work with a trauma-informed therapist.'
    },
    hero: {
      eyebrow: 'Nervous System Education',
      title: 'Understand your',
      titleHighlight: 'stress response.',
      subtitle: 'Your nervous system is designed to protect you. Sometimes it overprotects. Learning how it works can help you respond with more awareness and self-compassion.',
      primaryCta: { label: 'Learn the Basics', href: '#basics' },
      secondaryCta: { label: 'Try a Regulation Exercise', href: '#exercises' }
    },
    modules: [
      { icon: 'Zap', title: 'Fight or Flight', description: 'Mobilization for action—heart racing, muscles tense, ready to move.' },
      { icon: 'Pause', title: 'Freeze or Shutdown', description: 'Immobilization—feeling stuck, numb, disconnected, or foggy.' },
      { icon: 'Heart', title: 'Safe and Social', description: 'The calm, connected state where healing and connection happen.' }
    ],
    sections: [
      {
        id: 'basics',
        eyebrow: 'Understanding',
        title: 'How your nervous system works',
        subtitle: 'This is not a flaw—it is a survival system. Here is what happens.',
        variant: 'glow',
        bullets: [
          'Fight/Flight: Your body prepares for action. Heart races, breath quickens, muscles tense.',
          'Freeze: When action feels impossible, the system shuts down. You may feel numb or stuck.',
          'Fawn: Appeasing others to stay safe. Common in relational trauma.',
          'Safe and Social: The ventral vagal state—calm, connected, able to think clearly.'
        ]
      },
      {
        id: 'exercises',
        eyebrow: 'Micro-Exercises',
        title: 'Three ways to support regulation',
        subtitle: 'Each takes 30–90 seconds. These are calming signals for your nervous system.',
        variant: 'pattern',
        cards: [
          { icon: 'Wind', title: 'Long Exhale (30 sec)', text: 'Exhale longer than you inhale. 4 in, 6–8 out. This activates the calming branch of your nervous system.' },
          { icon: 'Eye', title: 'Orienting (60 sec)', text: 'Slowly look around the room. Name 5 safe things you see. This signals safety to your brain.' },
          { icon: 'Hand', title: 'Bilateral Touch (90 sec)', text: 'Alternate tapping your shoulders or knees. Left, right, left, right. This can help settle activation.' }
        ]
      },
      {
        id: 'levels',
        eyebrow: 'Skill Levels',
        title: 'Build regulation skills',
        subtitle: 'Start with noticing. Regulation follows awareness.',
        variant: 'glow',
        cards: [
          { icon: 'Smile', title: 'Beginner', text: 'Notice when you are activated or shut down. Name it: "I think I am in flight mode." No need to fix.' },
          { icon: 'Star', title: 'Intermediate', text: 'Practice regulation during calm moments. Build a toolkit of what helps you.' },
          { icon: 'Sparkles', title: 'Advanced', text: 'Recognize triggers and choose responses. Support co-regulation with others.' }
        ]
      },
      {
        id: 'stop-rule',
        eyebrow: 'Safety First',
        title: 'The pause rule',
        subtitle: 'If working with your nervous system feels too activating, stop.',
        variant: 'plain',
        bullets: [
          'If exercises increase distress, pause and do something grounding instead.',
          'You do not have to understand everything at once.',
          'If you have trauma history, work with a professional before deep nervous system work.',
          'Your safety matters more than any exercise.'
        ]
      }
    ]
  },
  {
    route: '/inner-child',
    category: 'landing',
    pageLabel: 'Inner Child',
    title: 'Inner Child Work — The Genuine Love Project',
    description: 'Gentle, trauma-informed exercises for reconnecting with your younger self. Drawn from IFS and attachment research.',
    safetyNotice: {
      type: 'trauma-aware',
      text: 'Inner child work can bring up intense emotions or memories. This is supportive content, not therapy. If you have significant trauma history, please work with a trauma-informed therapist before engaging deeply with this material.'
    },
    crisisBanner: {
      enabled: true,
      message: 'If you are in crisis or experiencing thoughts of self-harm, please reach out for support.',
      cta: { label: 'Crisis Resources', href: '/crisis' }
    },
    hero: {
      eyebrow: 'Inner Child Healing',
      title: 'Reconnect with your',
      titleHighlight: 'younger self.',
      subtitle: 'Inside you is a younger version of yourself who may still carry old wounds. Gently acknowledging that part of you can be a path toward healing. This work is tender—go slowly.',
      primaryCta: { label: 'Try a Gentle Exercise', href: '#exercises' },
      secondaryCta: { label: 'Understand the Approach', href: '#approach' }
    },
    modules: [
      { icon: 'Heart', title: 'Reconnection', description: 'Acknowledging the younger parts of yourself with compassion.' },
      { icon: 'Shield', title: 'Reparenting', description: 'Offering your younger self what was needed but not received.' },
      { icon: 'Sparkles', title: 'Integration', description: 'Bringing childhood joy, creativity, and wonder into your adult life.' }
    ],
    sections: [
      {
        id: 'exercises',
        eyebrow: 'Gentle Practices',
        title: 'Three ways to begin',
        subtitle: 'Each takes 60–120 seconds. Start with what feels safe. You can stop anytime.',
        variant: 'glow',
        cards: [
          { icon: 'Image', title: 'Photo Reflection (90 sec)', text: 'Look at a childhood photo. Notice what you feel. Silently say: "I see you. You are safe now."' },
          { icon: 'Pencil', title: 'Letter to Younger Self (120 sec)', text: 'Write a few sentences to yourself as a child. What did you need to hear? What do you wish someone had said?' },
          { icon: 'Heart', title: 'Hand on Heart (60 sec)', text: 'Place your hand on your heart. Imagine your child self receiving comfort. Breathe slowly and gently.' }
        ]
      },
      {
        id: 'levels',
        eyebrow: 'Skill Levels',
        title: 'Progress with care',
        subtitle: 'This work is not linear. Move at the pace that feels right for your nervous system.',
        variant: 'pattern',
        cards: [
          { icon: 'Smile', title: 'Beginner', text: 'Simple acknowledgment: "I had a childhood. Parts of it were hard." No detailed exploration yet.' },
          { icon: 'Star', title: 'Intermediate', text: 'Writing, visualization, noticing emotions that feel young. Working with a therapist recommended.' },
          { icon: 'Sparkles', title: 'Advanced', text: 'Deep parts work, reparenting practices, integration. Only with professional support.' }
        ]
      },
      {
        id: 'stop-rule',
        eyebrow: 'Safety First',
        title: 'The pause rule',
        subtitle: 'Inner child work can be intense. Your safety comes first.',
        variant: 'plain',
        bullets: [
          'If you feel overwhelmed, open your eyes and ground yourself.',
          'You do not have to revisit painful memories to heal.',
          'If distress persists after an exercise, please reach out for support.',
          'This content is not a substitute for trauma therapy.'
        ]
      },
      {
        id: 'approach',
        eyebrow: 'The Research',
        title: 'Understanding inner child work',
        subtitle: 'Approaches grounded in attachment and parts-based therapy.',
        variant: 'glow',
        bullets: [
          'Internal Family Systems (IFS) views the psyche as containing multiple parts, including younger selves.',
          'Attachment research shows early experiences shape adult patterns—and can be updated.',
          'Reparenting involves offering yourself the care, safety, and validation you needed as a child.',
          'This work is most effective when done with a trained therapist, especially for trauma survivors.'
        ]
      }
    ]
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
    route: '/content-studio',
    category: 'content',
    pageLabel: 'Content Studio',
    title: 'Content Studio — The Genuine Love Project',
    description: 'Create supportive, trauma-informed social media content with brand-aligned templates. Generate posts, carousels, threads, and newsletters that prioritize safety and warmth.',
    customComponent: 'ContentStudio',
    hero: {
      eyebrow: 'Content Creation',
      title: 'Create content that',
      titleHighlight: 'heals, not harms.',
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
    },
    contentLevels: {
      beginner: {
        title: 'Rest Is Healing',
        subtitle: 'Sleep helps your body and mind repair.',
        bulletPoints: [
          'Your body heals while you sleep—it\'s not lazy to rest.',
          'A dark, cool room helps you sleep better.',
          'Try putting your phone away an hour before bed.',
          'Your one next step: Set a gentle bedtime reminder for tonight.'
        ]
      },
      intermediate: {
        title: 'Sleep Hygiene Practices',
        subtitle: 'Build habits that support deeper, more restorative sleep.',
        bulletPoints: [
          'Create a consistent wind-down routine 30–60 minutes before bed.',
          'Limit caffeine after 2pm and alcohol close to bedtime.',
          'Use relaxation techniques like body scans or breathing exercises.',
          'Your one next step: Try a 5-minute body scan before bed tonight.'
        ]
      },
      advanced: {
        title: 'Sleep Science & Restoration',
        subtitle: 'Sleep is critical for memory consolidation and emotional processing (Walker, 2017).',
        bulletPoints: [
          'REM sleep processes emotional memories; slow-wave sleep restores physical energy.',
          'Trauma can disrupt sleep architecture; gentle interventions help restore patterns.',
          'Circadian rhythm alignment improves mood, cognition, and immune function.',
          'Your one next step: Track your sleep-wake times for one week to find patterns.'
        ]
      }
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
    },
    contentLevels: {
      beginner: {
        title: 'Food Is Fuel and Comfort',
        subtitle: 'Eating is how we care for our bodies.',
        bulletPoints: [
          'There are no "bad" foods—all eating is valid.',
          'Try eating slowly and noticing how food tastes.',
          'Drinking water throughout the day helps you feel better.',
          'Your one next step: Enjoy your next meal without screens.'
        ]
      },
      intermediate: {
        title: 'Mindful Eating Practices',
        subtitle: 'Build a peaceful relationship with food and nourishment.',
        bulletPoints: [
          'Practice hunger awareness: eat when hungry, stop when satisfied.',
          'Notice emotional eating triggers without judgment.',
          'Add variety and color to meals for balanced nutrition.',
          'Your one next step: Before your next meal, pause and check your hunger level.'
        ]
      },
      advanced: {
        title: 'Gut-Brain Axis & Nourishment',
        subtitle: 'The gut microbiome influences mood and mental health (Mayer, 2016).',
        bulletPoints: [
          '90% of serotonin is produced in the gut; food affects mood directly.',
          'Intuitive eating research shows restriction often backfires (Tribole & Resch, 2012).',
          'Anti-inflammatory foods may support trauma recovery and nervous system health.',
          'Your one next step: Add one fermented or fiber-rich food to your day.'
        ]
      }
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
    },
    contentLevels: {
      beginner: {
        title: 'Move Your Body Gently',
        subtitle: 'Any movement counts—even stretching in bed.',
        bulletPoints: [
          'You don\'t have to exercise hard to feel better.',
          'Gentle stretching, walking, or dancing all count.',
          'Listen to your body—rest when you need to.',
          'Your one next step: Try stretching your arms above your head right now.'
        ]
      },
      intermediate: {
        title: 'Trauma-Sensitive Movement',
        subtitle: 'Move in ways that feel safe and honoring to your body.',
        bulletPoints: [
          'Choose movement that feels good, not punishing.',
          'Yoga, walking, swimming, and dance are gentle options.',
          'Notice how movement affects your mood and energy.',
          'Your one next step: Try a 10-minute gentle yoga or stretch routine.'
        ]
      },
      advanced: {
        title: 'Somatic Movement Science',
        subtitle: 'Movement releases stored tension and completes stress cycles (Nagoski & Nagoski, 2019).',
        bulletPoints: [
          'The body stores trauma; movement helps discharge stuck survival energy.',
          'Trauma-sensitive yoga improves PTSD symptoms (Van der Kolk, 2014).',
          'Bilateral movement (walking) supports nervous system integration.',
          'Your one next step: Try a "shake-out" practice to release tension.'
        ]
      }
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
    },
    contentLevels: {
      beginner: {
        title: 'Go Outside and Breathe',
        subtitle: 'Nature helps you feel calm and grounded.',
        bulletPoints: [
          'Even a few minutes outside can lift your mood.',
          'Look at the sky, touch a tree, or listen to birds.',
          'You don\'t need a forest—a window or houseplant counts.',
          'Your one next step: Step outside for 2 minutes and take 3 deep breaths.'
        ]
      },
      intermediate: {
        title: 'Nature as Medicine',
        subtitle: 'Regular nature exposure supports mental and physical health.',
        bulletPoints: [
          'Aim for 20+ minutes in nature 2–3 times per week.',
          'Try "forest bathing"—slow, mindful time in green spaces.',
          'Bring nature indoors with plants, natural light, or nature sounds.',
          'Your one next step: Schedule a 20-minute walk in a park this week.'
        ]
      },
      advanced: {
        title: 'Ecotherapy & Biophilia',
        subtitle: 'Nature exposure reduces cortisol and activates the parasympathetic system (Li, 2010).',
        bulletPoints: [
          'Biophilia hypothesis: humans have an innate need to connect with nature (Wilson, 1984).',
          'Shinrin-yoku (forest bathing) research shows reduced stress hormones and blood pressure.',
          'Nature connection correlates with lower depression, anxiety, and rumination.',
          'Your one next step: Try a "sit spot" practice—sit quietly in nature for 10 minutes.'
        ]
      }
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
    },
    contentLevels: {
      beginner: {
        title: 'Make Something—Anything',
        subtitle: 'Creativity isn\'t about being good; it\'s about expressing.',
        bulletPoints: [
          'Doodling, humming, or coloring all count as creative acts.',
          'You don\'t have to show anyone what you make.',
          'There\'s no wrong way to be creative.',
          'Your one next step: Draw a shape or hum a tune—just for you.'
        ]
      },
      intermediate: {
        title: 'Creative Expression Practice',
        subtitle: 'Use art, music, or writing to process emotions.',
        bulletPoints: [
          'Try journaling, drawing, singing, or playing music regularly.',
          'Create without judgment—focus on the process, not the product.',
          'Notice how creative expression shifts your mood.',
          'Your one next step: Spend 15 minutes on a creative activity today.'
        ]
      },
      advanced: {
        title: 'Art Therapy & Expressive Arts',
        subtitle: 'Creative expression accesses non-verbal processing pathways (Malchiodi, 2011).',
        bulletPoints: [
          'Trauma is often stored in non-verbal, right-brain areas; art bypasses words.',
          'Expressive arts therapy integrates visual art, music, movement, and writing.',
          'Creating externalizes internal experiences, making them more manageable.',
          'Your one next step: Try drawing how you feel without using words.'
        ]
      }
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
  // DESIGN SYSTEM - Component Catalog
  // =========================================================================
  {
    route: '/design-system',
    category: 'system',
    pageLabel: 'Design System',
    title: 'Sacred UI — Design System | The Genuine Love Project',
    description: 'Component catalog and design tokens for The Genuine Love Project. Accessible, trauma-informed, and built with care.',
    hero: {
      eyebrow: 'Design System',
      title: 'Sacred UI',
      titleHighlight: 'Components',
      subtitle: 'A comprehensive catalog of reusable, accessible, trauma-informed components built with care.',
      primaryCta: { label: 'View Components', href: '#components' },
      secondaryCta: { label: 'Get Started', href: '#colors' }
    },
    sections: [
      {
        id: 'colors',
        eyebrow: 'Foundation',
        title: 'Brand Colors',
        subtitle: 'Core palette designed for calm, clarity, and accessibility.',
        variant: 'glow',
        contentLevels: {
          beginner: { text: 'Our colors are chosen to feel calming and easy on the eyes.' },
          intermediate: { text: 'Each color serves a purpose: sage for healing, gold for highlights, deep teal for trust.' },
          advanced: { text: 'WCAG AA compliant contrast ratios. HSL-based token system for predictable theming.' }
        }
      },
      {
        id: 'components',
        eyebrow: 'UI Library',
        title: 'Core Components',
        subtitle: 'Reusable building blocks for consistent, accessible interfaces.',
        variant: 'pattern',
        cards: [
          { icon: 'Layout', title: 'LayoutWrapper', text: 'Page wrapper with skip links, reduced-motion support, and SEO.' },
          { icon: 'Star', title: 'Hero', text: 'Flexible hero section with eyebrow, title, subtitle, and CTAs.' },
          { icon: 'Layers', title: 'SectionContainer', text: 'Section wrapper with 4 variants: plain, glow, pattern, dark.' },
          { icon: 'Grid', title: 'Card & CardGrid', text: 'Content cards with icons, responsive grid layouts.' },
          { icon: 'Zap', title: 'Button', text: '4 variants (primary, secondary, ghost, gold) with 3 sizes.' },
          { icon: 'Heart', title: 'SafetyNotice', text: 'Crisis resources with 988 hotline prominently displayed.' },
          { icon: 'BookOpen', title: 'EvidenceNote', text: 'Research citations and evidence-based callouts.' },
          { icon: 'List', title: 'Steps', text: 'Numbered step lists and compact check lists.' },
          { icon: 'AlertCircle', title: 'Callout', text: '4 variants: info, warning, success, tip.' },
          { icon: 'Quote', title: 'Quote', text: 'Block quotes with author attribution.' }
        ],
        contentLevels: {
          beginner: { text: 'These are the basic pieces we use to build every page.' },
          intermediate: { text: 'Import from @/components/ui and compose pages with semantic structure.' },
          advanced: { text: 'All components use CSS custom properties (--glp-*) for theming. Full keyboard and screen reader support.' }
        }
      },
      {
        id: 'accessibility',
        eyebrow: 'Standards',
        title: 'Accessibility First',
        subtitle: 'Every component is built with accessibility as a foundation, not an afterthought.',
        variant: 'plain',
        cards: [
          { icon: 'Eye', title: 'Focus Visible', text: 'Clear focus indicators on all interactive elements.' },
          { icon: 'Keyboard', title: 'Keyboard Navigation', text: 'Full keyboard support throughout.' },
          { icon: 'MessageCircle', title: 'Screen Readers', text: 'Semantic HTML and ARIA labels.' },
          { icon: 'Zap', title: 'Reduced Motion', text: 'Respects prefers-reduced-motion preference.' }
        ]
      },
      {
        id: 'safety',
        eyebrow: 'Trauma-Informed',
        title: 'Safety Notice Component',
        subtitle: 'Crisis resources are always accessible.',
        variant: 'glow',
        contentLevels: {
          beginner: { text: 'If you ever need help, call 988 — it\'s free and available 24/7.' },
          intermediate: { text: 'The SafetyNotice component displays crisis resources in a gentle, non-alarming way.' },
          advanced: { text: 'Compliant with trauma-informed design principles. Never gated behind authentication.' }
        },
        modules: [
          { type: 'SafetyNotice' }
        ]
      }
    ]
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
