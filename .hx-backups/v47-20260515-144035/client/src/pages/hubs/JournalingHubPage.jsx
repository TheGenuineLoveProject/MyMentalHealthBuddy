/**
 * @file JournalingHubPage.jsx
 * Journaling Hub Page
 * Topic hub for journaling and written reflection resources
 */

import { Link } from "wouter";
import { Feather, BookOpen, Heart, Sparkles, ArrowRight } from "lucide-react";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import SafetyFooter from "@/components/ui/SafetyFooter";
import { InfinityHeartCard } from "@/components/share/InfinityHeartCard";
import SEO from "@/components/SEO";

const JOURNALING_RESOURCES = [
  {
    title: "Guided Journaling",
    description: "Structured prompts for reflection",
    href: "/guided-journaling",
    icon: Feather
  },
  {
    title: "Free Writing",
    description: "Open space for your thoughts",
    href: "/journal",
    icon: BookOpen
  },
  {
    title: "Gratitude Practice",
    description: "Daily appreciation journaling",
    href: "/gratitude",
    icon: Heart
  },
  {
    title: "Insight Cards",
    description: "Reflective prompts and wisdom",
    href: "/insight-cards",
    icon: Sparkles
  }
];

export default function JournalingHubPage() {
  return (
    <>
    <SEO 
      title="Journaling Hub | The Genuine Love Project"
      description="Explore the healing power of writing. Guided journaling prompts, free writing spaces, and reflection tools for self-discovery."
    />
    <WellnessPageShell
      title="Journaling Hub"
      subtitle="Write your way to clarity"
      benefits={pickBenefits(["clarity", "calm", "meaning", "agency"], 4)}
      clarity={{
        what: "Tools and prompts for written reflection and self-discovery.",
        why: "Writing helps us process emotions and discover insights.",
        how: "Start with whatever feels right. There's no wrong way to journal."
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          {JOURNALING_RESOURCES.map((resource) => {
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
          quote="Your story matters. Writing it down helps you understand it."
          microTool="Write one sentence about how you're feeling right now."
          action="One sentence of truth"
          category="Journaling"
          className="mb-8"
        />

        <SafetyFooter />
      </div>
    </WellnessPageShell>
    </>
  );
}
