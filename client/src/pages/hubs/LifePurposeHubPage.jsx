/**
 * @file LifePurposeHubPage.jsx
 * Life Purpose Hub Page
 * Topic hub for meaning, values, and purpose exploration
 */

import { Link } from "wouter";
import { Compass, Target, Heart, Sparkles, ArrowRight } from "lucide-react";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import SafetyFooter from "@/components/ui/ReflectionFooter";
import { InfinityHeartCard } from "@/components/share/InfinityHeartCard";
import SEO from "@/components/SEO";

const PURPOSE_RESOURCES = [
  {
    title: "Values Finder",
    description: "Discover what truly matters",
    href: "/values-finder",
    icon: Compass
  },
  {
    title: "Goals & Intentions",
    description: "Set meaningful direction",
    href: "/goals",
    icon: Target
  },
  {
    title: "12 Steps of Genuine Love",
    description: "A path to authentic living",
    href: "/twelve-steps",
    icon: Heart
  },
  {
    title: "Wisdom Practices",
    description: "Deep contemplation for clarity",
    href: "/wisdom-practices",
    icon: Sparkles
  }
];

export default function LifePurposeHubPage() {
  return (
    <>
    <SEO 
      title="Life Purpose Hub | The Genuine Love Project"
      description="Explore meaning, values, and purpose. Tools for discovering what matters most and aligning your life with your deepest values."
    />
    <WellnessPageShell
      title="Life Purpose Hub"
      subtitle="Discover meaning and direction"
      benefits={pickBenefits(["clarity", "agency", "selfRespect", "meaning"], 4)}
      clarity={{
        what: "Resources for exploring purpose, values, and meaning.",
        why: "Living aligned with your values brings deep satisfaction.",
        how: "Start by noticing what energizes you. Follow that thread."
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          {PURPOSE_RESOURCES.map((resource) => {
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
          quote="Purpose isn't found. It's created through how you choose to live."
          microTool="What is one thing that makes you come alive? Name it."
          action="One spark recognized"
          category="Life Purpose"
          className="mb-8"
        />

        <SafetyFooter />
      </div>
    </WellnessPageShell>
    </>
  );
}
