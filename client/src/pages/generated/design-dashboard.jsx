// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function DesignDashboardPage() {
  const benefits = pickBenefits(["clarity", "agency", "selfRespect", "connection"], 4);
  
  const clarity = {
    what: "Workspace for the design team to manage design assets and projects.",
    why: "Centralized design management enables efficient collaboration.",
    who: "Design team members.",
    when: "For design work and asset management.",
    where: "Design team workspace.",
    how: "Manage assets. Track projects. Collaborate on design work."
  };

  const examples = [
    { level: "Beginner", label: "Asset Library", description: "Browse and access design assets." },
    { level: "Intermediate", label: "Project Tracking", description: "Track design projects and tasks." },
    { level: "Advanced", label: "Version Control", description: "Manage design versions and history." }
  ];

  return (
    <>
      <SEO
        title="Design Dashboard | The Genuine Love Project"
        description="Design team workspace - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Design Dashboard"
        subtitle="Design team workspace"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Design team workspace for collaborative design work.
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
