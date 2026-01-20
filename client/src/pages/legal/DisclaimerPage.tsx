import { Link } from "wouter";
import { ArrowLeft, AlertCircle, Stethoscope, HandHeart, Heart, Sparkles } from "lucide-react";
import EthicsSafetyBlock from "@/components/legal/EthicsSafetyBlock";

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen hero-gradient">
      <div className="content-wrapper py-8">
        <div className="max-w-3xl mx-auto">
          <header className="mb-8">
            <Link href="/">
              <a className="inline-flex items-center gap-2 text-body-sm text-[var(--sage-500)] hover:text-[var(--teal-600)] mb-4 transition" data-testid="link-back">
                <ArrowLeft className="h-4 w-4" /> Back to Home
              </a>
            </Link>
            <div className="flex items-center gap-3">
              <div className="icon-container icon-xl icon-gradient-blush">
                <AlertCircle className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-display-lg text-teal" data-testid="text-page-title">Disclaimer</h1>
                <p className="text-lead">Clear boundaries protect you. We're here for reflection, not replacement of professional care.</p>
              </div>
            </div>
          </header>

          <div className="space-y-6">
            <EthicsSafetyBlock variant="card" showCrisis />

            <section className="card-bordered">
              <div className="flex items-center gap-3 mb-4">
                <div className="icon-container icon-md icon-soft-blush">
                  <Stethoscope className="h-5 w-5" />
                </div>
                <h2 className="text-heading-md text-teal">Not Medical Advice</h2>
              </div>
              <p className="text-body-sm text-[var(--sage-600)]">
                Content on this site is for educational and supportive purposes only.
                It is not medical, psychiatric, or therapeutic advice, and it does not
                create a clinician–patient relationship.
              </p>
            </section>

            <section className="card-bordered">
              <div className="flex items-center gap-3 mb-4">
                <div className="icon-container icon-md icon-soft-sage">
                  <HandHeart className="h-5 w-5" />
                </div>
                <h2 className="text-heading-md text-teal">Use at Your Pace</h2>
              </div>
              <p className="text-body-sm text-[var(--sage-600)]">
                If a prompt or reflection feels overwhelming, pause. Choose a gentler
                practice, reach out to someone you trust, or seek licensed support.
              </p>
            </section>

            <section className="card-bordered bg-[var(--gold-50)] border-[var(--gold-200)]">
              <div className="flex items-start gap-4">
                <div className="icon-container icon-lg icon-soft-gold flex-shrink-0">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-heading-sm text-[var(--gold-700)] mb-2">Your Wellbeing Comes First</h3>
                  <p className="text-body-sm text-[var(--gold-600)]">
                    This platform is designed to support your journey, not replace professional help when needed.
                    Trust your instincts and seek appropriate care when something feels beyond self-reflection.
                  </p>
                </div>
              </div>
            </section>

            <footer className="text-center py-4">
              <p className="text-caption flex items-center justify-center gap-1">
                <Heart className="h-4 w-4 text-[var(--blush-500)]" />
                Live in Genuine Love
              </p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
