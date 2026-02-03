import { Link } from "wouter";
import { FileText, ArrowLeft, Clock, User } from "lucide-react";

const articles = [
  {
    id: 1,
    title: "The Science of Self-Compassion",
    excerpt: "Research shows that self-compassion is linked to greater emotional resilience and wellbeing.",
    author: "Wellness Team",
    readTime: "5 min read",
    category: "Research"
  },
  {
    id: 2,
    title: "Understanding Trauma Responses",
    excerpt: "Learn about the different ways our bodies and minds respond to overwhelming experiences.",
    author: "Wellness Team",
    readTime: "8 min read",
    category: "Education"
  },
  {
    id: 3,
    title: "The Power of Mindful Breathing",
    excerpt: "Simple breathing techniques can activate your parasympathetic nervous system and reduce stress.",
    author: "Wellness Team",
    readTime: "4 min read",
    category: "Practical"
  },
  {
    id: 4,
    title: "Building Emotional Resilience",
    excerpt: "Practical strategies for developing the ability to bounce back from life's challenges.",
    author: "Wellness Team",
    readTime: "6 min read",
    category: "Growth"
  },
  {
    id: 5,
    title: "The Connection Between Sleep and Mental Health",
    excerpt: "How quality sleep supports emotional regulation and overall psychological wellbeing.",
    author: "Wellness Team",
    readTime: "7 min read",
    category: "Research"
  },
  {
    id: 6,
    title: "Journaling for Emotional Processing",
    excerpt: "Evidence-based benefits of expressive writing for mental health and emotional clarity.",
    author: "Wellness Team",
    readTime: "5 min read",
    category: "Practical"
  }
];

export default function LearnArticles() {
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
            <FileText className="w-4 h-4" />
            Evidence-Based
          </p>
          <h1 className="text-4xl md:text-5xl font-serif mb-6">
            Wellness{" "}
            <span className="text-primary italic">Articles.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Research-informed articles to deepen your understanding of emotional healing and wellness.
          </p>
        </div>

        <div className="space-y-6">
          {articles.map((article) => (
            <article
              key={article.id}
              className="bg-card rounded-2xl p-6 border border-border/50 hover:border-primary/30 transition-all group"
              data-testid={`card-article-${article.id}`}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <span className="text-xs uppercase tracking-wider text-primary/70 font-medium">
                    {article.category}
                  </span>
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-muted-foreground text-sm mb-3">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {article.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground text-sm">
            New articles are published regularly. Check back for the latest wellness insights.
          </p>
        </div>
      </div>
    </div>
  );
}
