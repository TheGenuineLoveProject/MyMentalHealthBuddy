import { Link } from "wouter";
import { ArrowLeft, TrendingUp, Target, Compass, Star, Heart, Brain, Sparkles, ChevronRight, BookOpen, Users, Zap, Milestone, Award, Flame, Map } from "lucide-react";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { useSEO } from "../hooks/useSEO";
import SafetyFooter from "../components/ui/SafetyFooter";

const GROWTH_PILLARS = [
  {
    id: "self-awareness",
    name: "Self-Awareness",
    icon: Compass,
    description: "Understanding your thoughts, emotions, and patterns",
    color: "indigo",
    tools: [
      { name: "Emotional Check-In", href: "/mood" },
      { name: "Journaling", href: "/journal" },
      { name: "Values Exploration", href: "/purpose-compass" }
    ]
  },
  {
    id: "emotional-health",
    name: "Emotional Health",
    icon: Heart,
    description: "Processing feelings and building resilience",
    color: "rose",
    tools: [
      { name: "Breathing Exercises", href: "/breathing" },
      { name: "Grounding Practices", href: "/grounding" },
      { name: "Self-Compassion", href: "/self-care" }
    ]
  },
  {
    id: "mental-clarity",
    name: "Mental Clarity",
    icon: Brain,
    description: "Cultivating focus, peace, and clear thinking",
    color: "sage",
    tools: [
      { name: "Meditation", href: "/meditation" },
      { name: "Mindfulness", href: "/meditation" },
      { name: "Cognitive Tools", href: "/cognitive-tools" }
    ]
  },
  {
    id: "purpose-meaning",
    name: "Purpose & Meaning",
    icon: Star,
    description: "Connecting with what matters most to you",
    color: "amber",
    tools: [
      { name: "Purpose Compass", href: "/purpose-compass" },
      { name: "Values Work", href: "/journal" },
      { name: "Vision Setting", href: "/journal" }
    ]
  }
];

const GROWTH_PATHS = [
  {
    id: "healing",
    name: "Healing Journey",
    icon: Heart,
    description: "For those working through past wounds and building emotional resilience",
    href: "/healing",
    color: "rose"
  },
  {
    id: "self-love",
    name: "Self-Love Path",
    icon: Sparkles,
    description: "Cultivating a nurturing, compassionate relationship with yourself",
    href: "/alignment-path",
    color: "amber"
  },
  {
    id: "emotional-mastery",
    name: "Emotional Mastery",
    icon: Zap,
    description: "Developing deep emotional intelligence and regulation skills",
    href: "/hubs/emotions",
    color: "indigo"
  },
  {
    id: "mindfulness",
    name: "Mindfulness Journey",
    icon: Brain,
    description: "Building present-moment awareness and inner peace",
    href: "/meditation",
    color: "sage"
  }
];

const MILESTONES = [
  { id: 1, name: "First Step", description: "Complete your first wellness practice", icon: Flame },
  { id: 2, name: "Week Warrior", description: "Practice for 7 consecutive days", icon: Star },
  { id: 3, name: "Inner Explorer", description: "Try 5 different wellness tools", icon: Compass },
  { id: 4, name: "Reflection Master", description: "Write 10 journal entries", icon: BookOpen },
  { id: 5, name: "Breath Anchor", description: "Complete 20 breathing sessions", icon: Zap },
  { id: 6, name: "Growth Champion", description: "30 days of consistent practice", icon: Award }
];

