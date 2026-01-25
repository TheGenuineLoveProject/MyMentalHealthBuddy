/**
 * @file AcceptanceHubPage.jsx
 * Acceptance Hub Page
 * Topic hub for radical acceptance and self-acceptance
 */

import { Link } from "wouter";
import { Heart, Feather, Sun, Sparkles, ArrowRight } from "lucide-react";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import SafetyFooter from "@/components/ui/SafetyFooter";
import { InfinityHeartCard } from "@/components/share/InfinityHeartCard";
import SEO from "@/components/SEO";

const ACCEPTANCE_RESOURCES = [
  {
    title: "Self-Compassion",
    description: "Accept yourself fully",
    href: "/hubs/self-compassion",
    icon: Heart
  },
  {
    title: "Letting Go Journal",
    description: "Release what you can't control",
    href: "/guided-journaling",
    icon: Feather
  },
  {
    title: "Mindfulness",
    description: "Present moment acceptance",
    href: "/hubs/mindfulness",
    icon: Sun
  },
  {
    title: "Self-Worth Reflection",
    description: "You are enough",
    href: "/self-worth-reflection",
    icon: Sparkles
  }
];

export default function AcceptanceHubPage() {
  return (
    <>
    <SEO 
      title="Acceptance Hub | The Genuine Love Project"
      description="Explore radical acceptance and self-acceptance. Tools for accepting what is and finding peace with yourself."
    />
    <WellnessPageShell
      title="Acceptance Hub"
      subtitle="Find peace with what is"
      benefits={pickBenefits(["Calm", "Your pace", "No judgment", "Compassion"], 4)}
      clarity={{
        what: "Resources for practicing acceptance of self and circumstances.",
        why: "Acceptance is not giving up. It's making peace so you can move forward.",
        how: "Start with accepting this moment, just as it is. Just this one."
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="p-4 mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-800 dark:text-green-200">
            <strong>Note:</strong> Acceptance doesn't mean liking or approving. It means acknowledging reality 
            so you can respond wisely rather than react blindly.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 mb-8">
          {ACCEPTANCE_RESOURCES.map((resource) => {
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
          quote="It is what it is. And you get to choose what happens next."
          microTool="Name one thing you've been resisting. Breathe. Let it be."
          action="One acceptance breath"
          category="Acceptance"
          className="mb-8"
        />

        <SafetyFooter />
      </div>
    </WellnessPageShell>
    </>
  );
}
