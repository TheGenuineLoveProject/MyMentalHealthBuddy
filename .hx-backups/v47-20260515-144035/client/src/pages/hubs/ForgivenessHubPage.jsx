/**
 * @file ForgivenessHubPage.jsx
 * Forgiveness Hub Page
 * Topic hub for forgiveness and letting go
 */

import { Link } from "wouter";
import { Heart, Feather, Sparkles, Sun, ArrowRight } from "lucide-react";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import SafetyFooter from "@/components/ui/SafetyFooter";
import { InfinityHeartCard } from "@/components/share/InfinityHeartCard";
import SEO from "@/components/SEO";

const FORGIVENESS_RESOURCES = [
  {
    title: "Self-Compassion",
    description: "Forgive yourself first",
    href: "/hubs/self-compassion",
    icon: Heart
  },
  {
    title: "Letting Go Journal",
    description: "Write to release",
    href: "/guided-journaling",
    icon: Feather
  },
  {
    title: "Daily Wisdom",
    description: "Wisdom on release",
    href: "/daily-wisdom",
    icon: Sparkles
  },
  {
    title: "Healing Journey",
    description: "Steps toward freedom",
    href: "/hubs/healing-journey",
    icon: Sun
  }
];

export default function ForgivenessHubPage() {
  return (
    <>
    <SEO 
      title="Forgiveness Hub | The Genuine Love Project"
      description="Explore forgiveness and letting go. Tools for self-forgiveness, releasing resentment, and finding peace through acceptance."
    />
    <WellnessPageShell
      title="Forgiveness Hub"
      subtitle="Release what no longer serves you"
      benefits={pickBenefits(["calm", "agency", "meaning", "connection"], 4)}
      clarity={{
        what: "Resources for exploring forgiveness of self and others.",
        why: "Forgiveness is not about them. It's about freeing yourself.",
        how: "Go gently. Forgiveness is a process, not an event."
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="p-4 mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Note:</strong> Forgiveness is personal and cannot be rushed. You never have to forgive anyone 
            to heal. These tools are for when you're ready to explore, on your own terms.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 mb-8">
          {FORGIVENESS_RESOURCES.map((resource) => {
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
          quote="Letting go is not giving up. It's making room for peace."
          microTool="What small resentment could you release today, just for yourself?"
          action="One release considered"
          category="Forgiveness"
          className="mb-8"
        />

        <SafetyFooter />
      </div>
    </WellnessPageShell>
    </>
  );
}