function PillarCard({ pillar }) {
  const Icon = pillar.icon;
  
  const colorClasses = {
    indigo: "from-indigo-100 to-indigo-50 dark:from-indigo-900/30 dark:to-slate-800 border-indigo-200 dark:border-indigo-800",
    rose: "from-rose-100 to-rose-50 dark:from-rose-900/30 dark:to-slate-800 border-rose-200 dark:border-rose-800",
    sage: "from-sage-100 to-sage-50 dark:from-sage-900/30 dark:to-slate-800 border-sage-200 dark:border-sage-800",
    amber: "from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-slate-800 border-amber-200 dark:border-amber-800"
  };
  
  const iconColors = {
    indigo: "text-indigo-600 dark:text-indigo-400",
    rose: "text-rose-600 dark:text-rose-400",
    sage: "text-sage-600 dark:text-sage-400",
    amber: "text-amber-600 dark:text-amber-400"
  };
  
  return (
    <div 
      className={`p-6 rounded-2xl bg-gradient-to-br ${colorClasses[pillar.color]} border hover:shadow-lg transition-all`}
      data-testid={`pillar-${pillar.id}`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-white/50 dark:bg-black/20 flex items-center justify-center">
          <Icon className={`w-5 h-5 ${iconColors[pillar.color]}`} />
        </div>
        <h3 className="font-playfair text-lg text-slate-800 dark:text-slate-200">{pillar.name}</h3>
      </div>
      
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{pillar.description}</p>
      
      <div className="space-y-2">
        {pillar.tools.map((tool, idx) => (
          <Link key={idx} href={tool.href}>
            <div className="flex items-center justify-between p-2 rounded-lg bg-white/60 dark:bg-black/20 hover:bg-white/80 dark:hover:bg-black/30 cursor-pointer transition-all">
              <span className="text-sm text-slate-700 dark:text-slate-300">{tool.name}</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function PathCard({ path }) {
  const Icon = path.icon;
  
  const colorClasses = {
    rose: "hover:border-rose-300 dark:hover:border-rose-700",
    amber: "hover:border-amber-300 dark:hover:border-amber-700",
    indigo: "hover:border-indigo-300 dark:hover:border-indigo-700",
    sage: "hover:border-sage-300 dark:hover:border-sage-700"
  };
  
  const iconColors = {
    rose: "text-rose-500",
    amber: "text-amber-500",
    indigo: "text-indigo-500",
    sage: "text-sage-500"
  };
  
  return (
    <Link href={path.href}>
      <div 
        className={`p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 ${colorClasses[path.color]} hover:shadow-md cursor-pointer transition-all`}
        data-testid={`path-${path.id}`}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center">
            <Icon className={`w-6 h-6 ${iconColors[path.color]}`} />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-slate-800 dark:text-slate-200 mb-1">{path.name}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">{path.description}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 mt-1" />
        </div>
      </div>
    </Link>
  );
}

function MilestoneCard({ milestone, unlocked = false }) {
  const Icon = milestone.icon;
  
  return (
    <div 
      className={`p-4 rounded-xl border transition-all ${
        unlocked 
          ? "bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-200 dark:border-amber-800"
          : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-60"
      }`}
      data-testid={`milestone-${milestone.id}`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          unlocked 
            ? "bg-amber-100 dark:bg-amber-900/50"
            : "bg-slate-200 dark:bg-slate-700"
        }`}>
          <Icon className={`w-5 h-5 ${unlocked ? "text-amber-600 dark:text-amber-400" : "text-slate-400"}`} />
        </div>
        <div>
          <h4 className={`font-medium text-sm ${unlocked ? "text-slate-800 dark:text-slate-200" : "text-slate-500 dark:text-slate-400"}`}>
            {milestone.name}
          </h4>
          <p className={`text-xs ${unlocked ? "text-slate-600 dark:text-slate-400" : "text-slate-400 dark:text-slate-500"}`}>
            {milestone.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function GrowthPage() {
  useSEO({
    title: "Personal Growth Journey | The Genuine Love Project",
    description: "Explore your path to personal growth through self-awareness, emotional health, mental clarity, and purpose discovery."
  });
  
  return (
    <WellnessPageShell>
      <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <Link href="/dashboard">
            <span className="inline-flex items-center gap-2 text-sage-600 dark:text-sage-400 hover:text-sage-700 dark:hover:text-sage-300 mb-6 cursor-pointer" data-testid="back-link">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </span>
          </Link>
          
          <header className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-sage-600 dark:text-sage-400 text-sm font-medium tracking-wider uppercase mb-3">
              <TrendingUp className="w-4 h-4" />
              Personal Growth
            </div>
            <h1 className="font-playfair text-3xl md:text-4xl text-slate-800 dark:text-slate-100 mb-3">
              Your Growth <span className="text-sage-600 dark:text-sage-400 italic">Journey</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              Personal growth isn't a destination—it's a continuous unfolding. Explore the pillars and pathways that resonate with where you are now.
            </p>
          </header>
          
          <section className="mb-12">
            <h2 className="font-playfair text-2xl text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
              <Target className="w-6 h-6 text-sage-500" />
              Four Pillars of Growth
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {GROWTH_PILLARS.map(pillar => (
                <PillarCard key={pillar.id} pillar={pillar} />
              ))}
            </div>
          </section>
          
          <section className="mb-12">
            <h2 className="font-playfair text-2xl text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
              <Map className="w-6 h-6 text-sage-500" />
              Choose Your Path
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {GROWTH_PATHS.map(path => (
                <PathCard key={path.id} path={path} />
              ))}
            </div>
          </section>
          
          <section className="mb-12">
            <h2 className="font-playfair text-2xl text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-500" />
              Growth Milestones
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {MILESTONES.map((milestone, idx) => (
                <MilestoneCard key={milestone.id} milestone={milestone} unlocked={idx < 2} />
              ))}
            </div>
          </section>
          
          <div className="bg-gradient-to-r from-sage-100 to-cream-100 dark:from-sage-900/30 dark:to-slate-800 rounded-2xl p-8 text-center mb-12">
            <Sparkles className="w-8 h-8 text-sage-600 dark:text-sage-400 mx-auto mb-4" />
            <h3 className="font-playfair text-xl text-slate-800 dark:text-slate-200 mb-2">
              Growth is Not Linear
            </h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
              Some days you'll leap forward, others you'll need to rest. Both are part of the journey. 
              Honor wherever you are today.
            </p>
          </div>
          
          <SafetyFooter />
        </div>
      </div>
    </WellnessPageShell>
  );
}
