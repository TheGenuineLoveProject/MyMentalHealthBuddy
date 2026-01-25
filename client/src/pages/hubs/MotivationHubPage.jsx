/**
 * @file MotivationHubPage.jsx
 * Motivation Hub Page
 * Topic hub for maintaining motivation and drive
 */

import { Link } from "wouter";
import { Flame, Target, Sun, TrendingUp, ArrowRight } from "lucide-react";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import SafetyFooter from "@/components/ui/SafetyFooter";
import { InfinityHeartCard } from "@/components/share/InfinityHeartCard";
import SEO from "@/components/SEO";

const MOTIVATION_RESOURCES = [
  {
    title: "Daily Affirmations",
    description: "Fuel your inner fire",
    href: "/affirmations",
    icon: Flame
  },
  {
    title: "Goals & Intentions",
    description: "Clarify your direction",
    href: "/goals",
    icon: Target
  },
  {
    title: "Daily Wisdom",
    description: "Inspiring perspectives",
    href: "/daily-wisdom",
    icon: Sun
  },
  {
    title: "Progress Tracking",
    description: "See how far you've come",
    href: "/progress",
    icon: TrendingUp
  }
];

export default function MotivationHubPage() {
  return (
    <>
    <SEO 
      title="Motivation Hub | The Genuine Love Project"
      description="Find and sustain your motivation. Affirmations, goal-setting, and inspiration for maintaining your drive."
    />
    <WellnessPageShell
      title="Motivation Hub"
      subtitle="Fuel your inner drive"
      benefits={pickBenefits(["Agency", "Your pace", "Clarity", "No pressure"], 4)}
      clarity={{
        what: "Resources for finding and maintaining motivation.",
        why: "Motivation fluctuates. Having tools helps ride the waves.",
        how: "Start with why. Reconnect with what matters to you."
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          {MOTIVATION_RESOURCES.map((resource) => {
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
          quote="Motivation follows action. Start small, start now."
          microTool="What is the tiniest step you could take toward something you want?"
          action="One tiny step named"
          category="Motivation"
          className="mb-8"
        />

        <SafetyFooter />
      </div>
    </WellnessPageShell>
    </>
  );
}
