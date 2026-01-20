import { Link } from "wouter";
import { ArrowLeft, Shield, AlertTriangle, Heart, Scale } from "lucide-react";
import SEO from "../../components/SEO";

export default function Disclaimer() {
  return (
    <>
      <SEO 
        title="Disclaimer" 
        description="Important disclaimers and terms regarding The Genuine Love Project mental wellness platform." 
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
                <div className="icon-container icon-xl icon-gradient-gold">
                  <Scale className="h-7 w-7" />
                </div>
                <h1 className="text-display-lg text-teal" data-testid="text-title">Disclaimer</h1>
              </div>
              <p className="text-lead">Important information about our mental wellness platform</p>
            </header>

            <div className="space-y-6">
              <section className="card-bordered">
                <div className="flex items-start gap-3 mb-4">
                  <div className="icon-container icon-md icon-soft-blush flex-shrink-0">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-heading-md text-teal mb-2">Not a Substitute for Professional Care</h2>
                    <p className="text-body-sm text-sage-600">
                      The Genuine Love Project is a wellness platform designed to support your mental health journey. 
                      However, it is not a replacement for professional medical advice, diagnosis, or treatment. 
                      Always seek the advice of qualified healthcare providers with any questions regarding mental health conditions.
                    </p>
                  </div>
                </div>
              </section>

              <section className="card-bordered">
                <div className="flex items-start gap-3 mb-4">
                  <div className="icon-container icon-md icon-soft-teal flex-shrink-0">
                    <Heart className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-heading-md text-teal mb-2">AI-Powered Support</h2>
                    <p className="text-body-sm text-sage-600">
                      Our platform uses AI technology to provide supportive responses and wellness tools. 
                      While our AI companion is designed to be trauma-informed and compassionate, 
                      it cannot provide the same level of care as a licensed mental health professional.
                    </p>
                  </div>
                </div>
              </section>

              <section className="card-bordered">
                <div className="flex items-start gap-3 mb-4">
                  <div className="icon-container icon-md icon-soft-sage flex-shrink-0">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-heading-md text-teal mb-2">Crisis Support</h2>
                    <p className="text-body-sm text-sage-600">
                      If you are experiencing a mental health crisis, please contact emergency services or a crisis hotline immediately. 
                      Our platform provides resources for crisis support, but cannot provide immediate emergency assistance.
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
