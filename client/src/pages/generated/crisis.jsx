// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function CrisisPage() {
  const benefits = pickBenefits(["calm", "connection", "clarity", "agency"], 4);
  
  const clarity = {
    what: "Resources, hotlines, and grounding techniques for moments of acute distress or crisis.",
    why: "Everyone deserves access to support in their darkest moments. Help is available.",
    who: "Anyone experiencing acute distress, suicidal thoughts, or overwhelming crisis.",
    when: "Right now, if you're in crisis. Or browse to know resources before you need them.",
    where: "Immediate help is available by phone, text, chat, or in-person emergency services.",
    how: "Reach out. You don't have to have it all figured out. Just make contact."
  };

  const examples = [
    { level: "Beginner", label: "Grounding First", description: "Before anything else: 5 things you see, 4 you hear, 3 you feel, 2 you smell, 1 you taste." },
    { level: "Intermediate", label: "Crisis Hotlines", description: "988 (US) Suicide and Crisis Lifeline. Crisis Text Line: text HOME to 741741." },
    { level: "Advanced", label: "Safety Planning", description: "Create a safety plan with a professional before crisis hits. Know your warning signs and supports." }
  ];

  return (
    <>
      <SEO
        title="Crisis Resources | The Genuine Love Project"
        description="Immediate support when you need it most - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Crisis Resources"
        subtitle="Immediate support when you need it most"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            You matter. Your life has value. If you're struggling, please reach out. Help is available 24/7.
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
