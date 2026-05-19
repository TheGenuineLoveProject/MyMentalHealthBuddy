/**
 * @file TraumaHealingHubPage.jsx
 * Trauma Healing Hub Page
 * Topic hub for trauma-informed healing resources
 */

import { Link } from "wouter";
import { Heart, Shield, Brain, Sparkles, ArrowRight } from "lucide-react";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import SafetyFooter from "@/components/ui/ReflectionFooter";
import { InfinityHeartCard } from "@/components/share/InfinityHeartCard";
import SEO from "@/components/SEO";

const TRAUMA_RESOURCES = [
  {
    title: "Healing Landing",
    description: "A safe starting point for your journey",
    href: "/healing",
    icon: Heart
  },
  {
    title: "Nervous System Regulation",
    description: "Gentle tools for safety and calm",
    href: "/nervous-system-flooding",
    icon: Brain
  },
  {
    title: "Boundaries & Safety",
    description: "Rebuilding your sense of protection",
    href: "/boundaries",
    icon: Shield
  },
  {
    title: "Daily Wisdom",
    description: "Gentle reminders for your healing path",
    href: "/daily-wisdom",
    icon: Sparkles
  }
];

export default function TraumaHealingHubPage() {
  return (
    <>
    <SEO 
      title="Trauma Healing Hub | The Genuine Love Project"
      description="Gentle, trauma-informed educational resources for healing. Safe tools for nervous system regulation and rebuilding a sense of safety."
    />
    <WellnessPageShell
      title="Trauma Healing Hub"
      subtitle="Gentle tools for your healing journey"
      benefits={pickBenefits(["calm", "meaning", "agency", "connection"], 4)}
      clarity={{
        what: "Trauma-informed resources designed with safety as the foundation.",
        why: "Healing happens in safety, at your own pace, in your own way.",
        how: "Go slowly. You are in control. Stop anytime you need to."
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="p-4 mb-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            <strong>Important:</strong> These are educational tools, not therapy. If you're processing trauma, 
            working with a qualified professional can provide the support you deserve. 
            <Link href="/crisis" className="underline ml-1">Crisis resources are always available.</Link>
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 mb-8">
          {TRAUMA_RESOURCES.map((resource) => {
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
          quote="What happened to you was not your fault. Your healing is your own."
          microTool="Place both feet on the floor. You are here, now, and you are safe."
          action="One grounding moment"
          category="Trauma Healing"
          className="mb-8"
        />

        <SafetyFooter />
      </div>
    </WellnessPageShell>
    </>
  );
}
