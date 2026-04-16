// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function ContentAdminPage() {
  const benefits = pickBenefits(["clarity", "agency", "selfRespect", "connection"], 4);
  
  const clarity = {
    what: "Tools for managing all content on the platform.",
    why: "Centralized content management ensures quality and consistency.",
    who: "Content administrators and editors.",
    when: "When creating, editing, or managing content.",
    where: "Admin content area.",
    how: "Create, edit, publish, and manage all platform content."
  };

  const examples = [
    { level: "Beginner", label: "Content Overview", description: "See all content at a glance." },
    { level: "Intermediate", label: "Edit & Publish", description: "Create and publish new content." },
    { level: "Advanced", label: "Content Strategy", description: "Plan and schedule content releases." }
  ];

  return (
    <>
      <SEO
        title="Content Administration | MyMentalHealthBuddy"
        description="Manage platform content - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Content Administration"
        subtitle="Manage platform content"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Content administration for authorized editors.
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
