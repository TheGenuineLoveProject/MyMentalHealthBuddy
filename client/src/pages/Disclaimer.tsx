import { FileText } from "lucide-react";
import SEO from "@/components/SEO";

export default function Disclaimer() {
  return (
    <>
      <SEO 
        title="Disclaimer - The Genuine Love Project" 
        description="Important disclaimer about The Genuine Love Project's services and limitations."
      />
      <div className="min-h-screen hero-premium relative overflow-hidden">
        <div className="decorative-orb decorative-orb-sage w-[500px] h-[500px] -top-40 -right-40 absolute" aria-hidden="true" />
        <div className="decorative-orb decorative-orb-blush w-[350px] h-[350px] bottom-32 -left-32 absolute" aria-hidden="true" />
        
        <main className="mx-auto max-w-3xl p-6 py-12 space-y-6 relative z-10">
          <div className="text-center mb-8">
            <div className="icon-container icon-xl icon-glow-sage mx-auto mb-4">
              <FileText className="w-8 h-8" />
            </div>
            <h1 className="text-display-md text-teal">Disclaimer</h1>
          </div>

          <div className="card-premium p-8 space-y-6">
            <p className="text-body-md">
              The Genuine Love Project ("TGLP") provides self-reflection tools, journaling features,
              mood tracking, and supportive, non-clinical guidance. It is intended for informational
              and educational purposes only.
            </p>

            <div>
              <h2 className="text-heading-sm text-teal mb-2">Not Medical Advice</h2>
              <p className="text-body-sm">
                TGLP does not provide medical advice, diagnosis, or treatment. Your use of the app does
                not create a therapist-client, doctor-patient, or other professional relationship.
              </p>
            </div>

            <div>
              <h2 className="text-heading-sm text-teal mb-2">Crisis & Emergency</h2>
              <p className="text-body-sm">
                If you are in immediate danger, call your local emergency number right now.
                If you are thinking about self-harm, seek immediate help from emergency services or a
                crisis hotline in your country.
              </p>
            </div>

            <div>
              <h2 className="text-heading-sm text-teal mb-2">AI Limitations</h2>
              <p className="text-body-sm">
                AI-generated responses may be inaccurate, incomplete, or inappropriate for your situation.
                Do not rely on AI outputs for urgent, medical, legal, or safety-critical decisions.
              </p>
            </div>

            <p className="text-caption pt-4 border-t border-[var(--glp-border)]">
              By using TGLP, you agree to these limitations and accept responsibility for your choices.
            </p>
          </div>
        </main>
      </div>
    </>
  );
}
