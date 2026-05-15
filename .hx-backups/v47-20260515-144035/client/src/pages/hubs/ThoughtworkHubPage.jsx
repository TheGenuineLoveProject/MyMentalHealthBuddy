/**
 * @file ThoughtworkHubPage.jsx
 * Thoughtwork Hub Page
 * Topic hub for cognitive tools and thought management
 */

import { Link } from "wouter";
import { Brain, RefreshCw, Eye, Sparkles, ArrowRight } from "lucide-react";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import SafetyFooter from "@/components/ui/SafetyFooter";
import { InfinityHeartCard } from "@/components/share/InfinityHeartCard";
import SEO from "@/components/SEO";

const THOUGHTWORK_RESOURCES = [
  {
    title: "Cognitive Tools",
    description: "Work with your thinking patterns",
    href: "/cognitive-tools",
    icon: Brain
  },
  {
    title: "Reframe Tool",
    description: "Transform unhelpful thoughts",
    href: "/tools/reframe",
    icon: RefreshCw
  },
  {
    title: "Perception Refinement",
    description: "Shift how you see things",
    href: "/perception-refinement",
    icon: Eye
  },
  {
    title: "Insight Cards",
    description: "New perspectives on old patterns",
    href: "/insight-cards",
    icon: Sparkles
  }
];

export default function ThoughtworkHubPage() {
  return (
    <>
    <SEO 
      title="Thoughtwork Hub | The Genuine Love Project"
      description="Tools for working with your thoughts. Cognitive reframing, perception shifts, and insight practices for clearer thinking."
    />
    <WellnessPageShell
      title="Thoughtwork Hub"
      subtitle="Tools for working with your mind"
      benefits={pickBenefits(["clarity", "agency", "meaning", "privacy"], 4)}
      clarity={{
        what: "Resources for understanding and working with your thought patterns.",
        why: "Thoughts shape experience. Shifting thoughts shifts how we feel.",
        how: "Notice a thought. Question it gently. Consider alternatives."
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          {THOUGHTWORK_RESOURCES.map((resource) => {
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
          quote="Your thoughts are not facts. They're visitors you can examine."
          microTool="Notice one thought you're having. Ask: Is this helpful? Is it true?"
          action="One thought examined"
          category="Thoughtwork"
          className="mb-8"
        />

        <SafetyFooter />
      </div>
    </WellnessPageShell>
    </>
  );
}
