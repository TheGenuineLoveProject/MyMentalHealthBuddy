/**
 * @file MindfulnessHubPage.jsx
 * Mindfulness Hub Page
 * Topic hub for mindfulness and present-moment awareness resources
 */

import { Link } from "wouter";
import { Eye, Wind, Brain, Sparkles, ArrowRight } from "lucide-react";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import SafetyFooter from "@/components/ui/SafetyFooter";
import { InfinityHeartCard } from "@/components/share/InfinityHeartCard";
import SEO from "@/components/SEO";

const MINDFULNESS_RESOURCES = [
  {
    title: "Perception Refinement",
    description: "Shift how you experience the present moment",
    href: "/perception-refinement",
    icon: Eye
  },
  {
    title: "Breathing Practices",
    description: "Simple techniques for calm awareness",
    href: "/breathing",
    icon: Wind
  },
  {
    title: "State Tracker",
    description: "Notice and name your present experience",
    href: "/state-tracker",
    icon: Brain
  },
  {
    title: "Daily Wisdom",
    description: "Mindful reflections for each day",
    href: "/daily-wisdom",
    icon: Sparkles
  }
];

export default function MindfulnessHubPage() {
  return (
    <>
    <SEO 
      title="Mindfulness Hub | The Genuine Love Project"
      description="Educational tools for developing present-moment awareness and mindful living. Gentle practices for finding calm in daily life."
    />
    <WellnessPageShell
      title="Mindfulness Hub"
      subtitle="Tools for present-moment awareness"
      benefits={pickBenefits(["calm", "clarity", "meaning", "calm"], 4)}
      clarity={{
        what: "Resources for developing awareness of the present moment.",
        why: "Being present can reduce stress and increase appreciation for life.",
        how: "Start with what resonates. Even one mindful breath is a practice."
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          {MINDFULNESS_RESOURCES.map((resource) => {
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
          quote="This moment is the only one that exists. You are already here."
          microTool="Notice three things you can see right now. Name them silently."
          action="One moment of presence"
          category="Mindfulness"
          className="mb-8"
        />

        <SafetyFooter />
      </div>
    </WellnessPageShell>
    </>
  );
}
