/**
 * @file HubsIndexPage.jsx
 * Topic Hubs Index Page
 * Master directory of all wellness topic hubs
 */

import { useState } from "react";
import { Link } from "wouter";
import { 
  Moon, Shield, Heart, Zap, Wind, Users, 
  Feather, Sparkles, Eye, Brain, TrendingUp, Flame, 
  Sun, ArrowRight, BookOpen, Compass, Search
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import SafetyFooter from "@/components/ui/SafetyFooter";
import SEO from "@/components/SEO";

const ALL_HUBS = [
  {
    title: "Sleep & Rest",
    description: "Tools for peaceful nights",
    href: "/hubs/sleep",
    icon: Moon,
    color: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300"
  },
  {
    title: "Boundaries",
    description: "Protect your energy",
    href: "/hubs/boundaries",
    icon: Shield,
    color: "bg-slate-100 dark:bg-slate-900/40 text-slate-600 dark:text-slate-300"
  },
  {
    title: "Self-Worth",
    description: "Recognize your inherent value",
    href: "/hubs/self-worth",
    icon: Heart,
    color: "bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300"
  },
  {
    title: "Resilience",
    description: "Build emotional strength",
    href: "/hubs/resilience",
    icon: Zap,
    color: "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300"
  },
  {
    title: "Anxiety Relief",
    description: "Calm your nervous system",
    href: "/hubs/anxiety",
    icon: Wind,
    color: "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-300"
  },
  {
    title: "Relationships",
    description: "Build healthy connections",
    href: "/hubs/relationships",
    icon: Users,
    color: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300"
  },
  {
    title: "Grief Support",
    description: "Navigate loss gently",
    href: "/hubs/grief",
    icon: Feather,
    color: "bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300"
  },
  {
    title: "Self-Compassion",
    description: "Cultivate inner kindness",
    href: "/hubs/self-compassion",
    icon: Sparkles,
    color: "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 dark:text-yellow-300"
  },
  {
    title: "Mindfulness",
    description: "Present-moment awareness",
    href: "/hubs/mindfulness",
    icon: Eye,
    color: "bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-300"
  },
  {
    title: "Stress Relief",
    description: "Find calm and balance",
    href: "/hubs/stress",
    icon: Brain,
    color: "bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-300"
  },
  {
    title: "Trauma Healing",
    description: "Gentle recovery tools",
    href: "/hubs/trauma-healing",
    icon: Heart,
    color: "bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300"
  },
  {
    title: "Emotional Intelligence",
    description: "Understand your feelings",
    href: "/hubs/emotional-intelligence",
    icon: Brain,
    color: "bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-300"
  },
  {
    title: "Personal Growth",
    description: "Continuous development",
    href: "/hubs/personal-growth",
    icon: TrendingUp,
    color: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300"
  },
  {
    title: "Inner Peace",
    description: "Cultivate serenity",
    href: "/hubs/inner-peace",
    icon: Sparkles,
    color: "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 dark:text-yellow-300"
  },
  {
    title: "Healing Journey",
    description: "Guided reflection programs",
    href: "/hubs/healing-journey",
    icon: Heart,
    color: "bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-300"
  },
  {
    title: "Self-Care",
    description: "Prioritize your wellbeing",
    href: "/hubs/self-care",
    icon: Sun,
    color: "bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-300"
  },
  {
    title: "Coping Skills",
    description: "Healthy strategies",
    href: "/hubs/coping-skills",
    icon: Shield,
    color: "bg-slate-100 dark:bg-slate-900/40 text-slate-600 dark:text-slate-300"
  },
  {
    title: "Inner Work",
    description: "Deep self-discovery",
    href: "/hubs/inner-work",
    icon: Eye,
    color: "bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-300"
  },
  {
    title: "Breathwork",
    description: "Power of breath",
    href: "/hubs/breathwork",
    icon: Wind,
    color: "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-300"
  },
  {
    title: "Journaling",
    description: "Written reflection",
    href: "/hubs/journaling",
    icon: Feather,
    color: "bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300"
  },
  {
    title: "Body-Mind",
    description: "Somatic practices",
    href: "/hubs/body-mind",
    icon: Heart,
    color: "bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300"
  },
  {
    title: "Daily Practice",
    description: "Sustainable habits",
    href: "/hubs/daily-practice",
    icon: Sun,
    color: "bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-300"
  },
  {
    title: "Gratitude",
    description: "Cultivate appreciation",
    href: "/hubs/gratitude",
    icon: Heart,
    color: "bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-300"
  },
  {
    title: "Thoughtwork",
    description: "Work with your mind",
    href: "/hubs/thoughtwork",
    icon: Brain,
    color: "bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-300"
  },
  {
    title: "Life Purpose",
    description: "Meaning and direction",
    href: "/hubs/life-purpose",
    icon: TrendingUp,
    color: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300"
  },
  {
    title: "Communication",
    description: "Express yourself clearly",
    href: "/hubs/communication",
    icon: Users,
    color: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300"
  },
  {
    title: "Forgiveness",
    description: "Release and let go",
    href: "/hubs/forgiveness",
    icon: Heart,
    color: "bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300"
  },
  {
    title: "Energy Management",
    description: "Prevent burnout",
    href: "/hubs/energy-management",
    icon: Zap,
    color: "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300"
  },
  {
    title: "Healthy Habits",
    description: "Sustainable practices",
    href: "/hubs/habits",
    icon: TrendingUp,
    color: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300"
  },
  {
    title: "Confidence",
    description: "Build self-belief",
    href: "/hubs/confidence",
    icon: Sparkles,
    color: "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 dark:text-yellow-300"
  },
  {
    title: "Focus",
    description: "Sharpen attention",
    href: "/hubs/focus",
    icon: Eye,
    color: "bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-300"
  },
  {
    title: "Spirituality",
    description: "Inner connection",
    href: "/hubs/spirituality",
    icon: Sparkles,
    color: "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 dark:text-yellow-300"
  },
  {
    title: "Motivation",
    description: "Fuel your drive",
    href: "/hubs/motivation",
    icon: Flame,
    color: "bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-300"
  },
  {
    title: "Acceptance",
    description: "Peace with what is",
    href: "/hubs/acceptance",
    icon: Heart,
    color: "bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300"
  },
  {
    title: "Creativity",
    description: "Creative expression",
    href: "/hubs/creativity",
    icon: Sparkles,
    color: "bg-fuchsia-100 dark:bg-fuchsia-900/40 text-fuchsia-600 dark:text-fuchsia-300"
  },
  {
    title: "Self-Awareness",
    description: "Know yourself deeply",
    href: "/hubs/self-awareness",
    icon: Eye,
    color: "bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-300"
  },
  {
    title: "Nervous System",
    description: "Regulate and restore",
    href: "/hubs/nervous-system",
    icon: Zap,
    color: "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300"
  },
  {
    title: "Presence",
    description: "Be here now",
    href: "/hubs/presence",
    icon: Sun,
    color: "bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-300"
  },
  {
    title: "Wisdom",
    description: "Timeless insights",
    href: "/hubs/wisdom",
    icon: BookOpen,
    color: "bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-300"
  },
  {
    title: "Self-Discovery",
    description: "Explore who you are",
    href: "/hubs/self-discovery",
    icon: Compass,
    color: "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-300"
  }
];

export default function HubsIndexPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredHubs = searchQuery.trim()
    ? ALL_HUBS.filter(hub =>
        hub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hub.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : ALL_HUBS;

  return (
    <>
    <SEO 
      title="Wellness Topic Hubs | The Genuine Love Project"
      description="Explore our collection of wellness topic hubs covering sleep, anxiety, relationships, grief, mindfulness, and more. Find tools that resonate with you."
    />
    <WellnessPageShell
      title="Wellness Topic Hubs"
      subtitle="Find tools that resonate with you"
      benefits={pickBenefits(["calm", "meaning", "privacy", "clarity"], 4)}
      clarity={{
        what: "A directory of curated wellness resources organized by topic.",
        why: "Different challenges call for different tools. Find what resonates.",
        how: "Browse the topics below and explore what calls to you."
      }}
    >
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 min-h-[44px]"
            data-testid="input-search-hubs"
          />
        </div>

        <p className="text-sm text-muted-foreground mb-4" data-testid="text-hub-count">
          {filteredHubs.length} topic{filteredHubs.length !== 1 ? "s" : ""} available
        </p>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {filteredHubs.map((hub) => {
            const Icon = hub.icon;
            return (
              <Link
                key={hub.href}
                href={hub.href}
                className="group block p-4 bg-card rounded-xl border border-border hover:border-primary/40 hover:shadow-md transition-all"
                data-testid={`link-hub-${hub.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl flex-shrink-0 ${hub.color || "bg-primary/10 text-primary"}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                      {hub.title}
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {hub.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {filteredHubs.length === 0 && (
          <div className="text-center py-12" data-testid="text-hub-empty">
            <p className="text-muted-foreground">No topics found matching "{searchQuery}"</p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-2 text-sm text-primary hover:underline"
              data-testid="button-clear-hub-search"
            >
              Clear search
            </button>
          </div>
        )}

        <div className="text-center text-sm text-muted-foreground mb-8">
          <p>All tools are educational and self-guided. Go at your own pace.</p>
        </div>

        <SafetyFooter />
      </div>
    </WellnessPageShell>
    </>
  );
}
