import { Link } from "wouter";
import SafetyFooter from "../components/ui/SafetyFooter";
import { 
  ArrowLeft, 
  ExternalLink,
  Phone,
  MessageSquare,
  Globe,
  Heart,
  Shield,
  Users,
  BookOpen,
  Headphones,
  Baby,
  Sparkles,
  AlertTriangle,
  Clock,
  MapPin
} from "lucide-react";

const crisisResources = [
  {
    name: "988 Suicide & Crisis Lifeline",
    description: "Free, confidential 24/7 support for anyone in crisis",
    phone: "988",
    text: "Text 988",
    website: "https://988lifeline.org",
    available: "24/7"
  },
  {
    name: "Crisis Text Line",
    description: "Text-based crisis support with trained counselors",
    text: "Text HOME to 741741",
    website: "https://crisistextline.org",
    available: "24/7"
  },
  {
    name: "SAMHSA National Helpline",
    description: "Treatment referral service for mental health and substance use",
    phone: "1-800-662-4357",
    website: "https://samhsa.gov/find-help/national-helpline",
    available: "24/7, 365 days"
  }
];

const resourceCategories = [
  {
    title: "Find a Therapist",
    icon: Users,
    resources: [
      { name: "Psychology Today Therapist Finder", description: "Search by location, specialty, and insurance", url: "https://psychologytoday.com/us/therapists" },
      { name: "Open Path Collective", description: "Affordable therapy sessions ($30-$80)", url: "https://openpathcollective.org" },
      { name: "Inclusive Therapists", description: "Directory focused on marginalized communities", url: "https://inclusivetherapists.com" },
      { name: "AASECT Certified Therapists", description: "Sex therapy specialists", url: "https://aasect.org/referral-directory" }
    ]
  },
  {
    title: "Support Groups",
    icon: Heart,
    resources: [
      { name: "NAMI Support Groups", description: "Peer-led groups for mental health conditions", url: "https://nami.org/support-education" },
      { name: "DailyStrength", description: "Online support communities for various issues", url: "https://dailystrength.org" },
      { name: "7 Cups", description: "Free emotional support from trained listeners", url: "https://7cups.com" },
      { name: "Support Groups Central", description: "Directory of online and local groups", url: "https://supportgroupscentral.com" }
    ]
  },
  {
    title: "Trauma & PTSD",
    icon: Shield,
    resources: [
      { name: "PTSD Foundation", description: "Resources and support for trauma survivors", url: "https://ptsd.va.gov" },
      { name: "RAINN", description: "Sexual assault resources and hotline", url: "https://rainn.org" },
      { name: "The National Child Traumatic Stress Network", description: "Childhood trauma resources", url: "https://nctsn.org" },
      { name: "Sidran Institute", description: "Traumatic stress education and advocacy", url: "https://sidran.org" }
    ]
  },
  {
    title: "Anxiety & Depression",
    icon: Sparkles,
    resources: [
      { name: "Anxiety & Depression Association", description: "Education, resources, and therapist finder", url: "https://adaa.org" },
      { name: "Depression and Bipolar Support Alliance", description: "Peer support and education", url: "https://dbsalliance.org" },
      { name: "Calm Clinic", description: "Free anxiety tests and education", url: "https://calmclinic.com" },
      { name: "Mind (UK)", description: "Mental health information and support", url: "https://mind.org.uk" }
    ]
  },
  {
    title: "Meditation & Mindfulness",
    icon: Headphones,
    resources: [
      { name: "Insight Timer", description: "Free meditation app with thousands of guided sessions", url: "https://insighttimer.com" },
      { name: "UCLA Mindful Awareness", description: "Free guided meditations", url: "https://uclahealth.org/marc/mindful-meditations" },
      { name: "Palouse Mindfulness", description: "Free online MBSR course", url: "https://palousemindfulness.com" },
      { name: "Tara Brach", description: "Free talks and guided meditations", url: "https://tarabrach.com" }
    ]
  },
  {
    title: "Self-Help Books",
    icon: BookOpen,
    resources: [
      { name: "The Body Keeps the Score", description: "Bessel van der Kolk on trauma and healing", url: "https://besselvanderkolk.com" },
      { name: "Self-Compassion", description: "Kristin Neff on kindness toward yourself", url: "https://self-compassion.org" },
      { name: "Attached", description: "Amir Levine on attachment styles in relationships", url: "" },
      { name: "Feeling Good", description: "David Burns on cognitive behavioral therapy", url: "" }
    ]
  }
];

