/**
 * @file AnxietyHubPage.jsx
 * Anxiety Hub Page
 * Topic hub for anxiety relief and nervous system regulation resources
 */

import { Link } from "wouter";
import { Wind, Brain, Heart, Sparkles, ArrowRight } from "lucide-react";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import SafetyFooter from "@/components/ui/SafetyFooter";
import { InfinityHeartCard } from "@/components/share/InfinityHeartCard";
import SEO from "@/components/SEO";

const ANXIETY_RESOURCES = [
  {
    title: "Nervous System Flooding",
    description: "Gentle techniques for when you feel overwhelmed",
    href: "/nervous-system-flooding",
    icon: Wind
  },
  {
    title: "Coherence Ladder",
    description: "Step-by-step return to calm",
    href: "/coherence-ladder",
    icon: Brain
  },
  {
    title: "Perception Refinement",
    description: "Shift how you see stressful moments",
    href: "/perception-refinement",
    icon: Heart
  },
  {
    title: "State Tracker",
    description: "Notice patterns in your emotional states",
    href: "/state-tracker",
    icon: Sparkles
  }
];

export default function AnxietyHubPage() {
  return (
    <>
    <SEO 
      title="Anxiety Relief Hub | The Genuine Love Project"
      description="Gentle educational tools for calming anxiety and regulating your nervous system. Learn techniques for returning to a sense of safety and peace."
    />
    <WellnessPageShell
      title="Anxiety Relief Hub"
      subtitle="Gentle tools for calming your nervous system"
      benefits={pickBenefits(["calm", "calm", "meaning", "privacy"], 4)}
      clarity={{
        what: "A collection of educational tools designed to help you understand and work with anxiety.",
        why: "Anxiety is a natural response. Learning to work with it gently can bring more ease.",
        how: "Explore at your own pace. Each tool offers different approaches to finding calm."
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          {ANXIETY_RESOURCES.map((resource) => {
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
          quote="You are allowed to feel safe in your own body."
          microTool="Take three slow breaths. Notice your feet on the ground."
          action="One gentle breath"
          category="Anxiety Relief"
          className="mb-8"
        />

        <SafetyFooter />
      </div>
    </WellnessPageShell>
    </>
  );
}
