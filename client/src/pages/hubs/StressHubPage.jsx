/**
 * @file StressHubPage.jsx
 * Stress Relief Hub Page
 * Topic hub for stress management and relief resources
 */

import { Link } from "wouter";
import { Zap, Wind, Moon, Shield, ArrowRight } from "lucide-react";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import SafetyFooter from "@/components/ui/ReflectionFooter";
import { InfinityHeartCard } from "@/components/share/InfinityHeartCard";
import SEO from "@/components/SEO";

const STRESS_RESOURCES = [
  {
    title: "Coherence Ladder",
    description: "Step-by-step return to calm",
    href: "/coherence-ladder",
    icon: Zap
  },
  {
    title: "Nervous System Flooding",
    description: "When everything feels too much",
    href: "/nervous-system-flooding",
    icon: Wind
  },
  {
    title: "Rest & Restoration",
    description: "Permission to pause and recover",
    href: "/rest",
    icon: Moon
  },
  {
    title: "Boundaries Builder",
    description: "Protect your energy from overload",
    href: "/boundaries",
    icon: Shield
  }
];

export default function StressHubPage() {
  return (
    <>
    <SEO 
      title="Stress Relief Hub | The Genuine Love Project"
      description="Educational tools for managing stress and finding relief. Gentle techniques for calming your nervous system and restoring balance."
    />
    <WellnessPageShell
      title="Stress Relief Hub"
      subtitle="Tools for calming and restoring balance"
      benefits={pickBenefits(["calm", "agency", "meaning", "agency"], 4)}
      clarity={{
        what: "Resources for understanding and managing stress responses.",
        why: "Stress is a signal, not a failure. Learning to work with it brings relief.",
        how: "Choose what feels most needed right now. Start small."
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          {STRESS_RESOURCES.map((resource) => {
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
          quote="You don't have to carry it all. Let something go, just for now."
          microTool="Drop your shoulders. Unclench your jaw. Take one slow exhale."
          action="One release"
          category="Stress Relief"
          className="mb-8"
        />

        <SafetyFooter />
      </div>
    </WellnessPageShell>
    </>
  );
}
