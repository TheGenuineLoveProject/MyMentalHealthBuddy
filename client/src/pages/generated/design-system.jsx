// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function DesignSystemPage() {
  const benefits = pickBenefits(["clarity", "agency", "selfRespect", "connection"], 4);
  
  const clarity = {
    what: "Our design system: colors, typography, components, and patterns.",
    why: "Consistent design creates a cohesive, trustworthy experience.",
    who: "Designers, developers, and content creators.",
    when: "When creating or updating visual elements.",
    where: "Design system documentation.",
    how: "Reference guidelines. Use provided components. Maintain consistency."
  };

  const examples = [
    { level: "Beginner", label: "Color Palette", description: "Our brand colors and how to use them." },
    { level: "Intermediate", label: "Components", description: "Standard UI components and patterns." },
    { level: "Advanced", label: "Design Tokens", description: "Technical design specifications." }
  ];

  return (
    <>
      <SEO
        title="Design System | MyMentalHealthBuddy"
        description="Visual design reference - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Design System"
        subtitle="Visual design reference"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Design consistency creates trust. Reference this system for all visual work.
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
