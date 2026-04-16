// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function SupportGuidesPage() {
  const benefits = pickBenefits(["clarity", "calm", "agency", "connection"], 4);
  
  const clarity = {
    what: "Detailed guides for getting help with common questions and issues.",
    why: "Clear guidance makes getting help easier and faster.",
    who: "Anyone needing help with the platform or their practice.",
    when: "Whenever you have questions or need assistance.",
    where: "Browse guides or search for specific topics.",
    how: "Find your topic. Follow the guide. Reach out if you need more help."
  };

  const examples = [
    { level: "Beginner", label: "Getting Started", description: "Guides for new users learning the platform." },
    { level: "Intermediate", label: "Feature Guides", description: "Detailed explanations of specific features." },
    { level: "Advanced", label: "Troubleshooting", description: "Solutions for common technical issues." }
  ];

  return (
    <>
      <SEO
        title="Support Guides | MyMentalHealthBuddy"
        description="Help when you need it - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Support Guides"
        subtitle="Help when you need it"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Clear instructions make getting help easier. Start here for common questions.
          </p>
          <p className="text-sm opacity-70 mt-6">
            Adults 18+ only. Educational wellness tools, not medical care or mental health treatment.
            You may pause or stop at any time.
          </p>
        </div>
      </WellnessPageShell>
    </>
  );
}
