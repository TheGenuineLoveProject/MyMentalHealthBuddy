/**
 * @file NervousSystemHubPage.jsx
 * Nervous System Hub Page
 * Topic hub for nervous system regulation
 */

import { Link } from "wouter";
import { Zap, Wind, Heart, Anchor, ArrowRight } from "lucide-react";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import SafetyFooter from "@/components/ui/SafetyFooter";
import { InfinityHeartCard } from "@/components/share/InfinityHeartCard";
import SEO from "@/components/SEO";

const NERVOUS_SYSTEM_RESOURCES = [
  {
    title: "Coherence Ladder",
    description: "Regulate your states",
    href: "/coherence-ladder",
    icon: Zap
  },
  {
    title: "Breathing Exercises",
    description: "Calm your system",
    href: "/breathing-exercises",
    icon: Wind
  },
  {
    title: "Grounding Techniques",
    description: "Return to safety",
    href: "/grounding-techniques",
    icon: Anchor
  },
  {
    title: "Body-Mind Connection",
    description: "Somatic awareness",
    href: "/hubs/body-mind",
    icon: Heart
  }
];

export default function NervousSystemHubPage() {
  return (
    <>
    <SEO 
      title="Nervous System Hub | The Genuine Love Project"
      description="Tools for nervous system regulation. Learn to calm activation, return to safety, and maintain balance."
    />
    <WellnessPageShell
      title="Nervous System Hub"
      subtitle="Regulate and restore balance"
      benefits={pickBenefits(["Calm", "Agency", "Safe space", "Your pace"], 4)}
      clarity={{
        what: "Resources for understanding and regulating your nervous system.",
        why: "A regulated nervous system is the foundation of wellbeing.",
        how: "Start with your breath. It's the fastest way to signal safety."
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="p-4 mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Science note:</strong> Your nervous system is designed to protect you. These tools work 
            with its natural patterns to help you feel safer and more regulated.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 mb-8">
          {NERVOUS_SYSTEM_RESOURCES.map((resource) => {
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
          quote="Your nervous system is always listening. Speak kindly to it."
          microTool="Take one slow exhale right now. Let it be longer than your inhale."
          action="One calming breath"
          category="Nervous System"
          className="mb-8"
        />

        <SafetyFooter />
      </div>
    </WellnessPageShell>
    </>
  );
}
