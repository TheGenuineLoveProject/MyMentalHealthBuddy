import { Link } from "wouter";
import { ArrowLeft, Shield, Lock, Eye, Database, CreditCard, Bot, Share2, Trash2, Mail } from "lucide-react";
import SEO from "../../components/SEO";
import TglpNavbar from "../../components/TglpNavbar";

export default function Privacy() {
  return (
    <>
      <SEO 
        title="Privacy Policy - The Genuine Love Project"
        description="Learn how The Genuine Love Project protects your privacy and handles your personal data."
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
                <div className="icon-container icon-lg icon-gradient-sage">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-heading-xl text-teal" data-testid="text-privacy-title">Privacy Policy</h1>
                  <p className="text-body-sm">Last updated: {new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </header>

            <div className="card-bordered space-y-8">
              <p className="text-body-lg">
                The Genuine Love Project ("we", "us") provides reflective tools for journaling, learning, and personal growth.
                This platform is not a medical service and does not provide clinical diagnosis or treatment.
              </p>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="icon-container icon-md icon-soft-teal">
                    <Database className="w-5 h-5" />
                  </div>
                  <h2 className="text-heading-md text-teal">What We Collect</h2>
                </div>
                <ul className="space-y-3 ml-12">
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-[var(--sage-400)] mt-2 flex-shrink-0"></span>
                    <span><strong className="text-[var(--teal-700)]">Account data:</strong> email, profile settings, and basic preferences.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-[var(--sage-400)] mt-2 flex-shrink-0"></span>
                    <span><strong className="text-[var(--teal-700)]">User content:</strong> journal entries, reflections, and tool inputs you submit.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-[var(--sage-400)] mt-2 flex-shrink-0"></span>
                    <span><strong className="text-[var(--teal-700)]">Usage data:</strong> basic analytics and error logs to improve reliability.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-[var(--sage-400)] mt-2 flex-shrink-0"></span>
                    <span><strong className="text-[var(--teal-700)]">Billing data:</strong> processed by Stripe (we do not store full card numbers).</span>
                  </li>
                </ul>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="icon-container icon-md icon-soft-sage">
                    <Eye className="w-5 h-5" />
                  </div>
                  <h2 className="text-heading-md text-teal">How We Use Information</h2>
                </div>
                <ul className="space-y-3 ml-12">
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-[var(--sage-400)] mt-2 flex-shrink-0"></span>
                    <span>Provide and improve the platform features you request.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-[var(--sage-400)] mt-2 flex-shrink-0"></span>
                    <span>Secure the platform and prevent abuse.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-[var(--sage-400)] mt-2 flex-shrink-0"></span>
                    <span>Operate subscriptions and receipts through Stripe.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-[var(--sage-400)] mt-2 flex-shrink-0"></span>
                    <span>Measure performance and fix bugs (e.g., error monitoring).</span>
                  </li>
                </ul>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="icon-container icon-md icon-soft-gold">
                    <Bot className="w-5 h-5" />
                  </div>
                  <h2 className="text-heading-md text-teal">AI Features</h2>
                </div>
                <p className="ml-12">
                  Some tools may use AI to generate supportive reflections. You control what you submit.
                  Do not include sensitive personal information you don't want processed for generating responses.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="icon-container icon-md icon-soft-blush">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <h2 className="text-heading-md text-teal">Sharing</h2>
                </div>
                <p className="ml-12">
                  We do not sell your personal data. We share data only with service providers needed to run the platform
                  (e.g., hosting, database, analytics, payments) and only as necessary.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="icon-container icon-md icon-soft-teal">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <h2 className="text-heading-md text-teal">Data Retention & Deletion</h2>
                </div>
                <p className="ml-12">
                  You may request deletion of your account and associated content where technically feasible and legally permitted.
                  We may retain limited logs for security and compliance.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="icon-container icon-md icon-soft-sage">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h2 className="text-heading-md text-teal">Security</h2>
                </div>
                <p className="ml-12">
                  We use standard safeguards (encryption in transit, access controls, rate limiting). No system is 100% secure,
                  but we continuously improve protections.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="icon-container icon-md icon-soft-gold">
                    <Mail className="w-5 h-5" />
                  </div>
                  <h2 className="text-heading-md text-teal">Contact</h2>
                </div>
                <p className="ml-12">
                  For privacy questions, contact the platform owner via the contact method listed on the website.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
