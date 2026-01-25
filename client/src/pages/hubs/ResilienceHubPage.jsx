/**
 * Resilience Hub Page
 * Topic hub for resilience and emotional strength resources
 */

import { Link } from "wouter";
import { Zap, Brain, Shield, Flame, ArrowRight } from "lucide-react";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import SafetyFooter from "@/components/ui/SafetyFooter";
import { InfinityHeartCard } from "@/components/share/InfinityHeartCard";
import SEO from "@/components/SEO";

const RESILIENCE_RESOURCES = [
  {
    title: "Coherence Ladder",
    description: "Build emotional regulation step by step",
    href: "/coherence-ladder",
    icon: Zap
  },
  {
    title: "Cognitive Tools",
    description: "Reframe thoughts for greater strength",
    href: "/cognitive-tools",
    icon: Brain
  },
  {
    title: "Nervous System Support",
    description: "Calm and regulate when overwhelmed",
    href: "/nervous-system-flooding",
    icon: Shield
  },
  {
    title: "Daily Practices",
    description: "Build resilience through small habits",
    href: "/daily-routines",
    icon: Flame
  }
];

export default function ResilienceHubPage() {
  return (
    <>
    <SEO 
      title="Resilience Hub | The Genuine Love Project"
      description="Educational tools for building emotional strength and bouncing back. Gentle practices for developing resilience through regulation and self-care."
    />
    <WellnessPageShell
      title="Resilience Hub"
      subtitle="Tools for building emotional strength and bouncing back"
      benefits={pickBenefits(["Calm", "Agency", "Clarity", "Your pace"], 4)}
      clarity={{
        what: "A collection of resilience-focused wellness tools",
        why: "To support emotional regulation through gentle practices",
        who: "For adults (18+) seeking educational resilience resources"
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {RESILIENCE_RESOURCES.map((resource) => {
            const IconComponent = resource.icon;
            return (
              <Link
                key={resource.href}
                href={resource.href}
                className="group p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 border border-amber-200/60 dark:border-amber-800/40 hover:shadow-lg transition-all"
                data-testid={`link-resilience-${resource.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-800 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1 flex items-center gap-2">
                      {resource.title}
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {resource.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <InfinityHeartCard
          quote="Resilience isn't about never falling. It's about getting up one more time than you fall."
          microTool="Name one challenge you've overcome before. Remember: you've done hard things."
          action="Take 3 deep breaths right now. You're building resilience in this moment."
          category="Resilience"
          className="mb-8"
        />

        <SafetyFooter />
      </div>
    </WellnessPageShell>
    </>
  );
}
