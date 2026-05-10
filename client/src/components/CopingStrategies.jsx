import { useState } from "react";
import { Brain, Heart, Zap, Users, Music, Palette, BookOpen, ChevronDown, Star, Check } from 'lucide-react';

const STRATEGY_CATEGORIES = {
  cognitive: {
    name: "Cognitive",
    icon: Brain,
    color: "from-purple-400 to-indigo-500",
    description: "Change your thinking patterns",
    strategies: [
      {
        id: "reframing",
        name: "Cognitive Reframing",
        description: "Challenge negative thoughts by finding alternative perspectives",
        steps: [
          "Identify the negative thought",
          "Ask: Is this thought 100% true?",
          "Find evidence against this thought",
          "Create a balanced alternative thought",
        ],
        example: "Instead of 'I always fail,' try 'I face challenges, but I've succeeded before and can again.'",
      },
      {
        id: "thought-stopping",
        name: "Thought Stopping",
        description: "Interrupt rumination with a mental 'stop sign'",
        steps: [
          "Notice when you're ruminating",
          "Visualize a bright red stop sign",
          "Say 'STOP' firmly in your mind",
          "Replace with a positive affirmation",
        ],
        example: "When caught in worry loops, mentally shout STOP and redirect to present moment.",
      },
      {
        id: "journaling",
        name: "Therapeutic Journaling",
        description: "Write to process and understand emotions",
        steps: [
          "Set aside 15-20 minutes",
          "Write freely without judgment",
          "Explore the 'why' behind feelings",
          "End with one positive insight",
        ],
        example: "Write about a difficult situation, then list 3 things you learned from it.",
      },
    ],
  },
  emotional: {
    name: "Emotional",
    icon: Heart,
    color: "from-pink-400 to-rose-500",
    description: "Regulate your emotions",
    strategies: [
      {
        id: "self-compassion",
        name: "Self-Compassion",
        description: "Treat yourself with the kindness you'd show a friend",
        steps: [
          "Acknowledge your suffering",
          "Remember others feel this too",
          "Place a hand on your heart",
          "Say kind words to yourself",
        ],
        example: "'This is hard, and it's okay to struggle. I'm doing my best.'",
      },
      {
        id: "emotional-release",
        name: "Emotional Release",
        description: "Allow emotions to flow safely",
        steps: [
          "Find a private, safe space",
          "Allow tears if they come",
          "Express through art or music",
          "Physical movement helps release",
        ],
        example: "Put on emotional music, let yourself cry, then take a warm shower.",
      },
      {
        id: "opposite-action",
        name: "Opposite Action",
        description: "Act opposite to unhelpful urges",
        steps: [
          "Identify the urge (e.g., isolate)",
          "Recognize it may not help",
          "Choose the opposite (e.g., reach out)",
          "Do it even if you don't feel like it",
        ],
        example: "When urge says 'stay in bed,' gently get up and take a short walk.",
      },
    ],
  },
  physical: {
    name: "Physical",
    icon: Zap,
    color: "from-orange-400 to-amber-500",
    description: "Use your body to calm your mind",
    strategies: [
      {
        id: "grounding",
        name: "Physical Grounding",
        description: "Use your senses to anchor in the present",
        steps: [
          "Feel your feet on the ground",
          "Hold an ice cube or cold water",
          "Smell something strong (mint, coffee)",
          "Focus on physical sensations",
        ],
        example: "Hold ice in your hand and focus entirely on the cold sensation.",
      },
      {
        id: "progressive-relaxation",
        name: "Progressive Muscle Relaxation",
        description: "Systematically tense and release muscle groups",
        steps: [
          "Start with feet - tense for 5 seconds",
          "Release and notice the difference",
          "Move up through each body part",
          "End with face muscles",
        ],
        example: "Clench your fists tight for 5 seconds, then completely release.",
      },
      {
        id: "cold-exposure",
        name: "Cold Water Technique",
        description: "Activate the dive reflex to calm anxiety",
        steps: [
          "Fill a bowl with cold water",
          "Hold your breath",
          "Submerge your face for 30 seconds",
          "This activates calming reflex",
        ],
        example: "Splash cold water on your face when feeling overwhelmed.",
      },
    ],
  },
  social: {
    name: "Social",
    icon: Users,
    color: "from-green-400 to-emerald-500",
    description: "Connect with others",
    strategies: [
      {
        id: "reach-out",
        name: "Reach Out",
        description: "Connect with someone who cares",
        steps: [
          "Choose someone you trust",
          "Send a message or call",
          "You don't have to explain everything",
          "Just hearing a friendly voice helps",
        ],
        example: "Text a friend: 'Having a rough day. Can we chat for 5 minutes?'",
      },
      {
        id: "helping-others",
        name: "Help Someone Else",
        description: "Shift focus outward by giving",
        steps: [
          "Think of someone who might need help",
          "Offer something small",
          "Volunteer or donate",
          "Acts of kindness boost mood",
        ],
        example: "Send an encouraging message to a friend who's also struggling.",
      },
      {
        id: "support-groups",
        name: "Support Groups",
        description: "Connect with others who understand",
        steps: [
          "Find groups for your situation",
          "Online or in-person options exist",
          "Share when ready, listen always",
          "Knowing you're not alone helps",
        ],
        example: "Join an online mental health community or local support group.",
      },
    ],
  },
  creative: {
    name: "Creative",
    icon: Palette,
    color: "from-cyan-400 to-blue-500",
    description: "Express through creativity",
    strategies: [
      {
        id: "art-therapy",
        name: "Art Expression",
        description: "Draw, paint, or create without judgment",
        steps: [
          "Gather materials (even just pen and paper)",
          "Don't aim for 'good' - just express",
          "Use colors that match your mood",
          "Let your hand move freely",
        ],
        example: "Scribble with colors that represent how you feel right now.",
      },
      {
        id: "music-therapy",
        name: "Music Healing",
        description: "Use music to process emotions",
        steps: [
          "Choose music matching your mood first",
          "Gradually shift to uplifting songs",
          "Sing or hum along",
          "Create a 'feel better' playlist",
        ],
        example: "Start with a sad song if you're sad, then transition to hopeful music.",
      },
      {
        id: "nature-connection",
        name: "Nature Connection",
        description: "Find peace in the natural world",
        steps: [
          "Go outside, even briefly",
          "Notice plants, sky, animals",
          "Touch natural textures",
          "Breathe fresh air deeply",
        ],
        example: "Sit with a tree for 5 minutes. Feel its bark. Listen to leaves.",
      },
    ],
  },
};

