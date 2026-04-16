// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function AdminPage() {
  const benefits = pickBenefits(["clarity", "agency", "selfRespect", "connection"], 4);
  
  const clarity = {
    what: "Administrative controls for managing the platform.",
    why: "Centralized management enables effective platform operation.",
    who: "Authorized administrators only.",
    when: "For platform management tasks.",
    where: "Secure admin area.",
    how: "Access with admin credentials. Manage users, content, and settings."
  };

  const examples = [
    { level: "Beginner", label: "Quick Stats", description: "Overview of key platform metrics." },
    { level: "Intermediate", label: "User Management", description: "Manage user accounts and permissions." },
    { level: "Advanced", label: "System Config", description: "Advanced platform configuration options." }
  ];

  return (
    <>
      <SEO
        title="Admin Dashboard | MyMentalHealthBuddy"
        description="Platform management - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Admin Dashboard"
        subtitle="Platform management"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Administrative access for authorized personnel only.
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
