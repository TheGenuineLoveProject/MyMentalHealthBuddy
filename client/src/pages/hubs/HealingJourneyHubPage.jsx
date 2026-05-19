/**
 * @file HealingJourneyHubPage.jsx
 * Healing Journey Hub Page
 * Topic hub for holistic healing journey resources
 */

import { Link } from "wouter";
import { Heart, Compass, Sparkles, Sun, ArrowRight } from "lucide-react";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import SafetyFooter from "@/components/ui/ReflectionFooter";
import { InfinityHeartCard } from "@/components/share/InfinityHeartCard";
import SEO from "@/components/SEO";

const HEALING_RESOURCES = [
  {
    title: "12 Steps of Genuine Love",
    description: "A gentle path to self-transformation",
    href: "/twelve-steps",
    icon: Heart
  },
  {
    title: "Healing Journeys",
    description: "Curated paths for specific challenges",
    href: "/healing-journeys",
    icon: Compass
  },
  {
    title: "Daily Wisdom",
    description: "Gentle guidance for each day",
    href: "/daily-wisdom",
    icon: Sparkles
  },
  {
    title: "Affirmations",
    description: "Positive reminders for your journey",
    href: "/affirmations",
    icon: Sun
  }
];

export default function HealingJourneyHubPage() {
  return (
    <>
    <SEO 
      title="Healing Journey Hub | The Genuine Love Project"
      description="Guided programs and reflection tools. Discover the 12 Steps of Genuine Love and curated paths for self-awareness."
    />
    <WellnessPageShell
      title="Healing Journey Hub"
      subtitle="Guided programs and reflection tools"
      benefits={pickBenefits(["calm", "meaning", "connection", "agency"], 4)}
      clarity={{
        what: "A collection of guided programs and self-reflection resources.",
        why: "Healing is not linear. Having the right tools at the right time matters.",
        how: "Explore what resonates. Go at your own pace."
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          {HEALING_RESOURCES.map((resource) => {
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
          quote="Every step forward, no matter how small, is part of your healing."
          microTool="Acknowledge one way you've grown in the past year."
          action="One moment of recognition"
          category="Healing Journey"
          className="mb-8"
        />

        <SafetyFooter />
      </div>
    </WellnessPageShell>
    </>
  );
}
