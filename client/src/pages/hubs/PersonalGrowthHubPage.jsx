/**
 * @file PersonalGrowthHubPage.jsx
 * Personal Growth Hub Page
 * Topic hub for personal development and growth resources
 */

import { Link } from "wouter";
import { TrendingUp, Target, Compass, Sparkles, ArrowRight } from "lucide-react";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import SafetyFooter from "@/components/ui/SafetyFooter";
import { InfinityHeartCard } from "@/components/share/InfinityHeartCard";
import SEO from "@/components/SEO";

const GROWTH_RESOURCES = [
  {
    title: "Values Finder",
    description: "Discover what truly matters to you",
    href: "/values-finder",
    icon: Compass
  },
  {
    title: "Progress Dashboard",
    description: "Track your growth journey",
    href: "/progress",
    icon: TrendingUp
  },
  {
    title: "Goals & Intentions",
    description: "Set meaningful direction",
    href: "/goals",
    icon: Target
  },
  {
    title: "Daily Wisdom",
    description: "Insights for continuous growth",
    href: "/daily-wisdom",
    icon: Sparkles
  }
];

export default function PersonalGrowthHubPage() {
  return (
    <>
    <SEO 
      title="Personal Growth Hub | The Genuine Love Project"
      description="Educational tools for personal development and self-improvement. Discover your values, set meaningful goals, and track your growth journey."
    />
    <WellnessPageShell
      title="Personal Growth Hub"
      subtitle="Tools for continuous self-development"
      benefits={pickBenefits(["agency", "clarity", "meaning", "selfRespect"], 4)}
      clarity={{
        what: "Resources for ongoing personal development and growth.",
        why: "Growth happens gradually, through small consistent steps.",
        how: "Choose one area to focus on. Progress, not perfection."
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          {GROWTH_RESOURCES.map((resource) => {
            const Icon = resource.icon;
            return (
              <Link
                key={resource.href}
                href={resource.href}
                className="group block p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:shadow-lg transition-all"
                data-testid={`link-hub-${resource.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors flex items-center gap-2">
                      {resource.title}
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {resource.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <InfinityHeartCard 
          quote="You are already enough. Growth is about becoming more of who you are."
          microTool="Think of one small thing you've learned about yourself recently."
          action="One moment of recognition"
          category="Personal Growth"
          className="mb-8"
        />

        <SafetyFooter />
      </div>
    </WellnessPageShell>
    </>
  );
}
