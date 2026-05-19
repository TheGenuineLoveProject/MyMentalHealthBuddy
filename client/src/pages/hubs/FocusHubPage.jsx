/**
 * @file FocusHubPage.jsx
 * Focus Hub Page
 * Topic hub for concentration and attention management
 */

import { Link } from "wouter";
import { Focus, Brain, Clock, Eye, ArrowRight } from "lucide-react";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import SafetyFooter from "@/components/ui/ReflectionFooter";
import { InfinityHeartCard } from "@/components/share/InfinityHeartCard";
import SEO from "@/components/SEO";

const FOCUS_RESOURCES = [
  {
    title: "Mindfulness",
    description: "Train your attention",
    href: "/hubs/mindfulness",
    icon: Focus
  },
  {
    title: "Cognitive Tools",
    description: "Strengthen focus",
    href: "/cognitive-tools",
    icon: Brain
  },
  {
    title: "Daily Routines",
    description: "Structure for focus",
    href: "/daily-routines",
    icon: Clock
  },
  {
    title: "Perception Refinement",
    description: "Sharpen awareness",
    href: "/perception-refinement",
    icon: Eye
  }
];

export default function FocusHubPage() {
  return (
    <>
    <SEO 
      title="Focus Hub | The Genuine Love Project"
      description="Tools for improving focus and concentration. Mindfulness practices, cognitive exercises, and routines for better attention."
    />
    <WellnessPageShell
      title="Focus Hub"
      subtitle="Sharpen your attention"
      benefits={pickBenefits(["clarity", "agency", "meaning", "agency"], 4)}
      clarity={{
        what: "Resources for developing and maintaining focus.",
        why: "Attention is a muscle. With practice, it grows stronger.",
        how: "Start with 5 minutes of undistracted presence. Build from there."
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          {FOCUS_RESOURCES.map((resource) => {
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
          quote="Where focus goes, energy flows."
          microTool="For the next 60 seconds, give full attention to one thing. Just one."
          action="One minute of focus"
          category="Focus"
          className="mb-8"
        />

        <SafetyFooter />
      </div>
    </WellnessPageShell>
    </>
  );
}
