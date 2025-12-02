import { Link } from "wouter";
import { ArrowLeft, Phone, MessageSquare, Globe, Heart, AlertTriangle, Shield, ExternalLink } from "lucide-react";

const CRISIS_HOTLINES = [
  {
    name: "988 Suicide & Crisis Lifeline",
    description: "Free, confidential support 24/7 for anyone in distress",
    phone: "988",
    text: "Text 988",
    website: "https://988lifeline.org",
    available: "24/7",
    priority: true,
  },
  {
    name: "Crisis Text Line",
    description: "Text-based crisis support for those who prefer texting",
    phone: null,
    text: "Text HOME to 741741",
    website: "https://www.crisistextline.org",
    available: "24/7",
    priority: true,
  },
  {
    name: "National Alliance on Mental Illness (NAMI)",
    description: "Support, education, and advocacy for mental health",
    phone: "1-800-950-NAMI (6264)",
    text: "Text NAMI to 741741",
    website: "https://www.nami.org",
    available: "Mon-Fri, 10am-10pm ET",
    priority: false,
  },
  {
    name: "SAMHSA National Helpline",
    description: "Treatment referrals and information service",
    phone: "1-800-662-4357",
    text: null,
    website: "https://www.samhsa.gov/find-help/national-helpline",
    available: "24/7, 365 days",
    priority: false,
  },
  {
    name: "Veterans Crisis Line",
    description: "Support for veterans and their loved ones",
    phone: "988, then press 1",
    text: "Text 838255",
    website: "https://www.veteranscrisisline.net",
    available: "24/7",
    priority: false,
  },
  {
    name: "Trevor Project (LGBTQ+ Youth)",
    description: "Crisis intervention for LGBTQ+ young people",
    phone: "1-866-488-7386",
    text: "Text START to 678-678",
    website: "https://www.thetrevorproject.org",
    available: "24/7",
    priority: false,
  },
];

const SELF_CARE_TIPS = [
  {
    title: "Ground Yourself",
    description: "Use the 5-4-3-2-1 technique: Name 5 things you see, 4 you hear, 3 you feel, 2 you smell, 1 you taste.",
  },
  {
    title: "Breathe Slowly",
    description: "Try box breathing: Inhale for 4 counts, hold for 4, exhale for 4, hold for 4. Repeat 4 times.",
  },
  {
    title: "Reach Out",
    description: "You don't have to face this alone. Contact a trusted friend, family member, or one of the resources above.",
  },
  {
    title: "Stay Safe",
    description: "If you have access to items that could harm you, please move to a safe space or ask someone to help secure them.",
  },
];

export default function CrisisResources() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-neutral-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <header className="flex items-center gap-4 mb-8">
          <Link 
            href="/dashboard" 
            className="text-neutral-400 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-blue-400 rounded" 
            data-testid="link-back"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="w-6 h-6" aria-hidden="true" />
          </Link>
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-red-400" aria-hidden="true" />
            <h1 className="text-3xl font-bold" data-testid="text-title">Crisis Resources</h1>
          </div>
        </header>

        <div 
          className="bg-red-900/30 border border-red-700 rounded-xl p-6 mb-8"
          role="alert"
          aria-labelledby="emergency-heading"
        >
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 text-red-400 flex-shrink-0 mt-1" aria-hidden="true" />
            <div>
              <h2 id="emergency-heading" className="text-xl font-bold text-red-200 mb-2">
                If you're in immediate danger
              </h2>
              <p className="text-red-100 mb-4">
                Please call <strong>911</strong> or go to your nearest emergency room. Your safety is the top priority.
              </p>
              <a
                href="tel:911"
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition focus:outline-none focus:ring-2 focus:ring-red-400"
                data-testid="link-call-911"
              >
                <Phone className="w-5 h-5" aria-hidden="true" />
                Call 911
              </a>
            </div>
          </div>
        </div>

        <section aria-labelledby="hotlines-heading" className="mb-10">
          <h2 id="hotlines-heading" className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Phone className="w-6 h-6 text-blue-400" aria-hidden="true" />
            Crisis Hotlines & Support
          </h2>
          
          <div className="space-y-4">
            {CRISIS_HOTLINES.map((hotline, idx) => (
              <article
                key={idx}
                className={`rounded-xl p-5 border ${
                  hotline.priority 
                    ? "bg-blue-900/30 border-blue-700" 
                    : "bg-neutral-800 border-neutral-700"
                }`}
                data-testid={`card-hotline-${idx}`}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
                      {hotline.priority && (
                        <Shield className="w-5 h-5 text-blue-400" aria-label="Priority resource" />
                      )}
                      {hotline.name}
                    </h3>
                    <p className="text-neutral-400 text-sm mb-3">{hotline.description}</p>
                    <p className="text-xs text-neutral-500">
                      Available: {hotline.available}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {hotline.phone && (
                      <a
                        href={`tel:${hotline.phone.replace(/[^0-9]/g, "")}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition focus:outline-none focus:ring-2 focus:ring-green-400"
                        data-testid={`link-call-${idx}`}
                      >
                        <Phone className="w-4 h-4" aria-hidden="true" />
                        {hotline.phone}
                      </a>
                    )}
                    {hotline.text && (
                      <span 
                        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600/80 text-white text-sm font-medium rounded-lg"
                        aria-label={`Text support: ${hotline.text}`}
                      >
                        <MessageSquare className="w-4 h-4" aria-hidden="true" />
                        {hotline.text}
                      </span>
                    )}
                    {hotline.website && (
                      <a
                        href={hotline.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white text-sm font-medium rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-400"
                        data-testid={`link-website-${idx}`}
                      >
                        <Globe className="w-4 h-4" aria-hidden="true" />
                        Website
                        <ExternalLink className="w-3 h-3" aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="selfcare-heading" className="mb-10">
          <h2 id="selfcare-heading" className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Heart className="w-6 h-6 text-pink-400" aria-hidden="true" />
            Immediate Self-Care Steps
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SELF_CARE_TIPS.map((tip, idx) => (
              <article
                key={idx}
                className="bg-neutral-800 rounded-xl p-5 border border-neutral-700"
                data-testid={`card-tip-${idx}`}
              >
                <h3 className="text-lg font-semibold mb-2 text-pink-300">{tip.title}</h3>
                <p className="text-neutral-300 text-sm">{tip.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section 
          aria-labelledby="reminder-heading"
          className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-700/50 rounded-xl p-6 text-center"
        >
          <h2 id="reminder-heading" className="text-xl font-bold mb-3">You Are Not Alone</h2>
          <p className="text-neutral-300 mb-4 max-w-2xl mx-auto">
            Whatever you're going through, there are people who care and want to help. 
            Reaching out is a sign of strength, not weakness. You matter, and your life has value.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-400"
              data-testid="link-chat"
            >
              <MessageSquare className="w-5 h-5" aria-hidden="true" />
              Talk to Wellness Companion
            </Link>
            <Link
              href="/journal"
              className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-700 hover:bg-neutral-600 text-white font-medium rounded-lg transition focus:outline-none focus:ring-2 focus:ring-neutral-400"
              data-testid="link-journal"
            >
              Write in Journal
            </Link>
          </div>
        </section>

        <footer className="mt-8 text-center text-sm text-neutral-500">
          <p>
            This page provides general information and resources. 
            It is not a substitute for professional mental health treatment.
          </p>
        </footer>
      </div>
    </div>
  );
}
