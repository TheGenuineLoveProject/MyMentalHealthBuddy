import { 
  Heart, Shield, Brain, Sparkles, Star, Sun, Moon, Leaf, 
  BookOpen, MessageCircle, Users, Zap, Target, Compass,
  Activity, TrendingUp, Clock, Eye, Lightbulb, Award,
  FileText, Settings, Lock, CreditCard, HelpCircle, Mail,
  Scale, AlertTriangle, Bookmark, Palette, Layout, PenTool,
  BarChart, Calendar, MapPin, Mic, Camera, Video,
  Database, Code, Terminal, Cloud, Globe, Link
} from 'lucide-react';

export const routeCategories = {
  landing: 'Landing',
  auth: 'Authentication',
  core: 'Core Experience',
  wellness: 'Wellness Tools',
  healing: 'Healing Resources',
  wisdom: 'Wisdom & Growth',
  advanced: 'Advanced Tools',
  community: 'Community',
  content: 'Content & Resources',
  admin: 'Admin',
  legal: 'Legal',
  support: 'Support'
};

export const routes = [
  {
    route: '/',
    category: 'landing',
    title: 'The Genuine Love Project — Your Sanctuary for Emotional Healing',
    description: 'A trauma-informed sanctuary for emotional healing. AI-powered therapy tools, inner child work, nervous system regulation, and parts work—all in complete privacy.',
    hero: {
      eyebrow: 'Trusted by 50,000+ healing hearts',
      title: 'Your sanctuary for emotional healing',
      titleHighlight: 'where transformation happens at your own pace.',
      subtitle: 'A trauma-informed space built for people who carry more than they show. Process grief, calm your nervous system, heal attachment wounds, meet your inner child—all in complete privacy.',
      primaryCta: { label: 'Begin Your Journey', href: '/register' },
      secondaryCta: { label: 'Learn More', href: '#features' }
    },
    sections: [
      {
        id: 'pathways',
        eyebrow: 'Sacred Pathways',
        title: 'Healing tools designed with compassion',
        subtitle: 'Evidence-based approaches wrapped in gentle, trauma-informed care.',
        variant: 'glow',
        cards: [
          { icon: 'Heart', title: 'Inner Child Work', text: 'Reconnect with your younger self through guided healing exercises.' },
          { icon: 'Brain', title: 'Nervous System Care', text: 'Learn to regulate your nervous system with somatic practices.' },
          { icon: 'Shield', title: 'Parts Work', text: 'Understand and integrate all parts of yourself with IFS-inspired tools.' },
          { icon: 'Sparkles', title: 'AI Companion', text: '24/7 trauma-informed AI support for your healing journey.' }
        ]
      },
      {
        id: 'features',
        eyebrow: 'Platform Features',
        title: 'Everything you need to heal',
        subtitle: 'A comprehensive toolkit for your emotional wellness journey.',
        variant: 'pattern',
        cards: [
          { icon: 'BookOpen', title: 'Guided Journaling', text: 'Process emotions with therapeutic writing prompts.' },
          { icon: 'Activity', title: 'State Tracking', text: 'Monitor your emotional patterns and progress over time.' },
          { icon: 'MessageCircle', title: 'AI Therapy Chat', text: 'Compassionate conversations whenever you need support.' },
          { icon: 'Users', title: 'Community Support', text: 'Connect with others on similar healing journeys.' }
        ]
      }
    ],
    protected: false
  },
  {
    route: '/healing',
    category: 'landing',
    title: 'Healing Hub — The Genuine Love Project',
    description: 'Discover evidence-based healing modalities for trauma recovery, emotional regulation, and personal growth.',
    hero: {
      eyebrow: 'Your Healing Journey Starts Here',
      title: 'Gentle pathways to',
      titleHighlight: 'emotional freedom.',
      subtitle: 'Explore trauma-informed healing tools, somatic practices, and therapeutic techniques designed to support your unique journey.',
      primaryCta: { label: 'Explore Healing Tools', href: '/healing-library' },
      secondaryCta: { label: 'View Resources', href: '/resources' }
    },
    sections: [
      {
        id: 'modalities',
        eyebrow: 'Healing Modalities',
        title: 'Evidence-based approaches',
        subtitle: 'Therapeutic techniques backed by research and wrapped in compassion.',
        variant: 'glow',
        cards: [
          { icon: 'Heart', title: 'Somatic Healing', text: 'Body-based practices to release stored trauma.' },
          { icon: 'Brain', title: 'EMDR-Inspired', text: 'Bilateral stimulation for processing difficult memories.' },
          { icon: 'Leaf', title: 'Mindfulness', text: 'Present-moment awareness for emotional regulation.' },
          { icon: 'Shield', title: 'Parts Work (IFS)', text: 'Internal Family Systems for self-understanding.' }
        ]
      }
    ],
    protected: false
  },
  {
    route: '/login',
    category: 'auth',
    title: 'Sign In — The Genuine Love Project',
    description: 'Welcome back to your healing sanctuary. Sign in to continue your journey.',
    hero: {
      eyebrow: 'Welcome Back',
      title: 'Continue your',
      titleHighlight: 'healing journey.',
      subtitle: 'Your progress and insights are waiting for you.',
      primaryCta: { label: 'Sign In', href: '#login-form' },
      secondaryCta: { label: 'Create Account', href: '/register' }
    },
    sections: [],
    protected: false,
    isAuthPage: true
  },
  {
    route: '/register',
    category: 'auth',
    title: 'Create Account — The Genuine Love Project',
    description: 'Join thousands on their healing journey. Create your free account today.',
    hero: {
      eyebrow: 'Begin Your Journey',
      title: 'Create your',
      titleHighlight: 'healing sanctuary.',
      subtitle: 'A safe, private space designed just for you.',
      primaryCta: { label: 'Get Started Free', href: '#register-form' },
      secondaryCta: { label: 'Already have an account?', href: '/login' }
    },
    sections: [],
    protected: false,
    isAuthPage: true
  },
  {
    route: '/forgot-password',
    category: 'auth',
    title: 'Reset Password — The Genuine Love Project',
    description: 'Reset your password to regain access to your healing sanctuary.',
    hero: {
      eyebrow: 'Password Recovery',
      title: 'Reset your',
      titleHighlight: 'password.',
      subtitle: 'We\'ll send you a secure link to create a new password.',
      primaryCta: { label: 'Send Reset Link', href: '#reset-form' },
      secondaryCta: { label: 'Back to Sign In', href: '/login' }
    },
    sections: [],
    protected: false,
    isAuthPage: true
  },
  {
    route: '/dashboard',
    category: 'core',
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
    ],
    protected: true
  },
  {
    route: '/today',
    category: 'core',
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
    sections: [],
    protected: true
  },
  {
    route: '/journal',
    category: 'core',
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
    ],
    protected: true
  },
  {
    route: '/chat',
    category: 'core',
    title: 'AI Companion — The Genuine Love Project',
    description: 'Your 24/7 trauma-informed AI companion for emotional support and guidance.',
    hero: {
      eyebrow: 'Always Here For You',
      title: 'A compassionate ear',
      titleHighlight: 'whenever you need it.',
      subtitle: 'Talk through anything with our trauma-informed AI companion.',
      primaryCta: { label: 'Start Conversation', href: '#chat' },
      secondaryCta: { label: 'Learn About AI Safety', href: '/safety' }
    },
    sections: [],
    protected: true
  },
  {
    route: '/mood',
    category: 'core',
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
    sections: [],
    protected: true
  },
  {
    route: '/state',
    category: 'core',
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
    sections: [],
    protected: true
  },
  {
    route: '/analytics',
    category: 'core',
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
    sections: [],
    protected: true
  },
  {
    route: '/settings',
    category: 'core',
    title: 'Settings — The Genuine Love Project',
    description: 'Customize your healing sanctuary to suit your needs.',
    hero: {
      eyebrow: 'Personalization',
      title: 'Make this space',
      titleHighlight: 'truly yours.',
      subtitle: 'Customize notifications, privacy, and display preferences.',
      primaryCta: { label: 'Edit Profile', href: '#profile' },
      secondaryCta: { label: 'Privacy Settings', href: '#privacy' }
    },
    sections: [],
    protected: true
  },
  {
    route: '/breathing',
    category: 'wellness',
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
    ],
    protected: false
  },
  {
    route: '/grounding',
    category: 'wellness',
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
    ],
    protected: false
  },
  {
    route: '/meditation',
    category: 'wellness',
    title: 'Meditation Guide — The Genuine Love Project',
    description: 'Guided meditations for healing, relaxation, and inner peace.',
    hero: {
      eyebrow: 'Inner Stillness',
      title: 'Discover peace',
      titleHighlight: 'within yourself.',
      subtitle: 'Guided meditations for every mood and moment.',
      primaryCta: { label: 'Start Meditating', href: '#meditations' },
      secondaryCta: { label: 'Quick 3-Minute', href: '#quick' }
    },
    sections: [
      {
        id: 'types',
        eyebrow: 'Meditation Types',
        title: 'Find your practice',
        subtitle: 'Different styles for different needs.',
        variant: 'glow',
        cards: [
          { icon: 'Heart', title: 'Loving-Kindness', text: 'Cultivate compassion for self and others.' },
          { icon: 'Leaf', title: 'Mindfulness', text: 'Present-moment awareness without judgment.' },
          { icon: 'Brain', title: 'Body Scan', text: 'Release tension stored in the body.' },
          { icon: 'Sparkles', title: 'Visualization', text: 'Healing imagery for the subconscious.' }
        ]
      }
    ],
    protected: false
  },
  {
    route: '/affirmations',
    category: 'wellness',
    title: 'Affirmations — The Genuine Love Project',
    description: 'Positive affirmations for healing, self-love, and personal growth.',
    hero: {
      eyebrow: 'Positive Self-Talk',
      title: 'Rewire your mind with',
      titleHighlight: 'loving words.',
      subtitle: 'Affirmations that speak to your healing journey.',
      primaryCta: { label: 'Daily Affirmation', href: '#daily' },
      secondaryCta: { label: 'Create Your Own', href: '#custom' }
    },
    sections: [
      {
        id: 'categories',
        eyebrow: 'Categories',
        title: 'Affirmation themes',
        subtitle: 'Words of healing for every need.',
        variant: 'pattern',
        cards: [
          { icon: 'Heart', title: 'Self-Love', text: 'Embrace and accept yourself fully.' },
          { icon: 'Shield', title: 'Boundaries', text: 'Honor your needs and limits.' },
          { icon: 'Sun', title: 'Hope', text: 'Believe in your capacity to heal.' },
          { icon: 'Star', title: 'Worth', text: 'Know your inherent value.' }
        ]
      }
    ],
    protected: false
  },
  {
    route: '/self-care',
    category: 'wellness',
    title: 'Self-Care Toolkit — The Genuine Love Project',
    description: 'Practical self-care tools and practices for daily wellness.',
    hero: {
      eyebrow: 'Nurturing Yourself',
      title: 'Self-care is',
      titleHighlight: 'not selfish.',
      subtitle: 'Practical tools to nurture your body, mind, and spirit.',
      primaryCta: { label: 'Build Your Toolkit', href: '#toolkit' },
      secondaryCta: { label: 'Quick Self-Care', href: '#quick' }
    },
    sections: [
      {
        id: 'areas',
        eyebrow: 'Self-Care Areas',
        title: 'Holistic wellness',
        subtitle: 'Care for all aspects of your being.',
        variant: 'glow',
        cards: [
          { icon: 'Activity', title: 'Physical', text: 'Movement, rest, and nourishment.' },
          { icon: 'Brain', title: 'Mental', text: 'Boundaries, stimulation, and quiet.' },
          { icon: 'Heart', title: 'Emotional', text: 'Expression, connection, and validation.' },
          { icon: 'Sparkles', title: 'Spiritual', text: 'Meaning, purpose, and transcendence.' }
        ]
      }
    ],
    protected: false
  },
  {
    route: '/calming-scenes',
    category: 'wellness',
    title: 'Calming Scenes — The Genuine Love Project',
    description: 'Immersive visual and audio experiences for relaxation.',
    hero: {
      eyebrow: 'Peaceful Escapes',
      title: 'Find serenity in',
      titleHighlight: 'beautiful places.',
      subtitle: 'Immersive scenes to calm your mind and soothe your soul.',
      primaryCta: { label: 'Explore Scenes', href: '#scenes' },
      secondaryCta: { label: 'Sleep Sounds', href: '#sounds' }
    },
    sections: [],
    protected: false
  },
  {
    route: '/sleep-guide',
    category: 'wellness',
    title: 'Sleep Guide — The Genuine Love Project',
    description: 'Tools and techniques for better, more restful sleep.',
    hero: {
      eyebrow: 'Restful Nights',
      title: 'Embrace deep,',
      titleHighlight: 'healing sleep.',
      subtitle: 'Evidence-based approaches to improve your sleep quality.',
      primaryCta: { label: 'Sleep Assessment', href: '#assessment' },
      secondaryCta: { label: 'Tonight\'s Routine', href: '#routine' }
    },
    sections: [],
    protected: false
  },
  {
    route: '/stress-response',
    category: 'wellness',
    title: 'Stress Response Guide — The Genuine Love Project',
    description: 'Understand and regulate your stress response system.',
    hero: {
      eyebrow: 'Nervous System Education',
      title: 'Understand your',
      titleHighlight: 'stress response.',
      subtitle: 'Learn about fight, flight, freeze, and fawn responses.',
      primaryCta: { label: 'Take Assessment', href: '#assessment' },
      secondaryCta: { label: 'Learn Regulation', href: '#regulation' }
    },
    sections: [],
    protected: false
  },
  {
    route: '/emotional-intelligence',
    category: 'wellness',
    title: 'Emotional Intelligence — The Genuine Love Project',
    description: 'Develop your emotional awareness and regulation skills.',
    hero: {
      eyebrow: 'EQ Development',
      title: 'Master the art of',
      titleHighlight: 'emotional wisdom.',
      subtitle: 'Build skills for understanding and managing emotions.',
      primaryCta: { label: 'Start Learning', href: '#modules' },
      secondaryCta: { label: 'EQ Assessment', href: '#assessment' }
    },
    sections: [],
    protected: false
  },
  {
    route: '/inner-child',
    category: 'healing',
    title: 'Inner Child Work — The Genuine Love Project',
    description: 'Reconnect with and heal your inner child through guided exercises.',
    hero: {
      eyebrow: 'Inner Child Healing',
      title: 'Reconnect with your',
      titleHighlight: 'younger self.',
      subtitle: 'Gentle exercises to heal childhood wounds and reclaim lost joy.',
      primaryCta: { label: 'Meet Your Inner Child', href: '#exercises' },
      secondaryCta: { label: 'Learn About Inner Child', href: '#learn' }
    },
    sections: [
      {
        id: 'exercises',
        eyebrow: 'Healing Exercises',
        title: 'Inner child practices',
        subtitle: 'Safe, guided ways to connect with younger parts.',
        variant: 'glow',
        cards: [
          { icon: 'Heart', title: 'Letter Writing', text: 'Write to your younger self with compassion.' },
          { icon: 'Eye', title: 'Visualization', text: 'Visit and comfort your inner child.' },
          { icon: 'MessageCircle', title: 'Dialogue', text: 'Learn what your inner child needs.' },
          { icon: 'Star', title: 'Reparenting', text: 'Give yourself what you needed then.' }
        ]
      }
    ],
    protected: false
  },
  {
    route: '/healing-library',
    category: 'healing',
    title: 'Healing Library — The Genuine Love Project',
    description: 'A comprehensive library of healing resources and modalities.',
    hero: {
      eyebrow: 'Knowledge Base',
      title: 'Your library of',
      titleHighlight: 'healing wisdom.',
      subtitle: 'Evidence-based resources for your healing journey.',
      primaryCta: { label: 'Browse Library', href: '#library' },
      secondaryCta: { label: 'Recommended', href: '#recommended' }
    },
    sections: [],
    protected: false
  },
  {
    route: '/healing-journeys',
    category: 'healing',
    title: 'Healing Journeys — The Genuine Love Project',
    description: 'Structured healing pathways for specific challenges.',
    hero: {
      eyebrow: 'Guided Pathways',
      title: 'Structured paths to',
      titleHighlight: 'lasting healing.',
      subtitle: 'Multi-week journeys designed for specific healing goals.',
      primaryCta: { label: 'Choose Your Path', href: '#paths' },
      secondaryCta: { label: 'Continue Journey', href: '#continue' }
    },
    sections: [],
    protected: false
  },
  {
    route: '/body-wellness',
    category: 'healing',
    title: 'Body Wellness — The Genuine Love Project',
    description: 'Somatic practices for body-based healing and awareness.',
    hero: {
      eyebrow: 'Somatic Healing',
      title: 'The body keeps',
      titleHighlight: 'the score.',
      subtitle: 'Somatic practices to release trauma stored in the body.',
      primaryCta: { label: 'Body Practices', href: '#practices' },
      secondaryCta: { label: 'Body Scan', href: '#scan' }
    },
    sections: [],
    protected: false
  },
  {
    route: '/soul-wellness',
    category: 'healing',
    title: 'Soul Wellness — The Genuine Love Project',
    description: 'Spiritual practices for meaning, purpose, and transcendence.',
    hero: {
      eyebrow: 'Spiritual Nourishment',
      title: 'Nurture your',
      titleHighlight: 'deepest self.',
      subtitle: 'Practices for meaning, purpose, and spiritual connection.',
      primaryCta: { label: 'Soul Practices', href: '#practices' },
      secondaryCta: { label: 'Daily Reflection', href: '#reflection' }
    },
    sections: [],
    protected: false
  },
  {
    route: '/crisis',
    category: 'healing',
    title: 'Crisis Resources — The Genuine Love Project',
    description: 'Immediate support and resources for moments of crisis.',
    hero: {
      eyebrow: 'You Are Not Alone',
      title: 'Crisis support',
      titleHighlight: 'is available.',
      subtitle: 'Immediate resources and grounding techniques for difficult moments.',
      primaryCta: { label: 'Get Help Now', href: '#resources' },
      secondaryCta: { label: 'Grounding Exercise', href: '/grounding' }
    },
    sections: [],
    protected: true
  },
  {
    route: '/wisdom',
    category: 'wisdom',
    title: 'Wisdom Tools — The Genuine Love Project',
    description: 'Deep wisdom practices for personal growth and insight.',
    hero: {
      eyebrow: 'Deep Wisdom',
      title: 'Cultivate inner',
      titleHighlight: 'wisdom.',
      subtitle: 'Practices that connect you to deeper knowing.',
      primaryCta: { label: 'Explore Wisdom', href: '#tools' },
      secondaryCta: { label: 'Daily Oracle', href: '/daily-wisdom' }
    },
    sections: [],
    protected: true
  },
  {
    route: '/wisdom-practices',
    category: 'wisdom',
    title: 'Wisdom Practices — The Genuine Love Project',
    description: 'Daily practices for cultivating wisdom and insight.',
    hero: {
      eyebrow: 'Daily Wisdom',
      title: 'Small practices,',
      titleHighlight: 'profound shifts.',
      subtitle: 'Daily rituals that cultivate deep wisdom over time.',
      primaryCta: { label: 'Start Practice', href: '#practices' },
      secondaryCta: { label: 'Build Habit', href: '#habit' }
    },
    sections: [],
    protected: true
  },
  {
    route: '/wisdom-synthesis',
    category: 'wisdom',
    title: 'Wisdom Synthesis — The Genuine Love Project',
    description: 'Integrate insights from multiple wisdom traditions.',
    hero: {
      eyebrow: 'Integrated Wisdom',
      title: 'Ancient wisdom meets',
      titleHighlight: 'modern science.',
      subtitle: 'Synthesize insights from psychology, philosophy, and spirituality.',
      primaryCta: { label: 'Explore Synthesis', href: '#synthesis' },
      secondaryCta: { label: 'Traditions', href: '#traditions' }
    },
    sections: [],
    protected: true
  },
  {
    route: '/daily-wisdom',
    category: 'wisdom',
    title: 'Daily Wisdom Oracle — The Genuine Love Project',
    description: 'Receive daily wisdom and guidance for your journey.',
    hero: {
      eyebrow: 'Daily Guidance',
      title: 'Your daily dose of',
      titleHighlight: 'sacred wisdom.',
      subtitle: 'Receive a personalized insight each day.',
      primaryCta: { label: 'Draw Card', href: '#oracle' },
      secondaryCta: { label: 'Past Readings', href: '#history' }
    },
    sections: [],
    protected: true
  },
  {
    route: '/tools',
    category: 'advanced',
    title: 'Tools — The Genuine Love Project',
    description: 'Your complete toolkit for healing and personal growth.',
    hero: {
      eyebrow: 'Your Toolkit',
      title: 'All tools in',
      titleHighlight: 'one place.',
      subtitle: 'Quick access to every healing resource.',
      primaryCta: { label: 'Browse All', href: '#all' },
      secondaryCta: { label: 'Favorites', href: '#favorites' }
    },
    sections: [],
    protected: true
  },
  {
    route: '/advanced',
    category: 'advanced',
    title: 'Advanced Tools — The Genuine Love Project',
    description: 'Deep-dive tools for experienced practitioners.',
    hero: {
      eyebrow: 'Advanced Practice',
      title: 'Go deeper into',
      titleHighlight: 'your healing.',
      subtitle: 'Sophisticated tools for the committed practitioner.',
      primaryCta: { label: 'Advanced Tools', href: '#tools' },
      secondaryCta: { label: 'Readiness Check', href: '#check' }
    },
    sections: [],
    protected: true
  },
  {
    route: '/mastery',
    category: 'advanced',
    title: 'Mastery Tools — The Genuine Love Project',
    description: 'Elite-level tools for healing mastery.',
    hero: {
      eyebrow: 'Mastery Path',
      title: 'Master the art of',
      titleHighlight: 'self-healing.',
      subtitle: 'Premium tools for those committed to deep transformation.',
      primaryCta: { label: 'Mastery Suite', href: '#suite' },
      secondaryCta: { label: 'Prerequisites', href: '#prereq' }
    },
    sections: [],
    protected: true
  },
  {
    route: '/ritual',
    category: 'advanced',
    title: 'Daily Ritual — The Genuine Love Project',
    description: 'Create and maintain healing rituals.',
    hero: {
      eyebrow: 'Sacred Rituals',
      title: 'Transform your day with',
      titleHighlight: 'intentional rituals.',
      subtitle: 'Build consistent practices that anchor your healing.',
      primaryCta: { label: 'Create Ritual', href: '#create' },
      secondaryCta: { label: 'Morning Ritual', href: '#morning' }
    },
    sections: [],
    protected: true
  },
  {
    route: '/atlas',
    category: 'advanced',
    title: 'Intellectual Atlas — The Genuine Love Project',
    description: 'Map your knowledge and growth across domains.',
    hero: {
      eyebrow: 'Knowledge Mapping',
      title: 'Navigate your',
      titleHighlight: 'intellectual landscape.',
      subtitle: 'Visualize connections between concepts and insights.',
      primaryCta: { label: 'Open Atlas', href: '#atlas' },
      secondaryCta: { label: 'Add Concept', href: '#add' }
    },
    sections: [],
    protected: true
  },
  {
    route: '/strategy-maps',
    category: 'advanced',
    title: 'Strategy Maps — The Genuine Love Project',
    description: 'Visual strategies for achieving your healing goals.',
    hero: {
      eyebrow: 'Strategic Planning',
      title: 'Map your path to',
      titleHighlight: 'lasting change.',
      subtitle: 'Visual planning tools for your healing journey.',
      primaryCta: { label: 'Create Map', href: '#create' },
      secondaryCta: { label: 'Templates', href: '#templates' }
    },
    sections: [],
    protected: true
  },
  {
    route: '/meta-learning',
    category: 'advanced',
    title: 'Meta Learning — The Genuine Love Project',
    description: 'Learn how to learn more effectively.',
    hero: {
      eyebrow: 'Learning Mastery',
      title: 'Accelerate your',
      titleHighlight: 'learning capacity.',
      subtitle: 'Techniques to learn faster and retain more.',
      primaryCta: { label: 'Start Learning', href: '#start' },
      secondaryCta: { label: 'Assessment', href: '#assessment' }
    },
    sections: [],
    protected: true
  },
  {
    route: '/systems-thinking',
    category: 'advanced',
    title: 'Systems Thinking — The Genuine Love Project',
    description: 'See the bigger picture of your life patterns.',
    hero: {
      eyebrow: 'Holistic View',
      title: 'See the systems',
      titleHighlight: 'shaping your life.',
      subtitle: 'Understand how all the pieces of your life connect.',
      primaryCta: { label: 'Map Systems', href: '#map' },
      secondaryCta: { label: 'Learn Basics', href: '#basics' }
    },
    sections: [],
    protected: true
  },
  {
    route: '/cognitive-architecture',
    category: 'advanced',
    title: 'Cognitive Architecture — The Genuine Love Project',
    description: 'Understand and optimize your mental patterns.',
    hero: {
      eyebrow: 'Mind Mapping',
      title: 'Architect your',
      titleHighlight: 'optimal mind.',
      subtitle: 'Understand and reshape your cognitive patterns.',
      primaryCta: { label: 'Start Mapping', href: '#map' },
      secondaryCta: { label: 'Assessment', href: '#assessment' }
    },
    sections: [],
    protected: true
  },
  {
    route: '/philosophical-inquiry',
    category: 'advanced',
    title: 'Philosophical Inquiry — The Genuine Love Project',
    description: 'Deep questions for profound self-understanding.',
    hero: {
      eyebrow: 'Deep Questions',
      title: 'Explore life\'s',
      titleHighlight: 'biggest questions.',
      subtitle: 'Philosophical inquiry as a path to self-knowledge.',
      primaryCta: { label: 'Begin Inquiry', href: '#inquiry' },
      secondaryCta: { label: 'Topics', href: '#topics' }
    },
    sections: [],
    protected: true
  },
  {
    route: '/knowledge-synthesis',
    category: 'advanced',
    title: 'Knowledge Synthesis — The Genuine Love Project',
    description: 'Integrate and synthesize your learning.',
    hero: {
      eyebrow: 'Integration',
      title: 'Connect the dots of',
      titleHighlight: 'your knowledge.',
      subtitle: 'Synthesize insights across domains for deeper understanding.',
      primaryCta: { label: 'Synthesize', href: '#synthesize' },
      secondaryCta: { label: 'View Connections', href: '#connections' }
    },
    sections: [],
    protected: true
  },
  {
    route: '/content-studio',
    category: 'advanced',
    title: 'Content Studio — The Genuine Love Project',
    description: 'Create and transform content for your healing journey.',
    hero: {
      eyebrow: 'Creative Space',
      title: 'Transform your insights',
      titleHighlight: 'into content.',
      subtitle: 'Tools to create, organize, and share your wisdom.',
      primaryCta: { label: 'Open Studio', href: '#studio' },
      secondaryCta: { label: 'Templates', href: '#templates' }
    },
    sections: [],
    protected: true
  },
  {
    route: '/study-vault',
    category: 'advanced',
    title: 'Study Vault — The Genuine Love Project',
    description: 'Evidence-based research summaries for informed healing.',
    hero: {
      eyebrow: 'Research Hub',
      title: 'Science-backed',
      titleHighlight: 'healing knowledge.',
      subtitle: 'Accessible summaries of the latest research.',
      primaryCta: { label: 'Browse Studies', href: '#studies' },
      secondaryCta: { label: 'Topics', href: '#topics' }
    },
    sections: [],
    protected: true
  },
  {
    route: '/elite-tools',
    category: 'advanced',
    title: 'Elite Tools — The Genuine Love Project',
    description: 'Premium tools for advanced practitioners.',
    hero: {
      eyebrow: 'Premium Suite',
      title: 'Access elite-level',
      titleHighlight: 'healing technology.',
      subtitle: 'The most sophisticated tools for serious practitioners.',
      primaryCta: { label: 'Access Suite', href: '#suite' },
      secondaryCta: { label: 'Upgrade', href: '/upgrade' }
    },
    sections: [],
    protected: true
  },
  {
    route: '/resilience',
    category: 'advanced',
    title: 'Resilience Metrics — The Genuine Love Project',
    description: 'Track and build your emotional resilience.',
    hero: {
      eyebrow: 'Resilience Building',
      title: 'Measure and grow your',
      titleHighlight: 'inner strength.',
      subtitle: 'Quantify and develop your capacity to bounce back.',
      primaryCta: { label: 'View Metrics', href: '#metrics' },
      secondaryCta: { label: 'Build Resilience', href: '#build' }
    },
    sections: [],
    protected: true
  },
  {
    route: '/companion',
    category: 'advanced',
    title: 'Adaptive Companion — The Genuine Love Project',
    description: 'An AI companion that adapts to your unique needs.',
    hero: {
      eyebrow: 'Personalized Support',
      title: 'A companion who',
      titleHighlight: 'truly knows you.',
      subtitle: 'AI that learns your patterns and adapts its support.',
      primaryCta: { label: 'Meet Companion', href: '#companion' },
      secondaryCta: { label: 'Customize', href: '#customize' }
    },
    sections: [],
    protected: true
  },
  {
    route: '/collaborative-lab',
    category: 'advanced',
    title: 'Collaborative Lab — The Genuine Love Project',
    description: 'Collaborative tools for group healing work.',
    hero: {
      eyebrow: 'Group Work',
      title: 'Heal together in',
      titleHighlight: 'community.',
      subtitle: 'Collaborative tools for shared healing experiences.',
      primaryCta: { label: 'Enter Lab', href: '#lab' },
      secondaryCta: { label: 'Join Group', href: '#join' }
    },
    sections: [],
    protected: true
  },
  {
    route: '/growth-analytics',
    category: 'advanced',
    title: 'Growth Analytics — The Genuine Love Project',
    description: 'Deep analytics on your personal growth.',
    hero: {
      eyebrow: 'Growth Tracking',
      title: 'Data-driven',
      titleHighlight: 'personal growth.',
      subtitle: 'Detailed insights into your transformation journey.',
      primaryCta: { label: 'View Analytics', href: '#analytics' },
      secondaryCta: { label: 'Set Goals', href: '#goals' }
    },
    sections: [],
    protected: true
  },
  {
    route: '/guided-journaling',
    category: 'advanced',
    title: 'Guided Journaling — The Genuine Love Project',
    description: 'Advanced guided journaling with AI support.',
    hero: {
      eyebrow: 'Deep Writing',
      title: 'AI-guided',
      titleHighlight: 'transformative writing.',
      subtitle: 'Intelligent prompts that adapt to your journey.',
      primaryCta: { label: 'Start Writing', href: '#write' },
      secondaryCta: { label: 'Browse Prompts', href: '#prompts' }
    },
    sections: [],
    protected: true
  },
  {
    route: '/insight-cards',
    category: 'advanced',
    title: 'Insight Cards — The Genuine Love Project',
    description: 'Capture and organize your healing insights.',
    hero: {
      eyebrow: 'Insight Capture',
      title: 'Collect moments of',
      titleHighlight: 'clarity.',
      subtitle: 'Never lose an important insight again.',
      primaryCta: { label: 'Add Insight', href: '#add' },
      secondaryCta: { label: 'Browse Cards', href: '#browse' }
    },
    sections: [],
    protected: true
  },
  {
    route: '/progress',
    category: 'advanced',
    title: 'Progress Dashboard — The Genuine Love Project',
    description: 'Comprehensive view of your healing progress.',
    hero: {
      eyebrow: 'Your Journey',
      title: 'Celebrate how far',
      titleHighlight: 'you\'ve come.',
      subtitle: 'A comprehensive view of your growth and achievements.',
      primaryCta: { label: 'View Progress', href: '#progress' },
      secondaryCta: { label: 'Milestones', href: '#milestones' }
    },
    sections: [],
    protected: true
  },
  {
    route: '/mirror',
    category: 'advanced',
    title: 'Mirror Work — The Genuine Love Project',
    description: 'Powerful self-reflection exercises.',
    hero: {
      eyebrow: 'Self-Reflection',
      title: 'See yourself with',
      titleHighlight: 'loving eyes.',
      subtitle: 'Mirror work exercises for deep self-acceptance.',
      primaryCta: { label: 'Begin Mirror Work', href: '#mirror' },
      secondaryCta: { label: 'Learn More', href: '#learn' }
    },
    sections: [],
    protected: true
  },
  {
    route: '/community',
    category: 'community',
    title: 'Community — The Genuine Love Project',
    description: 'Connect with others on similar healing journeys.',
    hero: {
      eyebrow: 'You\'re Not Alone',
      title: 'Heal in',
      titleHighlight: 'community.',
      subtitle: 'Connect with others who understand your journey.',
      primaryCta: { label: 'Join Community', href: '#community' },
      secondaryCta: { label: 'Browse Discussions', href: '#discussions' }
    },
    sections: [],
    protected: true
  },
  {
    route: '/social',
    category: 'community',
    title: 'Social Hub — The Genuine Love Project',
    description: 'Your social connections and community activity.',
    hero: {
      eyebrow: 'Connection',
      title: 'Build meaningful',
      titleHighlight: 'connections.',
      subtitle: 'Engage with your healing community.',
      primaryCta: { label: 'View Activity', href: '#activity' },
      secondaryCta: { label: 'Find Friends', href: '#find' }
    },
    sections: [],
    protected: false
  },
  {
    route: '/blog',
    category: 'content',
    title: 'Blog — The Genuine Love Project',
    description: 'Articles and insights on healing and personal growth.',
    hero: {
      eyebrow: 'Healing Insights',
      title: 'Stories of',
      titleHighlight: 'transformation.',
      subtitle: 'Articles, guides, and insights for your healing journey.',
      primaryCta: { label: 'Read Latest', href: '#latest' },
      secondaryCta: { label: 'Topics', href: '#topics' }
    },
    sections: [],
    protected: false
  },
  {
    route: '/news',
    category: 'content',
    title: 'News — The Genuine Love Project',
    description: 'Latest updates and announcements.',
    hero: {
      eyebrow: 'Updates',
      title: 'What\'s new at',
      titleHighlight: 'Genuine Love.',
      subtitle: 'Stay informed about platform updates and new features.',
      primaryCta: { label: 'Latest News', href: '#news' },
      secondaryCta: { label: 'Subscribe', href: '#subscribe' }
    },
    sections: [],
    protected: false
  },
  {
    route: '/research',
    category: 'content',
    title: 'Research & Evidence — The Genuine Love Project',
    description: 'Scientific foundation of our healing approaches.',
    hero: {
      eyebrow: 'Evidence-Based',
      title: 'Science behind',
      titleHighlight: 'the healing.',
      subtitle: 'The research foundation of our therapeutic approaches.',
      primaryCta: { label: 'View Research', href: '#research' },
      secondaryCta: { label: 'Studies', href: '#studies' }
    },
    sections: [],
    protected: false
  },
  {
    route: '/glossary',
    category: 'content',
    title: 'Wellness Glossary — The Genuine Love Project',
    description: 'Definitions of healing and wellness terms.',
    hero: {
      eyebrow: 'Reference',
      title: 'Understanding',
      titleHighlight: 'healing language.',
      subtitle: 'Clear definitions of therapeutic terms and concepts.',
      primaryCta: { label: 'Browse Terms', href: '#terms' },
      secondaryCta: { label: 'Search', href: '#search' }
    },
    sections: [],
    protected: false
  },
  {
    route: '/how-to-guides',
    category: 'content',
    title: 'How-To Guides — The Genuine Love Project',
    description: 'Step-by-step guides for healing practices.',
    hero: {
      eyebrow: 'Practical Guides',
      title: 'Learn how to',
      titleHighlight: 'heal yourself.',
      subtitle: 'Step-by-step instructions for healing practices.',
      primaryCta: { label: 'Browse Guides', href: '#guides' },
      secondaryCta: { label: 'Popular', href: '#popular' }
    },
    sections: [],
    protected: false
  },
  {
    route: '/daily-routines',
    category: 'content',
    title: 'Daily Routines — The Genuine Love Project',
    description: 'Healing routines for morning, day, and night.',
    hero: {
      eyebrow: 'Routine Building',
      title: 'Routines that',
      titleHighlight: 'transform.',
      subtitle: 'Daily practices for sustainable healing.',
      primaryCta: { label: 'Browse Routines', href: '#routines' },
      secondaryCta: { label: 'Build Custom', href: '#custom' }
    },
    sections: [],
    protected: false
  },
  {
    route: '/cognitive-tools',
    category: 'content',
    title: 'Cognitive Tools — The Genuine Love Project',
    description: 'Tools for reframing thoughts and beliefs.',
    hero: {
      eyebrow: 'Thought Work',
      title: 'Reframe your',
      titleHighlight: 'thoughts.',
      subtitle: 'Cognitive tools for changing unhelpful thought patterns.',
      primaryCta: { label: 'Start Reframing', href: '#tools' },
      secondaryCta: { label: 'Learn CBT', href: '#cbt' }
    },
    sections: [],
    protected: false
  },
  {
    route: '/behavior-change',
    category: 'content',
    title: 'Behavior Change — The Genuine Love Project',
    description: 'Science of lasting behavior change.',
    hero: {
      eyebrow: 'Habit Science',
      title: 'Change that',
      titleHighlight: 'actually lasts.',
      subtitle: 'Evidence-based approaches to sustainable change.',
      primaryCta: { label: 'Start Journey', href: '#journey' },
      secondaryCta: { label: 'Assessment', href: '#assessment' }
    },
    sections: [],
    protected: false
  },
  {
    route: '/wellness-hub',
    category: 'content',
    title: 'Wellness Hub — The Genuine Love Project',
    description: 'Central hub for all wellness resources.',
    hero: {
      eyebrow: 'Resource Center',
      title: 'Everything wellness',
      titleHighlight: 'in one place.',
      subtitle: 'Your central hub for all wellness resources.',
      primaryCta: { label: 'Explore Hub', href: '#hub' },
      secondaryCta: { label: 'Categories', href: '#categories' }
    },
    sections: [],
    protected: false
  },
  {
    route: '/content-index',
    category: 'content',
    title: 'Content Index — The Genuine Love Project',
    description: 'Complete index of all platform content.',
    hero: {
      eyebrow: 'Full Index',
      title: 'Find anything',
      titleHighlight: 'you need.',
      subtitle: 'Searchable index of all content and resources.',
      primaryCta: { label: 'Browse Index', href: '#index' },
      secondaryCta: { label: 'Search', href: '#search' }
    },
    sections: [],
    protected: false
  },
  {
    route: '/examples',
    category: 'content',
    title: 'Examples — The Genuine Love Project',
    description: 'Example practices and use cases.',
    hero: {
      eyebrow: 'See It In Action',
      title: 'Learn by',
      titleHighlight: 'example.',
      subtitle: 'Real examples of healing practices in action.',
      primaryCta: { label: 'Browse Examples', href: '#examples' },
      secondaryCta: { label: 'Categories', href: '#categories' }
    },
    sections: [],
    protected: false
  },
  {
    route: '/professional-resources',
    category: 'content',
    title: 'Professional Resources — The Genuine Love Project',
    description: 'Resources for therapists and professionals.',
    hero: {
      eyebrow: 'For Professionals',
      title: 'Tools for',
      titleHighlight: 'practitioners.',
      subtitle: 'Resources for mental health professionals.',
      primaryCta: { label: 'Access Resources', href: '#resources' },
      secondaryCta: { label: 'Verify Credentials', href: '#verify' }
    },
    sections: [],
    protected: false
  },
  {
    route: '/pricing',
    category: 'support',
    title: 'Pricing — The Genuine Love Project',
    description: 'Choose the plan that fits your healing journey.',
    hero: {
      eyebrow: 'Investment in You',
      title: 'Plans for every',
      titleHighlight: 'healing journey.',
      subtitle: 'Affordable access to premium healing tools.',
      primaryCta: { label: 'View Plans', href: '#plans' },
      secondaryCta: { label: 'Compare Features', href: '#compare' }
    },
    sections: [
      {
        id: 'plans',
        eyebrow: 'Choose Your Path',
        title: 'Simple, transparent pricing',
        subtitle: 'Start free, upgrade when you\'re ready.',
        variant: 'glow',
        cards: [
          { icon: 'Heart', title: 'Free', text: 'Essential tools to begin your journey.' },
          { icon: 'Star', title: 'Premium', text: 'Full access to all healing tools.' },
          { icon: 'Sparkles', title: 'Mastery', text: 'Elite tools for serious practitioners.' }
        ]
      }
    ],
    protected: false
  },
  {
    route: '/upgrade',
    category: 'support',
    title: 'Upgrade — The Genuine Love Project',
    description: 'Unlock premium features for deeper healing.',
    hero: {
      eyebrow: 'Go Deeper',
      title: 'Unlock your full',
      titleHighlight: 'healing potential.',
      subtitle: 'Premium features for accelerated growth.',
      primaryCta: { label: 'Upgrade Now', href: '#upgrade' },
      secondaryCta: { label: 'Compare Plans', href: '/pricing' }
    },
    sections: [],
    protected: true
  },
  {
    route: '/premium',
    category: 'support',
    title: 'Premium — The Genuine Love Project',
    description: 'Your premium membership benefits.',
    hero: {
      eyebrow: 'Premium Member',
      title: 'Your premium',
      titleHighlight: 'benefits.',
      subtitle: 'Thank you for investing in your healing.',
      primaryCta: { label: 'View Benefits', href: '#benefits' },
      secondaryCta: { label: 'Manage Subscription', href: '/settings' }
    },
    sections: [],
    protected: true
  },
  {
    route: '/faq',
    category: 'support',
    title: 'FAQ — The Genuine Love Project',
    description: 'Frequently asked questions about the platform.',
    hero: {
      eyebrow: 'Questions',
      title: 'How can we',
      titleHighlight: 'help you?',
      subtitle: 'Find answers to common questions.',
      primaryCta: { label: 'Browse FAQs', href: '#faqs' },
      secondaryCta: { label: 'Contact Support', href: '/support' }
    },
    sections: [],
    protected: false
  },
  {
    route: '/support',
    category: 'support',
    title: 'Support — The Genuine Love Project',
    description: 'Get help with the platform.',
    hero: {
      eyebrow: 'We\'re Here',
      title: 'Need',
      titleHighlight: 'help?',
      subtitle: 'Our team is here to support you.',
      primaryCta: { label: 'Contact Support', href: '#contact' },
      secondaryCta: { label: 'Browse FAQs', href: '/faq' }
    },
    sections: [],
    protected: false
  },
  {
    route: '/resources',
    category: 'support',
    title: 'Resources — The Genuine Love Project',
    description: 'Helpful resources for your journey.',
    hero: {
      eyebrow: 'Resource Library',
      title: 'Helpful',
      titleHighlight: 'resources.',
      subtitle: 'Curated resources to support your healing.',
      primaryCta: { label: 'Browse Resources', href: '#resources' },
      secondaryCta: { label: 'Request Resource', href: '#request' }
    },
    sections: [],
    protected: false
  },
  {
    route: '/admin',
    category: 'admin',
    title: 'Admin — The Genuine Love Project',
    description: 'Platform administration dashboard.',
    hero: {
      eyebrow: 'Administration',
      title: 'Platform',
      titleHighlight: 'management.',
      subtitle: 'Monitor and manage platform operations.',
      primaryCta: { label: 'View Dashboard', href: '#dashboard' },
      secondaryCta: { label: 'Reports', href: '#reports' }
    },
    sections: [],
    protected: true,
    adminOnly: true
  },
  {
    route: '/control',
    category: 'admin',
    title: 'Control Dashboard — The Genuine Love Project',
    description: 'System control and monitoring.',
    hero: {
      eyebrow: 'System Control',
      title: 'Platform',
      titleHighlight: 'controls.',
      subtitle: 'System monitoring and configuration.',
      primaryCta: { label: 'View Status', href: '#status' },
      secondaryCta: { label: 'Settings', href: '#settings' }
    },
    sections: [],
    protected: false
  },
  {
    route: '/content-admin',
    category: 'admin',
    title: 'Content Admin — The Genuine Love Project',
    description: 'Manage platform content.',
    hero: {
      eyebrow: 'Content Management',
      title: 'Manage',
      titleHighlight: 'content.',
      subtitle: 'Create, edit, and organize platform content.',
      primaryCta: { label: 'View Content', href: '#content' },
      secondaryCta: { label: 'Create New', href: '#create' }
    },
    sections: [],
    protected: true,
    adminOnly: true
  },
  {
    route: '/health',
    category: 'admin',
    title: 'Health — The Genuine Love Project',
    description: 'System health monitoring.',
    hero: {
      eyebrow: 'System Health',
      title: 'Platform',
      titleHighlight: 'status.',
      subtitle: 'Real-time system health monitoring.',
      primaryCta: { label: 'View Status', href: '#status' },
      secondaryCta: { label: 'History', href: '#history' }
    },
    sections: [],
    protected: false
  },
  {
    route: '/qa',
    category: 'admin',
    title: 'QA — The Genuine Love Project',
    description: 'Quality assurance testing.',
    hero: {
      eyebrow: 'Quality Assurance',
      title: 'Platform',
      titleHighlight: 'testing.',
      subtitle: 'Quality assurance and testing tools.',
      primaryCta: { label: 'Run Tests', href: '#tests' },
      secondaryCta: { label: 'Reports', href: '#reports' }
    },
    sections: [],
    protected: false
  },
  {
    route: '/crm',
    category: 'admin',
    title: 'CRM — The Genuine Love Project',
    description: 'Customer relationship management.',
    hero: {
      eyebrow: 'CRM',
      title: 'User',
      titleHighlight: 'management.',
      subtitle: 'Customer relationship and user management.',
      primaryCta: { label: 'View Users', href: '#users' },
      secondaryCta: { label: 'Analytics', href: '#analytics' }
    },
    sections: [],
    protected: true,
    adminOnly: true
  },
  {
    route: '/terms',
    category: 'legal',
    title: 'Terms of Service — The Genuine Love Project',
    description: 'Terms and conditions of platform use.',
    hero: {
      eyebrow: 'Legal',
      title: 'Terms of',
      titleHighlight: 'Service.',
      subtitle: 'Please read these terms carefully.',
      primaryCta: null,
      secondaryCta: null
    },
    sections: [],
    protected: false,
    isLegalPage: true
  },
  {
    route: '/privacy',
    category: 'legal',
    title: 'Privacy Policy — The Genuine Love Project',
    description: 'How we protect and handle your data.',
    hero: {
      eyebrow: 'Legal',
      title: 'Privacy',
      titleHighlight: 'Policy.',
      subtitle: 'Your privacy is sacred to us.',
      primaryCta: null,
      secondaryCta: null
    },
    sections: [],
    protected: false,
    isLegalPage: true
  },
  {
    route: '/legal',
    category: 'legal',
    title: 'Legal — The Genuine Love Project',
    description: 'Legal information and policies.',
    hero: {
      eyebrow: 'Legal',
      title: 'Legal',
      titleHighlight: 'Information.',
      subtitle: 'Important legal documents and policies.',
      primaryCta: null,
      secondaryCta: null
    },
    sections: [],
    protected: false,
    isLegalPage: true
  },
  {
    route: '/ethics',
    category: 'legal',
    title: 'Ethics — The Genuine Love Project',
    description: 'Our ethical guidelines and commitments.',
    hero: {
      eyebrow: 'Our Values',
      title: 'Ethical',
      titleHighlight: 'Commitments.',
      subtitle: 'Our commitment to ethical AI and mental health care.',
      primaryCta: null,
      secondaryCta: null
    },
    sections: [],
    protected: false,
    isLegalPage: true
  },
  {
    route: '/disclaimer',
    category: 'legal',
    title: 'Disclaimer — The Genuine Love Project',
    description: 'Important disclaimers about our services.',
    hero: {
      eyebrow: 'Legal',
      title: 'Disclaimer.',
      titleHighlight: '',
      subtitle: 'Important information about our services.',
      primaryCta: null,
      secondaryCta: null
    },
    sections: [],
    protected: false,
    isLegalPage: true
  },
  {
    route: '/safety',
    category: 'legal',
    title: 'Safety — The Genuine Love Project',
    description: 'Safety information and crisis resources.',
    hero: {
      eyebrow: 'Your Safety Matters',
      title: 'Safety',
      titleHighlight: 'First.',
      subtitle: 'Important safety information and resources.',
      primaryCta: { label: 'Crisis Resources', href: '/crisis' },
      secondaryCta: { label: 'Contact Support', href: '/support' }
    },
    sections: [],
    protected: false
  },
  {
    route: '/home',
    aliasOf: '/',
    category: 'landing'
  },
  {
    route: '/welcome',
    aliasOf: '/',
    category: 'landing'
  },
  {
    route: '/reset-password',
    category: 'auth',
    title: 'Reset Password — The Genuine Love Project',
    description: 'Create a new password for your account.',
    hero: {
      eyebrow: 'Almost There',
      title: 'Create your new',
      titleHighlight: 'password.',
      subtitle: 'Choose a strong, unique password for your account.',
      primaryCta: { label: 'Reset Password', href: '#reset-form' },
      secondaryCta: { label: 'Back to Sign In', href: '/login' }
    },
    sections: [],
    protected: false,
    isAuthPage: true
  },
  {
    route: '/onboarding',
    category: 'core',
    title: 'Welcome — The Genuine Love Project',
    description: 'Get started with your personalized healing journey.',
    hero: {
      eyebrow: 'Getting Started',
      title: 'Let\'s personalize your',
      titleHighlight: 'healing journey.',
      subtitle: 'A few questions to tailor your experience.',
      primaryCta: { label: 'Continue', href: '#next' },
      secondaryCta: null
    },
    sections: [],
    protected: true
  },
  {
    route: '/billing',
    category: 'core',
    title: 'Billing — The Genuine Love Project',
    description: 'Manage your subscription and payment methods.',
    hero: {
      eyebrow: 'Account',
      title: 'Manage your',
      titleHighlight: 'billing.',
      subtitle: 'View invoices and update payment methods.',
      primaryCta: { label: 'View Plans', href: '/pricing' },
      secondaryCta: { label: 'Payment History', href: '#history' }
    },
    sections: [],
    protected: true
  },
  {
    route: '/profile',
    category: 'core',
    title: 'Profile — The Genuine Love Project',
    description: 'View and edit your personal profile.',
    hero: {
      eyebrow: 'Your Profile',
      title: 'This is',
      titleHighlight: 'you.',
      subtitle: 'Manage your profile and preferences.',
      primaryCta: { label: 'Edit Profile', href: '#edit' },
      secondaryCta: { label: 'View Settings', href: '/settings' }
    },
    sections: [],
    protected: true
  },
  {
    route: '/overview',
    category: 'core',
    title: 'Overview — The Genuine Love Project',
    description: 'Quick overview of your healing journey.',
    hero: {
      eyebrow: 'At a Glance',
      title: 'Your healing',
      titleHighlight: 'overview.',
      subtitle: 'See your progress and upcoming activities.',
      primaryCta: { label: 'View Details', href: '/dashboard' },
      secondaryCta: { label: 'Today\'s Focus', href: '/today' }
    },
    sections: [],
    protected: true
  },
  {
    route: '/insights',
    category: 'core',
    title: 'Insights — The Genuine Love Project',
    description: 'Personal insights from your healing journey.',
    hero: {
      eyebrow: 'Your Insights',
      title: 'Patterns &',
      titleHighlight: 'discoveries.',
      subtitle: 'AI-generated insights about your progress.',
      primaryCta: { label: 'View Insights', href: '#insights' },
      secondaryCta: { label: 'Share Insight', href: '#share' }
    },
    sections: [],
    protected: true
  },
  {
    route: '/glossary-full',
    aliasOf: '/glossary',
    category: 'content'
  },
  {
    route: '/write',
    category: 'content',
    title: 'Write — The Genuine Love Project',
    description: 'Share your healing story with the community.',
    hero: {
      eyebrow: 'Share Your Voice',
      title: 'Write your',
      titleHighlight: 'story.',
      subtitle: 'Contribute to our community blog.',
      primaryCta: { label: 'Start Writing', href: '#editor' },
      secondaryCta: { label: 'Writing Guidelines', href: '#guidelines' }
    },
    sections: [],
    protected: true
  },
  {
    route: '/blog/:slug',
    category: 'content',
    isDynamic: true,
    title: 'Article — The Genuine Love Project',
    description: 'Read this healing insight.',
    hero: {
      eyebrow: 'Blog',
      title: 'Article',
      titleHighlight: '',
      subtitle: 'Insights for your healing journey.',
      primaryCta: null,
      secondaryCta: { label: 'Back to Blog', href: '/blog' }
    },
    sections: [],
    protected: false
  },
  {
    route: '/community/discussion/:id',
    category: 'community',
    isDynamic: true,
    title: 'Discussion — The Genuine Love Project',
    description: 'Community discussion thread.',
    hero: {
      eyebrow: 'Community',
      title: 'Discussion',
      titleHighlight: '',
      subtitle: 'Join the conversation.',
      primaryCta: null,
      secondaryCta: { label: 'Back to Community', href: '/community' }
    },
    sections: [],
    protected: true
  },
  {
    route: '/publishing',
    category: 'admin',
    title: 'Publishing — The Genuine Love Project',
    description: 'Content publishing management.',
    hero: {
      eyebrow: 'Content',
      title: 'Publishing',
      titleHighlight: 'center.',
      subtitle: 'Manage and publish content.',
      primaryCta: { label: 'View Queue', href: '#queue' },
      secondaryCta: { label: 'Create Post', href: '/write' }
    },
    sections: [],
    protected: false
  },
  {
    route: '/design-system',
    category: 'admin',
    title: 'Design System — The Genuine Love Project',
    description: 'Platform design system documentation.',
    hero: {
      eyebrow: 'Design',
      title: 'Design',
      titleHighlight: 'System.',
      subtitle: 'Component library and style guide.',
      primaryCta: { label: 'View Components', href: '#components' },
      secondaryCta: { label: 'Colors', href: '#colors' }
    },
    sections: [],
    protected: false
  },
  {
    route: '/wireframes',
    category: 'admin',
    title: 'Wireframes — The Genuine Love Project',
    description: 'UI wireframe templates.',
    hero: {
      eyebrow: 'Design',
      title: 'Wireframe',
      titleHighlight: 'Templates.',
      subtitle: 'Page layout templates and patterns.',
      primaryCta: { label: 'View Templates', href: '#templates' },
      secondaryCta: null
    },
    sections: [],
    protected: false
  },
  {
    route: '/design-dashboard',
    category: 'admin',
    title: 'Design Dashboard — The Genuine Love Project',
    description: 'Design team dashboard.',
    hero: {
      eyebrow: 'Design Team',
      title: 'Design',
      titleHighlight: 'Dashboard.',
      subtitle: 'Monitor design system usage and updates.',
      primaryCta: { label: 'View Metrics', href: '#metrics' },
      secondaryCta: { label: 'Components', href: '/design-system' }
    },
    sections: [],
    protected: true,
    adminOnly: true
  },
  {
    route: '/canva-landing',
    category: 'landing',
    title: 'Welcome — The Genuine Love Project',
    description: 'Beautiful landing page for The Genuine Love Project.',
    hero: {
      eyebrow: 'Discover',
      title: 'Your path to',
      titleHighlight: 'genuine love.',
      subtitle: 'A beautiful journey of self-discovery and healing.',
      primaryCta: { label: 'Get Started', href: '/register' },
      secondaryCta: { label: 'Learn More', href: '#features' }
    },
    sections: [],
    protected: false
  },
  {
    route: '/about',
    category: 'landing',
    title: 'About — The Genuine Love Project',
    description: 'Learn about our mission and the team behind The Genuine Love Project.',
    hero: {
      eyebrow: 'Our Story',
      title: 'Why we built',
      titleHighlight: 'Genuine Love.',
      subtitle: 'A platform born from personal healing journeys.',
      primaryCta: { label: 'Join Us', href: '/register' },
      secondaryCta: { label: 'Our Mission', href: '#mission' }
    },
    sections: [
      {
        id: 'values',
        eyebrow: 'Our Values',
        title: 'What we believe',
        subtitle: 'Core principles that guide everything we do.',
        variant: 'glow',
        cards: [
          { icon: 'Heart', title: 'Compassion First', text: 'Every feature is designed with empathy.' },
          { icon: 'Shield', title: 'Safety Always', text: 'Your privacy and security are sacred.' },
          { icon: 'Sparkles', title: 'Evidence-Based', text: 'Grounded in science, delivered with love.' },
          { icon: 'Users', title: 'Community Driven', text: 'Built for and with our healing community.' }
        ]
      }
    ],
    protected: false
  },
  {
    route: '/features',
    category: 'landing',
    title: 'Features — The Genuine Love Project',
    description: 'Explore all the healing tools and features available.',
    hero: {
      eyebrow: 'Platform Features',
      title: 'Everything you need to',
      titleHighlight: 'heal and grow.',
      subtitle: 'A comprehensive toolkit for emotional wellness.',
      primaryCta: { label: 'Try Free', href: '/register' },
      secondaryCta: { label: 'View Pricing', href: '/pricing' }
    },
    sections: [
      {
        id: 'core-features',
        eyebrow: 'Core Features',
        title: 'Your healing toolkit',
        subtitle: 'Essential tools for every stage of your journey.',
        variant: 'pattern',
        cards: [
          { icon: 'MessageCircle', title: 'AI Companion', text: '24/7 trauma-informed chat support.' },
          { icon: 'BookOpen', title: 'Journaling', text: 'Guided prompts for deep reflection.' },
          { icon: 'Activity', title: 'Mood Tracking', text: 'Understand your emotional patterns.' },
          { icon: 'Heart', title: 'Inner Child Work', text: 'Heal your younger self.' }
        ]
      }
    ],
    protected: false
  },
  {
    route: '/testimonials',
    category: 'landing',
    title: 'Testimonials — The Genuine Love Project',
    description: 'Stories from our healing community.',
    hero: {
      eyebrow: 'Real Stories',
      title: 'Hear from our',
      titleHighlight: 'healing community.',
      subtitle: 'Stories of transformation from people like you.',
      primaryCta: { label: 'Start Your Story', href: '/register' },
      secondaryCta: { label: 'Share Yours', href: '#share' }
    },
    sections: [],
    protected: false
  },
  {
    route: '/contact',
    category: 'support',
    title: 'Contact — The Genuine Love Project',
    description: 'Get in touch with our team.',
    hero: {
      eyebrow: 'Reach Out',
      title: 'We\'d love to',
      titleHighlight: 'hear from you.',
      subtitle: 'Questions, feedback, or partnership inquiries.',
      primaryCta: { label: 'Send Message', href: '#contact-form' },
      secondaryCta: { label: 'FAQ', href: '/faq' }
    },
    sections: [],
    protected: false
  },
  {
    route: '/accessibility',
    category: 'legal',
    title: 'Accessibility — The Genuine Love Project',
    description: 'Our commitment to accessible design.',
    hero: {
      eyebrow: 'Inclusive Design',
      title: 'Accessible to',
      titleHighlight: 'everyone.',
      subtitle: 'Our commitment to inclusive, accessible design.',
      primaryCta: { label: 'Accessibility Features', href: '#features' },
      secondaryCta: { label: 'Report Issue', href: '#report' }
    },
    sections: [],
    protected: false
  },
  {
    route: '/cookies',
    category: 'legal',
    title: 'Cookie Policy — The Genuine Love Project',
    description: 'How we use cookies on our platform.',
    hero: {
      eyebrow: 'Legal',
      title: 'Cookie',
      titleHighlight: 'Policy.',
      subtitle: 'How we use cookies to improve your experience.',
      primaryCta: null,
      secondaryCta: null
    },
    sections: [],
    protected: false,
    isLegalPage: true
  },
  {
    route: '/landing',
    aliasOf: '/',
    category: 'landing'
  },
  {
    route: '/signup',
    aliasOf: '/register',
    category: 'auth'
  },
  {
    route: '/sign-up',
    aliasOf: '/register',
    category: 'auth'
  },
  {
    route: '/signin',
    aliasOf: '/login',
    category: 'auth'
  },
  {
    route: '/sign-in',
    aliasOf: '/login',
    category: 'auth'
  },
  {
    route: '/help',
    aliasOf: '/support',
    category: 'support'
  },
  {
    route: '/therapy',
    aliasOf: '/chat',
    category: 'core'
  },
  {
    route: '/ai-chat',
    aliasOf: '/chat',
    category: 'core'
  },
  {
    route: '/tos',
    aliasOf: '/terms',
    category: 'legal'
  },
  {
    route: '/not-found',
    category: 'support',
    title: 'Page Not Found — The Genuine Love Project',
    description: 'The page you\'re looking for couldn\'t be found.',
    hero: {
      eyebrow: 'Oops',
      title: 'Page not',
      titleHighlight: 'found.',
      subtitle: 'The page you\'re looking for doesn\'t exist or has been moved.',
      primaryCta: { label: 'Go Home', href: '/' },
      secondaryCta: { label: 'Contact Support', href: '/support' }
    },
    sections: [],
    protected: false
  }
];

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

export const getRouteConfig = (path) => {
  const directMatch = staticRoutes.find(r => r.route === path);
  if (directMatch) return directMatch;
  
  const aliasMatch = aliasRoutes.find(r => r.route === path);
  if (aliasMatch) {
    const target = staticRoutes.find(r => r.route === aliasMatch.aliasOf);
    return target ? { ...target, route: path } : null;
  }
  
  const dynamicMatch = matchDynamicRoute(path);
  if (dynamicMatch) return dynamicMatch;
  
  return routes.find(r => r.route === '/not-found') || null;
};

export const getRoutesByCategory = (category) => {
  return routes.filter(r => r.category === category && !r.aliasOf);
};

export const getAllCategories = () => {
  return [...new Set(routes.filter(r => !r.aliasOf).map(r => r.category))];
};

export const isProtectedRoute = (path) => {
  const config = getRouteConfig(path);
  return config?.protected ?? false;
};

export const isAdminRoute = (path) => {
  const config = getRouteConfig(path);
  return config?.adminOnly ?? false;
};

export default routes;
