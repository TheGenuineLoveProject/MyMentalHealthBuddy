/**
 * @file GratitudeHubPage.jsx
 * Gratitude Hub Page
 * Topic hub for gratitude practices and appreciation
 */

import { Link } from "wouter";
import { Heart, Sun, Feather, Sparkles, ArrowRight } from "lucide-react";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import SafetyFooter from "@/components/ui/SafetyFooter";
import { InfinityHeartCard } from "@/components/share/InfinityHeartCard";
import SEO from "@/components/SEO";

const GRATITUDE_RESOURCES = [
  {
    title: "Gratitude Practice",
    description: "Daily appreciation exercises",
    href: "/gratitude",
    icon: Heart
  },
  {
    title: "Daily Wisdom",
    description: "Grateful reflections each day",
    href: "/daily-wisdom",
    icon: Sun
  },
  {
    title: "Gratitude Journaling",
    description: "Write what you're thankful for",
    href: "/guided-journaling",
    icon: Feather
  },
  {
    title: "Affirmations",
    description: "Appreciation affirmations",
    href: "/affirmations",
    icon: Sparkles
  }
];

export default function GratitudeHubPage() {
  return (
    <>
    <SEO 
      title="Gratitude Hub | The Genuine Love Project"
      description="Cultivate appreciation and thankfulness. Gratitude practices, journaling prompts, and daily reflections for a more appreciative life."
    />
    <WellnessPageShell
      title="Gratitude Hub"
      subtitle="Cultivate appreciation and thankfulness"
      benefits={pickBenefits(["Clarity", "Your pace", "Safe space", "Agency"], 4)}
      clarity={{
        what: "Tools and practices for developing a gratitude mindset.",
        why: "Gratitude rewires the brain toward noticing what's good.",
        how: "Start with one thing you're grateful for today. Just one."
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          {GRATITUDE_RESOURCES.map((resource) => {
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
          quote="Gratitude turns what we have into enough."
          microTool="Name three things you're grateful for right now, no matter how small."
          action="Three grateful thoughts"
          category="Gratitude"
          className="mb-8"
        />

        <SafetyFooter />
      </div>
    </WellnessPageShell>
    </>
  );
}
