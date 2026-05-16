import { FileText, Stethoscope, AlertTriangle, Bot } from "lucide-react";
import SEO from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function Disclaimer() {
  return (
  <WellnessPageShell
    title="Disclaimer"
    subtitle="Educational reflection tools. Choose what feels safe and supportive."
    benefits={pickBenefits(["agency","calm","clarity","selfRespect","meaning"], 5)}
    clarity={{
      what: "A self-paced reflection tool you control.",
      why: "To support clarity, values alignment, and gentle next steps.",
      who: "For adults (18+) who want educational wellness tools (not medical care).",
      when: "Anytime you want a small reset or a thoughtful pause.",
      where: "Anywhere you can breathe and write for 1–5 minutes.",
      how: "Pick one prompt, answer briefly, stop whenever you want."
    }}
    examples={[
      { label: "Beginner", examples: ["Write one honest sentence about how you feel.", "Name one value you want to protect today."] },
      { label: "Intermediate", examples: ["Describe the situation + the need underneath it.", "Write a boundary you could try in one sentence."] },
      { label: "Advanced", examples: ["Identify a pattern and the smallest experiment to change it.", "Write a compassionate reframe and one measurable step."] }
    ]}
  >

    <>
      <SEO 
        title="Disclaimer - The Genuine Love Project" 
        description="Important disclaimer about The Genuine Love Project's services and limitations."
      />
      <div className="min-h-screen relative" style={{ background: 'var(--glp-paper, #F7F4EE)' }}>
        <main className="mx-auto max-w-3xl p-6 py-12 space-y-6 relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-4 shadow-md" style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))' }} aria-hidden="true">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--glp-sage-deep)' }}>Disclaimer</h1>
          </div>

          <div className="bg-white rounded-3xl p-8 space-y-8" style={{ border: '1px solid var(--glp-sage-20)', boxShadow: '0 12px 32px -10px rgba(0,0,0,0.08)' }}>
            <p className="leading-relaxed" style={{ color: 'var(--glp-sage-deep)', opacity: 0.85 }}>
              The Genuine Love Project ("TGLP") provides self-reflection tools, journaling features,
              mood tracking, and supportive, non-clinical guidance. It is intended for informational
              and educational purposes only.
            </p>

            <div className="flex items-start gap-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full flex-shrink-0 shadow-md" style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))' }} aria-hidden="true">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--glp-sage-deep)' }}>Not Medical Advice</h2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--glp-sage-deep)', opacity: 0.85 }}>
                  TGLP does not provide medical advice, diagnosis, or treatment. Your use of the app does
                  not create a therapist-client, doctor-patient, or other professional relationship.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full flex-shrink-0 shadow-md" style={{ background: 'linear-gradient(135deg, #FF9A8B, #E8913A)' }} aria-hidden="true">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--glp-sage-deep)' }}>Crisis & Emergency</h2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--glp-sage-deep)', opacity: 0.85 }}>
                  If you are in immediate danger, call your local emergency number right now.
                  If you are thinking about self-harm, seek immediate help from emergency services or a
                  crisis hotline in your country.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full flex-shrink-0 shadow-md" style={{ background: 'linear-gradient(135deg, var(--glp-gold), var(--glp-gold-dark))' }} aria-hidden="true">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--glp-sage-deep)' }}>AI Limitations</h2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--glp-sage-deep)', opacity: 0.85 }}>
                  AI-generated responses may be inaccurate, incomplete, or inappropriate for your situation.
                  Do not rely on AI outputs for urgent, medical, legal, or safety-critical decisions.
                </p>
              </div>
            </div>

            <p className="text-xs pt-4" style={{ color: 'var(--glp-sage-deep)', opacity: 0.7, borderTop: '1px solid var(--glp-sage-20)' }}>
              By using TGLP, you agree to these limitations and accept responsibility for your choices.
            </p>
          </div>
        </main>
      </div>
    </>
  </WellnessPageShell>
  );
}
