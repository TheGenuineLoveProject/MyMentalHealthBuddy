/**
 * @file CreativityHubPage.jsx
 * Creativity Hub Page
 * Topic hub for creative expression and flow
 */

import { Link } from "wouter";
import { Palette, Sparkles, Feather, Eye, ArrowRight } from "lucide-react";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import SafetyFooter from "@/components/ui/SafetyFooter";
import { InfinityHeartCard } from "@/components/share/InfinityHeartCard";
import SEO from "@/components/SEO";

const CREATIVITY_RESOURCES = [
  {
    title: "Creative Journaling",
    description: "Express through writing",
    href: "/hubs/journaling",
    icon: Feather
  },
  {
    title: "Insight Cards",
    description: "New perspectives",
    href: "/insight-cards",
    icon: Sparkles
  },
  {
    title: "Perception Refinement",
    description: "See differently",
    href: "/perception-refinement",
    icon: Eye
  },
  {
    title: "Content Studio",
    description: "Create and share",
    href: "/content-studio",
    icon: Palette
  }
];

export default function CreativityHubPage() {
  return (
    <>
    <SEO 
      title="Creativity Hub | The Genuine Love Project"
      description="Unlock your creative potential. Tools for creative expression, journaling, and finding your unique voice."
    />
    <WellnessPageShell
      title="Creativity Hub"
      subtitle="Unlock your creative expression"
      benefits={pickBenefits(["agency", "meaning", "privacy", "calm"], 4)}
      clarity={{
        what: "Resources for tapping into your creative potential.",
        why: "Creativity is healing. It's how we process and express our inner world.",
        how: "Start creating before you're ready. Perfection is not the goal."
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          {CREATIVITY_RESOURCES.map((resource) => {
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
          quote="Creativity is intelligence having fun."
          microTool="What is one creative thing you wish you did more often? Just notice it."
          action="One creative wish noted"
          category="Creativity"
          className="mb-8"
        />

        <SafetyFooter />
      </div>
    </WellnessPageShell>
    </>
  );
}
