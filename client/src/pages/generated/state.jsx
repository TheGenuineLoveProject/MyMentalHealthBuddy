// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function StatePage() {
  const benefits = pickBenefits(["clarity", "calm", "agency", "selfRespect"], 4);
  
  const clarity = {
    what: "Tools to check in with your current physical, emotional, and mental state.",
    why: "We often push through without noticing how we're actually doing. Awareness enables choice.",
    who: "Anyone wanting to develop better self-awareness and respond to their needs.",
    when: "Throughout the day, especially during transitions or when something feels off.",
    where: "Anywhere you can pause for 30 seconds to a few minutes.",
    how: "Pause. Scan body, emotions, and thoughts. Notice without judgment. Respond to what you find."
  };

  const examples = [
    { level: "Beginner", label: "Quick Body Scan", description: "Notice tension in shoulders, jaw, stomach. Breathe into tight areas." },
    { level: "Intermediate", label: "Emotional Check-In", description: "Name your current emotion. Ask: what do I need right now?" },
    { level: "Advanced", label: "Full State Assessment", description: "Body, emotions, energy, mental clarity, connection—assess all dimensions." }
  ];

  return (
    <>
      <SEO
        title="State Awareness | The Genuine Love Project"
        description="Tuning into how you're doing right now - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="State Awareness"
        subtitle="Tuning into how you're doing right now"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Noticing how you are is the first step to taking care of yourself.
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
