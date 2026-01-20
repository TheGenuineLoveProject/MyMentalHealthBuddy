import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Brain, Heart, Lightbulb, Compass, Target, 
  Sparkles, BookOpen, Zap, Shield, Flame,
  TreeDeciduous, Eye, Scale, Infinity, Star
} from "lucide-react";
import { Link } from "wouter";
import SEO from "@/components/SEO";

interface HealingModality {
  id: string;
  name: string;
  category: string;
  description: string;
  duration: string;
  intensity: string;
}

interface CognitiveFramework {
  id: string;
  name: string;
  category: string;
  description: string;
  difficulty: string;
}

interface WisdomPattern {
  id: string;
  name: string;
  description: string;
  insights: string[];
}

const TOOL_CATEGORIES = [
  { id: "healing", name: "Healing Intelligence", icon: Heart, color: "rose", description: "12 evidence-based healing modalities" },
  { id: "cognitive", name: "Cognitive Mastery", icon: Brain, color: "violet", description: "15 advanced mental frameworks" },
  { id: "wisdom", name: "Wisdom Engine", icon: Lightbulb, color: "amber", description: "Cross-tradition wisdom synthesis" }
];

export default function EliteToolsDashboard() {
  const [activeCategory, setActiveCategory] = useState<string>("healing");

  const { data: healingData, isLoading: healingLoading } = useQuery<{ success: boolean; data: HealingModality[] }>({
    queryKey: ["/api/healing-intelligence/modalities"]
  });

  const { data: cognitiveData, isLoading: cognitiveLoading } = useQuery<{ success: boolean; data: CognitiveFramework[] }>({
    queryKey: ["/api/cognitive-mastery/frameworks"]
  });

  const { data: wisdomData, isLoading: wisdomLoading } = useQuery<{ success: boolean; data: WisdomPattern[] }>({
    queryKey: ["/api/wisdom-engine/patterns"]
  });

  const { data: dailyWisdom } = useQuery<{ success: boolean; data: { quote: string; source: string; theme: string } }>({
    queryKey: ["/api/wisdom-engine/daily"]
  });

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, typeof Heart> = {
      "Body-Based": Heart,
      "Mind-Based": Brain,
      "Emotion-Based": Flame,
      "Story-Based": BookOpen,
      "Relational": Target,
      "Existential": Compass,
      "Physiological": Zap,
      "Depth Psychology": Eye,
      "Heart-Based": Heart,
      "Loss-Based": TreeDeciduous,
      "Parts Work": Shield,
      "Foundational Reasoning": Brain,
      "Consequential Analysis": Scale,
      "Decision Science": Target,
      "Economic Thinking": Infinity,
      "Complexity Science": Sparkles
    };
    return icons[category] || Star;
  };

  const renderContent = () => {
    if (activeCategory === "healing") {
      if (healingLoading) return <LoadingState />;
      return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {healingData?.data?.map((modality) => {
            const Icon = getCategoryIcon(modality.category);
            return (
              <article 
                key={modality.id} 
                className="card-bordered group cursor-pointer hover:shadow-lg transition-all duration-300"
                data-testid={`card-healing-${modality.id}`}
              >
                <div className="flex items-start gap-4">
                  <div className="icon-container icon-lg icon-soft-blush group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-heading-sm text-teal mb-1">{modality.name}</h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-[var(--blush-100)] text-[var(--blush-700)]">
                      {modality.category}
                    </span>
                  </div>
                </div>
                <p className="text-body-sm mt-4 line-clamp-2">{modality.description}</p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--sage-200)]">
                  <span className="text-caption">{modality.duration}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    modality.intensity === 'gentle' ? 'bg-[var(--sage-100)] text-[var(--sage-700)]' :
                    modality.intensity === 'moderate' ? 'bg-[var(--gold-100)] text-[var(--gold-700)]' :
                    modality.intensity === 'deep' ? 'bg-[var(--teal-100)] text-[var(--teal-700)]' :
                    'bg-[var(--sage-100)] text-[var(--sage-700)]'
                  }`}>
                    {modality.intensity}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      );
    }

    if (activeCategory === "cognitive") {
      if (cognitiveLoading) return <LoadingState />;
      return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cognitiveData?.data?.map((framework) => {
            const Icon = getCategoryIcon(framework.category);
            return (
              <article 
                key={framework.id} 
                className="card-bordered group cursor-pointer hover:shadow-lg transition-all duration-300"
                data-testid={`card-cognitive-${framework.id}`}
              >
                <div className="flex items-start gap-4">
                  <div className="icon-container icon-lg icon-soft-teal group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-heading-sm text-teal mb-1">{framework.name}</h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-[var(--teal-100)] text-[var(--teal-700)]">
                      {framework.category}
                    </span>
                  </div>
                </div>
                <p className="text-body-sm mt-4 line-clamp-2">{framework.description}</p>
                <div className="flex items-center justify-end mt-4 pt-4 border-t border-[var(--sage-200)]">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    framework.difficulty === 'beginner' ? 'bg-[var(--sage-100)] text-[var(--sage-700)]' :
                    framework.difficulty === 'intermediate' ? 'bg-[var(--gold-100)] text-[var(--gold-700)]' :
                    'bg-[var(--blush-100)] text-[var(--blush-700)]'
                  }`}>
                    {framework.difficulty}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      );
    }

    if (activeCategory === "wisdom") {
      if (wisdomLoading) return <LoadingState />;
      return (
        <div className="space-y-6">
          {dailyWisdom?.data && (
            <div className="card-bordered bg-[var(--gold-50)] border-[var(--gold-200)]">
              <div className="flex items-center gap-2 mb-4">
                <div className="icon-container icon-sm icon-soft-gold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-caption font-medium text-[var(--gold-700)]">Today's Wisdom</span>
              </div>
              <blockquote className="text-xl font-serif text-teal italic mb-4">
                "{dailyWisdom.data.quote}"
              </blockquote>
              <p className="text-[var(--gold-700)]">— {dailyWisdom.data.source}</p>
              <span className="inline-block mt-4 text-xs px-3 py-1 rounded-full bg-[var(--gold-200)] text-[var(--gold-800)]">
                {dailyWisdom.data.theme}
              </span>
            </div>
          )}
          
          <div className="grid md:grid-cols-2 gap-6">
            {wisdomData?.data?.map((pattern) => (
              <article 
                key={pattern.id} 
                className="card-bordered"
                data-testid={`card-wisdom-${pattern.id}`}
              >
                <h3 className="text-heading-sm text-teal mb-2 flex items-center gap-2">
                  <div className="icon-container icon-sm icon-soft-gold">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  {pattern.name}
                </h3>
                <p className="text-body-sm mb-4">{pattern.description}</p>
                <ul className="space-y-2">
                  {pattern.insights.slice(0, 3).map((insight, i) => (
                    <li key={i} className="text-caption flex items-start gap-2">
                      <Star className="w-4 h-4 text-[var(--gold-500)] mt-0.5 flex-shrink-0" />
                      {insight}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="text-center py-12">
        <p className="text-lead">Select a category to explore tools</p>
      </div>
    );
  };

  return (
    <>
      <SEO 
        title="Elite Intellectual Tools | The Genuine Love Project"
        description="Access 700+ world-class intellectual instruments for MIT-level minds: healing modalities, cognitive frameworks, and wisdom synthesis."
      />
      
      <div className="min-h-screen hero-gradient">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--sage-100)] border border-[var(--sage-200)] text-[var(--teal-700)] text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Elite Intelligence Suite
            </div>
            <h1 className="text-display-xl text-teal mb-4">
              Intellectual Tools for <span className="text-gradient-brand">Deep Minds</span>
            </h1>
            <p className="text-lead max-w-2xl mx-auto">
              Access our comprehensive suite of 700+ intellectual instruments designed for those who think deeply and seek genuine transformation.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {TOOL_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-r from-[var(--sage-600)] to-[var(--teal-600)] text-white shadow-lg scale-105' 
                      : 'bg-white border border-[var(--sage-200)] text-[var(--sage-700)] hover:shadow-md hover:border-[var(--sage-300)]'
                  }`}
                  data-testid={`button-category-${cat.id}`}
                >
                  <Icon className="w-5 h-5" />
                  {cat.name}
                </button>
              );
            })}
          </div>

          <div className="mb-8">
            {TOOL_CATEGORIES.find(c => c.id === activeCategory) && (
              <p className="text-center text-body-sm">
                {TOOL_CATEGORIES.find(c => c.id === activeCategory)?.description}
              </p>
            )}
          </div>

          {renderContent()}

          <div className="mt-16 text-center">
            <Link 
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--sage-600)] to-[var(--sage-500)] text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
              <Compass className="w-5 h-5" />
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function LoadingState() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 animate-pulse">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
