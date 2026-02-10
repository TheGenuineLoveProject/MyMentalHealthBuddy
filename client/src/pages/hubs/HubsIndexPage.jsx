/**
 * @file HubsIndexPage.jsx
 * Topic Hubs Index Page
 * Master directory of all wellness topic hubs
 */

import { Link } from "wouter";
import { 
  Moon, Shield, Heart, Zap, Wind, Users, 
  Feather, Sparkles, Eye, Brain, TrendingUp, Flame, 
  Sun, ArrowRight, BookOpen, Compass 
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
  },
  {
    title: "Healing Journey",
    description: "Guided reflection programs",
    href: "/hubs/healing-journey",
    icon: Heart
  },
  {
    title: "Self-Care",
    description: "Prioritize your wellbeing",
    href: "/hubs/self-care",
    icon: Sun
  },
  {
    title: "Coping Skills",
    description: "Healthy strategies",
    href: "/hubs/coping-skills",
    icon: Shield
  },
  {
    title: "Inner Work",
    description: "Deep self-discovery",
    href: "/hubs/inner-work",
    icon: Eye
  },
  {
    title: "Breathwork",
    description: "Power of breath",
    href: "/hubs/breathwork",
    icon: Wind
  },
  {
    title: "Journaling",
    description: "Written reflection",
    href: "/hubs/journaling",
    icon: Feather
  },
  {
    title: "Body-Mind",
    description: "Somatic practices",
    href: "/hubs/body-mind",
    icon: Heart
  },
  {
    title: "Daily Practice",
    description: "Sustainable habits",
    href: "/hubs/daily-practice",
    icon: Sun
  },
  {
    title: "Gratitude",
    description: "Cultivate appreciation",
    href: "/hubs/gratitude",
    icon: Heart
  },
  {
    title: "Thoughtwork",
    description: "Work with your mind",
    href: "/hubs/thoughtwork",
    icon: Brain
  },
  {
    title: "Life Purpose",
    description: "Meaning and direction",
    href: "/hubs/life-purpose",
    icon: TrendingUp
  },
  {
    title: "Communication",
    description: "Express yourself clearly",
    href: "/hubs/communication",
    icon: Users
  },
  {
    title: "Forgiveness",
    description: "Release and let go",
    href: "/hubs/forgiveness",
    icon: Heart
  },
  {
    title: "Energy Management",
    description: "Prevent burnout",
    href: "/hubs/energy-management",
    icon: Zap
  },
  {
    title: "Healthy Habits",
    description: "Sustainable practices",
    href: "/hubs/habits",
    icon: TrendingUp
  },
  {
    title: "Confidence",
    description: "Build self-belief",
    href: "/hubs/confidence",
    icon: Sparkles
  },
  {
    title: "Focus",
    description: "Sharpen attention",
    href: "/hubs/focus",
    icon: Eye
  },
  {
    title: "Spirituality",
    description: "Inner connection",
    href: "/hubs/spirituality",
    icon: Sparkles
  },
  {
    title: "Motivation",
    description: "Fuel your drive",
    href: "/hubs/motivation",
    icon: Flame
  },
  {
    title: "Acceptance",
    description: "Peace with what is",
    href: "/hubs/acceptance",
    icon: Heart
  },
  {
    title: "Creativity",
    description: "Creative expression",
    href: "/hubs/creativity",
    icon: Sparkles
  },
  {
    title: "Self-Awareness",
    description: "Know yourself deeply",
    href: "/hubs/self-awareness",
    icon: Eye
  },
  {
    title: "Nervous System",
    description: "Regulate and restore",
    href: "/hubs/nervous-system",
    icon: Zap
  },
  {
    title: "Presence",
    description: "Be here now",
    href: "/hubs/presence",
    icon: Sun
  },
  {
    title: "Wisdom",
    description: "Timeless insights",
    href: "/hubs/wisdom",
    icon: BookOpen
  },
  {
    title: "Self-Discovery",
    description: "Explore who you are",
    href: "/hubs/self-discovery",
    icon: Compass
  }
];

export default function HubsIndexPage() {
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
