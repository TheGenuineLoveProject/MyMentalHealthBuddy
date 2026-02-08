import { Link } from "wouter";
import { ArrowLeft, Heart, Shield, Sparkles, Users, Flower2 } from "lucide-react";
import EmotionBackground from "@/components/sacred/EmotionBackground";
import GlowFooter from "@/components/GlowFooter";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <EmotionBackground emotion="calm" intensity={0.2} />
      
      <main className="flex-1 relative z-10">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group" data-testid="link-back-home">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>

          <div className="text-center mb-12" data-testid="about-header">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#8fbf9f] to-[#2f5d5d] mb-6 shadow-lg" aria-hidden="true">
              <Flower2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4" data-testid="text-about-title">
              About The Genuine Love Project
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="text-about-subtitle">
              A private space for reflection, built around what wellness apps usually get wrong.
            </p>
          </div>

          <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-border/50 shadow-xl mb-12" data-testid="card-mission">
            <h2 className="text-2xl font-serif font-semibold text-foreground mb-6 flex items-center gap-3" data-testid="text-mission-title">
              <Heart className="w-6 h-6 text-[#e8a5b3]" aria-hidden="true" />
              Our Mission
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              This platform exists because most wellness tools are designed to maximize how long you stay, not whether you're actually helped. We built something different — tools that are useful when you need them and quiet when you don't. No streaks, no guilt-driven notifications, no engagement tricks.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              If you're someone who values privacy, prefers going at your own pace, and wants tools that don't demand constant participation — you'll probably recognize what this is for. You don't need to be in crisis to use it. You don't need to commit to a program. It's here when you want to check in with yourself, and it stays out of the way when you don't.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12" data-testid="about-features-grid">
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg text-center" data-testid="card-feature-safe">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#8fbf9f]/20 mb-4" aria-hidden="true">
                <Shield className="w-7 h-7 text-[#8fbf9f]" />
              </div>
              <h3 className="text-lg font-serif font-semibold text-foreground mb-2">Safe & Private</h3>
              <p className="text-sm text-muted-foreground">
                Your journey is yours alone. We prioritize your privacy and create a judgment-free space for exploration.
              </p>
            </div>

            <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg text-center" data-testid="card-feature-ai">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#d4af37]/20 mb-4" aria-hidden="true">
                <Sparkles className="w-7 h-7 text-[#d4af37]" />
              </div>
              <h3 className="text-lg font-serif font-semibold text-foreground mb-2">AI-Powered Guidance</h3>
              <p className="text-sm text-muted-foreground">
                Compassionate AI companions available 24/7, trained in trauma-informed care and supportive communication.
              </p>
            </div>

            <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg text-center" data-testid="card-feature-community">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#e8a5b3]/20 mb-4" aria-hidden="true">
                <Users className="w-7 h-7 text-[#e8a5b3]" />
              </div>
              <h3 className="text-lg font-serif font-semibold text-foreground mb-2">Community Care</h3>
              <p className="text-sm text-muted-foreground">
                Connect with others on similar paths through shared reflections and supportive community features.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#8fbf9f]/10 to-[#2f5d5d]/10 rounded-3xl p-8 md:p-12 border border-[#8fbf9f]/20 text-center" data-testid="card-quote">
            <blockquote className="text-2xl md:text-3xl font-serif italic text-foreground mb-4" data-testid="text-quote-main">
              "The quietest tools are often the most useful ones."
            </blockquote>
            <p className="text-muted-foreground" data-testid="text-quote-attribution">
              — The Genuine Love Project
            </p>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              <strong>Important:</strong> The Genuine Love Project is an educational wellness platform and is not a substitute for professional mental health treatment. If you're in crisis, please reach out to a qualified professional or call your local emergency services.
            </p>
            <Link 
              href="/crisis" 
              className="inline-flex items-center gap-2 text-[#8fbf9f] hover:text-[#2f5d5d] transition-colors font-medium"
              data-testid="link-crisis-resources"
            >
              Access Crisis Resources →
            </Link>
          </div>
        </div>
      </main>

      <GlowFooter />
    </div>
  );
}
