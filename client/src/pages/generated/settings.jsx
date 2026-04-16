// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function SettingsPage() {
  const benefits = pickBenefits(["agency", "clarity", "selfRespect", "calm"], 4);
  
  const clarity = {
    what: "Controls to customize how you use the platform.",
    why: "Your experience should work for you. Customization enables that.",
    who: "All users can personalize their experience here.",
    when: "When you want to adjust your experience.",
    where: "Access anytime from your account.",
    how: "Review options. Adjust as desired. Changes save automatically."
  };

  const examples = [
    { level: "Beginner", label: "Display Settings", description: "Theme, text size, and visual preferences." },
    { level: "Intermediate", label: "Privacy Controls", description: "Manage what data is collected and how it's used." },
    { level: "Advanced", label: "Advanced Options", description: "Full customization for power users." }
  ];

  return (
    <>
      <SEO
        title="Settings | MyMentalHealthBuddy"
        description="Customize your experience - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Settings"
        subtitle="Customize your experience"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Make this platform work for you. Adjust settings to match your needs.
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
