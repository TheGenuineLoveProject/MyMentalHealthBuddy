import { Link } from "wouter";
import { ArrowLeft, AlertTriangle, Phone, Heart, BookOpen } from "lucide-react";
import SEO from "../../components/SEO";
import TglpNavbar from "../../components/TglpNavbar";

export default function Disclaimer() {
  return (
    <>
      <SEO 
        title="Important Information - The Genuine Love Project"
        description="Important disclaimer about the nature of this platform and when to seek professional help."
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
                <div className="icon-container icon-lg icon-gradient-teal">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-heading-xl text-teal" data-testid="text-disclaimer-title">Important Information</h1>
                  <p className="text-body-sm">Please read carefully</p>
                </div>
              </div>
            </header>

            <div className="card-bordered space-y-6">
              <div className="p-5 rounded-xl bg-[var(--blush-50)] border border-[var(--blush-200)]">
                <div className="flex items-start gap-4">
                  <div className="icon-container icon-md icon-soft-blush flex-shrink-0">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-heading-md text-teal mb-2">Not a Medical Service</h2>
                    <p className="text-body-md">
                      This platform is not a medical or mental health service. It provides tools for 
                      reflection and personal growth, but does not offer diagnosis, treatment, or 
                      professional therapeutic care.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-[var(--sage-50)] border border-[var(--sage-200)]">
                <div className="flex items-start gap-4">
                  <div className="icon-container icon-md icon-soft-sage flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-heading-md text-teal mb-2">If You Need Immediate Help</h2>
                    <p className="text-body-md">
                      If you are in immediate danger or distress, please contact local emergency services 
                      or a trusted professional. Crisis resources are available 24/7:
                    </p>
                    <ul className="mt-3 space-y-2 text-body-sm">
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[var(--sage-400)]"></span>
                        <strong>988 Suicide & Crisis Lifeline:</strong> Call or text 988
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[var(--sage-400)]"></span>
                        <strong>Crisis Text Line:</strong> Text HOME to 741741
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-[var(--gold-50)] border border-[var(--gold-200)]">
                <div className="flex items-start gap-4">
                  <div className="icon-container icon-md icon-soft-gold flex-shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-heading-md text-teal mb-2">Educational Purpose</h2>
                    <p className="text-body-md">
                      All content is provided for reflection and educational purposes only. The insights 
                      and tools offered are meant to complement, not replace, professional guidance when needed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
