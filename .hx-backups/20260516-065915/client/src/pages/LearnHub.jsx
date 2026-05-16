import { Link } from "wouter";
import { BookOpen, FileText, GraduationCap, Heart, ArrowRight, ArrowLeft } from "lucide-react";

const CARDS = [
  {
    href: "/learn/guides",
    testId: "card-guides",
    icon: GraduationCap,
    title: "Healing Guides",
    desc: "Step-by-step guides to help you navigate your healing path with confidence.",
    cta: "Explore Guides",
  },
  {
    href: "/learn/articles",
    testId: "card-articles",
    icon: FileText,
    title: "Wellness Articles",
    desc: "Evidence-based articles to deepen your understanding of healing.",
    cta: "Read Articles",
  },
  {
    href: "/courses",
    testId: "card-courses",
    icon: Heart,
    title: "Self-Paced Courses",
    desc: "Comprehensive courses to support your personal growth journey.",
    cta: "View Courses",
  },
];

export default function LearnHub() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-widest text-primary/70 mb-4 flex items-center justify-center gap-2">
            <BookOpen className="w-4 h-4" />
            Grow Your Understanding
          </p>
          <h1 className="text-4xl md:text-5xl font-serif mb-6">
            Learn &{" "}
            <span className="text-primary italic">Grow.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Evidence-based articles, guides, and courses to support your healing journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.href}
                href={card.href}
                className="block bg-card rounded-2xl p-6 border border-border/50 hover:border-primary/30 hover:shadow-md transition-all group cursor-pointer no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                data-testid={card.testId}
                aria-label={card.title}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors no-underline">
                  {card.title}
                </h2>
                <p className="text-muted-foreground text-sm mb-4 no-underline">
                  {card.desc}
                </p>
                <span className="text-primary text-sm flex items-center gap-1 no-underline">
                  {card.cta} <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            );
          })}
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:underline cursor-pointer no-underline"
            data-testid="button-return-home"
          >
            <ArrowLeft className="w-4 h-4" />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
