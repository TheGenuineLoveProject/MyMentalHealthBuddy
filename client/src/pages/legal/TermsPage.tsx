import { Link } from "wouter";
import { ArrowLeft, FileText, Users, AlertTriangle, RefreshCw, Heart } from "lucide-react";
import EthicsSafetyBlock from "@/components/legal/EthicsSafetyBlock";

export default function TermsPage() {
  return (
    <div className="min-h-screen hero-gradient">
      <div className="content-wrapper py-8">
        <div className="max-w-3xl mx-auto">
          <header className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-body-sm text-[var(--sage-500)] hover:text-[var(--teal-600)] mb-4 transition" data-testid="link-back">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Link>
            <div className="flex items-center gap-3">
              <div className="icon-container icon-xl icon-gradient-teal">
                <FileText className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-display-lg text-teal" data-testid="text-page-title">Terms of Service</h1>
                <p className="text-lead">A simple agreement: be kind, be safe, and respect the space.</p>
              </div>
            </div>
          </header>

          <div className="space-y-6">
            <EthicsSafetyBlock variant="card" showCrisis={false} />

            <section className="card-bordered">
              <div className="flex items-center gap-3 mb-4">
                <div className="icon-container icon-md icon-soft-sage">
                  <Users className="h-5 w-5" />
                </div>
                <h2 className="text-heading-md text-teal">Respectful Use</h2>
              </div>
              <p className="text-body-sm text-[var(--sage-600)]">
                You agree not to use the platform to harass, exploit, or harm others,
                or to post illegal content.
              </p>
            </section>

            <section className="card-bordered">
              <div className="flex items-center gap-3 mb-4">
                <div className="icon-container icon-md icon-soft-blush">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <h2 className="text-heading-md text-teal">No Emergency Services</h2>
              </div>
              <p className="text-body-sm text-[var(--sage-600)]">
                We do not provide crisis response. If you are in danger, contact local
                emergency services immediately.
              </p>
            </section>

            <section className="card-bordered">
              <div className="flex items-center gap-3 mb-4">
                <div className="icon-container icon-md icon-soft-gold">
                  <RefreshCw className="h-5 w-5" />
                </div>
                <h2 className="text-heading-md text-teal">Changes</h2>
              </div>
              <p className="text-body-sm text-[var(--sage-600)]">
                We may update these terms. Continued use means you accept the newest
                version.
              </p>
            </section>

            <footer className="text-center py-4">
              <p className="text-caption flex items-center justify-center gap-1">
                <Heart className="h-4 w-4 text-[var(--blush-500)]" />
                Thank you for being part of our community
              </p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
