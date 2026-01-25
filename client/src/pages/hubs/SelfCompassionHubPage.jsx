/**
 * @file SelfCompassionHubPage.jsx
 * Self-Compassion Hub Page
 * Topic hub for self-compassion and inner kindness resources
 */

import { Link } from "wouter";
import { Heart, Sparkles, Sun, Feather, ArrowRight } from "lucide-react";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import SafetyFooter from "@/components/ui/SafetyFooter";
import { InfinityHeartCard } from "@/components/share/InfinityHeartCard";
import SEO from "@/components/SEO";

const SELF_COMPASSION_RESOURCES = [
  {
    title: "Self-Worth Reflection",
    description: "Reconnect with your inherent value",
    href: "/self-worth-reflection",
    icon: Heart
  },
  {
    title: "Inner Critic Work",
    description: "Transform harsh self-talk into kindness",
    href: "/inner-critic",
    icon: Sparkles
  },
  {
    title: "Daily Affirmations",
    description: "Gentle reminders of your worth",
    href: "/affirmations",
    icon: Sun
  },
  {
    title: "Journaling Prompts",
    description: "Write your way to self-understanding",
    href: "/guided-journaling",
    icon: Feather
  }
];

export default function SelfCompassionHubPage() {
  return (
    <>
    <SEO 
      title="Self-Compassion Hub | The Genuine Love Project"
      description="Educational tools for developing self-compassion and inner kindness. Learn to treat yourself with the same care you'd offer a dear friend."
    />
    <WellnessPageShell
      title="Self-Compassion Hub"
      subtitle="Tools for cultivating inner kindness"
      benefits={pickBenefits(["connection", "selfRespect", "privacy", "meaning"], 4)}
      clarity={{
        what: "Resources for developing a kinder relationship with yourself.",
        why: "Self-compassion is the foundation of genuine healing and growth.",
        how: "Explore these tools to practice treating yourself with care."
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          {SELF_COMPASSION_RESOURCES.map((resource) => {
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
          quote="You are worthy of the same kindness you give to others."
          microTool="Place your hands over your heart. Whisper: 'I am learning to be kind to myself.'"
          action="One moment of self-kindness"
          category="Self-Compassion"
          className="mb-8"
        />

        <SafetyFooter />
      </div>
    </WellnessPageShell>
    </>
  );
}
