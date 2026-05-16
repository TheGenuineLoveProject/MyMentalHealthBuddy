/**
 * @file InnerPeaceHubPage.jsx
 * Inner Peace Hub Page
 * Topic hub for peace, calm, and serenity resources
 */

import { Link } from "wouter";
import { Heart, Moon, Wind, Sparkles, ArrowRight } from "lucide-react";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import SafetyFooter from "@/components/ui/SafetyFooter";
import { InfinityHeartCard } from "@/components/share/InfinityHeartCard";
import SEO from "@/components/SEO";

const PEACE_RESOURCES = [
  {
    title: "Calming Scenes",
    description: "Visual spaces for mental rest",
    href: "/calming-scenes",
    icon: Heart
  },
  {
    title: "Sleep & Rest",
    description: "Tools for peaceful restoration",
    href: "/hubs/sleep",
    icon: Moon
  },
  {
    title: "Breathing Practices",
    description: "Return to calm through breath",
    href: "/breathing",
    icon: Wind
  },
  {
    title: "Daily Wisdom",
    description: "Peaceful reflections for your day",
    href: "/daily-wisdom",
    icon: Sparkles
  }
];

export default function InnerPeaceHubPage() {
  return (
    <>
    <SEO 
      title="Inner Peace Hub | The Genuine Love Project"
      description="Gentle tools for cultivating inner peace and serenity. Find calm through breathing practices, visualization, and mindful rest."
    />
    <WellnessPageShell
      title="Inner Peace Hub"
      subtitle="Tools for cultivating serenity"
      benefits={pickBenefits(["calm", "calm", "meaning", "agency"], 4)}
      clarity={{
        what: "Resources for finding and maintaining inner peace.",
        why: "Peace is not the absence of challenges, but a way of being with them.",
        how: "Start with what calls to you. Even one peaceful moment matters."
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          {PEACE_RESOURCES.map((resource) => {
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
          quote="Peace is always here, waiting beneath the noise."
          microTool="Close your eyes for three breaths. Just be."
          action="Three peaceful breaths"
          category="Inner Peace"
          className="mb-8"
        />

        <SafetyFooter />
      </div>
    </WellnessPageShell>
    </>
  );
}
