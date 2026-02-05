import React, { useState } from 'react';
import { Link } from 'wouter';
import { 
  MessageCircle, Heart, Brain, Users, Sparkles, 
  RefreshCw, BookOpen, ArrowRight, Star, Shield,
  Lightbulb, Compass, Sun, Moon, Feather, Target
} from 'lucide-react';
import TglpNavbar from '../components/TglpNavbar';
import SafetyFooter from '../components/ui/SafetyFooter';

const TOPIC_CATEGORIES = [
  {
    id: 'self-reflection',
    name: 'Self-Reflection',
    icon: Brain,
    color: 'from-sage-400 to-sage-600',
    description: 'Explore your inner world with gentle curiosity',
    topics: [
      { question: "What does feeling safe look like for you?", depth: 'beginner' },
      { question: "When do you feel most like yourself?", depth: 'beginner' },
      { question: "What's one thing you're grateful for today, even if it's small?", depth: 'beginner' },
      { question: "How has your relationship with yourself changed over time?", depth: 'intermediate' },
      { question: "What would you tell your younger self about getting through hard times?", depth: 'intermediate' },
      { question: "What boundaries have you set that you're proud of?", depth: 'intermediate' },
      { question: "How do you recognize when you're being too hard on yourself?", depth: 'advanced' },
      { question: "What patterns from your past do you notice showing up in your present?", depth: 'advanced' },
      { question: "What does healing mean to you right now, in this season of your life?", depth: 'advanced' }
    ]
  },
  {
    id: 'emotions',
    name: 'Emotions & Feelings',
    icon: Heart,
    color: 'from-blossom-400 to-blossom-600',
    description: 'Name and understand your emotional landscape',
    topics: [
      { question: "What emotion have you been feeling most often lately?", depth: 'beginner' },
      { question: "How does your body tell you when something is wrong?", depth: 'beginner' },
      { question: "What helps you feel calm when you're overwhelmed?", depth: 'beginner' },
      { question: "Are there emotions you find difficult to express? Why might that be?", depth: 'intermediate' },
      { question: "How do you typically respond to sadness? Is that response helpful?", depth: 'intermediate' },
      { question: "What's the difference between feeling lonely and being alone for you?", depth: 'intermediate' },
      { question: "How has your relationship with anger evolved?", depth: 'advanced' },
      { question: "What emotions do you tend to avoid, and what might they be trying to tell you?", depth: 'advanced' },
      { question: "How do you hold space for multiple conflicting emotions at once?", depth: 'advanced' }
    ]
  },
  {
    id: 'relationships',
    name: 'Relationships',
    icon: Users,
    color: 'from-gold-400 to-gold-600',
    description: 'Deepen connections with others and yourself',
    topics: [
      { question: "Who makes you feel truly seen and heard?", depth: 'beginner' },
      { question: "What's one quality you appreciate in your closest relationships?", depth: 'beginner' },
      { question: "How do you like to receive support when you're struggling?", depth: 'beginner' },
      { question: "What does healthy conflict look like to you?", depth: 'intermediate' },
      { question: "How do you communicate your needs without feeling guilty?", depth: 'intermediate' },
      { question: "What relationship patterns have you worked to change?", depth: 'intermediate' },
      { question: "How do early attachment experiences show up in your adult relationships?", depth: 'advanced' },
      { question: "What does interdependence mean to you versus codependence?", depth: 'advanced' },
      { question: "How do you repair trust after it's been broken?", depth: 'advanced' }
    ]
  },
  {
    id: 'growth',
    name: 'Growth & Healing',
    icon: Sparkles,
    color: 'from-healing-400 to-healing-600',
    description: 'Celebrate progress and explore next steps',
    topics: [
      { question: "What's one small win you've had recently?", depth: 'beginner' },
      { question: "What does self-compassion look like in practice for you?", depth: 'beginner' },
      { question: "When was the last time you did something just for yourself?", depth: 'beginner' },
      { question: "What's one thing you've learned about yourself this year?", depth: 'intermediate' },
      { question: "How do you know when you're making progress in your healing?", depth: 'intermediate' },
      { question: "What's something you used to believe that no longer serves you?", depth: 'intermediate' },
      { question: "How do you navigate setbacks without losing hope?", depth: 'advanced' },
      { question: "What does post-traumatic growth look like in your life?", depth: 'advanced' },
      { question: "How do you balance accepting yourself as you are while still wanting to grow?", depth: 'advanced' }
    ]
  },
  {
    id: 'values',
    name: 'Values & Purpose',
    icon: Compass,
    color: 'from-purple-400 to-purple-600',
    description: 'Connect with what matters most to you',
    topics: [
      { question: "What brings you joy, even in small moments?", depth: 'beginner' },
      { question: "What activities make you lose track of time?", depth: 'beginner' },
      { question: "Who inspires you, and what qualities do they have?", depth: 'beginner' },
      { question: "What values do you want to guide your decisions?", depth: 'intermediate' },
      { question: "How has your sense of purpose evolved over time?", depth: 'intermediate' },
      { question: "What would you do differently if fear wasn't a factor?", depth: 'intermediate' },
      { question: "How do you stay connected to your values during difficult times?", depth: 'advanced' },
      { question: "What legacy do you want to leave in the lives of those around you?", depth: 'advanced' },
      { question: "How do you reconcile who you are with who you want to become?", depth: 'advanced' }
    ]
  },
  {
    id: 'daily-life',
    name: 'Daily Wellbeing',
    icon: Sun,
    color: 'from-amber-400 to-amber-600',
    description: 'Practical topics for everyday wellness',
    topics: [
      { question: "How did you sleep last night, and how is that affecting your day?", depth: 'beginner' },
      { question: "What's one thing you could do today to take care of yourself?", depth: 'beginner' },
      { question: "How are you feeling right now, in this moment?", depth: 'beginner' },
      { question: "What's your relationship with rest and productivity?", depth: 'intermediate' },
      { question: "How do you create moments of peace in a busy day?", depth: 'intermediate' },
      { question: "What routines support your mental health?", depth: 'intermediate' },
      { question: "How do you navigate days when motivation is low?", depth: 'advanced' },
      { question: "What does sustainable self-care look like for your life?", depth: 'advanced' },
      { question: "How do you maintain wellness practices during transitions or crises?", depth: 'advanced' }
    ]
  }
];

