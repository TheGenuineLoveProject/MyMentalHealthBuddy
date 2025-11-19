/**
 * AI-Powered Content Creation Engine
 * Provides intelligent content suggestions, templates, and generation tools
 */

export type ContentType = 'journal' | 'mood-note' | 'resource' | 'article' | 'social-post';

export interface ContentTemplate {
  id: string;
  name: string;
  type: ContentType;
  description: string;
  icon: string;
  structure: {
    sections: Array<{
      id: string;
      label: string;
      type: 'text' | 'rich-text' | 'list' | 'mood-scale' | 'tags';
      placeholder?: string;
      required?: boolean;
      suggestions?: string[];
    }>;
  };
}

export interface ContentSuggestion {
  id: string;
  title: string;
  content: string;
  relevance: number;
  type: ContentType;
  context?: string;
  tags?: string[];
}

export interface GenerationOptions {
  tone?: 'professional' | 'casual' | 'empathetic' | 'motivational';
  length?: 'short' | 'medium' | 'long';
  style?: 'narrative' | 'structured' | 'reflective';
  keywords?: string[];
  context?: string;
}

/**
 * Content Template Library
 */
export const contentTemplates: ContentTemplate[] = [
  {
    id: 'gratitude-journal',
    name: 'Gratitude Journal',
    type: 'journal',
    description: 'Reflect on positive moments and things you\'re grateful for',
    icon: '🙏',
    structure: {
      sections: [
        {
          id: 'date',
          label: 'Date',
          type: 'text',
          required: true
        },
        {
          id: 'gratitude-list',
          label: 'What I\'m grateful for today',
          type: 'list',
          placeholder: 'List 3-5 things you\'re grateful for...',
          required: true,
          suggestions: [
            'Health and wellbeing',
            'Supportive relationships',
            'Personal achievements',
            'Simple pleasures',
            'Opportunities for growth'
          ]
        },
        {
          id: 'reflection',
          label: 'Reflection',
          type: 'rich-text',
          placeholder: 'How do these things make you feel? What impact have they had on your day?',
          required: false
        },
        {
          id: 'mood',
          label: 'Current Mood',
          type: 'mood-scale',
          required: false
        }
      ]
    }
  },
  {
    id: 'daily-reflection',
    name: 'Daily Reflection',
    type: 'journal',
    description: 'Structured daily check-in and self-reflection',
    icon: '📝',
    structure: {
      sections: [
        {
          id: 'highs',
          label: 'Today\'s Highlights',
          type: 'text',
          placeholder: 'What went well today?',
          required: true
        },
        {
          id: 'lows',
          label: 'Today\'s Challenges',
          type: 'text',
          placeholder: 'What was difficult today?',
          required: false
        },
        {
          id: 'lessons',
          label: 'Lessons Learned',
          type: 'text',
          placeholder: 'What did you learn today?',
          required: false
        },
        {
          id: 'tomorrow',
          label: 'Tomorrow\'s Focus',
          type: 'text',
          placeholder: 'What will you focus on tomorrow?',
          required: false
        },
        {
          id: 'tags',
          label: 'Tags',
          type: 'tags',
          suggestions: ['personal-growth', 'work', 'relationships', 'health', 'productivity']
        }
      ]
    }
  },
  {
    id: 'mood-tracker',
    name: 'Mood Check-In',
    type: 'mood-note',
    description: 'Quick mood tracking with contextual notes',
    icon: '😊',
    structure: {
      sections: [
        {
          id: 'mood',
          label: 'How are you feeling?',
          type: 'mood-scale',
          required: true
        },
        {
          id: 'triggers',
          label: 'What influenced your mood?',
          type: 'list',
          placeholder: 'List any triggers or influences...',
          suggestions: [
            'Sleep quality',
            'Physical activity',
            'Social interactions',
            'Work stress',
            'Diet/nutrition',
            'Weather'
          ]
        },
        {
          id: 'coping',
          label: 'Coping Strategies Used',
          type: 'list',
          placeholder: 'What helped you today?',
          suggestions: [
            'Deep breathing',
            'Exercise',
            'Talking to someone',
            'Meditation',
            'Journaling',
            'Creative activities'
          ]
        },
        {
          id: 'notes',
          label: 'Additional Notes',
          type: 'text',
          placeholder: 'Any other thoughts or observations?'
        }
      ]
    }
  },
  {
    id: 'cbt-thought-record',
    name: 'Thought Record (CBT)',
    type: 'journal',
    description: 'Cognitive Behavioral Therapy thought tracking and reframing',
    icon: '🧠',
    structure: {
      sections: [
        {
          id: 'situation',
          label: 'Situation',
          type: 'text',
          placeholder: 'What happened? Where, when, with whom?',
          required: true
        },
        {
          id: 'automatic-thought',
          label: 'Automatic Thought',
          type: 'text',
          placeholder: 'What went through your mind?',
          required: true
        },
        {
          id: 'emotion',
          label: 'Emotion',
          type: 'text',
          placeholder: 'What did you feel? (Rate 0-100%)',
          required: true
        },
        {
          id: 'evidence-for',
          label: 'Evidence Supporting the Thought',
          type: 'list',
          placeholder: 'What facts support this thought?'
        },
        {
          id: 'evidence-against',
          label: 'Evidence Against the Thought',
          type: 'list',
          placeholder: 'What facts contradict this thought?'
        },
        {
          id: 'balanced-thought',
          label: 'Balanced Thought',
          type: 'text',
          placeholder: 'What\'s a more balanced way to think about this?',
          required: true
        },
        {
          id: 'new-emotion',
          label: 'Re-rated Emotion',
          type: 'text',
          placeholder: 'How do you feel now? (Rate 0-100%)'
        }
      ]
    }
  },
  {
    id: 'wellness-resource',
    name: 'Mental Health Resource',
    type: 'resource',
    description: 'Create and share mental health resources and tips',
    icon: '💡',
    structure: {
      sections: [
        {
          id: 'title',
          label: 'Resource Title',
          type: 'text',
          placeholder: 'Give your resource a clear, descriptive title',
          required: true
        },
        {
          id: 'category',
          label: 'Category',
          type: 'tags',
          required: true,
          suggestions: [
            'Coping Skills',
            'Self-Care',
            'Mindfulness',
            'Stress Management',
            'Sleep Hygiene',
            'Nutrition',
            'Exercise',
            'Relationships'
          ]
        },
        {
          id: 'description',
          label: 'Description',
          type: 'rich-text',
          placeholder: 'Provide a detailed description of the resource...',
          required: true
        },
        {
          id: 'key-points',
          label: 'Key Takeaways',
          type: 'list',
          placeholder: 'List the main points or tips...',
          required: true
        },
        {
          id: 'implementation',
          label: 'How to Implement',
          type: 'rich-text',
          placeholder: 'Practical steps to use this resource...'
        }
      ]
    }
  }
];

