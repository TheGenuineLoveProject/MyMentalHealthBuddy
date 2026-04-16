// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function WireframesPage() {
  const benefits = pickBenefits(["clarity", "agency", "selfRespect", "connection"], 4);
  
  const clarity = {
    what: "Structural wireframes for key page types and layouts.",
    why: "Wireframes ensure consistent structure and information architecture.",
    who: "Designers and developers building new pages.",
    when: "When planning or building new pages.",
    where: "Wireframe documentation.",
    how: "Reference wireframes. Adapt for specific content. Maintain structural consistency."
  };

  const examples = [
    { level: "Beginner", label: "Page Templates", description: "Standard templates for common page types." },
    { level: "Intermediate", label: "Layout Patterns", description: "Reusable layout patterns and grids." },
    { level: "Advanced", label: "Interaction Flows", description: "Wireframes showing user interaction paths." }
  ];

  return (
    <>
      <SEO
        title="Wireframes | MyMentalHealthBuddy"
        description="Page structure templates - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Wireframes"
        subtitle="Page structure templates"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Wireframes guide structure. Adapt them for your specific content needs.
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
