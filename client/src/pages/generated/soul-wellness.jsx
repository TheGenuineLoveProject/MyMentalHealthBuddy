// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function SoulWellnessPage() {
  const benefits = pickBenefits(["connection", "clarity", "selfRespect", "calm"], 4);
  
  const clarity = {
    what: "Practices that nurture your sense of meaning, purpose, and connection to something larger than yourself.",
    why: "Spiritual or soulful wellness provides resilience, perspective, and a sense of belonging in the world.",
    who: "Anyone seeking deeper meaning, experiencing existential questions, or wanting more inner peace.",
    when: "During transitions, after losses, or when life feels disconnected from meaning.",
    where: "In nature, quiet reflection, creative expression, or community.",
    how: "Explore what gives you a sense of awe, purpose, or connection. There's no single right path."
  };

  const examples = [
    { level: "Beginner", label: "Gratitude Moment", description: "Name three things you're grateful for today. Small things count." },
    { level: "Intermediate", label: "Values Reflection", description: "What matters most to you? Are you living in alignment with those values?" },
    { level: "Advanced", label: "Purpose Inquiry", description: "Ask: 'What am I here to contribute? What would I regret not doing?'" }
  ];

  return (
    <>
      <SEO
        title="Soul Wellness | The Genuine Love Project"
        description="Nurturing meaning, purpose, and inner peace - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Soul Wellness"
        subtitle="Nurturing meaning, purpose, and inner peace"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Soul wellness is personal. Whether through nature, creativity, service, or stillness—honor what resonates with you.
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
