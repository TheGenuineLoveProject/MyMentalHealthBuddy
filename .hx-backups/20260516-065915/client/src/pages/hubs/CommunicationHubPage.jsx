/**
 * @file CommunicationHubPage.jsx
 * Communication Hub Page
 * Topic hub for healthy communication skills
 */

import { Link } from "wouter";
import { MessageCircle, Users, Shield, Heart, ArrowRight } from "lucide-react";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import SafetyFooter from "@/components/ui/SafetyFooter";
import { InfinityHeartCard } from "@/components/share/InfinityHeartCard";
import SEO from "@/components/SEO";

const COMMUNICATION_RESOURCES = [
  {
    title: "Communication Skills",
    description: "Express yourself clearly",
    href: "/communication",
    icon: MessageCircle
  },
  {
    title: "Healthy Relationships",
    description: "Build authentic connections",
    href: "/hubs/relationships",
    icon: Users
  },
  {
    title: "Boundaries",
    description: "Communicate limits with care",
    href: "/boundaries",
    icon: Shield
  },
  {
    title: "Attachment Awareness",
    description: "Understand connection patterns",
    href: "/attachment",
    icon: Heart
  }
];

export default function CommunicationHubPage() {
  return (
    <>
    <SEO 
      title="Communication Hub | The Genuine Love Project"
      description="Develop healthy communication skills. Learn to express yourself clearly, set boundaries, and build authentic connections."
    />
    <WellnessPageShell
      title="Communication Hub"
      subtitle="Express yourself with clarity and care"
      benefits={pickBenefits(["clarity", "agency", "selfRespect", "meaning"], 4)}
      clarity={{
        what: "Resources for developing healthier communication patterns.",
        why: "Clear communication builds trust and reduces misunderstanding.",
        how: "Start with listening. Then practice expressing your truth kindly."
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          {COMMUNICATION_RESOURCES.map((resource) => {
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
          quote="Speaking your truth with kindness is a form of self-respect."
          microTool="Think of something you've wanted to say. Practice saying it gently."
          action="One truth practiced"
          category="Communication"
          className="mb-8"
        />

        <SafetyFooter />
      </div>
    </WellnessPageShell>
    </>
  );
}
