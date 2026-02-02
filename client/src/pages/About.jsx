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

          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#8fbf9f] to-[#2f5d5d] mb-6 shadow-lg">
              <Flower2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              About The Genuine Love Project
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A sacred space for healing, self-discovery, and genuine transformation.
            </p>
          </div>

          <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-border/50 shadow-xl mb-12">
            <h2 className="text-2xl font-serif font-semibold text-foreground mb-6 flex items-center gap-3">
              <Heart className="w-6 h-6 text-[#e8a5b3]" />
              Our Mission
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              The Genuine Love Project was born from a simple yet profound belief: everyone deserves access to compassionate, trauma-informed support on their healing journey. We combine the wisdom of evidence-based therapeutic approaches with cutting-edge AI technology to create a private, accessible sanctuary for emotional growth.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our platform is designed to meet you exactly where you are—whether you're processing difficult emotions, celebrating small victories, or simply seeking a moment of peace. We believe that healing is not linear, and every step forward, no matter how small, is worthy of recognition.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#8fbf9f]/20 mb-4">
                <Shield className="w-7 h-7 text-[#8fbf9f]" />
              </div>
              <h3 className="text-lg font-serif font-semibold text-foreground mb-2">Safe & Private</h3>
              <p className="text-sm text-muted-foreground">
                Your journey is yours alone. We prioritize your privacy and create a judgment-free space for exploration.
              </p>
            </div>

            <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#d4af37]/20 mb-4">
                <Sparkles className="w-7 h-7 text-[#d4af37]" />
              </div>
              <h3 className="text-lg font-serif font-semibold text-foreground mb-2">AI-Powered Guidance</h3>
              <p className="text-sm text-muted-foreground">
                Compassionate AI companions available 24/7, trained in trauma-informed care and supportive communication.
              </p>
            </div>

            <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#e8a5b3]/20 mb-4">
                <Users className="w-7 h-7 text-[#e8a5b3]" />
              </div>
              <h3 className="text-lg font-serif font-semibold text-foreground mb-2">Community Care</h3>
              <p className="text-sm text-muted-foreground">
                Connect with others on similar paths through shared reflections and supportive community features.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#8fbf9f]/10 to-[#2f5d5d]/10 rounded-3xl p-8 md:p-12 border border-[#8fbf9f]/20 text-center">
            <blockquote className="text-2xl md:text-3xl font-serif italic text-foreground mb-4">
              "Healing is the new success."
            </blockquote>
            <p className="text-muted-foreground">
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
