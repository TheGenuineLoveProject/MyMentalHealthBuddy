import { Link } from "wouter";
import { ArrowLeft, Users, Phone, Globe, BookOpen, Heart, Shield, ExternalLink } from 'lucide-react';
import SafetyFooter from "../components/ui/SafetyFooter";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import { SEO } from "@/components/SEO";

const resources = [
  {
    category: "Crisis Hotlines",
    icon: Phone,
    color: "blush",
    items: [
      {
        name: "988 Suicide & Crisis Lifeline",
        description: "Free, confidential 24/7 support for people in distress",
        contact: "Call or text 988",
        url: "https://988lifeline.org"
      },
      {
        name: "Crisis Text Line",
        description: "Text-based crisis counseling available 24/7",
        contact: "Text HOME to 741741",
        url: "https://www.crisistextline.org"
      },
      {
        name: "SAMHSA National Helpline",
        description: "Treatment referrals and information 24/7",
        contact: "1-800-662-4357",
        url: "https://www.samhsa.gov/find-help/national-helpline"
      }
    ]
  },
  {
    category: "Find a Therapist",
    icon: Users,
    color: "teal",
    items: [
      {
        name: "Psychology Today Directory",
        description: "Search therapists by location, specialty, and insurance",
        url: "https://www.psychologytoday.com/us/therapists"
      },
      {
        name: "Open Path Collective",
        description: "Affordable therapy sessions ($30-$80) for those in need",
        url: "https://openpathcollective.org"
      },
      {
        name: "BetterHelp",
        description: "Online therapy with licensed counselors",
        url: "https://www.betterhelp.com"
      },
      {
        name: "NAMI HelpLine",
        description: "Free mental health resources and referrals",
        contact: "1-800-950-NAMI (6264)",
        url: "https://www.nami.org/help"
      }
    ]
  },
  {
    category: "Educational Resources",
    icon: BookOpen,
    color: "sage",
    items: [
      {
        name: "NIMH - National Institute of Mental Health",
        description: "Research-based mental health information",
        url: "https://www.nimh.nih.gov"
      },
      {
        name: "Mental Health America",
        description: "Screening tools, information, and advocacy",
        url: "https://www.mhanational.org"
      },
      {
        name: "Anxiety & Depression Association of America",
        description: "Evidence-based resources for anxiety and depression",
        url: "https://adaa.org"
      }
    ]
  },
  {
    category: "Support Communities",
    icon: Heart,
    color: "gold",
    items: [
      {
        name: "NAMI Support Groups",
        description: "Peer-led support groups for individuals and families",
        url: "https://www.nami.org/Support-Education"
      },
      {
        name: "DBSA Support Groups",
        description: "Depression and Bipolar Support Alliance groups",
        url: "https://www.dbsalliance.org/support/chapters-and-support-groups/"
      },
      {
        name: "7 Cups",
        description: "Free online chat with trained listeners",
        url: "https://www.7cups.com"
      }
    ]
  }
];

function ResourceCard({ item }) {
  return (
  <WellnessPageShell
    title="ProfessionalResourcesPage"
    subtitle="Educational reflection tools. Choose what feels safe and supportive."
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
      <SEO title="Professional Resources — The Genuine Love Project" description="Resources for wellness professionals." />


    <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--sage-200)] hover:border-[var(--teal-400)] transition">
      <h4 className="text-body-md font-semibold text-[var(--teal-700)] mb-1">{item.name}</h4>
      <p className="text-body-sm text-[var(--sage-600)] mb-2">{item.description}</p>
      {item.contact && (
        <p className="text-body-sm font-medium text-[var(--teal-600)] mb-2">{item.contact}</p>
      )}
      {item.url && (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-body-sm text-[var(--teal-500)] hover:text-[var(--teal-700)] transition"
          data-testid={`link-resource-${item.name.slice(0, 15).replace(/\s+/g, '-').toLowerCase()}`}
        >
          Visit Website <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </div>
  );
}

export default function ProfessionalResourcesPage() {
  return (
    <div className="min-h-screen hero-gradient">
      <div className="content-wrapper py-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-body-sm text-[var(--sage-500)] hover:text-[var(--teal-600)] mb-4 transition" data-testid="link-back">
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Link>
            <div className="flex items-center gap-3">
              <div className="icon-container icon-xl icon-gradient-teal">
                <Globe className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-display-lg text-teal" data-testid="text-page-title">Professional Resources</h1>
                <p className="text-lead">Trusted organizations and professionals who can help.</p>
              </div>
            </div>
          </header>

          <div className="card-bordered bg-[var(--blush-50)] mb-8">
            <div className="flex items-start gap-3">
              <div className="icon-container icon-md icon-soft-blush">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-heading-sm text-[var(--blush-700)] mb-1">Important Reminder</h2>
                <p className="text-body-sm text-[var(--sage-600)]">
                  The Genuine Love Project is a supportive wellness tool, not a replacement for professional mental health care. 
                  If you're experiencing a mental health crisis, please contact one of the crisis hotlines below or call 911.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {resources.map((section, idx) => {
              const IconComponent = section.icon;
              return (
                <section key={idx} className="card-bordered">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`icon-container icon-md icon-soft-${section.color}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <h2 className="text-heading-md text-teal">{section.category}</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {section.items.map((item, itemIdx) => (
                      <ResourceCard key={itemIdx} item={item} />
                    ))}
                  </div>
                </section>
              );
            })}

            <section className="card-bordered bg-[var(--sage-50)]">
              <div className="text-center">
                <h2 className="text-heading-md text-teal mb-2">Need Immediate Help?</h2>
                <p className="text-body-sm text-[var(--sage-600)] mb-4">
                  If you or someone you know is in crisis, reach out now.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <a href="tel:988" className="btn-primary-premium" data-testid="button-call-988">
                    <Phone className="h-4 w-4 mr-2" /> Call 988
                  </a>
                  <Link href="/crisis" className="btn-secondary-premium" data-testid="link-crisis-page">
                    View All Crisis Resources
                  </Link>
                </div>
              </div>
            </section>

            <SafetyFooter variant="prominent" />
          </div>
        </div>
      </div>
    </div>
  </WellnessPageShell>
  );
}
