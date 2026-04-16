import { Link } from "wouter";
import { ArrowLeft, Heart, ShieldCheck, UserCheck, AlertCircle, Sparkles } from "lucide-react";
import SEO from "../../components/SEO";
import TglpNavbar from "../../components/TglpNavbar";

export default function Ethics() {
  return (
    <>
      <SEO 
        title="Our Ethics - MyMentalHealthBuddy"
        description="Learn about our ethical commitments including user autonomy, transparency, and responsible AI use."
      />
      <div className="min-h-screen bg-[var(--glp-paper)]">
        <TglpNavbar />
        
        <div className="content-wrapper py-12">
          <div className="max-w-3xl mx-auto">
            <header className="mb-10">
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 text-sm text-[var(--sage-600)] hover:text-[var(--teal-700)] transition mb-6"
                data-testid="link-back"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
              
              <div className="flex items-center gap-4">
                <div className="icon-container icon-lg icon-gradient-blush">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-heading-xl text-teal" data-testid="text-ethics-title">Our Ethics</h1>
                  <p className="text-body-sm">Our commitments to you</p>
                </div>
              </div>
            </header>

            <div className="card-bordered space-y-8">
              <p className="text-body-lg">
                This platform exists to support reflection, clarity, and self-respect.
                It does not replace professional care.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-4 rounded-xl bg-[var(--sage-50)] border border-[var(--sage-200)]">
                  <div className="icon-container icon-md icon-soft-sage mb-3">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-heading-sm text-teal mb-2">No diagnosis or treatment claims</h3>
                  <p className="text-body-sm">We provide tools for reflection, not medical advice.</p>
                </div>

                <div className="p-4 rounded-xl bg-[var(--sage-50)] border border-[var(--sage-200)]">
                  <div className="icon-container icon-md icon-soft-blush mb-3">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <h3 className="text-heading-sm text-teal mb-2">No emotional manipulation</h3>
                  <p className="text-body-sm">We don't use engagement traps or dark patterns.</p>
                </div>

                <div className="p-4 rounded-xl bg-[var(--sage-50)] border border-[var(--sage-200)]">
                  <div className="icon-container icon-md icon-soft-gold mb-3">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="text-heading-sm text-teal mb-2">No selling user vulnerability</h3>
                  <p className="text-body-sm">Your data is not sold or exploited.</p>
                </div>

                <div className="p-4 rounded-xl bg-[var(--sage-50)] border border-[var(--sage-200)]">
                  <div className="icon-container icon-md icon-soft-teal mb-3">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-heading-sm text-teal mb-2">User autonomy always comes first</h3>
                  <p className="text-body-sm">You control your experience and your data.</p>
                </div>
              </div>

              <p className="text-body-md p-4 rounded-xl bg-[var(--blush-50)] border border-[var(--blush-200)]">
                If a feature ever feels unsafe or overwhelming, you are encouraged
                to pause or stop using it. Your wellbeing is the priority.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
