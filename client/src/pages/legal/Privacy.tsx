import { Link } from "wouter";
import { ArrowLeft, Lock, Eye, Shield, Database, UserCheck } from "lucide-react";
import SEO from "../../components/SEO";

export default function Privacy() {
  return (
    <>
      <SEO 
        title="Privacy Policy" 
        description="Learn how The Genuine Love Project protects your privacy and handles your personal data." 
      />
      <div className="min-h-screen hero-gradient">
        <div className="content-wrapper py-8">
          <div className="max-w-3xl mx-auto">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-body-sm text-sage-500 hover:text-teal-600 mb-6 transition"
              data-testid="link-back"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Link>

            <header className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="icon-container icon-xl icon-gradient-teal">
                  <Lock className="h-7 w-7" />
                </div>
                <h1 className="text-display-lg text-teal" data-testid="text-title">Privacy Policy</h1>
              </div>
              <p className="text-lead">Your privacy and data security are our highest priorities</p>
            </header>

            <div className="space-y-6">
              <section className="card-bordered">
                <div className="flex items-start gap-3 mb-4">
                  <div className="icon-container icon-md icon-soft-teal flex-shrink-0">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-heading-md text-teal mb-2">Data Protection</h2>
                    <p className="text-body-sm text-sage-600">
                      We use industry-standard encryption to protect your personal information and wellness data. 
                      Your conversations with our AI companion are encrypted and stored securely.
                    </p>
                  </div>
                </div>
              </section>

              <section className="card-bordered">
                <div className="flex items-start gap-3 mb-4">
                  <div className="icon-container icon-md icon-soft-sage flex-shrink-0">
                    <Database className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-heading-md text-teal mb-2">Information We Collect</h2>
                    <ul className="text-body-sm text-sage-600 space-y-2 list-disc list-inside">
                      <li>Account information (email, username)</li>
                      <li>Wellness data (mood entries, journal entries)</li>
                      <li>Usage patterns to improve our services</li>
                      <li>Conversations with AI companion for continuity</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="card-bordered">
                <div className="flex items-start gap-3 mb-4">
                  <div className="icon-container icon-md icon-soft-blush flex-shrink-0">
                    <Eye className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-heading-md text-teal mb-2">How We Use Your Data</h2>
                    <p className="text-body-sm text-sage-600">
                      Your data is used solely to provide and improve our wellness services. 
                      We do not sell your personal information to third parties. 
                      Analytics data is anonymized to protect your identity.
                    </p>
                  </div>
                </div>
              </section>

              <section className="card-bordered">
                <div className="flex items-start gap-3 mb-4">
                  <div className="icon-container icon-md icon-soft-gold flex-shrink-0">
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-heading-md text-teal mb-2">Your Rights</h2>
                    <ul className="text-body-sm text-sage-600 space-y-2 list-disc list-inside">
                      <li>Access your personal data at any time</li>
                      <li>Request correction of inaccurate data</li>
                      <li>Request deletion of your account and data</li>
                      <li>Export your wellness data</li>
                    </ul>
                  </div>
                </div>
              </section>

              <p className="text-caption text-center mt-8">
                Last updated: January 2026
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
