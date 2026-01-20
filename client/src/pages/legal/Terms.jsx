import { Link } from "wouter";
import { ArrowLeft, FileText, AlertTriangle, User, FileEdit, CreditCard, ShieldCheck, Scale, RefreshCw } from "lucide-react";
import SEO from "../../components/SEO";
import TglpNavbar from "../../components/TglpNavbar";

export default function Terms() {
  return (
    <>
      <SEO 
        title="Terms of Service - The Genuine Love Project"
        description="Read the Terms of Service for The Genuine Love Project mental wellness platform."
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
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-heading-xl text-teal" data-testid="text-terms-title">Terms of Service</h1>
                  <p className="text-body-sm">Last updated: {new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </header>

            <div className="card-bordered space-y-8">
              <p className="text-body-lg">
                By using The Genuine Love Project ("Service"), you agree to these Terms.
                If you do not agree, do not use the Service.
              </p>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="icon-container icon-md icon-soft-blush">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <h2 className="text-heading-md text-teal">Not Medical or Emergency Services</h2>
                </div>
                <p className="ml-12">
                  The Service provides educational and reflective tools only. It is not medical advice, therapy, diagnosis,
                  or crisis support. If you are in immediate danger, contact local emergency services.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="icon-container icon-md icon-soft-teal">
                    <User className="w-5 h-5" />
                  </div>
                  <h2 className="text-heading-md text-teal">Your Account</h2>
                </div>
                <ul className="space-y-3 ml-12">
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-[var(--sage-400)] mt-2 flex-shrink-0"></span>
                    <span>You are responsible for your account credentials and activity.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-[var(--sage-400)] mt-2 flex-shrink-0"></span>
                    <span>You agree not to misuse the Service or attempt unauthorized access.</span>
                  </li>
                </ul>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="icon-container icon-md icon-soft-sage">
                    <FileEdit className="w-5 h-5" />
                  </div>
                  <h2 className="text-heading-md text-teal">User Content</h2>
                </div>
                <p className="ml-12">
                  You retain ownership of content you submit. You grant us permission to process it to operate the Service
                  (including AI features you choose to use).
                </p>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="icon-container icon-md icon-soft-gold">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <h2 className="text-heading-md text-teal">Subscriptions & Billing</h2>
                </div>
                <p className="ml-12">
                  Paid plans are billed via Stripe. Subscription terms, cancellations, and refunds follow the plan details shown
                  at checkout and applicable law.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="icon-container icon-md icon-soft-teal">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h2 className="text-heading-md text-teal">Acceptable Use</h2>
                </div>
                <ul className="space-y-3 ml-12">
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-[var(--sage-400)] mt-2 flex-shrink-0"></span>
                    <span>No illegal activity, harassment, hate, or exploitation.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-[var(--sage-400)] mt-2 flex-shrink-0"></span>
                    <span>No attempts to reverse engineer or disrupt the Service.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-[var(--sage-400)] mt-2 flex-shrink-0"></span>
                    <span>No uploading malware or harmful code.</span>
                  </li>
                </ul>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="icon-container icon-md icon-soft-blush">
                    <Scale className="w-5 h-5" />
                  </div>
                  <h2 className="text-heading-md text-teal">Disclaimer</h2>
                </div>
                <p className="ml-12">
                  The Service is provided "as is" without warranties. We are not liable for decisions you make based on outputs.
                  Use your judgment and seek qualified help when appropriate.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="icon-container icon-md icon-soft-sage">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <h2 className="text-heading-md text-teal">Changes</h2>
                </div>
                <p className="ml-12">
                  We may update these Terms. Continued use after updates means you accept the new Terms.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
