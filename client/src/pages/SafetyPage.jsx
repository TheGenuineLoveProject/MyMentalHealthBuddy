import { Link } from "wouter";
import { ArrowLeft, AlertTriangle, Phone, Heart, Shield, ExternalLink, BookOpen, Users } from "lucide-react";
import SEO from "../components/SEO";
import TglpNavbar from "../components/TglpNavbar";

const CRISIS_HOTLINES = [
  {
    name: "988 Suicide & Crisis Lifeline",
    phone: "988",
    text: "Text 988",
    available: "24/7",
  },
  {
    name: "Crisis Text Line",
    text: "Text HOME to 741741",
    available: "24/7",
  },
  {
    name: "Emergency Services",
    phone: "911",
    available: "24/7",
  },
];

export default function SafetyPage() {
  return (
    <>
      <SEO 
        title="Safety & Wellness Boundaries - The Genuine Love Project"
        description="Important safety information about our platform. We are not medical advice. If you are in crisis, please contact emergency services immediately."
      />
      <div className="min-h-screen bg-[var(--glp-paper)]">
        <TglpNavbar />
        
        <div className="content-wrapper py-12">
          <div className="max-w-3xl mx-auto">
            <header className="mb-10">
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 text-sm text-[var(--sage-600)] hover:text-[var(--teal-700)] transition mb-6"
                data-testid="link-back-safety"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
              
              <div className="flex items-center gap-4">
                <div className="icon-container icon-lg icon-gradient-teal">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-heading-xl text-teal" data-testid="text-safety-title">Safety & Wellness Boundaries</h1>
                  <p className="text-body-sm">Your wellbeing is our priority</p>
                </div>
              </div>
            </header>

            <div className="space-y-8">
              <section className="card-bordered p-6 rounded-xl bg-red-50 border-red-200" data-testid="section-emergency">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-red-100 flex-shrink-0">
                    <Phone className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-red-800 mb-3">If You Are in Immediate Danger</h2>
                    <p className="text-red-700 mb-4">
                      If you or someone you know is in immediate danger, please contact emergency services right away.
                    </p>
                    <div className="space-y-3">
                      {CRISIS_HOTLINES.map((hotline) => (
                        <div key={hotline.name} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-red-100">
                          <div className="font-semibold text-red-800">{hotline.name}</div>
                          {hotline.phone && (
                            <a 
                              href={`tel:${hotline.phone}`}
                              className="px-3 py-1 bg-red-600 text-white rounded-full text-sm font-medium hover:bg-red-700 transition"
                              data-testid={`link-call-${hotline.phone}`}
                            >
                              Call {hotline.phone}
                            </a>
                          )}
                          {hotline.text && (
                            <span className="text-sm text-red-600">{hotline.text}</span>
                          )}
                        </div>
                      ))}
                    </div>
                    <Link 
                      href="/crisis"
                      className="inline-flex items-center gap-2 mt-4 text-red-700 hover:text-red-800 font-medium"
                      data-testid="link-crisis-resources"
                    >
                      View All Crisis Resources <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </section>

              <section className="card-bordered p-6 rounded-xl" data-testid="section-not-medical">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-amber-100 flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-[var(--glp-ink)] mb-3">This Is Not Medical Advice</h2>
                    <p className="text-[var(--glp-text-muted)] mb-4">
                      The Genuine Love Project is a wellness and personal growth platform. It is <strong>not</strong> a substitute for professional medical, mental health, or therapeutic care.
                    </p>
                    <ul className="space-y-2 text-[var(--glp-text-muted)]">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 mt-1">•</span>
                        We do not diagnose or treat mental health conditions
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 mt-1">•</span>
                        Our AI companion provides supportive reflection, not clinical therapy
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 mt-1">•</span>
                        No content on this platform should replace professional medical advice
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 mt-1">•</span>
                        We cannot guarantee specific outcomes or results
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="card-bordered p-6 rounded-xl" data-testid="section-seek-help">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-[var(--sage-100)] flex-shrink-0">
                    <Users className="w-6 h-6 text-[var(--sage-600)]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-[var(--glp-ink)] mb-3">When to Seek Professional Help</h2>
                    <p className="text-[var(--glp-text-muted)] mb-4">
                      We encourage you to seek professional support if you experience:
                    </p>
                    <ul className="space-y-2 text-[var(--glp-text-muted)]">
                      <li className="flex items-start gap-2">
                        <span className="text-[var(--sage-500)] mt-1">•</span>
                        Persistent feelings of sadness, hopelessness, or emptiness
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[var(--sage-500)] mt-1">•</span>
                        Thoughts of self-harm or harming others
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[var(--sage-500)] mt-1">•</span>
                        Significant changes in sleep, appetite, or daily functioning
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[var(--sage-500)] mt-1">•</span>
                        Trauma symptoms that interfere with your quality of life
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[var(--sage-500)] mt-1">•</span>
                        Substance use concerns
                      </li>
                    </ul>
                    <Link 
                      href="/resources"
                      className="inline-flex items-center gap-2 mt-4 text-[var(--sage-600)] hover:text-[var(--sage-700)] font-medium"
                      data-testid="link-professional-resources"
                    >
                      Find Professional Resources <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </section>

              <section className="card-bordered p-6 rounded-xl" data-testid="section-our-purpose">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-[var(--blush-100)] flex-shrink-0">
                    <Heart className="w-6 h-6 text-[var(--blush-500)]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-[var(--glp-ink)] mb-3">What We Do Offer</h2>
                    <p className="text-[var(--glp-text-muted)] mb-4">
                      The Genuine Love Project provides:
                    </p>
                    <ul className="space-y-2 text-[var(--glp-text-muted)]">
                      <li className="flex items-start gap-2">
                        <span className="text-[var(--blush-400)] mt-1">♥</span>
                        A safe, private space for self-reflection and personal growth
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[var(--blush-400)] mt-1">♥</span>
                        Evidence-informed wellness tools and practices
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[var(--blush-400)] mt-1">♥</span>
                        Compassionate AI support for emotional processing
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[var(--blush-400)] mt-1">♥</span>
                        Educational content about mental wellness
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[var(--blush-400)] mt-1">♥</span>
                        Connection to professional resources when needed
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="card-bordered p-6 rounded-xl bg-[var(--sage-50)]" data-testid="section-commitment">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-[var(--sage-100)] flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-[var(--sage-600)]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-[var(--glp-ink)] mb-3">Our Commitment to You</h2>
                    <p className="text-[var(--glp-text-muted)]">
                      We are committed to creating a supportive environment that respects your journey. 
                      Your safety and wellbeing are our top priorities. If at any point you feel this 
                      platform is not serving your needs, we encourage you to seek support that aligns 
                      with your path to healing.
                    </p>
                    <p className="text-[var(--glp-text-muted)] mt-4">
                      With genuine care,<br />
                      <strong className="text-[var(--sage-600)]">The Genuine Love Project Team</strong>
                    </p>
                  </div>
                </div>
              </section>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link 
                  href="/disclaimer"
                  className="btn-secondary"
                  data-testid="link-disclaimer"
                >
                  Read Full Disclaimer
                </Link>
                <Link 
                  href="/faq"
                  className="btn-secondary"
                  data-testid="link-faq"
                >
                  Frequently Asked Questions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
