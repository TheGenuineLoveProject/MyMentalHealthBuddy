/**
 * @file BodyMindHubPage.jsx
 * Body-Mind Connection Hub Page
 * Topic hub for somatic and body-based wellness resources
 */

import { Link } from "wouter";
import { Heart, Activity, Wind, Brain, ArrowRight } from "lucide-react";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import SafetyFooter from "@/components/ui/SafetyFooter";
import { InfinityHeartCard } from "@/components/share/InfinityHeartCard";
import SEO from "@/components/SEO";

const BODY_MIND_RESOURCES = [
  {
    title: "Body Wellness",
    description: "Physical self-care practices",
    href: "/body-wellness",
    icon: Heart
  },
  {
    title: "Grounding Techniques",
    description: "Return to your body",
    href: "/grounding-techniques",
    icon: Activity
  },
  {
    title: "Breathing Practices",
    description: "Connect through breath",
    href: "/breathing-exercises",
    icon: Wind
  },
  {
    title: "Nervous System",
    description: "Regulate your responses",
    href: "/nervous-system-flooding",
    icon: Brain
  }
];

export default function BodyMindHubPage() {
  return (
    <>
    <SEO 
      title="Body-Mind Connection Hub | The Genuine Love Project"
      description="Explore the connection between body and mind. Somatic practices, grounding techniques, and body-based wellness tools."
    />
    <WellnessPageShell
      title="Body-Mind Connection Hub"
      subtitle="Reconnect with your physical self"
      benefits={pickBenefits(["calm", "clarity", "calm", "agency"], 4)}
      clarity={{
        what: "Resources for understanding the body-mind connection.",
        why: "Your body holds wisdom. Learning to listen brings healing.",
        how: "Start by simply noticing. What sensations are present now?"
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          {BODY_MIND_RESOURCES.map((resource) => {
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
          quote="Your body is not separate from your healing. It's where healing lives."
          microTool="Notice where you feel tension. Breathe into that space gently."
          action="One breath into tension"
          category="Body-Mind"
          className="mb-8"
        />

        <SafetyFooter />
      </div>
    </WellnessPageShell>
    </>
  );
}