const specializedResources = [
  { name: "The Trevor Project", description: "LGBTQ+ youth crisis support", icon: Heart, phone: "1-866-488-7386" },
  { name: "National Domestic Violence Hotline", description: "Support for domestic abuse", icon: Shield, phone: "1-800-799-7233" },
  { name: "National Eating Disorders Association", description: "Eating disorder support", icon: Sparkles, phone: "1-800-931-2237" },
  { name: "Veterans Crisis Line", description: "Mental health support for veterans", icon: Shield, phone: "988, Press 1" }
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen hero-gradient">
      <div className="content-wrapper py-8">
        <div className="max-w-5xl mx-auto">
          <header className="mb-8">
            <Link href="/wellness-hub" className="inline-flex items-center gap-2 text-body-sm text-[var(--sage-500)] hover:text-[var(--teal-600)] mb-4 transition" data-testid="link-back">
              <ArrowLeft className="h-4 w-4" /> Back to Wellness Hub
            </Link>
            <div className="flex items-center gap-3">
              <div className="icon-container icon-xl icon-gradient-teal">
                <Globe className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-display-lg" style={{ color: 'var(--glp-sage-deep)' }} data-testid="text-page-title">Professional Resources</h1>
                <p className="text-lead">Curated directory of mental health support and professional services</p>
              </div>
            </div>
          </header>

          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-6 w-6" style={{ color: 'var(--glp-rose)' }} />
              <h2 className="text-heading-md" style={{ color: 'var(--glp-rose-dark)' }}>Crisis Resources</h2>
            </div>
            <p className="text-body-sm mb-4" style={{ color: 'var(--glp-sage)' }}>
              If you or someone you know is in immediate danger, please call 911 or go to your nearest emergency room.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {crisisResources.map((resource, index) => (
                <div 
                  key={index}
                  className="card-bordered p-5 rounded-xl"
                  style={{ background: 'var(--glp-rose-15)', border: '1px solid var(--glp-blush)' }}
                  data-testid={`card-crisis-${index}`}
                >
                  <h3 className="font-semibold mb-2" style={{ color: 'var(--glp-ink)' }}>{resource.name}</h3>
                  <p className="text-sm mb-3" style={{ color: 'var(--glp-sage)' }}>{resource.description}</p>
                  <div className="space-y-2">
                    {resource.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4" style={{ color: 'var(--glp-rose)' }} />
                        <a href={`tel:${resource.phone}`} className="font-medium hover:underline" style={{ color: 'var(--glp-rose-dark)' }}>
                          {resource.phone}
                        </a>
                      </div>
                    )}
                    {resource.text && (
                      <div className="flex items-center gap-2 text-sm">
                        <MessageSquare className="h-4 w-4" style={{ color: 'var(--glp-rose)' }} />
                        <span style={{ color: 'var(--glp-sage)' }}>{resource.text}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4" style={{ color: 'var(--glp-rose)' }} />
                      <span style={{ color: 'var(--glp-sage)' }}>{resource.available}</span>
                    </div>
                    {resource.website && (
                      <a 
                        href={resource.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm hover:underline"
                        style={{ color: 'var(--glp-rose-dark)' }}
                      >
                        Visit Website <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-heading-md mb-4" style={{ color: 'var(--glp-sage-deep)' }}>Specialized Support Lines</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {specializedResources.map((resource, index) => (
                <div 
                  key={index}
                  className="card-bordered flex items-start gap-4 p-5 rounded-xl"
                  style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-15)' }}
                  data-testid={`card-specialized-${index}`}
                >
                  <resource.icon className="h-6 w-6 flex-shrink-0" style={{ color: 'var(--glp-sage-deep)' }} />
                  <div>
                    <h3 className="font-semibold" style={{ color: 'var(--glp-ink)' }}>{resource.name}</h3>
                    <p className="text-sm mb-2" style={{ color: 'var(--glp-sage)' }}>{resource.description}</p>
                    <a href={`tel:${resource.phone.replace(/[^0-9]/g, '')}`} className="text-sm font-medium hover:underline" style={{ color: 'var(--glp-teal)' }}>
                      {resource.phone}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-heading-md mb-6" style={{ color: 'var(--glp-sage-deep)' }}>Resource Directory</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {resourceCategories.map((category, index) => (
                <div 
                  key={index}
                  className="card-bordered p-5 rounded-xl"
                  style={{ background: 'var(--glp-sage-10)', border: '1px solid var(--glp-sage-15)' }}
                  data-testid={`card-category-${index}`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <category.icon className="h-6 w-6" style={{ color: 'var(--glp-sage-deep)' }} />
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--glp-ink)' }}>{category.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {category.resources.map((resource, idx) => (
                      <li key={idx}>
                        {resource.url ? (
                          <a 
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group"
                          >
                            <p className="font-medium transition flex items-center gap-1" style={{ color: 'var(--glp-ink)' }}>
                              {resource.name}
                              <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition" />
                            </p>
                            <p className="text-sm" style={{ color: 'var(--glp-sage)' }}>{resource.description}</p>
                          </a>
                        ) : (
                          <div>
                            <p className="font-medium" style={{ color: 'var(--glp-ink)' }}>{resource.name}</p>
                            <p className="text-sm" style={{ color: 'var(--glp-sage)' }}>{resource.description}</p>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <div className="card-bordered p-5 rounded-xl" style={{ background: 'var(--glp-teal-50)', border: '1px solid var(--glp-teal)' }}>
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 flex-shrink-0 mt-1" style={{ color: 'var(--glp-teal)' }} />
                <div>
                  <h3 className="font-semibold mb-2" style={{ color: 'var(--glp-ink)' }}>Finding Local Support</h3>
                  <p className="text-sm mb-3" style={{ color: 'var(--glp-sage)' }}>
                    Many communities offer local resources including community mental health centers, 
                    peer support groups, and sliding-scale therapy options. Contact your local health 
                    department or community center for information about services in your area.
                  </p>
                  <p className="text-sm" style={{ color: 'var(--glp-sage)' }}>
                    Your primary care doctor can also provide referrals to mental health specialists 
                    and may be covered by your insurance.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <SafetyFooter variant="prominent" />
        </div>
      </div>
    </div>
  );
}
