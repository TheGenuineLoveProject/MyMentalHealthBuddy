import { Link } from "wouter";
import { ArrowLeft, FileText, CheckCircle, AlertCircle, BookOpen, Users } from "lucide-react";
import SEO from "../../components/SEO";

export default function Terms() {
  return (
    <>
      <SEO 
        title="Terms of Service" 
        description="Terms and conditions for using The Genuine Love Project mental wellness platform." 
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
                <div className="icon-container icon-xl icon-gradient-sage">
                  <FileText className="h-7 w-7" />
                </div>
                <h1 className="text-display-lg text-teal" data-testid="text-title">Terms of Service</h1>
              </div>
              <p className="text-lead">Guidelines for using our mental wellness platform</p>
            </header>

            <div className="space-y-6">
              <section className="card-bordered">
                <div className="flex items-start gap-3 mb-4">
                  <div className="icon-container icon-md icon-soft-teal flex-shrink-0">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-heading-md text-teal mb-2">Acceptance of Terms</h2>
                    <p className="text-body-sm text-sage-600">
                      By accessing or using The Genuine Love Project, you agree to be bound by these Terms of Service. 
                      If you do not agree to these terms, please do not use our services.
                    </p>
                  </div>
                </div>
              </section>

              <section className="card-bordered">
                <div className="flex items-start gap-3 mb-4">
                  <div className="icon-container icon-md icon-soft-sage flex-shrink-0">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-heading-md text-teal mb-2">Service Description</h2>
                    <p className="text-body-sm text-sage-600">
                      We provide an AI-powered mental wellness platform featuring mood tracking, journaling, 
                      guided exercises, and supportive conversations. Our services are designed to complement, 
                      not replace, professional mental health care.
                    </p>
                  </div>
                </div>
              </section>

              <section className="card-bordered">
                <div className="flex items-start gap-3 mb-4">
                  <div className="icon-container icon-md icon-soft-gold flex-shrink-0">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-heading-md text-teal mb-2">User Responsibilities</h2>
                    <ul className="text-body-sm text-sage-600 space-y-2 list-disc list-inside">
                      <li>Provide accurate account information</li>
                      <li>Use the platform responsibly and respectfully</li>
                      <li>Keep your login credentials secure</li>
                      <li>Seek professional help for serious mental health concerns</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="card-bordered">
                <div className="flex items-start gap-3 mb-4">
                  <div className="icon-container icon-md icon-soft-blush flex-shrink-0">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-heading-md text-teal mb-2">Limitations</h2>
                    <p className="text-body-sm text-sage-600">
                      Our platform is not a crisis service. If you are in immediate danger or experiencing 
                      a mental health emergency, please contact emergency services or a crisis hotline.
                    </p>
                    <Link 
                      href="/crisis" 
                      className="inline-flex items-center gap-2 mt-3 text-body-sm text-teal-600 hover:text-teal-700 font-medium"
                      data-testid="link-crisis"
                    >
                      View Crisis Resources →
                    </Link>
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
