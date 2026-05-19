/**
 * @file EmotionalIntelligenceHubPage.jsx
 * Emotional Intelligence Hub Page
 * Topic hub for emotional awareness and intelligence resources
 */

import { Link } from "wouter";
import { Heart, Brain, Eye, MessageCircle, ArrowRight } from "lucide-react";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import SafetyFooter from "@/components/ui/ReflectionFooter";
import { InfinityHeartCard } from "@/components/share/InfinityHeartCard";
import SEO from "@/components/SEO";

const EQ_RESOURCES = [
  {
    title: "State Tracker",
    description: "Develop awareness of your emotional states",
    href: "/state-tracker",
    icon: Heart
  },
  {
    title: "Perception Refinement",
    description: "See emotions with greater clarity",
    href: "/perception-refinement",
    icon: Eye
  },
  {
    title: "Emotional Mastery",
    description: "Navigate feelings with skill",
    href: "/emotional-mastery",
    icon: Brain
  },
  {
    title: "Communication Skills",
    description: "Express emotions effectively",
    href: "/communication",
    icon: MessageCircle
  }
];

export default function EmotionalIntelligenceHubPage() {
  return (
    <>
    <SEO 
      title="Emotional Intelligence Hub | The Genuine Love Project"
      description="Educational tools for developing emotional intelligence. Learn to understand, navigate, and express your emotions with greater skill and awareness."
    />
    <WellnessPageShell
      title="Emotional Intelligence Hub"
      subtitle="Tools for understanding and navigating emotions"
      benefits={pickBenefits(["clarity", "agency", "selfRespect", "meaning"], 4)}
      clarity={{
        what: "Resources for developing deeper emotional awareness and skill.",
        why: "Understanding your emotions is the foundation of wise action.",
        how: "Explore these tools to build emotional vocabulary and insight."
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          {EQ_RESOURCES.map((resource) => {
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
          quote="All emotions are valid messengers. You can learn their language."
          microTool="Name what you're feeling right now, without judgment. Just notice."
          action="One moment of noticing"
          category="Emotional Intelligence"
          className="mb-8"
        />

        <SafetyFooter />
      </div>
    </WellnessPageShell>
    </>
  );
}
