/**
 * @file ConfidenceHubPage.jsx
 * Confidence Hub Page
 * Topic hub for building self-confidence and self-belief
 */

import { Link } from "wouter";
import { Sparkles, Heart, Sun, Shield, ArrowRight } from "lucide-react";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import SafetyFooter from "@/components/ui/SafetyFooter";
import { InfinityHeartCard } from "@/components/share/InfinityHeartCard";
import SEO from "@/components/SEO";

const CONFIDENCE_RESOURCES = [
  {
    title: "Self-Worth Reflection",
    description: "Reconnect with your value",
    href: "/self-worth-reflection",
    icon: Sparkles
  },
  {
    title: "Self-Compassion",
    description: "Be your own supporter",
    href: "/hubs/self-compassion",
    icon: Heart
  },
  {
    title: "Affirmations",
    description: "Build positive self-belief",
    href: "/affirmations",
    icon: Sun
  },
  {
    title: "Boundaries",
    description: "Stand in your power",
    href: "/boundaries",
    icon: Shield
  }
];

export default function ConfidenceHubPage() {
  return (
    <>
    <SEO 
      title="Confidence Hub | The Genuine Love Project"
      description="Build authentic self-confidence. Tools for developing self-belief, self-worth, and standing in your personal power."
    />
    <WellnessPageShell
      title="Confidence Hub"
      subtitle="Build authentic self-belief"
      benefits={pickBenefits(["Agency", "Dignity", "Self-respect", "Your pace"], 4)}
      clarity={{
        what: "Resources for developing genuine self-confidence.",
        why: "True confidence comes from knowing your worth, not proving it.",
        how: "Start with one small act of self-trust today."
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          {CONFIDENCE_RESOURCES.map((resource) => {
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
          quote="Confidence is not about being perfect. It's about being enough."
          microTool="Name one thing you did recently that you're proud of."
          action="One proud moment"
          category="Confidence"
          className="mb-8"
        />

        <SafetyFooter />
      </div>
    </WellnessPageShell>
    </>
  );
}
