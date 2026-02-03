import { Link } from "wouter";
import { BookOpen, FileText, GraduationCap, Heart, ArrowRight, ArrowLeft } from "lucide-react";

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
          <Link href="/learn/guides">
            <div className="bg-card rounded-2xl p-6 border border-border/50 hover:border-primary/30 transition-all cursor-pointer group" data-testid="card-guides">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                Healing Guides
              </h2>
              <p className="text-muted-foreground text-sm mb-4">
                Step-by-step guides to help you navigate your healing path with confidence.
              </p>
              <span className="text-primary text-sm flex items-center gap-1">
                Explore Guides <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>

          <Link href="/learn/articles">
            <div className="bg-card rounded-2xl p-6 border border-border/50 hover:border-primary/30 transition-all cursor-pointer group" data-testid="card-articles">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                Wellness Articles
              </h2>
              <p className="text-muted-foreground text-sm mb-4">
                Evidence-based articles to deepen your understanding of healing.
              </p>
              <span className="text-primary text-sm flex items-center gap-1">
                Read Articles <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>

          <Link href="/courses">
            <div className="bg-card rounded-2xl p-6 border border-border/50 hover:border-primary/30 transition-all cursor-pointer group" data-testid="card-courses">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                Self-Paced Courses
              </h2>
              <p className="text-muted-foreground text-sm mb-4">
                Comprehensive courses to support your personal growth journey.
              </p>
              <span className="text-primary text-sm flex items-center gap-1">
                View Courses <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        </div>

        <div className="text-center">
          <Link href="/">
            <span className="inline-flex items-center gap-2 text-primary hover:underline cursor-pointer" data-testid="button-return-home">
              <ArrowLeft className="w-4 h-4" />
              Return Home
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
