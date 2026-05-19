/**
 * @file BreathworkHubPage.jsx
 * Breathwork Hub Page
 * Topic hub for breathing practices and techniques
 */

import { Link } from "wouter";
import { Wind, Heart, Brain, Moon, ArrowRight } from "lucide-react";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import SafetyFooter from "@/components/ui/ReflectionFooter";
import { InfinityHeartCard } from "@/components/share/InfinityHeartCard";
import SEO from "@/components/SEO";

const BREATHWORK_RESOURCES = [
  {
    title: "Breathing Exercises",
    description: "Guided breathing techniques",
    href: "/breathing-exercises",
    icon: Wind
  },
  {
    title: "Calming Practices",
    description: "Slow breaths for relaxation",
    href: "/calming-scenes",
    icon: Heart
  },
  {
    title: "Coherence Ladder",
    description: "Breath-based regulation",
    href: "/coherence-ladder",
    icon: Brain
  },
  {
    title: "Sleep Breathing",
    description: "Restful breath for better sleep",
    href: "/hubs/sleep",
    icon: Moon
  }
];

export default function BreathworkHubPage() {
  return (
    <>
    <SEO 
      title="Breathwork Hub | The Genuine Love Project"
      description="Discover the power of conscious breathing. Learn techniques for calm, focus, sleep, and nervous system regulation through guided breathwork."
    />
    <WellnessPageShell
      title="Breathwork Hub"
      subtitle="Harness the power of your breath"
      benefits={pickBenefits(["calm", "agency", "meaning", "clarity"], 4)}
      clarity={{
        what: "A collection of breathing techniques and practices.",
        why: "Your breath is always with you - a portable tool for regulation.",
        how: "Start with just 3 conscious breaths. Notice how you feel."
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          {BREATHWORK_RESOURCES.map((resource) => {
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
          quote="Your breath is a bridge between mind and body."
          microTool="Breathe in for 4 counts. Hold for 4. Out for 6. Notice the calm."
          action="One calming breath cycle"
          category="Breathwork"
          className="mb-8"
        />

        <SafetyFooter />
      </div>
    </WellnessPageShell>
    </>
  );
}
