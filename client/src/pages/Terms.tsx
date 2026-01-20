import { Link } from "wouter";
import { ArrowLeft, FileText, Shield, AlertCircle, User, Heart } from "lucide-react";
import SEO from "@/components/SEO";

export default function Terms() {
  return (
    <>
      <SEO 
        title="Terms of Use - The Genuine Love Project"
        description="Terms of Use for The Genuine Love Project mental wellness platform."
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
                <div className="icon-container icon-xl icon-gradient-sage">
                  <FileText className="w-7 h-7" />
                </div>
                <div>
                  <h1 className="text-display-lg text-teal">Terms of Use</h1>
                  <p className="text-lead">Summary for launch</p>
                </div>
              </div>
            </header>

            <div className="space-y-6">
              <section className="card-bordered">
                <p className="text-body-sm">
                  By using The Genuine Love Project, you agree to use the app responsibly and lawfully.
                  Do not misuse the platform, attempt unauthorized access, or upload harmful content.
                </p>
              </section>

              <section className="card-bordered">
                <div className="flex items-center gap-3 mb-4">
                  <div className="icon-container icon-md icon-soft-teal">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h2 className="text-heading-md text-teal">No Professional Services</h2>
                </div>
                <p className="text-body-sm">
                  The app is not therapy or medical care. It provides self-reflection tools and supportive,
                  non-clinical guidance only.
                </p>
              </section>

              <section className="card-bordered">
                <div className="flex items-center gap-3 mb-4">
                  <div className="icon-container icon-md icon-soft-sage">
                    <User className="w-5 h-5" />
                  </div>
                  <h2 className="text-heading-md text-teal">User Content</h2>
                </div>
                <p className="text-body-sm">
                  You retain rights to your content. You grant us permission to process it solely to provide
                  the service and maintain safety, reliability, and performance.
                </p>
              </section>

              <section className="card-bordered">
                <div className="flex items-center gap-3 mb-4">
                  <div className="icon-container icon-md icon-soft-blush">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <h2 className="text-heading-md text-teal">Safety</h2>
                </div>
                <p className="text-body-sm">
                  If we detect high-risk content, we may show crisis resources or restrict access to protect users.
                </p>
              </section>

              <footer className="card-bordered bg-[var(--sage-50)] border-[var(--sage-200)]">
                <div className="flex items-center gap-3">
                  <div className="icon-container icon-sm icon-soft-gold">
                    <Heart className="w-4 h-4" />
                  </div>
                  <p className="text-caption">
                    This is a summary for launch. Replace with full Terms before large-scale release.
                  </p>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
