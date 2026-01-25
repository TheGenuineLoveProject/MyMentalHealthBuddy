/**
 * @file HubsIndexPage.jsx
 * Topic Hubs Index Page
 * Master directory of all wellness topic hubs
 */

import { Link } from "wouter";
import { 
  Moon, Shield, Heart, Zap, Wind, Users, 
  Feather, Sparkles, Eye, Brain, TrendingUp, 
  ArrowRight 
} from "lucide-react";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import SafetyFooter from "@/components/ui/SafetyFooter";
import SEO from "@/components/SEO";

const ALL_HUBS = [
  {
    title: "Sleep & Rest",
    description: "Tools for peaceful nights",
    href: "/hubs/sleep",
    icon: Moon
  },
  {
    title: "Boundaries",
    description: "Protect your energy",
    href: "/hubs/boundaries",
    icon: Shield
  },
  {
    title: "Self-Worth",
    description: "Recognize your inherent value",
    href: "/hubs/self-worth",
    icon: Heart
  },
  {
    title: "Resilience",
    description: "Build emotional strength",
    href: "/hubs/resilience",
    icon: Zap
  },
  {
    title: "Anxiety Relief",
    description: "Calm your nervous system",
    href: "/hubs/anxiety",
    icon: Wind
  },
  {
    title: "Relationships",
    description: "Build healthy connections",
    href: "/hubs/relationships",
    icon: Users
  },
  {
    title: "Grief Support",
    description: "Navigate loss gently",
    href: "/hubs/grief",
    icon: Feather
  },
  {
    title: "Self-Compassion",
    description: "Cultivate inner kindness",
    href: "/hubs/self-compassion",
    icon: Sparkles
  },
  {
    title: "Mindfulness",
    description: "Present-moment awareness",
    href: "/hubs/mindfulness",
    icon: Eye
  },
  {
    title: "Stress Relief",
    description: "Find calm and balance",
    href: "/hubs/stress",
    icon: Brain
  },
  {
    title: "Trauma Healing",
    description: "Gentle recovery tools",
    href: "/hubs/trauma-healing",
    icon: Heart
  },
  {
    title: "Emotional Intelligence",
    description: "Understand your feelings",
    href: "/hubs/emotional-intelligence",
    icon: Brain
  },
  {
    title: "Personal Growth",
    description: "Continuous development",
    href: "/hubs/personal-growth",
    icon: TrendingUp
  },
  {
    title: "Inner Peace",
    description: "Cultivate serenity",
    href: "/hubs/inner-peace",
    icon: Sparkles
  }
];

export default function HubsIndexPage() {
  return (
    <>
    <SEO 
      title="Wellness Topic Hubs | The Genuine Love Project"
      description="Explore our collection of wellness topic hubs covering sleep, anxiety, relationships, grief, mindfulness, and more. Find the right tools for your journey."
    />
    <WellnessPageShell
      title="Wellness Topic Hubs"
      subtitle="Find the right tools for your journey"
      benefits={pickBenefits(["Safe space", "Your pace", "No judgment", "Clarity"], 4)}
      clarity={{
        what: "A directory of curated wellness resources organized by topic.",
        why: "Different challenges call for different tools. Find what resonates.",
        how: "Browse the topics below and explore what calls to you."
      }}
    >
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {ALL_HUBS.map((hub) => {
            const Icon = hub.icon;
            return (
              <Link
                key={hub.href}
                href={hub.href}
                className="group block p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:shadow-lg transition-all"
                data-testid={`link-hub-${hub.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors flex items-center gap-2">
                      {hub.title}
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                      {hub.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center text-sm text-gray-500 dark:text-gray-400 mb-8">
          <p>All tools are educational and self-guided. Go at your own pace.</p>
        </div>

        <SafetyFooter />
      </div>
    </WellnessPageShell>
    </>
  );
}
