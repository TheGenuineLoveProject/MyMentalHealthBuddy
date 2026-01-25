import { Link } from "wouter";
import SafetyFooter from "../components/ui/SafetyFooter";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import { 
  ArrowLeft, 
  BookOpen, 
  Brain, 
  Heart, 
  Sparkles, 
  ExternalLink,
  FileText,
  Microscope,
  GraduationCap,
  Activity,
  Users,
  Shield,
  Lightbulb,
  TrendingUp
} from "lucide-react";
import { SEO } from "@/components/SEO";

const researchCategories = [
  {
    id: "neuroscience",
    title: "Neuroscience of Healing",
    icon: Brain,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    findings: [
      {
        title: "Neuroplasticity",
        summary: "The brain can physically rewire itself throughout life. New neural pathways can be formed through repeated practice and experience.",
        implications: "This means healing is always possible—your brain can literally change structure and function through consistent practices like mindfulness, therapy, and healthy habits.",
        sources: ["Pascual-Leone et al., 2005", "Doidge, 2007 - 'The Brain That Changes Itself'"]
      },
      {
        title: "Polyvagal Theory",
        summary: "Dr. Stephen Porges' research shows how the vagus nerve regulates our sense of safety and our stress responses (fight, flight, freeze).",
        implications: "Understanding your nervous system states helps you choose appropriate calming techniques and explains why social connection is essential for healing.",
        sources: ["Porges, 2011 - 'The Polyvagal Theory'", "Dana, 2018 - 'The Polyvagal Theory in Therapy'"]
      },
      {
        title: "Memory Reconsolidation",
        summary: "When memories are activated, they become temporarily malleable and can be updated with new emotional information.",
        implications: "Traumatic memories can be reprocessed in a safe therapeutic context, reducing their emotional charge. This is the basis for treatments like EMDR.",
        sources: ["Ecker et al., 2012 - 'Unlocking the Emotional Brain'", "Nader et al., 2000"]
      }
    ]
  },
  {
    id: "mindfulness",
    title: "Mindfulness & Meditation",
    icon: Sparkles,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    findings: [
      {
        title: "8-Week MBSR Programs",
        summary: "Mindfulness-Based Stress Reduction (MBSR) has been extensively studied. 8 weeks of practice shows measurable changes in brain structure and function.",
        implications: "Regular mindfulness practice increases gray matter in areas related to learning, memory, and emotional regulation, while decreasing the amygdala (stress center).",
        sources: ["Hölzel et al., 2011 - Harvard/Mass General study", "Kabat-Zinn, 1990 - 'Full Catastrophe Living'"]
      },
      {
        title: "Meditation and Anxiety",
        summary: "Meta-analyses show meditation reduces anxiety with effect sizes comparable to antidepressant medications for some populations.",
        implications: "Meditation is a valid, evidence-based intervention for anxiety that can be practiced independently and has no side effects.",
        sources: ["Goyal et al., 2014 - JAMA Internal Medicine", "Hofmann et al., 2010"]
      },
      {
        title: "Loving-Kindness Meditation",
        summary: "Research shows LKM increases positive emotions, social connection, and even changes activity in brain regions related to empathy.",
        implications: "Practicing goodwill toward yourself and others has measurable psychological and neurological benefits.",
        sources: ["Fredrickson et al., 2008", "Klimecki et al., 2013"]
      }
    ]
  },
  {
    id: "trauma",
    title: "Trauma & Recovery",
    icon: Shield,
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-50 dark:bg-rose-900/20",
    findings: [
      {
        title: "The Body Keeps the Score",
        summary: "Dr. Bessel van der Kolk's decades of research show trauma is stored in the body, not just the mind. Body-based therapies are essential.",
        implications: "Healing must include the body through practices like yoga, EMDR, somatic experiencing, and breathwork—talk therapy alone is often insufficient.",
        sources: ["van der Kolk, 2014 - 'The Body Keeps the Score'", "Price & Hooven, 2018"]
      },
      {
        title: "Post-Traumatic Growth",
        summary: "Research shows many trauma survivors experience significant positive change—improved relationships, new possibilities, personal strength, spiritual growth.",
        implications: "Trauma doesn't define you. Many people not only recover but grow beyond their pre-trauma functioning.",
        sources: ["Tedeschi & Calhoun, 2004", "Joseph, 2011 - 'What Doesn't Kill Us'"]
      },
      {
        title: "ACEs and Resilience",
        summary: "Adverse Childhood Experiences (ACEs) increase health risks, but protective factors and healing relationships can mitigate these effects.",
        implications: "While early adversity has real impacts, resilience can be built at any age through supportive relationships and healthy practices.",
        sources: ["Felitti et al., 1998 - ACE Study", "Harris, 2018 - 'The Deepest Well'"]
      }
    ]
  },
  {
    id: "positive-psych",
    title: "Positive Psychology",
    icon: Heart,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    findings: [
      {
        title: "Gratitude Research",
        summary: "Regularly practicing gratitude (as little as writing 3 things weekly) significantly increases happiness and life satisfaction.",
        implications: "Simple gratitude practices are among the most effective, accessible interventions for improving wellbeing.",
        sources: ["Emmons & McCullough, 2003", "Seligman et al., 2005"]
      },
      {
        title: "Self-Compassion",
        summary: "Dr. Kristin Neff's research shows self-compassion is more psychologically beneficial than self-esteem and protects against anxiety and depression.",
        implications: "Being kind to yourself isn't weak—it's a research-backed path to resilience and emotional health.",
        sources: ["Neff, 2011 - 'Self-Compassion'", "MacBeth & Gumley, 2012"]
      },
      {
        title: "Flow States",
        summary: "Csikszentmihalyi's research on 'flow'—complete absorption in meaningful activity—shows it's a key component of happiness.",
        implications: "Engaging in challenging activities that match your skills leads to fulfillment. Seek flow experiences in work and hobbies.",
        sources: ["Csikszentmihalyi, 1990 - 'Flow'", "Nakamura & Csikszentmihalyi, 2002"]
      }
    ]
  },
  {
    id: "connection",
    title: "Social Connection",
    icon: Users,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    findings: [
      {
        title: "Loneliness & Health",
        summary: "Loneliness increases mortality risk comparable to smoking 15 cigarettes daily. Social connection is a fundamental human need.",
        implications: "Prioritizing relationships is not optional—it's as important as exercise and nutrition for physical health.",
        sources: ["Holt-Lunstad et al., 2015", "Cacioppo & Patrick, 2008"]
      },
      {
        title: "Co-Regulation",
        summary: "Our nervous systems are designed to regulate through connection with others. Safe relationships literally calm our biology.",
        implications: "Healing often requires safe relationships—with therapists, friends, family, or community. We cannot fully heal in isolation.",
        sources: ["Porges, 2011", "Siegel, 2012 - 'The Developing Mind'"]
      },
      {
        title: "Attachment Theory",
        summary: "Early attachment patterns shape adult relationships, but 'earned secure attachment' is possible through healing relationships.",
        implications: "Your attachment style isn't fixed. Therapy and healthy relationships can help you develop secure attachment patterns.",
        sources: ["Bowlby, 1988", "Levine & Heller, 2010 - 'Attached'"]
      }
    ]
  },
  {
    id: "somatic",
    title: "Somatic & Body-Based",
    icon: Activity,
    color: "text-indigo-600 dark:text-indigo-400",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    findings: [
      {
        title: "Breathwork Effects",
        summary: "Controlled breathing directly affects the autonomic nervous system. The physiological sigh (double inhale, long exhale) rapidly reduces stress.",
        implications: "Breath is the fastest way to shift your nervous system state. Specific patterns produce specific effects.",
        sources: ["Huberman Lab, Stanford", "Brown & Gerbarg, 2012"]
      },
      {
        title: "Yoga for Mental Health",
        summary: "Research shows yoga reduces symptoms of PTSD, depression, and anxiety, often as effectively as medication or therapy.",
        implications: "Mind-body practices like yoga are valid, evidence-based treatments that work through the body to heal the mind.",
        sources: ["van der Kolk et al., 2014", "Cramer et al., 2013"]
      },
      {
        title: "Interoception",
        summary: "The ability to sense internal body states (heartbeat, breath, hunger) is linked to emotional awareness and regulation.",
        implications: "Improving body awareness through practices like body scanning enhances emotional intelligence and self-regulation.",
        sources: ["Craig, 2015", "Price & Hooven, 2018"]
      }
    ]
  }
];