const DEPTH_LABELS = {
  beginner: { label: 'Gentle Start', color: 'bg-sage-100 text-sage-700 dark:bg-sage-900/50 dark:text-sage-300' },
  intermediate: { label: 'Going Deeper', color: 'bg-gold-100 text-gold-700 dark:bg-gold-900/50 dark:text-gold-300' },
  advanced: { label: 'Deep Exploration', color: 'bg-blossom-100 text-blossom-700 dark:bg-blossom-900/50 dark:text-blossom-300' }
};

export default function TalkTopics() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentTopic, setCurrentTopic] = useState(null);
  const [depthFilter, setDepthFilter] = useState('all');
  const [savedTopics, setSavedTopics] = useState([]);

  const getRandomTopic = (category = null) => {
    let pool = [];
    if (category) {
      pool = category.topics;
    } else {
      pool = TOPIC_CATEGORIES.flatMap(c => c.topics.map(t => ({ ...t, category: c.name })));
    }
    
    if (depthFilter !== 'all') {
      pool = pool.filter(t => t.depth === depthFilter);
    }
    
    if (pool.length === 0) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const handleSaveTopic = (topic) => {
    if (!savedTopics.find(t => t.question === topic.question)) {
      setSavedTopics([...savedTopics, topic]);
    }
  };

  const filteredTopics = selectedCategory?.topics.filter(t => 
    depthFilter === 'all' || t.depth === depthFilter
  ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white dark:from-gray-900 dark:to-gray-950">
      <TglpNavbar />
      
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-sage-600 dark:text-sage-400 mb-4">
            <MessageCircle className="w-5 h-5" />
            <span className="uppercase tracking-wider text-sm font-medium">Talk Topics</span>
          </div>
          
          <h1 className="font-serif text-4xl md:text-5xl text-gray-800 dark:text-gray-100 mb-4">
            Start a meaningful
            <span className="block text-sage-600 dark:text-sage-400 italic">conversation.</span>
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            Whether you're preparing for therapy, connecting with a loved one, 
            or simply exploring your own thoughts, these prompts can help guide 
            deeper, more meaningful discussions.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={() => setCurrentTopic(getRandomTopic())}
              className="inline-flex items-center gap-2 px-6 py-3 bg-sage-600 hover:bg-sage-700 text-white rounded-full transition-colors"
              data-testid="button-random-topic"
            >
              <Sparkles className="w-5 h-5" />
              Get Random Topic
            </button>
            
            <Link href="/journal">
              <a className="inline-flex items-center gap-2 px-6 py-3 border border-sage-300 dark:border-sage-700 text-sage-700 dark:text-sage-300 rounded-full hover:bg-sage-50 dark:hover:bg-sage-900/30 transition-colors">
                <BookOpen className="w-5 h-5" />
                Journal Instead
              </a>
            </Link>
          </div>

          <div className="flex justify-center gap-2 flex-wrap">
            <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Filter by depth:</span>
            {['all', 'beginner', 'intermediate', 'advanced'].map(depth => (
              <button
                key={depth}
                onClick={() => setDepthFilter(depth)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  depthFilter === depth
                    ? 'bg-sage-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                data-testid={`button-filter-${depth}`}
              >
                {depth === 'all' ? 'All Levels' : DEPTH_LABELS[depth].label}
              </button>
            ))}
          </div>
        </header>

        {currentTopic && (
          <div className="mb-12 p-8 bg-gradient-to-br from-sage-50 to-cream-50 dark:from-sage-900/30 dark:to-gray-800 rounded-2xl border border-sage-200 dark:border-sage-800">
            <div className="flex items-start justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-xs ${DEPTH_LABELS[currentTopic.depth].color}`}>
                {DEPTH_LABELS[currentTopic.depth].label}
              </span>
              <button
                onClick={() => setCurrentTopic(getRandomTopic())}
                className="p-2 text-sage-600 dark:text-sage-400 hover:bg-sage-100 dark:hover:bg-sage-800 rounded-full transition-colors"
                data-testid="button-refresh-topic"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
            
            <p className="font-serif text-2xl md:text-3xl text-gray-800 dark:text-gray-100 mb-6">
              "{currentTopic.question}"
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => handleSaveTopic(currentTopic)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sage-600 dark:text-sage-400 hover:bg-sage-100 dark:hover:bg-sage-800 rounded-lg transition-colors"
                data-testid="button-save-topic"
              >
                <Star className="w-4 h-4" />
                Save for Later
              </button>
              <Link href="/journal">
                <a className="inline-flex items-center gap-2 px-4 py-2 bg-sage-600 text-white rounded-lg hover:bg-sage-700 transition-colors">
                  <Feather className="w-4 h-4" />
                  Journal This
                </a>
              </Link>
            </div>
          </div>
        )}

        <section className="mb-12">
          <h2 className="font-serif text-2xl text-gray-800 dark:text-gray-100 mb-6 text-center">
            Explore by Category
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOPIC_CATEGORIES.map(category => {
              const Icon = category.icon;
              const isSelected = selectedCategory?.id === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(isSelected ? null : category)}
                  className={`p-6 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-gradient-to-br ' + category.color + ' text-white border-transparent shadow-lg scale-[1.02]'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-sage-300 dark:hover:border-sage-600'
                  }`}
                  data-testid={`button-category-${category.id}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${
                    isSelected ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-sage-600 dark:text-sage-400'}`} />
                  </div>
                  <h3 className={`font-semibold mb-1 ${isSelected ? 'text-white' : 'text-gray-800 dark:text-gray-100'}`}>
                    {category.name}
                  </h3>
                  <p className={`text-sm ${isSelected ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'}`}>
                    {category.description}
                  </p>
                  <div className={`mt-3 text-xs ${isSelected ? 'text-white/70' : 'text-gray-500 dark:text-gray-500'}`}>
                    {category.topics.length} topics
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {selectedCategory && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl text-gray-800 dark:text-gray-100">
                {selectedCategory.name} Topics
              </h2>
              <button
                onClick={() => setCurrentTopic(getRandomTopic(selectedCategory))}
                className="inline-flex items-center gap-2 px-4 py-2 text-sage-600 dark:text-sage-400 hover:bg-sage-100 dark:hover:bg-sage-800 rounded-lg transition-colors"
                data-testid="button-random-from-category"
              >
                <RefreshCw className="w-4 h-4" />
                Random from this category
              </button>
            </div>
            
            <div className="space-y-3">
              {filteredTopics.map((topic, index) => (
                <div
                  key={index}
                  className="p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs mb-2 ${DEPTH_LABELS[topic.depth].color}`}>
                        {DEPTH_LABELS[topic.depth].label}
                      </span>
                      <p className="text-gray-800 dark:text-gray-100">{topic.question}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveTopic(topic)}
                        className="p-2 text-gray-400 hover:text-gold-500 transition-colors"
                        title="Save for later"
                        data-testid={`button-save-topic-${index}`}
                      >
                        <Star className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredTopics.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No topics match the current filter. Try adjusting the depth level.
                </p>
              )}
            </div>
          </section>
        )}

        {savedTopics.length > 0 && (
          <section className="mb-12">
            <h2 className="font-serif text-2xl text-gray-800 dark:text-gray-100 mb-6">
              <Star className="w-5 h-5 inline-block mr-2 text-gold-500" />
              Saved Topics ({savedTopics.length})
            </h2>
            
            <div className="space-y-3">
              {savedTopics.map((topic, index) => (
                <div
                  key={index}
                  className="p-4 bg-gold-50 dark:bg-gold-900/20 rounded-xl border border-gold-200 dark:border-gold-800"
                >
                  <p className="text-gray-800 dark:text-gray-100">{topic.question}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="bg-gradient-to-br from-cream-100 to-sage-50 dark:from-gray-800 dark:to-sage-900/30 rounded-2xl p-8 mb-12">
          <h2 className="font-serif text-2xl text-gray-800 dark:text-gray-100 mb-4">
            <Shield className="w-5 h-5 inline-block mr-2 text-sage-600" />
            Tips for Meaningful Conversations
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex gap-3">
                <Lightbulb className="w-5 h-5 text-sage-600 dark:text-sage-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-100 mb-1">Create a safe space</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Choose a comfortable setting free from distractions. Let the other person know 
                    there's no pressure to share anything they're not ready to discuss.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Heart className="w-5 h-5 text-blossom-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-100 mb-1">Listen without fixing</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Sometimes people just need to be heard. Ask if they want advice before offering solutions.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <Target className="w-5 h-5 text-gold-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-100 mb-1">Start where you are</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Begin with "Gentle Start" topics if deep conversations feel overwhelming. 
                    There's no rush to go deeper.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Moon className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-100 mb-1">Respect boundaries</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    It's okay to say "I'm not ready to talk about that." Honor your own and others' limits.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="text-center mb-12">
          <h2 className="font-serif text-2xl text-gray-800 dark:text-gray-100 mb-4">
            Continue Your Journey
          </h2>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/chat">
              <a className="inline-flex items-center gap-2 px-6 py-3 bg-sage-600 text-white rounded-full hover:bg-sage-700 transition-colors">
                <MessageCircle className="w-5 h-5" />
                Talk to AI Companion
                <ArrowRight className="w-4 h-4" />
              </a>
            </Link>
            
            <Link href="/journal">
              <a className="inline-flex items-center gap-2 px-6 py-3 border border-sage-300 dark:border-sage-700 text-sage-700 dark:text-sage-300 rounded-full hover:bg-sage-50 dark:hover:bg-sage-900/30 transition-colors">
                <BookOpen className="w-5 h-5" />
                Start Journaling
              </a>
            </Link>
            
            <Link href="/practices">
              <a className="inline-flex items-center gap-2 px-6 py-3 border border-sage-300 dark:border-sage-700 text-sage-700 dark:text-sage-300 rounded-full hover:bg-sage-50 dark:hover:bg-sage-900/30 transition-colors">
                <Sparkles className="w-5 h-5" />
                Explore Practices
              </a>
            </Link>
          </div>
        </section>

        <SafetyFooter />
      </main>
    </div>
  );
}
