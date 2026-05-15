import { Link } from "wouter";
import { ArrowLeft, Phone, MessageSquare, Globe, Heart, AlertTriangle, Shield, ExternalLink, Sparkles, Wind, Users, HandHeart } from "lucide-react";
import SEO from "../components/SEO";
import SafetyFooter from "../components/ui/SafetyFooter";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

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
    icon: Sparkles
  },
  {
    title: "Breathe Slowly",
    description: "Try box breathing: Inhale for 4 counts, hold for 4, exhale for 4, hold for 4. Repeat 4 times.",
    icon: Wind
  },
  {
    title: "Reach Out",
    description: "You don't have to face this alone. Contact a trusted friend, family member, or one of the resources above.",
    icon: Users
  },
  {
    title: "Stay Safe",
    description: "If you have access to items that could harm you, please move to a safe space or ask someone to help secure them.",
    icon: Shield
  },
];

export default function CrisisResources() {
  return (
  <div className="hxos-vnext-crisis">
  <WellnessPageShell
    title=""
    subtitle=""
    benefits={pickBenefits(["agency","calm","clarity","selfRespect","meaning"], 5)}
    clarity={{
      what: "A self-paced reflection tool you control.",
      why: "To support clarity, values alignment, and gentle next steps.",
      who: "For adults (18+) who want educational wellness tools (not medical care).",
      when: "Anytime you want a small reset or a thoughtful pause.",
      where: "Anywhere you can breathe and write for 1–5 minutes.",
      how: "Pick one prompt, answer briefly, stop whenever you want."
    }}
    examples={[
      { label: "Beginner", examples: ["Write one honest sentence about how you feel.", "Name one value you want to protect today."] },
      { label: "Intermediate", examples: ["Describe the situation + the need underneath it.", "Write a boundary you could try in one sentence."] },
      { label: "Advanced", examples: ["Identify a pattern and the smallest experiment to change it.", "Write a compassionate reframe and one measurable step."] }
    ]}
  >

    <>
      <SEO 
        title="Crisis Resources"
        description="24/7 crisis support hotlines and mental health resources. Find immediate help, emergency contacts, and self-care tips when you need them most."
      />
      <div className="relative">
        <div className="relative z-10">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-body-sm transition mb-6 hover:opacity-80"
            style={{ color: 'var(--glp-sage-deep)' }}
            data-testid="link-back-home"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="rounded-2xl p-6 mb-8" style={{ background: 'var(--glp-rose-15)', border: '1px solid var(--glp-blush)' }}>
            <div className="flex items-start gap-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--glp-rose-20)', color: 'var(--glp-rose-dark)' }}
              >
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-heading-md mb-2" style={{ color: 'var(--glp-rose-dark)' }}>In immediate danger?</h2>
                <p className="text-body-sm" style={{ color: 'var(--glp-ink)' }}>
                  Call 911 or go to your nearest emergency room. Your safety is the priority.
                </p>
              </div>
            </div>
          </div>

          <section aria-labelledby="hotlines-heading" className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--glp-sage-15)', color: 'var(--glp-sage-deep)' }}
              >
                <Phone className="w-5 h-5" aria-hidden="true" />
              </div>
              <h2 id="hotlines-heading" className="text-heading-lg" style={{ color: 'var(--glp-sage-deep)' }}>
                Crisis Hotlines & Support
              </h2>
            </div>
            
            <div className="space-y-4">
              {CRISIS_HOTLINES.map((hotline, idx) => (
                <article
                  key={idx}
                  className="card-elevated p-5 transition-all hover:shadow-lg"
                  style={hotline.priority ? { background: 'linear-gradient(135deg, var(--glp-sage-10), var(--glp-teal-50))', border: '1px solid var(--glp-sage-30)' } : {}}
                  data-testid={`card-hotline-${idx}`}
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1 flex items-center gap-2" style={{ color: 'var(--glp-sage-deep)' }}>
                        {hotline.priority && (
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full flex-shrink-0" style={{ background: 'var(--glp-sage-deep)', color: 'var(--glp-paper)' }}>
                            Priority
                          </span>
                        )}
                        <span>{hotline.name}</span>
                      </h3>
                      <p className="text-sm mb-2" style={{ color: 'var(--glp-sage-deep)' }}>{hotline.description}</p>
                      <p className="text-xs flex items-center gap-1.5" style={{ color: 'var(--glp-ink)' }}>
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--glp-sage)' }}></span>
                        Available: {hotline.available}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {hotline.phone && (
                        <a
                          href={`tel:${hotline.phone.replace(/[^0-9]/g, "")}`}
                          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all shadow-md hover:shadow-lg hover:opacity-90 focus:outline-none"
                          style={{ background: 'linear-gradient(135deg, var(--glp-teal-400), var(--glp-sage-deep))', color: 'var(--glp-paper)' }}
                          data-testid={`link-call-${idx}`}
                        >
                          <Phone className="w-4 h-4" aria-hidden="true" />
                          {hotline.phone}
                        </a>
                      )}
                      {hotline.text && (
                        <span 
                          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl shadow-md"
                          style={{ background: 'linear-gradient(135deg, var(--glp-gold), var(--glp-gold-dark))', color: 'var(--glp-sage-deep)' }}
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
                          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all hover:opacity-80 focus:outline-none"
                          style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-20)', color: 'var(--glp-sage-deep)' }}
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
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, var(--glp-rose), var(--glp-rose-dark))', color: 'var(--glp-paper)' }}
              >
                <HandHeart className="w-5 h-5" aria-hidden="true" />
              </div>
              <h2 id="selfcare-heading" className="text-xl font-display font-bold" style={{ color: 'var(--glp-sage-deep)' }}>
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
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform"
                      style={{ background: 'linear-gradient(135deg, var(--glp-teal-400), var(--glp-sage-deep))', color: 'var(--glp-paper)' }}
                    >
                      <Icon className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--glp-sage-deep)' }}>{tip.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--glp-sage-deep)' }}>{tip.description}</p>
                  </article>
                );
              })}
            </div>
          </section>

          <section 
            aria-labelledby="reminder-heading"
            className="card-elevated p-8 text-center"
            style={{ background: 'linear-gradient(135deg, var(--glp-sage-10), var(--glp-teal-50))' }}
          >
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
              style={{ background: 'linear-gradient(135deg, var(--glp-teal-400), var(--glp-sage-deep))', color: 'var(--glp-paper)' }}
            >
              <Heart className="w-8 h-8" aria-hidden="true" />
            </div>
            <h2 id="reminder-heading" className="text-2xl font-display font-bold mb-3" style={{ color: 'var(--glp-sage-deep)' }}>You Are Not Alone</h2>
            <p className="mb-6 max-w-xl mx-auto leading-relaxed" style={{ color: 'var(--glp-sage-deep)' }}>
              Whatever you're going through, there are people who care and want to help. 
              Reaching out is a sign of strength, not weakness. You matter, and your life has value.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/chat"
                className="px-6 py-3 inline-flex items-center gap-2 font-medium rounded-xl transition-all hover:opacity-90 shadow-md"
                style={{ background: 'linear-gradient(135deg, var(--glp-teal-400), var(--glp-sage-deep))', color: 'var(--glp-paper)' }}
                data-testid="link-chat"
              >
                <MessageSquare className="w-5 h-5" aria-hidden="true" />
                Talk to Wellness Companion
              </Link>
              <Link
                href="/journal"
                className="inline-flex items-center gap-2 px-6 py-3 font-medium rounded-xl transition-all hover:opacity-80 focus:outline-none"
                style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-20)', color: 'var(--glp-sage-deep)' }}
                data-testid="link-journal"
              >
                Write in Journal
              </Link>
            </div>
          </section>

          <SafetyFooter variant="prominent" />
        </div>
      </div>
    </>
  </WellnessPageShell>
  </div>
  );
}
