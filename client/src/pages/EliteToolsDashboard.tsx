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
              <div 
                key={modality.id} 
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 group cursor-pointer"
                data-testid={`card-healing-${modality.id}`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{modality.name}</h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300">
                      {modality.category}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-4 line-clamp-2">{modality.description}</p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-xs text-gray-500">{modality.duration}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    modality.intensity === 'gentle' ? 'bg-green-100 text-green-700' :
                    modality.intensity === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                    modality.intensity === 'deep' ? 'bg-purple-100 text-purple-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {modality.intensity}
                  </span>
                </div>
              </div>
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
              <div 
                key={framework.id} 
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 group cursor-pointer"
                data-testid={`card-cognitive-${framework.id}`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{framework.name}</h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300">
                      {framework.category}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-4 line-clamp-2">{framework.description}</p>
                <div className="flex items-center justify-end mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    framework.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                    framework.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {framework.difficulty}
                  </span>
                </div>
              </div>
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
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 rounded-2xl p-8 border border-amber-100 dark:border-amber-800">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <span className="text-sm font-medium text-amber-700 dark:text-amber-300">Today's Wisdom</span>
              </div>
              <blockquote className="text-2xl font-serif text-gray-900 dark:text-white italic mb-4">
                "{dailyWisdom.data.quote}"
              </blockquote>
              <p className="text-amber-700 dark:text-amber-300">— {dailyWisdom.data.source}</p>
              <span className="inline-block mt-4 text-xs px-3 py-1 rounded-full bg-amber-200/50 dark:bg-amber-800/50 text-amber-800 dark:text-amber-200">
                {dailyWisdom.data.theme}
              </span>
            </div>
          )}
          
          <div className="grid md:grid-cols-2 gap-6">
            {wisdomData?.data?.map((pattern) => (
              <div 
                key={pattern.id} 
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
                data-testid={`card-wisdom-${pattern.id}`}
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  {pattern.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{pattern.description}</p>
                <ul className="space-y-2">
                  {pattern.insights.slice(0, 3).map((insight, i) => (
                    <li key={i} className="text-sm text-gray-500 dark:text-gray-400 flex items-start gap-2">
                      <Star className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Select a category to explore tools</p>
      </div>
    );
  };

  return (
    <>
      <SEO 
        title="Elite Intellectual Tools | The Genuine Love Project"
        description="Access 700+ world-class intellectual instruments for MIT-level minds: healing modalities, cognitive frameworks, and wisdom synthesis."
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-100 to-rose-100 dark:from-violet-900/50 dark:to-rose-900/50 text-violet-700 dark:text-violet-300 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Elite Intelligence Suite
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mb-4">
              Intellectual Tools for <span className="bg-gradient-to-r from-violet-600 to-rose-600 bg-clip-text text-transparent">Deep Minds</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
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
                      ? 'bg-gradient-to-r from-violet-600 to-rose-600 text-white shadow-lg scale-105' 
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md border border-gray-200 dark:border-gray-700'
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
              <p className="text-center text-gray-500 dark:text-gray-400">
                {TOOL_CATEGORIES.find(c => c.id === activeCategory)?.description}
              </p>
            )}
          </div>

          {renderContent()}

          <div className="mt-16 text-center">
            <Link href="/dashboard">
              <a className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--glp-sage-deep)] to-[var(--glp-sage)] text-white rounded-xl font-medium hover:opacity-90 transition-opacity">
                <Compass className="w-5 h-5" />
                Return to Dashboard
              </a>
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
