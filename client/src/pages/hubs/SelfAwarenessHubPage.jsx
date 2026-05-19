/**
 * @file SelfAwarenessHubPage.jsx
 * Self-Awareness Hub Page
 * Topic hub for developing self-understanding
 */

import { Link } from "wouter";
import { Eye, Heart, Brain, Feather, ArrowRight } from "lucide-react";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import SafetyFooter from "@/components/ui/ReflectionFooter";
import { InfinityHeartCard } from "@/components/share/InfinityHeartCard";
import SEO from "@/components/SEO";

const AWARENESS_RESOURCES = [
  {
    title: "Perception Refinement",
    description: "Understand your lens",
    href: "/perception-refinement",
    icon: Eye
  },
  {
    title: "Emotional Intelligence",
    description: "Know your emotions",
    href: "/hubs/emotional-intelligence",
    icon: Heart
  },
  {
    title: "Cognitive Tools",
    description: "Understand your thinking",
    href: "/cognitive-tools",
    icon: Brain
  },
  {
    title: "Reflective Journaling",
    description: "Discover through writing",
    href: "/hubs/journaling",
    icon: Feather
  }
];

export default function SelfAwarenessHubPage() {
  return (
    <>
    <SEO 
      title="Self-Awareness Hub | The Genuine Love Project"
      description="Develop deeper self-understanding. Tools for knowing yourself, your patterns, and your inner world."
    />
    <WellnessPageShell
      title="Self-Awareness Hub"
      subtitle="Know yourself more deeply"
      benefits={pickBenefits(["clarity", "agency", "meaning", "privacy"], 4)}
      clarity={{
        what: "Resources for developing self-understanding and awareness.",
        why: "The more you understand yourself, the better you can navigate life.",
        how: "Start with curiosity about yourself, not judgment."
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          {AWARENESS_RESOURCES.map((resource) => {
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
          quote="Knowing yourself is the beginning of all wisdom."
          microTool="What is one thing you've noticed about yourself recently?"
          action="One self-observation"
          category="Self-Awareness"
          className="mb-8"
        />

        <SafetyFooter />
      </div>
    </WellnessPageShell>
    </>
  );
}
