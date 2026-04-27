import { Link } from "wouter";
import { GraduationCap, ArrowLeft, ArrowRight, BookOpen, Heart, Sparkles, Shield, Brain } from "lucide-react";
import { GUIDES } from "@/content/learn";

const ICON_MAP = { Heart, Shield, Sparkles, Brain, BookOpen };

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
          {GUIDES.map((guide) => {
            const IconComponent = ICON_MAP[guide.icon] || Heart;
            return (
              <Link
                key={guide.slug}
                href={`/learn/guides/${guide.slug}`}
                className="block bg-card rounded-2xl p-6 border border-border/50 hover:border-primary/30 hover:shadow-md transition-all group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 no-underline"
                data-testid={`card-guide-${guide.id}`}
                aria-label={`Read: ${guide.title}`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">
                      {guide.category}
                    </span>
                    <h2 className="text-lg font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                      {guide.title}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      {guide.description}
                    </p>
                    <span className="inline-flex items-center gap-1 mt-3 text-sm text-primary font-medium opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                      Read guide
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
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
