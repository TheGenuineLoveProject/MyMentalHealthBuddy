import { Link } from "wouter";
import { ArrowLeft, Phone, MessageSquare, Globe, Heart, AlertTriangle, Shield, ExternalLink, Sparkles, Wind, Users, HandHeart } from "lucide-react";
import SEO from "../components/SEO.jsx";

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
    icon: Sparkles,
    color: "from-violet-500 to-purple-600",
  },
  {
    title: "Breathe Slowly",
    description: "Try box breathing: Inhale for 4 counts, hold for 4, exhale for 4, hold for 4. Repeat 4 times.",
    icon: Wind,
    color: "from-cyan-500 to-teal-600",
  },
  {
    title: "Reach Out",
    description: "You don't have to face this alone. Contact a trusted friend, family member, or one of the resources above.",
    icon: Users,
    color: "from-amber-500 to-orange-600",
  },
  {
    title: "Stay Safe",
    description: "If you have access to items that could harm you, please move to a safe space or ask someone to help secure them.",
    icon: Shield,
    color: "from-emerald-500 to-green-600",
  },
];

export default function CrisisResources() {
  return (
    <>
      <SEO 
        title="Crisis Resources"
        description="24/7 crisis support hotlines and mental health resources. Find immediate help, emergency contacts, and self-care tips when you need them most."
      />
      <div className="min-h-screen bg-[var(--bg)]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--accent-rose)]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[var(--primary)]/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-6 py-8 relative z-10">
          <header className="flex items-center gap-4 mb-8">
            <Link 
              href="/dashboard" 
              className="w-10 h-10 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text)] hover:border-[var(--primary)] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" 
              data-testid="link-back"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="w-5 h-5" aria-hidden="true" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent-rose)] to-rose-600 flex items-center justify-center shadow-lg">
                <Heart className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-[var(--text)]" data-testid="text-title">Crisis Resources</h1>
                <p className="text-sm text-[var(--text-muted)]">You are not alone. Help is available.</p>
              </div>
            </div>
          </header>

          <div 
            className="card-elevated p-6 mb-8 bg-gradient-to-r from-[var(--accent-rose-soft)] to-rose-50 dark:from-rose-900/20 dark:to-rose-900/10 border-[var(--accent-rose)]/30"
            role="alert"
            aria-labelledby="emergency-heading"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--accent-rose)] to-rose-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                <AlertTriangle className="w-7 h-7 text-white" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <h2 id="emergency-heading" className="text-xl font-display font-bold text-[var(--accent-rose)] mb-2">
                  If you're in immediate danger
                </h2>
                <p className="text-[var(--text-secondary)] mb-4">
                  Please call <strong className="text-[var(--text)]">911</strong> or go to your nearest emergency room. Your safety is the top priority.
                </p>
                <a
                  href="tel:911"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--accent-rose)] to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-medium rounded-xl transition-all shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-rose)] focus:ring-offset-2"
                  data-testid="link-call-911"
                >
                  <Phone className="w-5 h-5" aria-hidden="true" />
                  Call 911 Now
                </a>
              </div>
            </div>
          </div>

          <section aria-labelledby="hotlines-heading" className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent-violet)] flex items-center justify-center">
                <Phone className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <h2 id="hotlines-heading" className="text-xl font-display font-bold text-[var(--text)]">
                Crisis Hotlines & Support
              </h2>
            </div>
            
            <div className="space-y-4">
              {CRISIS_HOTLINES.map((hotline, idx) => (
                <article
                  key={idx}
                  className={`card-elevated p-5 transition-all hover:shadow-lg ${
                    hotline.priority 
                      ? "border-[var(--primary)]/30 bg-gradient-to-r from-[var(--primary-soft)] to-violet-50/50 dark:from-violet-900/20 dark:to-transparent" 
                      : ""
                  }`}
                  data-testid={`card-hotline-${idx}`}
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1 flex items-center gap-2 text-[var(--text)]">
                        {hotline.priority && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-[var(--primary)] text-white rounded-full">
                            Priority
                          </span>
                        )}
                        {hotline.name}
                      </h3>
                      <p className="text-[var(--text-secondary)] text-sm mb-2">{hotline.description}</p>
                      <p className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        Available: {hotline.available}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {hotline.phone && (
                        <a
                          href={`tel:${hotline.phone.replace(/[^0-9]/g, "")}`}
                          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white text-sm font-medium rounded-xl transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                          data-testid={`link-call-${idx}`}
                        >
                          <Phone className="w-4 h-4" aria-hidden="true" />
                          {hotline.phone}
                        </a>
                      )}
                      {hotline.text && (
                        <span 
                          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[var(--accent-violet)] to-purple-600 text-white text-sm font-medium rounded-xl shadow-md"
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
                          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--text)] text-sm font-medium rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                          data-testid={`link-website-${idx}`}
                        >
                          <Globe className="w-4 h-4" aria-hidden="true" />
                          Website
                          <ExternalLink className="w-3 h-3 opacity-50" aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="selfcare-heading" className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                <HandHeart className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <h2 id="selfcare-heading" className="text-xl font-display font-bold text-[var(--text)]">
                Immediate Self-Care Steps
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SELF_CARE_TIPS.map((tip, idx) => {
                const Icon = tip.icon;
                return (
                  <article
                    key={idx}
                    className="card-elevated p-5 hover:shadow-lg transition-all group"
                    data-testid={`card-tip-${idx}`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tip.color} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-[var(--text)]">{tip.title}</h3>
                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{tip.description}</p>
                  </article>
                );
              })}
            </div>
          </section>

          <section 
            aria-labelledby="reminder-heading"
            className="card-elevated p-8 text-center bg-gradient-to-br from-[var(--primary-soft)] via-violet-50/50 to-[var(--accent-teal-soft)] dark:from-violet-900/20 dark:via-transparent dark:to-teal-900/20"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-[var(--primary)] to-[var(--accent-violet)] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Heart className="w-8 h-8 text-white" aria-hidden="true" />
            </div>
            <h2 id="reminder-heading" className="text-2xl font-display font-bold mb-3 text-[var(--text)]">You Are Not Alone</h2>
            <p className="text-[var(--text-secondary)] mb-6 max-w-xl mx-auto leading-relaxed">
              Whatever you're going through, there are people who care and want to help. 
              Reaching out is a sign of strength, not weakness. You matter, and your life has value.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/chat"
                className="btn btn-gradient px-6 py-3 inline-flex items-center gap-2"
                data-testid="link-chat"
              >
                <MessageSquare className="w-5 h-5" aria-hidden="true" />
                Talk to Wellness Companion
              </Link>
              <Link
                href="/journal"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--text)] font-medium rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                data-testid="link-journal"
              >
                Write in Journal
              </Link>
            </div>
          </section>

          <footer className="mt-8 text-center text-sm text-[var(--text-muted)] p-4">
            <p>
              This page provides general information and resources. 
              It is not a substitute for professional mental health treatment.
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}