/**
 * AI Content Suggestion Engine
 */
export class ContentSuggestionEngine {
  private userHistory: Array<{ type: ContentType; timestamp: number; tags?: string[] }> = [];
  private timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';

  constructor() {
    this.timeOfDay = this.getTimeOfDay();
    this.loadHistory();
  }

  /**
   * Get time-of-day based suggestions
   */
  private getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  }

  /**
   * Generate contextual content suggestions
   */
  getSuggestions(context?: {
    recentMood?: string;
    recentActivity?: ContentType;
    tags?: string[];
  }): ContentSuggestion[] {
    const suggestions: ContentSuggestion[] = [];

    // Time-based suggestions
    switch (this.timeOfDay) {
      case 'morning':
        suggestions.push({
          id: 'morning-intention',
          title: 'Set Your Morning Intention',
          content: 'Start your day by setting a clear intention. What do you want to focus on today?',
          relevance: 0.9,
          type: 'journal',
          context: 'Morning ritual',
          tags: ['morning', 'intention-setting', 'productivity']
        });
        break;

      case 'afternoon':
        suggestions.push({
          id: 'afternoon-checkin',
          title: 'Midday Check-In',
          content: 'Take a moment to pause and reflect on your morning. How are you feeling? What adjustments might help your afternoon?',
          relevance: 0.85,
          type: 'mood-note',
          context: 'Afternoon reflection',
          tags: ['check-in', 'mindfulness']
        });
        break;

      case 'evening':
        suggestions.push({
          id: 'evening-reflection',
          title: 'Evening Reflection',
          content: 'Reflect on your day. What went well? What challenges did you face? What are you grateful for?',
          relevance: 0.95,
          type: 'journal',
          context: 'Evening wind-down',
          tags: ['evening', 'reflection', 'gratitude']
        });
        break;

      case 'night':
        suggestions.push({
          id: 'night-gratitude',
          title: 'Gratitude Before Sleep',
          content: 'End your day with gratitude. List three things that made today worthwhile.',
          relevance: 0.9,
          type: 'journal',
          context: 'Bedtime routine',
          tags: ['night', 'gratitude', 'sleep']
        });
        break;
    }

    // Mood-based suggestions
    if (context?.recentMood) {
      if (context.recentMood === 'anxious' || context.recentMood === 'stressed') {
        suggestions.push({
          id: 'stress-management',
          title: 'Stress Management Techniques',
          content: 'Try these evidence-based techniques: deep breathing, progressive muscle relaxation, or a short walk.',
          relevance: 0.95,
          type: 'resource',
          context: 'Mood support',
          tags: ['stress', 'coping', 'self-care']
        });
      }

      if (context.recentMood === 'sad' || context.recentMood === 'down') {
        suggestions.push({
          id: 'mood-boost',
          title: 'Mood-Boosting Activities',
          content: 'When feeling down, try: connecting with a friend, engaging in a hobby, or practicing self-compassion.',
          relevance: 0.9,
          type: 'resource',
          context: 'Mood support',
          tags: ['mood-boost', 'self-care', 'support']
        });
      }
    }

    // Activity-based suggestions
    if (context?.recentActivity === 'mood-note') {
      suggestions.push({
        id: 'mood-journal',
        title: 'Explore Your Mood Further',
        content: 'You checked in on your mood. Consider journaling to explore what\'s behind these feelings.',
        relevance: 0.8,
        type: 'journal',
        context: 'Follow-up suggestion',
        tags: ['journaling', 'self-awareness']
      });
    }

    // Pattern-based suggestions (if user hasn't journaled in a while)
    const lastJournal = this.userHistory
      .filter(h => h.type === 'journal')
      .sort((a, b) => b.timestamp - a.timestamp)[0];

    if (!lastJournal || Date.now() - lastJournal.timestamp > 86400000 * 2) {
      suggestions.push({
        id: 'journal-reminder',
        title: 'It\'s Been a While',
        content: 'You haven\'t journaled recently. Consistent reflection can help track patterns and progress.',
        relevance: 0.75,
        type: 'journal',
        context: 'Engagement nudge',
        tags: ['consistency', 'habit-building']
      });
    }

    // Weekly review suggestion (Sunday)
    const dayOfWeek = new Date().getDay();
    if (dayOfWeek === 0) {
      suggestions.push({
        id: 'weekly-review',
        title: 'Weekly Review',
        content: 'Take time to review your week. What patterns do you notice in your mood and activities?',
        relevance: 0.85,
        type: 'journal',
        context: 'Weekly ritual',
        tags: ['weekly-review', 'reflection', 'patterns']
      });
    }

    return suggestions.sort((a, b) => b.relevance - a.relevance);
  }

  /**
   * Generate AI-powered content based on options
   */
  async generateContent(type: ContentType, options: GenerationOptions = {}): Promise<string> {
    const { tone = 'empathetic', length = 'medium', style = 'reflective', keywords = [], context = '' } = options;

    // Content generation templates based on type and options
    const templates: Record<ContentType, Record<string, string[]>> = {
      'journal': {
        'reflective': [
          'Today, I noticed {keywords}. As I reflect on this, I feel...',
          'Looking back on {context}, I realize...',
          'In moments of {keywords}, I discovered...'
        ],
        'structured': [
          '**What happened:** {context}\n\n**My thoughts:**\n\n**What I learned:**',
          '**Situation:** {context}\n\n**Feelings:**\n\n**Next steps:**'
        ],
        'narrative': [
          'The day began with {context}. As events unfolded...',
          'Something interesting happened today regarding {keywords}...'
        ]
      },
      'mood-note': {
        'reflective': [
          'I\'m feeling {keywords} right now because...',
          'My mood today has been influenced by {context}...'
        ]
      },
      'resource': {
        'professional': [
          '**{keywords}:** Research shows that...\n\n**Key benefits:**\n\n**How to implement:**',
          '**Understanding {keywords}**\n\nThis evidence-based approach...'
        ],
        'casual': [
          'Let\'s talk about {keywords}. Here\'s what works...',
          'Quick tips for {keywords}:'
        ]
      },
      'article': {
        'professional': [
          '# {keywords}\n\n## Introduction\n\n{context}\n\n## Key Points\n\n## Conclusion',
          '**{keywords}: A Comprehensive Guide**\n\nUnderstanding {context}...'
        ]
      },
      'social-post': {
        'motivational': [
          '💪 {keywords}\n\n{context}\n\n#MentalHealth #Wellness',
          '✨ Remember: {keywords}\n\n{context}'
        ],
        'empathetic': [
          'It\'s okay to feel {keywords}. {context}',
          'Gentle reminder about {keywords}: {context}'
        ]
      }
    };

    const styleTemplates = templates[type]?.[style] || templates[type]?.['reflective'] || [];
    const template = styleTemplates[Math.floor(Math.random() * styleTemplates.length)] || '';

    let generated = template
      .replace('{keywords}', keywords.join(', '))
      .replace('{context}', context);

    // Adjust length
    if (length === 'short') {
      generated = generated.split('\n').slice(0, 2).join('\n');
    } else if (length === 'long') {
      generated += '\n\n[Continue expanding on your thoughts...]';
    }

    return generated;
  }

  /**
   * Track user activity for better suggestions
   */
  trackActivity(type: ContentType, tags?: string[]): void {
    this.userHistory.push({
      type,
      timestamp: Date.now(),
      tags
    });

    // Keep only last 100 activities
    if (this.userHistory.length > 100) {
      this.userHistory.shift();
    }

    this.saveHistory();
  }

  /**
   * Get template by ID
   */
  getTemplate(templateId: string): ContentTemplate | undefined {
    return contentTemplates.find(t => t.id === templateId);
  }

  /**
   * Get templates by type
   */
  getTemplatesByType(type: ContentType): ContentTemplate[] {
    return contentTemplates.filter(t => t.type === type);
  }

  /**
   * Load history from localStorage
   */
  private loadHistory(): void {
    try {
      const stored = localStorage.getItem('content-creation-history');
      if (stored) {
        this.userHistory = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load content creation history:', error);
    }
  }

  /**
   * Save history to localStorage
   */
  private saveHistory(): void {
    try {
      localStorage.setItem('content-creation-history', JSON.stringify(this.userHistory));
    } catch (error) {
      console.warn('Failed to save content creation history:', error);
    }
  }
}

