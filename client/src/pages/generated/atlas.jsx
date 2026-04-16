// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function AtlasPage() {
  const benefits = pickBenefits(["clarity", "agency", "connection", "selfRespect"], 4);
  
  const clarity = {
    what: "A visual map of your wellness journey, showing where you've been, where you are, and where you might go.",
    why: "Seeing the big picture helps you understand your progress and identify areas for growth.",
    who: "Anyone wanting to understand their overall wellness landscape and plan their journey.",
    when: "Periodically for planning, when feeling lost, or when celebrating progress.",
    where: "A quiet space where you can reflect on your journey without interruption.",
    how: "Explore different domains. Assess where you are. Set intentions for where to focus next."
  };

  const examples = [
    { level: "Beginner", label: "Domain Survey", description: "Rate your current state across different wellness domains: physical, emotional, relational, spiritual." },
    { level: "Intermediate", label: "Progress Mapping", description: "Track your growth over time. Notice patterns, celebrate wins, identify growth edges." },
    { level: "Advanced", label: "Integrated Vision", description: "Create a vision for your holistic wellness. Set goals that honor all dimensions of wellbeing." }
  ];

  return (
    <>
      <SEO
        title="Wellness Atlas | MyMentalHealthBuddy"
        description="Navigate your personal growth landscape - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Wellness Atlas"
        subtitle="Navigate your personal growth landscape"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Your wellness journey is unique. The atlas helps you see the territory, but you choose the path.
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