export default function CopingStrategies() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorite_strategies");
    return saved ? JSON.parse(saved) : [];
  });

  const toggleStep = (index) => {
    setCompletedSteps(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const toggleFavorite = (strategyId) => {
    const newFavorites = favorites.includes(strategyId)
      ? favorites.filter(f => f !== strategyId)
      : [...favorites, strategyId];
    setFavorites(newFavorites);
    localStorage.setItem("favorite_strategies", JSON.stringify(newFavorites));
  };

  const category = selectedCategory ? STRATEGY_CATEGORIES[selectedCategory] : null;
  const CategoryIcon = category?.icon;

  return (
    <div className="card-elevated p-6 relative overflow-hidden" data-testid="coping-strategies">
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-indigo-400/10 to-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category?.color || "from-indigo-400 to-purple-500"} flex items-center justify-center shadow-lg`}>
            {CategoryIcon ? <CategoryIcon className="w-6 h-6 text-white" /> : <Brain className="w-6 h-6 text-white" />}
          </div>
          <div>
            <h3 className="font-display font-bold text-[var(--text)]" data-testid="text-coping-title">
              Coping Strategies
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">Evidence-based techniques for wellbeing</p>
          </div>
        </div>

        {!selectedCategory && (
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(STRATEGY_CATEGORIES).map(([key, cat]) => {
              const Icon = cat.icon;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`p-4 rounded-xl text-left transition-all hover:scale-102 bg-gradient-to-br ${cat.color} text-white`}
                  data-testid={`button-category-${key}`}
                >
                  <Icon className="w-6 h-6 mb-2" aria-hidden="true" />
                  <span className="font-semibold block">{cat.name}</span>
                  <span className="text-xs text-white/80">{cat.description}</span>
                </button>
              );
            })}
          </div>
        )}

        {selectedCategory && !selectedStrategy && (
          <div className="animate-fade-in-up">
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-sm text-[var(--text-secondary)] mb-4 hover:text-[var(--primary)]"
              data-testid="button-back-categories"
            >
              ← Back to categories
            </button>

            <div className={`p-4 rounded-xl bg-gradient-to-br ${category.color} text-white mb-4`}>
              <div className="flex items-center gap-3">
                <CategoryIcon className="w-8 h-8" />
                <div>
                  <span className="font-bold text-lg">{category.name} Strategies</span>
                  <p className="text-sm text-white/80">{category.description}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {category.strategies.map((strategy) => (
                <button
                  key={strategy.id}
                  onClick={() => { setSelectedStrategy(strategy); setCompletedSteps([]); }}
                  className="w-full p-4 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-all text-left flex items-center justify-between"
                  data-testid={`button-strategy-${strategy.id}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[var(--text)]">{strategy.name}</span>
                      {favorites.includes(strategy.id) && (
                        <Star className="w-4 h-4 text-amber-500 fill-current" />
                      )}
                    </div>
                    <p className="text-sm text-[var(--text-secondary)]">{strategy.description}</p>
                  </div>
                  <ChevronDown className="w-5 h-5 text-[var(--text-muted)] -rotate-90" />
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedStrategy && (
          <div className="animate-fade-in-up">
            <button
              onClick={() => setSelectedStrategy(null)}
              className="text-sm text-[var(--text-secondary)] mb-4 hover:text-[var(--primary)]"
              data-testid="button-back-strategies"
            >
              ← Back to {category.name} strategies
            </button>

            <div className="flex items-center justify-between mb-4">
              <h4 className="font-display font-bold text-xl text-[var(--text)]">
                {selectedStrategy.name}
              </h4>
              <button
                onClick={() => toggleFavorite(selectedStrategy.id)}
                className={`p-2 rounded-lg ${favorites.includes(selectedStrategy.id) ? "bg-amber-100 dark:bg-amber-900/30" : "bg-[var(--surface)]"}`}
                aria-label={favorites.includes(selectedStrategy.id) ? "Remove from favorites" : "Add to favorites"}
                data-testid="button-favorite"
              >
                <Star className={`w-5 h-5 ${favorites.includes(selectedStrategy.id) ? "text-amber-500 fill-current" : "text-[var(--text-muted)]"}`} />
              </button>
            </div>

            <p className="text-[var(--text-secondary)] mb-6">{selectedStrategy.description}</p>

            <div className="space-y-3 mb-6">
              {selectedStrategy.steps.map((step, i) => (
                <button
                  key={i}
                  onClick={() => toggleStep(i)}
                  className={`w-full p-4 rounded-xl text-left transition-all flex items-center gap-3 ${
                    completedSteps.includes(i)
                      ? `bg-gradient-to-r ${category.color} text-white`
                      : "bg-[var(--surface)] hover:bg-[var(--surface-hover)]"
                  }`}
                  data-testid={`button-step-${i}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    completedSteps.includes(i) ? "bg-white/20" : "bg-[var(--primary)]/10"
                  }`}>
                    {completedSteps.includes(i) ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span className={completedSteps.includes(i) ? "text-white" : "text-[var(--primary)]"}>{i + 1}</span>
                    )}
                  </div>
                  <span className={completedSteps.includes(i) ? "text-white" : "text-[var(--text)]"}>{step}</span>
                </button>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20">
              <div className="flex items-start gap-2">
                <BookOpen className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-[var(--text)]">Example:</span>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">{selectedStrategy.example}</p>
                </div>
              </div>
            </div>

            {completedSteps.length === selectedStrategy.steps.length && (
              <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 text-center">
                <Check className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="font-medium text-[var(--text)]">Great job completing this exercise!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
