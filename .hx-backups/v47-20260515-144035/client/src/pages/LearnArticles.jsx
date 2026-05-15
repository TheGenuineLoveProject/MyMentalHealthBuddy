import { Link } from "wouter";
import { FileText, ArrowLeft, ArrowRight, Clock, User } from "lucide-react";
import { ARTICLES } from "@/content/learn";

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
          {ARTICLES.map((article) => (
            <Link
              key={article.slug}
              href={`/learn/articles/${article.slug}`}
              className="block bg-card rounded-2xl p-6 border border-border/50 hover:border-primary/30 hover:shadow-md transition-all group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 no-underline"
              data-testid={`card-article-${article.id}`}
              aria-label={`Read: ${article.title}`}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <span className="text-xs uppercase tracking-wider text-primary/70 font-medium">
                    {article.category}
                  </span>
                  <h2 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-muted-foreground text-sm mb-3">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {article.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.readTime}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-primary font-medium opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                      Read article
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
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
