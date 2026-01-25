/**
 * @file CopingSkillsHubPage.jsx
 * Coping Skills Hub Page
 * Topic hub for healthy coping strategies and skills
 */

import { Link } from "wouter";
import { Shield, Wind, Brain, Sparkles, ArrowRight } from "lucide-react";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import SafetyFooter from "@/components/ui/SafetyFooter";
import { InfinityHeartCard } from "@/components/share/InfinityHeartCard";
import SEO from "@/components/SEO";

const COPING_RESOURCES = [
  {
    title: "Grounding Techniques",
    description: "Return to the present moment",
    href: "/grounding-techniques",
    icon: Shield
  },
  {
    title: "Breathing Exercises",
    description: "Calm through breath",
    href: "/breathing-exercises",
    icon: Wind
  },
  {
    title: "Cognitive Tools",
    description: "Reframe unhelpful thoughts",
    href: "/cognitive-tools",
    icon: Brain
  },
  {
    title: "Calming Scenes",
    description: "Visual spaces for mental rest",
    href: "/calming-scenes",
    icon: Sparkles
  }
];

export default function CopingSkillsHubPage() {
  return (
    <>
    <SEO 
      title="Coping Skills Hub | The Genuine Love Project"
      description="Healthy coping strategies and skills for difficult moments. Learn grounding techniques, breathing exercises, and cognitive tools."
    />
    <WellnessPageShell
      title="Coping Skills Hub"
      subtitle="Healthy strategies for difficult moments"
      benefits={pickBenefits(["calm", "agency", "clarity", "calm"], 4)}
      clarity={{
        what: "A toolkit of healthy coping strategies for challenging times.",
        why: "Having the right tools when you need them makes all the difference.",
        how: "Practice these skills when you're calm so they're available when needed."
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          {COPING_RESOURCES.map((resource) => {
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
          quote="You have survived 100% of your hardest days. You have more strength than you know."
          microTool="Name one coping skill that has helped you in the past."
          action="One skill to remember"
          category="Coping Skills"
          className="mb-8"
        />

        <SafetyFooter />
      </div>
    </WellnessPageShell>
    </>
  );
}
