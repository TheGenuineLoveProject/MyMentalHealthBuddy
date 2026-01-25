import { Link } from "wouter";
import { ArrowLeft, AlertCircle, Shield, Phone, Heart } from "lucide-react";
import SEO from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function Legal() {
  return (
  <WellnessPageShell
    title="Legal"
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
        description="Legal disclaimer for The Genuine Love Project mental wellness platform."
      />
      <div className="min-h-screen hero-gradient">
        <div className="content-wrapper py-8">
          <div className="max-w-3xl mx-auto">
            <header className="mb-8">
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 text-body-sm text-[var(--sage-500)] hover:text-[var(--teal-600)] transition mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
              <div className="flex items-center gap-4">
                <div className="icon-container icon-xl icon-gradient-blush">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <div>
                  <h1 className="text-display-lg text-teal">Disclaimer</h1>
                  <p className="text-lead">Important information about our services</p>
                </div>
              </div>
            </header>

            <div className="space-y-6">
              <section className="card-bordered">
                <div className="flex items-center gap-3 mb-4">
                  <div className="icon-container icon-md icon-soft-sage">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h2 className="text-heading-md text-teal">General Information</h2>
                </div>
                <p className="text-body-sm">
                  The Genuine Love Project provides wellness and self-reflection tools for general informational
                  and supportive purposes only. It does not provide medical advice, diagnosis, or treatment.
                </p>
              </section>

              <section className="card-bordered bg-[var(--blush-50)] border-[var(--blush-200)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="icon-container icon-md icon-soft-blush">
                    <Phone className="w-5 h-5" />
                  </div>
                  <h2 className="text-heading-md text-[var(--blush-700)]">Crisis Support</h2>
                </div>
                <p className="text-body-sm text-[var(--blush-600)]">
                  If you are experiencing a crisis, thoughts of self-harm, or feel you may be in danger,
                  contact local emergency services immediately or reach a crisis hotline in your region.
                </p>
              </section>

              <section className="card-bordered">
                <div className="flex items-center gap-3 mb-4">
                  <div className="icon-container icon-md icon-soft-teal">
                    <Heart className="w-5 h-5" />
                  </div>
                  <h2 className="text-heading-md text-teal">User Responsibility</h2>
                </div>
                <p className="text-body-sm">
                  By using this platform, you acknowledge you are responsible for your own decisions and actions,
                  and you agree that The Genuine Love Project is not liable for outcomes resulting from use of the service.
                </p>
              </section>

              <footer className="text-center py-4">
                <div className="flex items-center justify-center gap-4">
                  <Link href="/terms" className="text-caption text-[var(--sage-600)] hover:text-[var(--teal-600)] transition">
                    Terms of Use
                  </Link>
                  <span className="text-caption text-[var(--sage-400)]">|</span>
                  <Link href="/privacy" className="text-caption text-[var(--sage-600)] hover:text-[var(--teal-600)] transition">
                    Privacy Policy
                  </Link>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </>
  </WellnessPageShell>
  );
}
