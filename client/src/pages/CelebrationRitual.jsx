import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Sparkles, Heart, Crown, Download, Star, 
  Flower2, ArrowLeft, Volume2, VolumeX 
} from "lucide-react";
import { Link } from "wouter";
import confetti from "canvas-confetti";

const AFFIRMATION_TEMPLATES = {
  joy: "I am a vessel of joy, radiating light wherever I go.",
  calm: "I am at peace with myself and the world around me.",
  grateful: "I am abundant in gratitude and rich in blessings.",
  hopeful: "I am the author of my story, and hope guides my pen.",
  healing: "I am healing, growing, and becoming whole again.",
  loved: "I am deeply loved and worthy of all good things.",
  balanced: "I am centered, grounded, and at home in myself.",
  neutral: "I am present, aware, and open to life's gifts."
};

export default function CelebrationRitual() {
  const [phase, setPhase] = useState("intro");
  const [isSpeaking, setIsSpeaking] = useState(false);

  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/community/completion-stats"],
    staleTime: 1000 * 60 * 5
  });

  useEffect(() => {
    if (phase === "celebrate") {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#fbbf24", "#f472b6", "#a78bfa", "#38bdf8"]
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#fbbf24", "#f472b6", "#a78bfa", "#38bdf8"]
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [phase]);

  const affirmation = AFFIRMATION_TEMPLATES[stats?.dominantEmotion] || AFFIRMATION_TEMPLATES.balanced;

  const speakAffirmation = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(affirmation);
    utterance.rate = 0.8;
    utterance.pitch = 1.1;
    
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.name.includes("Samantha") || 
      v.lang.startsWith("en") && v.name.toLowerCase().includes("female")
    );
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const downloadCertificate = () => {
    if (!stats) return;

    const content = `
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║              THE GENUINE LOVE PROJECT                      ║
║           CERTIFICATE OF SELF-LOVE                         ║
║                                                            ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║    This sacred document celebrates                         ║
║                                                            ║
║                 YOUR COMMITMENT                            ║
║                                                            ║
║    to healing, growth, and genuine self-love.              ║
║                                                            ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║    🌸 Days of Showing Up: ${String(stats.daysActive || 7).padStart(2, " ")}                            ║
║    📝 Journal Entries: ${String(stats.journalCount || 0).padStart(2, " ")}                              ║
║    💝 Gratitude Reflections: ${String(stats.gratitudeCount || 0).padStart(2, " ")}                       ║
║    🎯 Mood Check-ins: ${String(stats.moodCount || 0).padStart(2, " ")}                                ║
║                                                            ║
║    Dominant Emotion: ${stats.dominantEmotion || "balanced"}                        ║
║                                                            ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║    YOUR AFFIRMATION:                                       ║
║                                                            ║
║    "${affirmation}"
║                                                            ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║    Date: ${new Date().toLocaleDateString()}                                        ║
║                                                            ║
║    Remember: You are worthy of love, healing, and joy.     ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
    `.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `self-love-certificate-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-rose-50 to-pink-50 dark:from-gray-900 dark:via-rose-900/20 dark:to-gray-900">
        <div className="text-center">
          <Flower2 className="w-16 h-16 mx-auto mb-4 text-rose-400 animate-spin" style={{ animationDuration: "3s" }} />
          <p className="text-gray-600 dark:text-gray-300">Preparing your celebration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-pink-50 dark:from-gray-900 dark:via-rose-900/20 dark:to-gray-900 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-amber-200/30 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-radial from-rose-200/30 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        <Link href="/insights">
          <div className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition mb-8 cursor-pointer" data-testid="link-back-insights">
            <ArrowLeft className="w-4 h-4" />
            Back to Insights
          </div>
        </Link>

        {phase === "intro" && (
          <div className="text-center animate-fadeIn">
            <div className="relative inline-block mb-8">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-400 via-rose-400 to-pink-400 flex items-center justify-center shadow-2xl animate-pulse">
                <Crown className="w-16 h-16 text-white" />
              </div>
              <div className="absolute -inset-4 rounded-full border-2 border-amber-300/50 animate-ping" style={{ animationDuration: "2s" }} />
            </div>

            <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-amber-600 via-rose-500 to-pink-500 bg-clip-text text-transparent mb-4">
              You Did It!
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              You've shown up for yourself for {stats?.daysActive || 7} days.
            </p>

            <button
              onClick={() => setPhase("celebrate")}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-400 to-pink-400 text-white text-lg font-semibold shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
              data-testid="button-start-celebration"
            >
              <Sparkles className="w-5 h-5 inline mr-2" />
              Begin Celebration Ritual
            </button>
          </div>
        )}

        {phase === "celebrate" && (
          <div className="text-center animate-fadeIn">
            <div className="relative mb-8">
              <Flower2 
                className="w-40 h-40 mx-auto text-rose-400 animate-spin" 
                style={{ animationDuration: "8s" }} 
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-300 to-rose-300 animate-pulse opacity-50" />
              </div>
            </div>

            <h2 className="text-3xl font-display font-bold text-gray-800 dark:text-white mb-6">
              Your Sacred Journey
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <StatCard icon={Star} value={stats?.daysActive || 7} label="Days Active" />
              <StatCard icon={Heart} value={stats?.gratitudeCount || 0} label="Gratitude" />
              <StatCard icon={Sparkles} value={stats?.journalCount || 0} label="Journals" />
              <StatCard icon={Crown} value={stats?.dominantEmotion || "balanced"} label="Core Feeling" isText />
            </div>

            <button
              onClick={() => setPhase("affirmation")}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-500 text-white text-lg font-semibold shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
              data-testid="button-reveal-affirmation"
            >
              Reveal Your Affirmation
            </button>
          </div>
        )}

        {phase === "affirmation" && (
          <div className="text-center animate-fadeIn">
            <div className="p-8 rounded-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-2xl border border-white/50 mb-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-400 to-rose-400 flex items-center justify-center">
                <Heart className="w-10 h-10 text-white" />
              </div>

              <p className="text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4">
                Your Affirmation
              </p>

              <p className="text-2xl font-serif italic text-gray-800 dark:text-white leading-relaxed mb-6">
                "{affirmation}"
              </p>

              <button
                onClick={speakAffirmation}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                data-testid="button-speak-affirmation"
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    Stop
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    Speak Affirmation
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={downloadCertificate}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-rose-400 text-white font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                data-testid="button-download-certificate"
              >
                <Download className="w-5 h-5" />
                Download Certificate
              </button>

              <Link href="/insights">
                <button 
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  data-testid="button-return-dashboard"
                >
                  Return to Dashboard
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, value, label, isText = false }) {
  return (
    <div className="p-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
      <Icon className="w-6 h-6 mx-auto mb-2 text-amber-500" />
      <p className={`font-bold text-gray-800 dark:text-white ${isText ? "text-lg capitalize" : "text-2xl"}`}>
        {value}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  );
}
