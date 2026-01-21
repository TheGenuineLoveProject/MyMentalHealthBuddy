import { Link } from "wouter";
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
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
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
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-50 dark:bg-rose-900/20",
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
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
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
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
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
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-900/20",
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
    color: "text-indigo-600 dark:text-indigo-400",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    resources: [
      { name: "The Body Keeps the Score", description: "Bessel van der Kolk on trauma and healing", url: "https://besselvanderkolk.com" },
      { name: "Self-Compassion", description: "Kristin Neff on kindness toward yourself", url: "https://self-compassion.org" },
      { name: "Attached", description: "Amir Levine on attachment styles in relationships", url: "" },
      { name: "Feeling Good", description: "David Burns on cognitive behavioral therapy", url: "" }
    ]
  }
];

const specializedResources = [
  { name: "The Trevor Project", description: "LGBTQ+ youth crisis support", icon: Heart, phone: "1-866-488-7386", color: "text-pink-500" },
  { name: "National Domestic Violence Hotline", description: "Support for domestic abuse", icon: Shield, phone: "1-800-799-7233", color: "text-purple-500" },
  { name: "National Eating Disorders Association", description: "Eating disorder support", icon: Sparkles, phone: "1-800-931-2237", color: "text-green-500" },
  { name: "Veterans Crisis Line", description: "Mental health support for veterans", icon: Shield, phone: "988, Press 1", color: "text-blue-500" }
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
                <h1 className="text-display-lg text-teal" data-testid="text-page-title">Professional Resources</h1>
                <p className="text-lead">Curated directory of mental health support and professional services</p>
              </div>
            </div>
          </header>

          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-6 w-6 text-rose-500" />
              <h2 className="text-heading-md text-rose-600 dark:text-rose-400">Crisis Resources</h2>
            </div>
            <p className="text-body-sm text-[var(--sage-600)] mb-4">
              If you or someone you know is in immediate danger, please call 911 or go to your nearest emergency room.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {crisisResources.map((resource, index) => (
                <div 
                  key={index}
                  className="card-bordered bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800"
                  data-testid={`card-crisis-${index}`}
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{resource.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{resource.description}</p>
                  <div className="space-y-2">
                    {resource.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-rose-500" />
                        <a href={`tel:${resource.phone}`} className="font-medium text-rose-600 dark:text-rose-400 hover:underline">
                          {resource.phone}
                        </a>
                      </div>
                    )}
                    {resource.text && (
                      <div className="flex items-center gap-2 text-sm">
                        <MessageSquare className="h-4 w-4 text-rose-500" />
                        <span className="text-gray-700 dark:text-gray-300">{resource.text}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-rose-500" />
                      <span className="text-gray-600 dark:text-gray-400">{resource.available}</span>
                    </div>
                    {resource.website && (
                      <a 
                        href={resource.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-rose-600 dark:text-rose-400 hover:underline"
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
            <h2 className="text-heading-md text-teal mb-4">Specialized Support Lines</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {specializedResources.map((resource, index) => (
                <div 
                  key={index}
                  className="card-bordered flex items-start gap-4"
                  data-testid={`card-specialized-${index}`}
                >
                  <resource.icon className={`h-6 w-6 ${resource.color} flex-shrink-0`} />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{resource.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{resource.description}</p>
                    <a href={`tel:${resource.phone.replace(/[^0-9]/g, '')}`} className="text-sm font-medium text-[var(--teal-600)] hover:underline">
                      {resource.phone}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-heading-md text-teal mb-6">Resource Directory</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {resourceCategories.map((category, index) => (
                <div 
                  key={index}
                  className={`card-bordered ${category.bgColor}`}
                  data-testid={`card-category-${index}`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <category.icon className={`h-6 w-6 ${category.color}`} />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{category.title}</h3>
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
                            <p className="font-medium text-gray-900 dark:text-white group-hover:text-[var(--teal-600)] transition flex items-center gap-1">
                              {resource.name}
                              <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition" />
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{resource.description}</p>
                          </a>
                        ) : (
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{resource.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{resource.description}</p>
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
            <div className="card-bordered bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800">
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Finding Local Support</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                    Many communities offer local resources including community mental health centers, 
                    peer support groups, and sliding-scale therapy options. Contact your local health 
                    department or community center for information about services in your area.
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your primary care doctor can also provide referrals to mental health specialists 
                    and may be covered by your insurance.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <footer className="card-bordered bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
            <p className="text-sm text-amber-800 dark:text-amber-200 text-center">
              <strong>Disclaimer:</strong> This directory is provided for informational purposes only. 
              The Genuine Love Project is not affiliated with these organizations and does not provide 
              medical advice, diagnosis, or treatment. Always consult with qualified professionals for 
              your specific needs.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
