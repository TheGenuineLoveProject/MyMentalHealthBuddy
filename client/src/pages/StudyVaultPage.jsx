import { useState } from "react";
import { Link } from "wouter";
import { 
  BookOpen, ChevronLeft, Search, Info,
  Brain, Heart, Shield, Sparkles, Users, Lightbulb, Phone
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SafetyFooter from "@/components/ui/SafetyFooter";
import { useReadingLevel } from "@/context/ReadingLevelContext";
import Microcopy from "@/components/Microcopy";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import { SEO } from "@/components/SEO";

const RESEARCH_TOPICS = [
  {
    id: "trauma",
    title: "Understanding Trauma",
    icon: Shield,
    summary: "Trauma is the lasting emotional response to deeply distressing events. It affects the nervous system and can influence behavior, relationships, and well-being.",
    keyPoints: [
      "Trauma responses are normal reactions to abnormal situations",
      "The body keeps score of traumatic experiences",
      "Healing is possible through evidence-based approaches",
      "Safety and trust are foundational to recovery",
    ],
    sources: [
      { title: "The Body Keeps the Score - Bessel van der Kolk, MD", type: "Book" },
      { title: "SAMHSA Trauma-Informed Care", type: "Resource" },
      { title: "National Institute of Mental Health", type: "Research" },
    ],
  },
  {
    id: "attachment",
    title: "Attachment Theory",
    icon: Heart,
    summary: "Attachment theory explains how early relationships with caregivers shape our patterns of connecting with others throughout life.",
    keyPoints: [
      "Secure attachment provides a foundation for healthy relationships",
      "Attachment styles can be understood and modified",
      "Earned secure attachment is achievable in adulthood",
      "Understanding your pattern is the first step to change",
    ],
    sources: [
      { title: "Attached - Amir Levine & Rachel Heller", type: "Book" },
      { title: "John Bowlby's Attachment Research", type: "Research" },
      { title: "Mary Ainsworth's Strange Situation Study", type: "Research" },
    ],
  },
  {
    id: "nervous-system",
    title: "Nervous System Regulation",
    icon: Brain,
    summary: "The autonomic nervous system governs our stress responses. Understanding and regulating it is key to emotional well-being.",
    keyPoints: [
      "Polyvagal theory explains our social engagement system",
      "Co-regulation with safe others helps us heal",
      "Simple practices can shift nervous system states",
      "Interoception builds self-awareness",
    ],
    sources: [
      { title: "The Polyvagal Theory - Stephen Porges", type: "Book" },
      { title: "Deb Dana's Polyvagal Exercises", type: "Resource" },
      { title: "Somatic Experiencing - Peter Levine", type: "Method" },
    ],
  },
  {
    id: "self-compassion",
    title: "Self-Compassion",
    icon: Sparkles,
    summary: "Self-compassion involves treating yourself with the same kindness you would offer a good friend during difficult times.",
    keyPoints: [
      "Self-compassion is more effective than self-criticism",
      "Common humanity reminds us we're not alone",
      "Mindfulness helps us observe without judgment",
      "Self-kindness replaces harsh self-talk",
    ],
    sources: [
      { title: "Self-Compassion - Kristin Neff, PhD", type: "Book" },
      { title: "Mindful Self-Compassion Program", type: "Program" },
      { title: "Christopher Germer's Research", type: "Research" },
    ],
  },
  {
    id: "relationships",
    title: "Healthy Relationships",
    icon: Users,
    summary: "Research-backed principles for building and maintaining meaningful connections with others.",
    keyPoints: [
      "Gottman's research identifies key relationship patterns",
      "Repair attempts are more important than avoiding conflict",
      "Emotional bids require recognition and response",
      "Vulnerability builds deeper connection",
    ],
    sources: [
      { title: "The Gottman Institute Research", type: "Research" },
      { title: "Hold Me Tight - Sue Johnson", type: "Book" },
      { title: "Brené Brown's Vulnerability Research", type: "Research" },
    ],
  },
  {
    id: "meaning",
    title: "Meaning & Purpose",
    icon: Lightbulb,
    summary: "Finding meaning and purpose contributes significantly to psychological well-being and resilience.",
    keyPoints: [
      "Meaning can be found even in suffering",
      "Purpose is linked to longevity and well-being",
      "Values clarification guides meaningful living",
      "Contribution to others enhances personal meaning",
    ],
    sources: [
      { title: "Man's Search for Meaning - Viktor Frankl", type: "Book" },
      { title: "Ikigai Research", type: "Research" },
      { title: "ACT Values Work", type: "Method" },
    ],
  },
  {
    id: "mindfulness",
    title: "Mindfulness & Meditation",
    icon: Brain,
    summary: "Mindfulness is the practice of present-moment awareness without judgment. Research shows it reduces stress, anxiety, and depression.",
    keyPoints: [
      "8 weeks of practice can change brain structure",
      "Mindfulness reduces rumination and worry",
      "Brief daily practice is more effective than occasional long sessions",
      "Mindfulness enhances emotional regulation",
      "It increases gray matter in areas related to learning and memory",
    ],
    sources: [
      { title: "Full Catastrophe Living - Jon Kabat-Zinn", type: "Book" },
      { title: "Harvard Mindfulness Research", type: "Research" },
      { title: "MBSR (Mindfulness-Based Stress Reduction)", type: "Program" },
      { title: "Wherever You Go, There You Are - Jon Kabat-Zinn", type: "Book" },
    ],
  },
  {
    id: "resilience",
    title: "Building Resilience",
    icon: Shield,
    summary: "Resilience is the ability to adapt and recover from adversity. It's not a fixed trait—it can be developed through intentional practice.",
    keyPoints: [
      "Resilience involves flexibility, not just toughness",
      "Social support is the strongest predictor of resilience",
      "Post-traumatic growth is possible and common",
      "Small daily practices build resilience over time",
      "Self-care is not selfish—it's foundational",
    ],
    sources: [
      { title: "Option B - Sheryl Sandberg & Adam Grant", type: "Book" },
      { title: "American Psychological Association Resilience Guide", type: "Resource" },
      { title: "The Resilience Factor - Karen Reivich", type: "Book" },
    ],
  },
  {
    id: "grief",
    title: "Understanding Grief",
    icon: Heart,
    summary: "Grief is a natural response to loss. It's not linear, and there's no right way to grieve.",
    keyPoints: [
      "The five stages model is descriptive, not prescriptive",
      "Grief can be triggered by many types of loss",
      "Continuing bonds theory suggests ongoing connection is healthy",
      "Grief has no timeline—it changes but doesn't disappear",
      "Community support is essential during grief",
    ],
    sources: [
      { title: "It's OK That You're Not OK - Megan Devine", type: "Book" },
      { title: "Continuing Bonds Research - Dennis Klass", type: "Research" },
      { title: "On Grief and Grieving - Elisabeth Kübler-Ross", type: "Book" },
    ],
  },
  {
    id: "boundaries",
    title: "Setting Healthy Boundaries",
    icon: Shield,
    summary: "Boundaries are limits that protect your well-being. They're essential for healthy relationships and self-respect.",
    keyPoints: [
      "Boundaries are about your behavior, not controlling others",
      "Clear boundaries reduce resentment and burnout",
      "It's okay to change your boundaries as you grow",
      "Guilt after setting boundaries is normal but not a sign you're wrong",
      "Practice makes boundaries feel more natural",
    ],
    sources: [
      { title: "Set Boundaries, Find Peace - Nedra Glover Tawwab", type: "Book" },
      { title: "Boundaries - Henry Cloud & John Townsend", type: "Book" },
      { title: "The Dance of Anger - Harriet Lerner", type: "Book" },
    ],
  },
  {
    id: "inner-child",
    title: "Inner Child Work",
    icon: Sparkles,
    summary: "Inner child work involves healing emotional wounds from childhood by reconnecting with and nurturing your younger self.",
    keyPoints: [
      "Unmet childhood needs affect adult behavior",
      "Reparenting yourself is possible and healing",
      "Inner child work complements other therapeutic approaches",
      "Compassion for your younger self promotes self-acceptance",
      "Play and creativity can reconnect you with your inner child",
    ],
    sources: [
      { title: "Homecoming - John Bradshaw", type: "Book" },
      { title: "The Child in You - Stefanie Stahl", type: "Book" },
      { title: "Internal Family Systems - Richard Schwartz", type: "Method" },
    ],
  },
  {
    id: "somatic",
    title: "Somatic Healing",
    icon: Brain,
    summary: "Somatic approaches recognize that trauma and stress are stored in the body, not just the mind. Healing involves the whole person.",
    keyPoints: [
      "The body holds memories the mind may not access",
      "Shaking and trembling can release stored stress",
      "Breathwork directly affects the nervous system",
      "Movement helps process stuck emotions",
      "Body awareness (interoception) supports emotional regulation",
    ],
    sources: [
      { title: "Waking the Tiger - Peter Levine", type: "Book" },
      { title: "The Body Keeps the Score - Bessel van der Kolk", type: "Book" },
      { title: "Somatic Experiencing International", type: "Resource" },
      { title: "In an Unspoken Voice - Peter Levine", type: "Book" },
    ],
  },
  {
    id: "shame",
    title: "Healing Shame",
    icon: Heart,
    summary: "Shame is the painful feeling that something is fundamentally wrong with us. Unlike guilt, which says 'I did something bad,' shame says 'I am bad.' Healing shame is central to emotional wellness.",
    keyPoints: [
      "Shame thrives in secrecy and silence",
      "Empathy is the antidote to shame",
      "Shame resilience can be developed",
      "Distinguishing shame from guilt is liberating",
      "Perfectionism is often a shame-based coping mechanism",
    ],
    sources: [
      { title: "Daring Greatly - Brené Brown", type: "Book" },
      { title: "Healing the Shame That Binds You - John Bradshaw", type: "Book" },
      { title: "Shame and Guilt - June Tangney", type: "Research" },
      { title: "The Gifts of Imperfection - Brené Brown", type: "Book" },
    ],
  },
  {
    id: "anxiety",
    title: "Understanding Anxiety",
    icon: Shield,
    summary: "Anxiety is the body's natural alarm system. While uncomfortable, it evolved to protect us. Understanding anxiety helps reduce its grip.",
    keyPoints: [
      "Anxiety is your nervous system trying to keep you safe",
      "Avoidance maintains and strengthens anxiety",
      "Anxiety thoughts are not facts",
      "The body's fight-or-flight response is temporary",
      "Exposure and acceptance reduce anxiety over time",
    ],
    sources: [
      { title: "The Anxiety and Phobia Workbook - Edmund Bourne", type: "Book" },
      { title: "Dare: The New Way to End Anxiety - Barry McDonagh", type: "Book" },
      { title: "Acceptance and Commitment Therapy Research", type: "Research" },
      { title: "Anxiety and Depression Association of America", type: "Resource" },
    ],
  },
  {
    id: "inner-critic",
    title: "Transforming the Inner Critic",
    icon: Sparkles,
    summary: "The inner critic is the harsh internal voice that judges and criticizes us. While it often developed as protection, learning to work with it can transform self-relationship.",
    keyPoints: [
      "The inner critic often formed to protect us from external criticism",
      "Harsh self-talk activates the threat system",
      "The inner critic isn't your true voice",
      "Compassionate reframes can quiet the critic",
      "Internal Family Systems views critics as protective parts",
    ],
    sources: [
      { title: "Self-Therapy - Jay Earley", type: "Book" },
      { title: "Taming Your Gremlin - Rick Carson", type: "Book" },
      { title: "The Mindful Path to Self-Compassion - Christopher Germer", type: "Book" },
      { title: "IFS Institute Research", type: "Resource" },
    ],
  },
];

const WHAT_WE_BELIEVE = [
  {
    belief: "Healing is possible",
    why: "Decades of neuroscience research confirm neuroplasticity - the brain's ability to change and heal throughout life.",
  },
  {
    belief: "You are the expert on your own life",
    why: "While we provide tools and frameworks, you hold the wisdom about what works for you.",
  },
  {
    belief: "Trauma-informed approaches matter",
    why: "Understanding how trauma affects the mind-body system leads to more effective and compassionate support.",
  },
  {
    belief: "Evidence-based tools work",
    why: "We draw from established therapeutic modalities like CBT, DBT, ACT, IFS, and somatic approaches.",
  },
  {
    belief: "Connection is medicine",
    why: "Research consistently shows that safe relationships are central to healing and well-being.",
  },
  {
    belief: "This is not medical advice",
    why: "We're a wellness resource, not a replacement for professional mental health care. When in crisis, please seek professional support.",
  },
];

const HERO_COPY = {
  beginner: {
    title: "Study Vault",
    subtitle: "Easy-to-read research summaries.",
    helperLine: "Take what helps. Leave the rest."
  },
  intermediate: {
    title: "Study Vault",
    subtitle: "Evidence-based summaries for your healing journey.",
    helperLine: "Explore research at your own pace."
  },
  advanced: {
    title: "Study Vault",
    subtitle: "Curated research from neuroscience, psychology, and trauma-informed care.",
    helperLine: "Dive deeper into the science behind healing."
  }
};

export default function StudyVaultPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [activeTab, setActiveTab] = useState("topics");
  const { readingLevel } = useReadingLevel();
  const heroCopy = HERO_COPY[readingLevel] || HERO_COPY.beginner;

  const filteredTopics = RESEARCH_TOPICS.filter(topic =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeTopic = RESEARCH_TOPICS.find(t => t.id === selectedTopic);

  return (
  <WellnessPageShell
    title="StudyVaultPage"
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
      <SEO title="Study Vault — The Genuine Love Project" description="Research and evidence supporting our approach." />


    <div className="min-h-screen hero-gradient">
      <div className="content-wrapper py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="text-[var(--glp-sage)] hover:text-[var(--glp-sage-deep)]" data-testid="button-back">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--glp-sage-15)' }}>
                  <BookOpen className="w-5 h-5" style={{ color: 'var(--glp-sage-deep)' }} />
                </div>
                <h1 className="text-2xl font-semibold" style={{ color: 'var(--glp-sage-deep)' }} data-testid="text-page-title">
                  {heroCopy.title}
                </h1>
              </div>
              <p className="text-[var(--glp-ink)]/70">{heroCopy.subtitle}</p>
              {heroCopy.helperLine && (
                <p className="text-sm italic mt-1" style={{ color: 'var(--glp-sage)' }}>{heroCopy.helperLine}</p>
              )}
            </div>
          </div>

          <p className="text-center text-sm text-[var(--glp-ink)]/60 italic mb-6">
            <Microcopy slot="consent" seed="study-vault" as="span" />
          </p>

          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-8 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">Educational Resource Only</p>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                This content is for educational purposes and is not medical or therapeutic advice. 
                Please consult qualified professionals for personalized care.
              </p>
            </div>
          </div>

          <div className="rounded-xl p-4 mb-8" style={{ background: 'var(--glp-rose-15)', border: '1px solid var(--glp-rose-20)' }} data-testid="section-crisis-support">
            <div className="flex items-center gap-2 mb-2">
              <Phone className="w-4 h-4" style={{ color: 'var(--glp-rose)' }} />
              <span className="font-medium text-sm" style={{ color: 'var(--glp-rose)' }}>Crisis Support</span>
            </div>
            <p className="text-sm" style={{ color: 'var(--glp-ink)' }}>
              If you're in crisis, please reach out: <strong>988</strong> (Suicide & Crisis Lifeline) or text <strong>HOME</strong> to <strong>741741</strong>.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="topics" data-testid="tab-topics">Research Topics</TabsTrigger>
              <TabsTrigger value="beliefs" data-testid="tab-beliefs">What We Believe</TabsTrigger>
            </TabsList>

            <TabsContent value="topics">
              <div className="mb-6">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--glp-ink)]/40" />
                  <Input
                    placeholder="Search topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    data-testid="input-search"
                  />
                </div>
              </div>

              {selectedTopic && activeTopic ? (
                <div className="space-y-6">
                  <Button variant="ghost" onClick={() => setSelectedTopic(null)} data-testid="button-back-topics">
                    <ChevronLeft className="w-4 h-4 mr-2" /> Back to Topics
                  </Button>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        {(() => { const Icon = activeTopic.icon; return <Icon className="w-6 h-6" style={{ color: 'var(--glp-sage-deep)' }} />; })()}
                        {activeTopic.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <p className="text-lg">{activeTopic.summary}</p>
                      
                      <div>
                        <h3 className="font-semibold mb-3">Key Points</h3>
                        <ul className="space-y-2">
                          {activeTopic.keyPoints.map((point, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: 'var(--glp-sage)' }} />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-3">Sources & Further Reading</h3>
                        <div className="space-y-2">
                          {activeTopic.sources.map((source, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--glp-sage-10)' }}>
                              <div className="flex items-center gap-3">
                                <BookOpen className="w-4 h-4" style={{ color: 'var(--glp-sage)' }} />
                                <span className="text-sm">{source.title}</span>
                              </div>
                              <span className="text-xs px-2 py-1 rounded" style={{ background: 'var(--glp-sage-15)', color: 'var(--glp-sage-deep)' }}>{source.type}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTopics.map((topic) => {
                    const Icon = topic.icon;
                    return (
                      <Card 
                        key={topic.id} 
                        className="cursor-pointer transition-colors"
                        style={{ border: '1px solid var(--glp-sage-15)' }}
                        onClick={() => setSelectedTopic(topic.id)}
                        data-testid={`card-topic-${topic.id}`}
                      >
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <Icon className="w-5 h-5" style={{ color: 'var(--glp-sage-deep)' }} />
                            {topic.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-[var(--glp-ink)]/70 line-clamp-3">{topic.summary}</p>
                          <p className="text-xs mt-2" style={{ color: 'var(--glp-sage)' }}>{topic.sources.length} sources</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="beliefs">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" style={{ color: 'var(--glp-sage-deep)' }} />
                    What We Believe & Why
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[var(--glp-ink)]/70 mb-6">
                    Transparency is core to our approach. Here's what guides The Genuine Love Project.
                  </p>
                  <div className="space-y-4">
                    {WHAT_WE_BELIEVE.map((item, idx) => (
                      <div key={idx} className="p-4 rounded-lg" style={{ background: 'var(--glp-sage-10)' }}>
                        <h3 className="font-semibold mb-1" style={{ color: 'var(--glp-sage-deep)' }}>{item.belief}</h3>
                        <p className="text-sm text-[var(--glp-ink)]/70">{item.why}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <SafetyFooter />
    </div>
  </WellnessPageShell>
  );
}
