// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function SelfCarePage() {
  const benefits = pickBenefits(["selfRespect", "calm", "agency", "connection"], 4);
  
  const clarity = {
    what: "Intentional practices that replenish your energy and honor your physical, emotional, and mental needs.",
    why: "Self-care isn't selfish—it's essential. You can't pour from an empty cup, and rest is productive.",
    who: "Anyone feeling depleted, burned out, or struggling to prioritize their own wellbeing.",
    when: "Daily for small practices, weekly for deeper restoration. Before burnout, not just after.",
    where: "Home, nature, or any space that feels safe and restorative to you.",
    how: "Start with one small act of care today. Build gradually. Notice what actually refills you."
  };

  const examples = [
    { level: "Beginner", label: "5-Minute Pause", description: "Set a timer and do absolutely nothing productive. Rest your eyes, stretch, or just breathe." },
    { level: "Intermediate", label: "Weekly Restoration", description: "Schedule one hour weekly for something purely enjoyable—reading, nature, creative play, or rest." },
    { level: "Advanced", label: "Boundaries Practice", description: "Identify one thing draining your energy. Set a small boundary to protect your wellbeing." }
  ];

  return (
    <>
      <SEO
        title="Self-Care Practices | The Genuine Love Project"
        description="Nurturing routines that honor your needs - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Self-Care Practices"
        subtitle="Nurturing routines that honor your needs"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Self-care looks different for everyone. The best practice is the one you'll actually do. Start small.
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
