import { Link } from "wouter";
import { GraduationCap, ArrowLeft, BookOpen, Heart, Sparkles, Shield, Brain } from "lucide-react";

const guides = [
  {
    id: 1,
    title: "Getting Started with Emotional Healing",
    description: "A gentle introduction to beginning your healing journey with practical first steps.",
    icon: Heart,
    category: "Foundation"
  },
  {
    id: 2,
    title: "Understanding Your Nervous System",
    description: "Learn how your nervous system responds to stress and discover ways to find calm.",
    icon: Shield,
    category: "Body-Mind"
  },
  {
    id: 3,
    title: "Building Daily Wellness Habits",
    description: "Create sustainable routines that support your mental and emotional wellbeing.",
    icon: Sparkles,
    category: "Daily Practice"
  },
  {
    id: 4,
    title: "Processing Difficult Emotions",
    description: "Healthy strategies for working through challenging feelings with self-compassion.",
    icon: Brain,
    category: "Emotional Work"
  },
  {
    id: 5,
    title: "Developing Self-Compassion",
    description: "Practical exercises to cultivate kindness and understanding toward yourself.",
    icon: Heart,
    category: "Foundation"
  },
  {
    id: 6,
    title: "Creating Healthy Boundaries",
    description: "Learn to set and maintain boundaries that protect your emotional wellbeing.",
    icon: Shield,
    category: "Relationships"
  }
];

export default function LearnGuides() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <Link href="/learn">
          <span className="inline-flex items-center gap-2 text-primary hover:underline cursor-pointer mb-8" data-testid="link-back-learn">
            <ArrowLeft className="w-4 h-4" />
            Back to Learning Hub
          </span>
        </Link>

        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-widest text-primary/70 mb-4 flex items-center justify-center gap-2">
            <GraduationCap className="w-4 h-4" />
            Step by Step
          </p>
          <h1 className="text-4xl md:text-5xl font-serif mb-6">
            Healing{" "}
            <span className="text-primary italic">Guides.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive guides to help you navigate your healing path with confidence and clarity.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {guides.map((guide) => {
            const IconComponent = guide.icon;
            return (
              <div
                key={guide.id}
                className="bg-card rounded-2xl p-6 border border-border/50 hover:border-primary/30 transition-all group"
                data-testid={`card-guide-${guide.id}`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">
                      {guide.category}
                    </span>
                    <h2 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                      {guide.title}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      {guide.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground text-sm">
            More guides are being added regularly. Check back soon for new content.
          </p>
        </div>
      </div>
    </div>
  );
}