const keyBooks = [
  { title: "The Body Keeps the Score", author: "Bessel van der Kolk, MD", topic: "Trauma" },
  { title: "Self-Compassion", author: "Kristin Neff, PhD", topic: "Self-Care" },
  { title: "The Polyvagal Theory in Therapy", author: "Deb Dana, LCSW", topic: "Nervous System" },
  { title: "Attached", author: "Amir Levine, MD & Rachel Heller", topic: "Relationships" },
  { title: "Full Catastrophe Living", author: "Jon Kabat-Zinn, PhD", topic: "Mindfulness" },
  { title: "Man's Search for Meaning", author: "Viktor Frankl, MD, PhD", topic: "Purpose" }
];

export default function ResearchEvidencePage() {
  return (
  <WellnessPageShell
    title="ResearchEvidencePage"
    subtitle="Educational reflection tools. Choose what feels safe and supportive."
    benefits={pickBenefits(["Agency","Calm","Clarity","Self-respect","Your pace"], 5)}
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
      <SEO title="Research Evidence — The Genuine Love Project" description="Evidence-based foundations for our approaches." />


    <div className="min-h-screen hero-gradient">
      <div className="content-wrapper py-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <Link href="/wellness-hub" className="inline-flex items-center gap-2 text-body-sm text-[var(--sage-500)] hover:text-[var(--teal-600)] mb-4 transition" data-testid="link-back">
              <ArrowLeft className="h-4 w-4" /> Back to Wellness Hub
            </Link>
            <div className="flex items-center gap-3">
              <div className="icon-container icon-xl icon-gradient-teal">
                <Microscope className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-display-lg text-teal" data-testid="text-page-title">Research & Evidence</h1>
                <p className="text-lead">The science behind our healing practices</p>
              </div>
            </div>
          </header>

          <div className="card-bordered mb-8 bg-blue-50 dark:bg-blue-900/20">
            <div className="flex items-start gap-4">
              <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Evidence-Based Healing</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Every tool and practice on The Genuine Love Project is grounded in scientific research. We draw from 
                  neuroscience, psychology, somatic therapy, and contemplative traditions—all validated by peer-reviewed studies. 
                  Understanding the evidence empowers you to trust the process and engage more fully with your healing journey.
                </p>
              </div>
            </div>
          </div>

          <section className="mb-10">
            <h2 className="text-heading-md text-teal mb-4">Recommended Reading</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {keyBooks.map((book, index) => (
                <div 
                  key={index}
                  className="card-bordered text-center p-4"
                  data-testid={`card-book-${index}`}
                >
                  <BookOpen className="h-6 w-6 mx-auto mb-2 text-[var(--teal-600)]" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">{book.title}</p>
                  <p className="text-xs text-[var(--sage-500)] mt-1">{book.author}</p>
                  <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-[var(--sage-100)] text-[var(--sage-600)]">
                    {book.topic}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <div className="space-y-8">
            {researchCategories.map(category => (
              <section key={category.id} className={`card-bordered ${category.bgColor}`}>
                <div className="flex items-center gap-3 mb-6">
                  <category.icon className={`h-8 w-8 ${category.color}`} />
                  <h2 className="text-heading-lg text-gray-900 dark:text-white">{category.title}</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {category.findings.map((finding, index) => (
                    <div 
                      key={index}
                      className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700"
                      data-testid={`card-finding-${category.id}-${index}`}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Lightbulb className={`h-5 w-5 ${category.color}`} />
                        <h3 className="font-semibold text-gray-900 dark:text-white">{finding.title}</h3>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-medium text-[var(--sage-500)] mb-1">Research Finding:</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{finding.summary}</p>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                          <p className="text-xs font-medium text-[var(--sage-500)] mb-1">What This Means For You:</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{finding.implications}</p>
                        </div>
                        
                        <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                          <p className="text-xs text-[var(--sage-500)]">
                            <FileText className="h-3 w-3 inline mr-1" />
                            {finding.sources.join(" • ")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <section className="mt-10 card-bordered">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="h-6 w-6 text-[var(--teal-600)]" />
              <h2 className="text-heading-md text-teal">Key Takeaways</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center text-sm font-medium">1</span>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Healing is possible at any age</strong> thanks to neuroplasticity—your brain can change and grow throughout life.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center text-sm font-medium">2</span>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>The body must be included</strong> in healing from trauma and stress—it's not just a mental process.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center text-sm font-medium">3</span>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Mindfulness and self-compassion</strong> are validated by rigorous research as effective mental health interventions.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 flex items-center justify-center text-sm font-medium">4</span>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Connection is not optional</strong>—safe relationships are essential for nervous system regulation and healing.
                </p>
              </div>
            </div>
          </section>

          <SafetyFooter variant="default" />
        </div>
      </div>
    </div>
  </WellnessPageShell>
  );
}
