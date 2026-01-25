// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function JournalPage() {
  const benefits = pickBenefits(["clarity", "agency", "selfRespect", "connection"], 4);
  
  const clarity = {
    what: "Guided and free-form journaling tools to process thoughts, emotions, and experiences.",
    why: "Writing externalizes our thoughts, reduces rumination, and creates space for insight.",
    who: "Anyone seeking mental clarity, emotional processing, or self-discovery.",
    when: "Daily practice is ideal. Also helpful during challenging times or decisions.",
    where: "A quiet space where you can write without interruption.",
    how: "Use prompts or write freely. Don't censor yourself. The goal is expression, not perfection."
  };

  const examples = [
    { level: "Beginner", label: "3-Minute Free Write", description: "Set a timer. Write whatever comes to mind. No editing, no judgment." },
    { level: "Intermediate", label: "Prompted Reflection", description: "Use a question or prompt to focus your writing and deepen exploration." },
    { level: "Advanced", label: "Dialogue Practice", description: "Write a conversation between parts of yourself, or with your inner wisdom." }
  ];

  return (
    <>
      <SEO
        title="Journaling Practice | The Genuine Love Project"
        description="Writing your way to clarity - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Journaling Practice"
        subtitle="Writing your way to clarity"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Your journal is a safe space for honest self-expression. Write what's true for you.
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
