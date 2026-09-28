import { Link } from "wouter";
import { ArrowLeft, Phone, MessageSquare, Globe, Heart, AlertTriangle, Shield, ExternalLink, Sparkles, Wind, Users, HandHeart } from "lucide-react";
import SEO from "../components/SEO";
import SafetyFooter from "../components/ui/ReflectionFooter";
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

const SHADOW_MD = '0 4px 6px -1px rgba(0,0,0,0.10), 0 2px 4px -2px rgba(0,0,0,0.10)';
const SHADOW_LG = '0 10px 15px -3px rgba(0,0,0,0.10), 0 4px 6px -4px rgba(0,0,0,0.10)';
const ic = (s) => ({ width: s, height: s, flexShrink: 0 });
const actionBtnStyle = {
  gap: '0.5rem',
  padding: '0.625rem 1rem',
  fontSize: '0.875rem',
  fontWeight: 500,
  borderRadius: '0.75rem',
  boxShadow: SHADOW_MD,
};

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
            className="inline-flex items-center text-body-sm transition hover:opacity-80"
            style={{ color: 'var(--glp-sage-deep)', gap: '0.5rem', marginBottom: '1.5rem' }}
            data-testid="link-back-home"
          >
            <ArrowLeft style={ic('1rem')} />
            Back to Home
          </Link>

          <div style={{ background: 'var(--glp-rose-15)', border: '1px solid var(--glp-blush)', borderRadius: '1rem', padding: '1.5rem', marginBottom: '2rem' }}>
            <div className="flex items-start" style={{ gap: '1rem' }}>
              <div 
                className="flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--glp-rose-20)', color: 'var(--glp-rose-dark)', width: '3rem', height: '3rem', borderRadius: '0.75rem' }}
              >
                <AlertTriangle style={ic('1.5rem')} />
              </div>
              <div>
                <h2 className="text-heading-md" style={{ color: 'var(--glp-rose-dark)', marginBottom: '0.5rem' }}>In immediate danger?</h2>
                <p className="text-body-sm" style={{ color: 'var(--glp-ink)' }}>
                  Call 911 or go to your nearest emergency room. Your safety is the priority.
                </p>
              </div>
            </div>
          </div>

          <section aria-labelledby="hotlines-heading" style={{ marginBottom: '2.5rem' }}>
            <div className="flex items-center" style={{ gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div 
                className="flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--glp-sage-15)', color: 'var(--glp-sage-deep)', width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem' }}
              >
                <Phone style={ic('1.25rem')} aria-hidden="true" />
              </div>
              <h2 id="hotlines-heading" className="text-heading-lg" style={{ color: 'var(--glp-sage-deep)' }}>
                Crisis Hotlines & Support
              </h2>
            </div>
            
            <div className="flex flex-col" style={{ gap: '1rem' }}>
              {CRISIS_HOTLINES.map((hotline, idx) => (
                <article
                  key={idx}
                  className="card-elevated transition-all"
                  style={hotline.priority
                    ? { padding: '1.25rem', background: 'linear-gradient(135deg, var(--glp-sage-10), var(--glp-teal-50))', border: '1px solid var(--glp-sage-30)' }
                    : { padding: '1.25rem' }}
                  data-testid={`card-hotline-${idx}`}
                >
                  <div className="flex flex-col" style={{ gap: '1rem' }}>
                    <div className="flex-1">
                      <div className="flex items-center" style={{ gap: '0.75rem', marginBottom: '0.25rem' }}>
                        {hotline.priority && (
                          <span className="rounded-full flex-shrink-0" style={{ background: 'var(--glp-sage-deep)', color: 'var(--glp-paper)', padding: '0.125rem 0.5rem', fontSize: '0.75rem', fontWeight: 500 }}>
                            Priority
                          </span>
                        )}
                        <h3 style={{ color: 'var(--glp-sage-deep)', fontSize: '1.125rem', fontWeight: 600 }}>
                          {hotline.name}
                        </h3>
                      </div>
                      <p style={{ color: 'var(--glp-sage-deep)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{hotline.description}</p>
                      <p className="flex items-center" style={{ color: 'var(--glp-ink)', fontSize: '0.75rem', gap: '0.375rem' }}>
                        <span className="rounded-full" style={{ background: 'var(--glp-sage)', width: '0.375rem', height: '0.375rem' }}></span>
                        Available: {hotline.available}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap" style={{ gap: '0.5rem' }}>
                      {hotline.phone && (
                        <a
                          href={`tel:${hotline.phone.split(",")[0].replace(/[^0-9]/g, "")}`}
                          className="inline-flex items-center transition-all hover:opacity-90"
                          style={{ ...actionBtnStyle, background: 'linear-gradient(135deg, var(--glp-teal-400), var(--glp-sage-deep))', color: 'var(--glp-paper)' }}
                          data-testid={`link-call-${idx}`}
                        >
                          <Phone style={ic('1rem')} aria-hidden="true" />
                          {hotline.phone}
                        </a>
                      )}
                      {hotline.text && (
                        <span 
                          className="inline-flex items-center"
                          style={{ ...actionBtnStyle, background: 'linear-gradient(135deg, var(--glp-gold), var(--glp-gold-dark))', color: 'var(--glp-sage-deep)' }}
                          aria-label={`Text support: ${hotline.text}`}
                        >
                          <MessageSquare style={ic('1rem')} aria-hidden="true" />
                          {hotline.text}
                        </span>
                      )}
                      {hotline.website && (
                        <a
                          href={hotline.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center transition-all hover:opacity-80"
                          style={{ ...actionBtnStyle, boxShadow: 'none', background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-20)', color: 'var(--glp-sage-deep)' }}
                          data-testid={`link-website-${idx}`}
                        >
                          <Globe style={ic('1rem')} aria-hidden="true" />
                          Website
                          <ExternalLink style={{ ...ic('0.75rem'), opacity: 0.5 }} aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="selfcare-heading" style={{ marginBottom: '2.5rem' }}>
            <div className="flex items-center" style={{ gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div 
                className="flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, var(--glp-rose), var(--glp-rose-dark))', color: 'var(--glp-paper)', width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem' }}
              >
                <HandHeart style={ic('1.25rem')} aria-hidden="true" />
              </div>
              <h2 id="selfcare-heading" className="font-display" style={{ color: 'var(--glp-sage-deep)', fontSize: '1.25rem', fontWeight: 700 }}>
                Immediate Self-Care Steps
              </h2>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              {SELF_CARE_TIPS.map((tip, idx) => {
                const Icon = tip.icon;
                return (
                  <article
                    key={idx}
                    className="card-elevated transition-all group"
                    style={{ padding: '1.25rem' }}
                    data-testid={`card-tip-${idx}`}
                  >
                    <div 
                      className="rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
                      style={{ background: 'linear-gradient(135deg, var(--glp-teal-400), var(--glp-sage-deep))', color: 'var(--glp-paper)', width: '3rem', height: '3rem', marginBottom: '1rem', boxShadow: SHADOW_MD }}
                    >
                      <Icon style={ic('1.5rem')} aria-hidden="true" />
                    </div>
                    <h3 style={{ color: 'var(--glp-sage-deep)', fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>{tip.title}</h3>
                    <p style={{ color: 'var(--glp-sage-deep)', fontSize: '0.875rem', lineHeight: 1.625 }}>{tip.description}</p>
                  </article>
                );
              })}
            </div>
          </section>

          <section 
            aria-labelledby="reminder-heading"
            className="card-elevated text-center"
            style={{ background: 'linear-gradient(135deg, var(--glp-sage-10), var(--glp-teal-50))', padding: '2rem', textAlign: 'center' }}
          >
            <div 
              className="flex items-center justify-center mx-auto"
              style={{ background: 'linear-gradient(135deg, var(--glp-teal-400), var(--glp-sage-deep))', color: 'var(--glp-paper)', width: '4rem', height: '4rem', borderRadius: '1rem', marginBottom: '1rem', boxShadow: SHADOW_LG }}
            >
              <Heart style={ic('2rem')} aria-hidden="true" />
            </div>
            <h2 id="reminder-heading" className="font-display" style={{ color: 'var(--glp-sage-deep)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>You Are Not Alone</h2>
            <p className="mx-auto" style={{ color: 'var(--glp-sage-deep)', marginBottom: '1.5rem', maxWidth: '36rem', lineHeight: 1.625 }}>
              Whatever you're going through, there are people who care and want to help. 
              Reaching out is a sign of strength, not weakness. You matter, and your life has value.
            </p>
            <div className="flex flex-wrap justify-center" style={{ gap: '1rem' }}>
              <Link
                href="/chat"
                className="inline-flex items-center transition-all hover:opacity-90"
                style={{ gap: '0.5rem', padding: '0.75rem 1.5rem', fontWeight: 500, borderRadius: '0.75rem', boxShadow: SHADOW_MD, background: 'linear-gradient(135deg, var(--glp-teal-400), var(--glp-sage-deep))', color: 'var(--glp-paper)' }}
                data-testid="link-chat"
              >
                <MessageSquare style={ic('1.25rem')} aria-hidden="true" />
                Talk to Wellness Companion
              </Link>
              <Link
                href="/journal"
                className="inline-flex items-center transition-all hover:opacity-80"
                style={{ gap: '0.5rem', padding: '0.75rem 1.5rem', fontWeight: 500, borderRadius: '0.75rem', background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-20)', color: 'var(--glp-sage-deep)' }}
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
