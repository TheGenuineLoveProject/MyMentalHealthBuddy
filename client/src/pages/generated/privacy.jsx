// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function PrivacyPage() {
  const benefits = pickBenefits(["clarity", "agency", "selfRespect", "calm"], 4);
  
  const clarity = {
    what: "How we collect, use, store, and protect your personal information.",
    why: "Your privacy matters. Transparency builds trust.",
    who: "All users should understand how their data is handled.",
    when: "Review before sharing personal information.",
    where: "Read at your convenience.",
    how: "Review how we handle your data. Adjust settings as desired."
  };

  const examples = [
    { level: "Beginner", label: "Privacy Summary", description: "Key privacy protections in simple terms." },
    { level: "Intermediate", label: "Data Practices", description: "Details on data collection and use." },
    { level: "Advanced", label: "Your Controls", description: "How to manage your privacy settings." }
  ];

  return (
    <>
      <SEO
        title="Privacy Policy | MyMentalHealthBuddy"
        description="How we protect your information - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Privacy Policy"
        subtitle="How we protect your information"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Your data is yours. We're committed to protecting your privacy.
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
