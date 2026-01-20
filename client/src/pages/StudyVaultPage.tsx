import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  BookOpen, ChevronLeft, Search, ExternalLink, Info,
  Brain, Heart, Shield, Sparkles, Users, Lightbulb
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

export default function StudyVaultPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("topics");

  const filteredTopics = RESEARCH_TOPICS.filter(topic =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeTopic = RESEARCH_TOPICS.find(t => t.id === selectedTopic);

  return (
    <div className="min-h-screen hero-gradient">
      <div className="content-wrapper py-8">
        <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="text-[var(--sage-500)] hover:text-[var(--teal-600)]" data-testid="button-back">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="icon-container icon-lg icon-gradient-sage">
                <BookOpen className="w-6 h-6" />
              </div>
              <h1 className="text-display-lg text-teal" data-testid="text-page-title">
                Study Vault
              </h1>
            </div>
            <p className="text-lead">Evidence-based summaries for your healing journey</p>
          </div>
        </div>

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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="topics" data-testid="tab-topics">Research Topics</TabsTrigger>
            <TabsTrigger value="beliefs" data-testid="tab-beliefs">What We Believe</TabsTrigger>
          </TabsList>

          <TabsContent value="topics">
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search topics..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
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
                      {(() => { const Icon = activeTopic.icon; return <Icon className="w-6 h-6 text-primary" />; })()}
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
                            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Sources & Further Reading</h3>
                      <div className="space-y-2">
                        {activeTopic.sources.map((source, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <BookOpen className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">{source.title}</span>
                            </div>
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{source.type}</span>
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
                      className="cursor-pointer hover:border-primary/50 transition-colors"
                      onClick={() => setSelectedTopic(topic.id)}
                      data-testid={`card-topic-${topic.id}`}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Icon className="w-5 h-5 text-primary" />
                          {topic.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-3">{topic.summary}</p>
                        <p className="text-xs text-primary mt-2">{topic.sources.length} sources</p>
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
                  <Sparkles className="w-5 h-5 text-primary" />
                  What We Believe & Why
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Transparency is core to our approach. Here's what guides The Genuine Love Project.
                </p>
                <div className="space-y-4">
                  {WHAT_WE_BELIEVE.map((item, idx) => (
                    <div key={idx} className="p-4 bg-muted/50 rounded-lg">
                      <h3 className="font-semibold text-primary mb-1">{item.belief}</h3>
                      <p className="text-sm text-muted-foreground">{item.why}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </div>
  );
}
