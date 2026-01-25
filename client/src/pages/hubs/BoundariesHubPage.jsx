/**
 * Boundaries Hub Page
 * Topic hub for boundary-setting tools and resources
 */

import { Link } from "wouter";
import { Shield, Users, Heart, Compass, ArrowRight } from "lucide-react";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import SafetyFooter from "@/components/ui/SafetyFooter";
import { InfinityHeartCard } from "@/components/share/InfinityHeartCard";
import SEO from "@/components/SEO";

const BOUNDARIES_RESOURCES = [
  {
    title: "Boundaries Builder",
    description: "Learn to set healthy limits with care",
    href: "/boundaries",
    icon: Shield
  },
  {
    title: "Communication Tools",
    description: "Express needs clearly and kindly",
    href: "/cognitive-tools",
    icon: Users
  },
  {
    title: "Self-Worth Reflection",
    description: "Build the foundation for strong boundaries",
    href: "/self-worth-reflection",
    icon: Heart
  },
  {
    title: "Values Finder",
    description: "Clarify what matters most to you",
    href: "/values-finder",
    icon: Compass
  }
];

export default function BoundariesHubPage() {
  return (
    <>
    <SEO 
      title="Boundaries Hub | The Genuine Love Project"
      description="Educational tools for setting healthy boundaries and protecting your energy. Learn to establish limits with care and communicate needs clearly."
    />
    <WellnessPageShell
      title="Boundaries Hub"
      subtitle="Tools for setting healthy limits and protecting your energy"
      benefits={pickBenefits(["selfRespect", "agency", "selfRespect", "clarity"], 4)}
      clarity={{
        what: "A collection of boundary-focused wellness tools",
        why: "To support healthy relationship patterns through gentle practices",
        who: "For adults (18+) seeking educational resources on boundaries"
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {BOUNDARIES_RESOURCES.map((resource) => {
            const IconComponent = resource.icon;
            return (
              <Link
                key={resource.href}
                href={resource.href}
                className="group p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 border border-emerald-200/60 dark:border-emerald-800/40 hover:shadow-lg transition-all"
                data-testid={`link-boundaries-${resource.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-800 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1 flex items-center gap-2">
                      {resource.title}
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {resource.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <InfinityHeartCard
          quote="No is a complete sentence. Your boundaries are a gift you give yourself."
          microTool="Practice saying 'Let me think about that' before committing to requests."
          action="Identify one boundary you want to strengthen this week."
          category="Boundaries"
          className="mb-8"
        />

        <SafetyFooter />
      </div>
    </WellnessPageShell>
    </>
  );
}
