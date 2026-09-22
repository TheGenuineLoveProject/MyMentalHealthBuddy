// =============================================================================
// contentRoutes — public CONTENT & LEARNING routes (blog, glossary, research, etc.).
// Extracted verbatim from routes.js to reduce that file's size WITHOUT changing
// runtime behavior. Plain-data route objects; customComponent strings (e.g.
// 'ContentStudio') are preserved verbatim and resolved by the registry, not imported here.
// Merged back into rawRoutes via `...contentRoutes`, preserving array order.
// =============================================================================
export const contentRoutes = [
  {
    route: '/research-evidence',
    category: 'content',
    pageLabel: 'Research & Evidence',
    title: 'Research & Evidence — MyMentalHealthBuddy',
    description: 'Learn to examine mental health information, research limits, and personal experiences.',
    hero: {
      eyebrow: 'MyMentalHealthBuddy',
      title: 'Research & Evidence',
      subtitle: 'Explore information with curiosity and care. Educational information, not diagnosis or treatment.',
      primaryCta: { label: 'Explore sources', href: '#sources' },
      secondaryCta: { label: 'Questions to ask', href: '#checklist' }
    },
    sections: [
      {
        id: 'introduction',
        title: 'What counts as evidence?',
        subtitle: {
          beginner: 'A citation points to information you can examine. It does not prove a claim. Personal stories matter, but results differ. Philosophy and spirituality are not clinical evidence. Not all MMHB tools are clinically validated.',
          intermediate: 'Citations offer evidence to examine, not automatic proof; personal testimony cannot establish results for everyone. Philosophy and spirituality can offer meaning, but are not clinical evidence, and not all MMHB tools are clinically validated.',
          advanced: 'Clinical evidence is research evaluating health outcomes in defined conditions and populations; citations invite appraisal of methods, limitations, and relevance rather than guaranteeing effectiveness. Testimony is not universal evidence, philosophy and spirituality are distinct from clinical findings, and not all MMHB tools are clinically validated.'
        }
      },
      {
        id: 'checklist',
        title: 'A short evidence checklist',
        bullets: {
          beginner: [
            'Who wrote this? What are their sources?',
            'When was it updated? Who paid for it?',
            'Who took part? What changed, and what did not?',
            'What are the limits? Could results differ for me?'
          ],
          intermediate: [
            'Check the author, their expertise, and the original source.',
            'Look for the date, funding, and possible conflicts of interest.',
            'Ask who participated, what was measured, and what comparison was used.',
            'Look for uncertainty, possible harms, and whether findings fit your situation.'
          ],
          advanced: [
            'Trace claims to original research and assess author expertise and publication context.',
            'Check currency, funding disclosures, and potential conflicts of interest.',
            'Assess study design, sample selection, comparison groups, and meaningful outcomes.',
            'Consider bias, uncertainty, adverse effects, replication, and applicability beyond the study population.'
          ]
        }
      },
      {
        id: 'example',
        title: 'A hypothetical journal example',
        subtitle: 'Imagine someone says, “I felt calmer after journaling.” This is an invented example, not a study or a promise.',
        bullets: [
          'What did “calmer” mean, and how long did it last?',
          'Could rest, company, or another change explain the feeling?',
          'Would others have the same experience? What research could help us examine that question?',
          'One experience does not show that journaling treats a condition. You can pause any practice that feels uncomfortable.'
        ]
      },
      {
        id: 'sources',
        title: 'Sources to explore',
        subtitle: 'These external educational resources open in a new tab. Links do not imply endorsement of MMHB or validate its tools. Link-check date supplied for this page: September 22, 2026.',
        cards: [
          {
            title: 'NCCIH: Finding Health Information Online (opens in a new tab)',
            text: 'A guide to examining online health information and asking questions about its reliability.',
            icon: 'Search',
            href: 'https://www.nccih.nih.gov/health/know-science/finding-and-evaluating-online-resources/finding-health-information-online/introduction'
          },
          {
            title: 'NIMH: Psychotherapies (opens in a new tab)',
            text: 'An overview of psychotherapy and considerations when looking for professional care; not a treatment recommendation.',
            icon: 'BookOpen',
            href: 'https://www.nimh.nih.gov/health/topics/psychotherapies'
          },
          {
            title: 'NLM: About PubMed (opens in a new tab)',
            text: 'Learn about PubMed, a resource for biomedical citations and abstracts, not always full articles. A listing alone does not establish research quality.',
            icon: 'FileText',
            href: 'https://pubmed.ncbi.nlm.nih.gov/about/'
          }
        ]
      }
    ]
  },
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
