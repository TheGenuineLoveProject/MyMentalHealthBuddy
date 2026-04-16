// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function WisdomPracticesPage() {
  const benefits = pickBenefits(["clarity", "calm", "connection", "selfRespect"], 4);
  
  const clarity = {
    what: "Practices drawn from various wisdom traditions that cultivate insight, presence, and perspective.",
    why: "Wisdom traditions have refined practices for thousands of years. We can learn from this collective knowledge.",
    who: "Anyone interested in deepening their practice or exploring contemplative traditions.",
    when: "During dedicated practice time, retreats, or as part of daily spiritual practice.",
    where: "A quiet space conducive to deep reflection and practice.",
    how: "Approach with curiosity and respect. Start with one practice and go deep before adding more."
  };

  const examples = [
    { level: "Beginner", label: "Loving-Kindness", description: "Silently repeat: 'May I be happy, may I be healthy, may I be at peace.' Extend to others." },
    { level: "Intermediate", label: "Contemplative Reading", description: "Read a short passage slowly. Pause. Notice what arises. Read again. Listen deeply." },
    { level: "Advanced", label: "Self-Inquiry", description: "Ask 'Who am I?' not seeking intellectual answers, but sitting with the question itself." }
  ];

  return (
    <>
      <SEO
        title="Wisdom Practices | MyMentalHealthBuddy"
        description="Ancient and modern paths to understanding - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Wisdom Practices"
        subtitle="Ancient and modern paths to understanding"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            These practices come from many traditions. Take what serves you. Leave what doesn't. Honor the sources.
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
