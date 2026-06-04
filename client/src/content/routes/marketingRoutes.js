// =============================================================================
// marketingRoutes — public marketing / informational pages (LOW RISK).
// Extracted verbatim from routes.js to reduce that file's size WITHOUT changing
// runtime behavior. Plain-data route objects (no dynamic params, no monetization,
// no healing/auth coupling). Merged back via `...marketingRoutes`, order preserved.
// =============================================================================
export const marketingRoutes = [
  {
    route: '/about',
    category: 'landing',
    pageLabel: 'About Us',
    title: 'About The Genuine Love Project — Our Mission & Approach',
    description: 'Learn about The Genuine Love Project, a trauma-informed mental wellness platform designed to foster self-love, healing, and emotional growth through evidence-based tools.',
    contentLevels: {
      beginner: {
        title: 'Who We Are',
        subtitle: 'A safe space for your healing journey.',
        bulletPoints: [
          'We believe healing begins with genuine love for yourself',
          'Our tools are designed to be gentle and accessible',
          'You move at your own pace—there is no rush',
          'Your one next step: Explore what feels right for you'
        ]
      },
      intermediate: {
        title: 'Our Approach',
        subtitle: 'Evidence-based tools with compassion at the core.',
        bulletPoints: [
          'All content is trauma-informed and research-backed',
          'We combine wisdom traditions with modern psychology',
          'Privacy and safety are our highest priorities',
          'Your one next step: Try one of our wellness tools'
        ]
      },
      advanced: {
        title: 'Our Foundation',
        subtitle: 'The principles that guide everything we do.',
        bulletPoints: [
          'Grounded in attachment theory, polyvagal theory, and IFS',
          'Educational platform—not therapy or medical care',
          'Built for adults 18+ seeking personal growth',
          'Your one next step: Dive into our healing library'
        ]
      }
    },
    hero: {
      eyebrow: 'About The Genuine Love Project',
      title: 'Healing Starts with',
      titleHighlight: 'Genuine Love.',
      subtitle: 'We created this platform to provide a private, compassionate, and accessible environment for emotional healing. Every tool here is designed with your safety and growth in mind.',
      primaryCta: { label: 'Go to Dashboard', href: '/dashboard' },
      secondaryCta: { label: 'View Our Approach', href: '/about/approach' }
    },
    modules: [
      { icon: 'Heart', title: 'Self-Compassion First', description: 'Everything begins with kindness toward yourself.' },
      { icon: 'Shield', title: 'Trauma-Informed', description: 'All content is designed to feel safe, not overwhelming.' },
      { icon: 'Brain', title: 'Evidence-Based', description: 'Grounded in research and proven psychological frameworks.' }
    ],
    sections: [
      {
        id: 'mission',
        eyebrow: 'Our Mission',
        title: 'Helping you live in genuine love',
        subtitle: 'We believe everyone deserves access to high-quality mental wellness resources.',
        variant: 'glow',
        bullets: [
          'Provide evidence-based tools for emotional healing',
          'Create a safe, private space for personal growth',
          'Make mental wellness accessible to everyone',
          'Support you at every stage of your journey'
        ]
      },
      {
        id: 'values',
        eyebrow: 'Our Values',
        title: 'What guides everything we do',
        subtitle: 'These principles are woven into every tool, every page, every interaction.',
        variant: 'pattern',
        cards: [
          { icon: 'Heart', title: 'Compassion', text: 'We approach every user with warmth and understanding.' },
          { icon: 'Lock', title: 'Privacy', text: 'Your journey is yours alone. We protect it fiercely.' },
          { icon: 'Sparkles', title: 'Accessibility', text: 'Quality wellness tools should be available to everyone.' },
          { icon: 'Brain', title: 'Integrity', text: 'We only share what is backed by research and wisdom.' }
        ]
      }
    ]
  },
  {
    route: '/about/approach',
    category: 'landing',
    pageLabel: 'Our Approach',
    title: 'Our Approach — The Genuine Love Project',
    description: 'Discover the evidence-based, trauma-informed principles that guide The Genuine Love Project. Learn how we combine wisdom traditions with modern psychology.',
    contentLevels: {
      beginner: {
        title: 'How We Help',
        subtitle: 'Simple, gentle tools for real healing.',
        bulletPoints: [
          'We focus on what works, backed by research',
          'Everything is designed to feel safe',
          'You are always in control of your experience',
          'Your one next step: Try a breathing exercise'
        ]
      },
      intermediate: {
        title: 'Our Methods',
        subtitle: 'The frameworks behind our tools.',
        bulletPoints: [
          'Somatic practices for body-based healing',
          'Nervous system regulation techniques',
          'Mindfulness and present-moment awareness',
          'Your one next step: Explore our healing library'
        ]
      },
      advanced: {
        title: 'Theoretical Foundations',
        subtitle: 'The research that informs our approach.',
        bulletPoints: [
          'Polyvagal Theory by Dr. Stephen Porges',
          'Internal Family Systems (IFS) by Dr. Richard Schwartz',
          'Somatic Experiencing by Dr. Peter Levine',
          'Your one next step: Read our research summaries'
        ]
      }
    },
    hero: {
      eyebrow: 'Our Approach',
      title: 'Trauma-Informed,',
      titleHighlight: 'Evidence-Based.',
      subtitle: 'Every tool and practice on this platform is grounded in research and designed with your nervous system in mind. We believe healing happens when you feel truly safe.',
      primaryCta: { label: 'Explore Tools', href: '/tools' },
      secondaryCta: { label: 'Back to About', href: '/about' }
    },
    modules: [
      { icon: 'Activity', title: 'Somatic Practices', description: 'Body-based approaches to release stored tension.' },
      { icon: 'Brain', title: 'Nervous System Care', description: 'Tools to expand your window of tolerance.' },
      { icon: 'Eye', title: 'Inner Work', description: 'Gentle exploration of your inner landscape.' }
    ],
    sections: [
      {
        id: 'principles',
        eyebrow: 'Core Principles',
        title: 'What makes our approach different',
        subtitle: 'These principles guide every tool, every word, every interaction.',
        variant: 'glow',
        cards: [
          { icon: 'Shield', title: 'Safety First', text: 'Nothing here will push you faster than you are ready for.' },
          { icon: 'Heart', title: 'Self-Compassion', text: 'We meet you with kindness, exactly as you are.' },
          { icon: 'Compass', title: 'Your Pace', text: 'You are the expert on your own experience.' },
          { icon: 'Sparkles', title: 'Gentle Progress', text: 'Small steps are celebrated. Hard days are honored.' }
        ]
      }
    ]
  },
  {
    route: '/features',
    category: 'landing',
    pageLabel: 'Platform Features',
    title: 'Features — The Genuine Love Project',
    description: 'Discover the full suite of wellness tools, AI-powered therapy, journaling, mood tracking, and healing resources available on The Genuine Love Project platform.',
    contentLevels: {
      beginner: {
        title: 'What You Can Do Here',
        subtitle: 'Simple tools designed for your wellness journey.',
        bulletPoints: [
          'Journal your thoughts in a safe, private space',
          'Track your mood to understand patterns',
          'Access guided breathing and grounding exercises',
          'Your one next step: Try one tool that feels right'
        ]
      },
      intermediate: {
        title: 'Your Wellness Toolkit',
        subtitle: 'Evidence-based tools for deeper exploration.',
        bulletPoints: [
          'AI-powered chat for emotional support',
          'Personalized healing recommendations',
          'Progress tracking and streak rewards',
          'Your one next step: Explore the dashboard'
        ]
      },
      advanced: {
        title: 'Premium Features',
        subtitle: 'Advanced tools for your transformation.',
        bulletPoints: [
          'Access to 500+ specialized wellness modules',
          'Deep-dive healing protocols and frameworks',
          'Priority AI support with enhanced context',
          'Your one next step: Upgrade your experience'
        ]
      }
    },
    hero: {
      eyebrow: 'Platform Features',
      title: 'Everything you need',
      titleHighlight: 'to heal and grow.',
      subtitle: 'From simple breathing exercises to AI-powered therapy, our platform offers a comprehensive toolkit designed to support your unique journey toward genuine self-love.',
      primaryCta: { label: 'Get Started Free', href: '/register' },
      secondaryCta: { label: 'View Pricing', href: '/pricing' }
    },
    modules: [
      { icon: 'MessageCircle', title: 'AI Therapy Chat', description: 'Compassionate, trauma-informed AI support available 24/7.' },
      { icon: 'BookOpen', title: 'Journaling', description: 'Private space to process thoughts and emotions.' },
      { icon: 'Activity', title: 'Mood Tracking', description: 'Understand your emotional patterns over time.' },
      { icon: 'Brain', title: 'Wellness Tools', description: 'Breathing, grounding, and somatic exercises.' },
      { icon: 'Award', title: 'Progress Tracking', description: 'Celebrate your growth with streaks and achievements.' },
      { icon: 'Shield', title: 'Crisis Support', description: 'Immediate access to crisis resources when needed.' }
    ],
    sections: [
      {
        id: 'core-tools',
        eyebrow: 'Core Tools',
        title: 'Free tools to start your journey',
        subtitle: 'These foundational tools are available to everyone, no subscription required.',
        variant: 'glow',
        cards: [
          { icon: 'BookOpen', title: 'Daily Journal', text: 'Write freely in your private digital journal.' },
          { icon: 'Activity', title: 'Mood Check-In', text: 'Quick emotional check-ins to track your state.' },
          { icon: 'Wind', title: 'Breathing Exercises', text: 'Guided breathing for calm and regulation.' },
          { icon: 'Heart', title: 'Affirmations', text: 'Daily words of encouragement and self-love.' }
        ]
      },
      {
        id: 'premium-tools',
        eyebrow: 'Premium Features',
        title: 'Advanced tools for deeper healing',
        subtitle: 'Unlock the full power of the platform with a subscription.',
        variant: 'pattern',
        cards: [
          { icon: 'MessageCircle', title: 'Unlimited AI Chat', text: 'No limits on your therapeutic conversations.' },
          { icon: 'Target', title: 'Personalized Paths', text: 'Custom healing journeys based on your needs.' },
          { icon: 'Zap', title: 'Elite Tools', text: 'Advanced cognitive and emotional exercises.' },
          { icon: 'Star', title: 'Priority Support', text: 'Enhanced AI responses and faster processing.' }
        ]
      }
    ]
  },
  {
    route: '/testimonials',
    category: 'landing',
    pageLabel: 'Testimonials',
    title: 'Testimonials — The Genuine Love Project',
    description: 'Real stories from real people who have experienced healing and growth through The Genuine Love Project platform.',
    contentLevels: {
      beginner: {
        title: 'Stories of Hope',
        subtitle: 'Hear from others who started exactly where you are.',
        bulletPoints: [
          'Every journey begins with a single step',
          'You are not alone in what you are feeling',
          'Small changes can lead to meaningful transformation',
          'Your one next step: Read one story that resonates with you'
        ]
      },
      intermediate: {
        title: 'Journeys of Growth',
        subtitle: 'Discover how others have used these tools.',
        bulletPoints: [
          'Learn which features helped others most',
          'See real progress from consistent practice',
          'Find inspiration in shared experiences',
          'Your one next step: Consider starting your own journey'
        ]
      },
      advanced: {
        title: 'Transformation Stories',
        subtitle: 'In-depth accounts of personal growth and healing.',
        bulletPoints: [
          'Deep dives into individual healing journeys',
          'Insights from long-term platform users',
          'Evidence of sustainable emotional wellness',
          'Your one next step: Join our community of growth'
        ]
      }
    },
    hero: {
      eyebrow: 'Stories of Healing',
      title: 'Real people.',
      titleHighlight: 'Real transformation.',
      subtitle: 'These are the voices of people who have walked the path of healing. Their stories remind us that change is possible, one gentle step at a time.',
      primaryCta: { label: 'Try It Free', href: '/register' },
      secondaryCta: { label: 'Explore Features', href: '/features' }
    },
    modules: [
      { icon: 'Heart', title: 'Self-Love', description: 'Stories of learning to embrace and accept oneself.' },
      { icon: 'Sparkles', title: 'Growth', description: 'Journeys of personal development and transformation.' },
      { icon: 'Shield', title: 'Healing', description: 'Accounts of recovery and emotional wellness.' }
    ],
    sections: [
      {
        id: 'featured-stories',
        eyebrow: 'Featured Stories',
        title: 'Voices from our community',
        subtitle: 'Each story is unique, yet they all share a common thread of hope and resilience.',
        variant: 'glow',
        cards: [
          { icon: 'Quote', title: 'Finding Peace', text: '"I never thought I could feel calm again. The breathing exercises changed everything for me."' },
          { icon: 'Quote', title: 'Learning Self-Compassion', text: '"The AI companion helped me see myself the way a loving friend would. That perspective shift was everything."' },
          { icon: 'Quote', title: 'Daily Practice', text: '"Journaling every morning has become my sanctuary. I finally have a safe space to process my thoughts."' },
          { icon: 'Quote', title: 'Reconnecting', text: '"Through inner child work, I reconnected with parts of myself I had forgotten. Healing is real."' }
        ]
      },
      {
        id: 'impact',
        eyebrow: 'Our Impact',
        title: 'The ripple effect of healing',
        subtitle: 'When one person heals, it touches everyone around them.',
        variant: 'pattern',
        bullets: [
          'Thousands of journal entries written in safe, private spaces',
          'Countless moments of calm found through breathing exercises',
          'Daily check-ins helping people understand their emotional patterns',
          'A growing community supporting each other in healing'
        ]
      }
    ]
  },
];
