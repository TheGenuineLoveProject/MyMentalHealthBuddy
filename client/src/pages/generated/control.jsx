// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function ControlPage() {
  const benefits = pickBenefits(["clarity", "agency", "selfRespect", "calm"], 4);
  
  const clarity = {
    what: "System-level controls for platform operation.",
    why: "Centralized controls enable efficient system management.",
    who: "System administrators only.",
    when: "For system-level management tasks.",
    where: "Secure control panel.",
    how: "Access with appropriate credentials. Manage system settings."
  };

  const examples = [
    { level: "Beginner", label: "System Status", description: "Current system health and status." },
    { level: "Intermediate", label: "Configuration", description: "Adjust system configuration settings." },
    { level: "Advanced", label: "Maintenance", description: "System maintenance and optimization tools." }
  ];

  return (
    <>
      <SEO
        title="Control Panel | The Genuine Love Project"
        description="System controls - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Control Panel"
        subtitle="System controls"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            System administration for authorized personnel.
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