/**
 * Content Quality Analyzer
 */
export class ContentQualityAnalyzer {
  /**
   * Analyze content quality and provide suggestions
   */
  analyze(content: string): {
    score: number;
    wordCount: number;
    readabilityScore: number;
    suggestions: string[];
  } {
    const wordCount = content.trim().split(/\s+/).length;
    const sentenceCount = content.split(/[.!?]+/).filter(s => s.trim()).length;
    const avgWordsPerSentence = sentenceCount > 0 ? wordCount / sentenceCount : 0;

    const suggestions: string[] = [];
    let score = 100;

    // Word count analysis
    if (wordCount < 10) {
      suggestions.push('Try to expand your thoughts for deeper reflection');
      score -= 20;
    } else if (wordCount < 50) {
      suggestions.push('Consider adding more detail to capture the full experience');
      score -= 10;
    }

    // Readability analysis
    let readabilityScore = 100;
    if (avgWordsPerSentence > 25) {
      suggestions.push('Try breaking long sentences into shorter ones for clarity');
      readabilityScore -= 20;
      score -= 10;
    }

    // Sentiment indicators
    const positiveWords = content.match(/\b(grateful|happy|joy|love|peace|calm|hope|success|good|better|wonderful|amazing)\b/gi);
    const negativeWords = content.match(/\b(sad|angry|frustrat|stress|anxious|worry|fear|bad|terrible|awful|hate)\b/gi);

    const positiveCount = positiveWords?.length || 0;
    const negativeCount = negativeWords?.length || 0;

    if (negativeCount > positiveCount * 2 && positiveCount > 0) {
      suggestions.push('Remember to also acknowledge any positive aspects or coping strategies');
    }

    // Specificity check
    const hasSpecifics = /\b(today|yesterday|this morning|this evening|at \d+|when|where|who)\b/i.test(content);
    if (!hasSpecifics && wordCount > 20) {
      suggestions.push('Adding specific details (when, where, who) can make reflections more meaningful');
      score -= 5;
    }

    return {
      score: Math.max(0, Math.min(100, score)),
      wordCount,
      readabilityScore,
      suggestions
    };
  }
}

// Export singleton instances
export const contentEngine = new ContentSuggestionEngine();
export const qualityAnalyzer = new ContentQualityAnalyzer();
