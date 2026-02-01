import { useState } from "react";
import { Heart, ChevronRight, RotateCcw, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import SEO from "../../components/SEO";

const emotionData = {
  happy: {
    color: "bg-yellow-400",
    secondary: ["joyful", "content", "proud", "optimistic", "playful", "peaceful"],
    tertiary: {
      joyful: ["elated", "excited", "blissful"],
      content: ["satisfied", "serene", "comfortable"],
      proud: ["accomplished", "confident", "worthy"],
      optimistic: ["hopeful", "inspired", "encouraged"],
      playful: ["silly", "amused", "creative"],
      peaceful: ["calm", "relaxed", "centered"]
    }
  },
  sad: {
    color: "bg-blue-400",
    secondary: ["lonely", "hurt", "disappointed", "grieving", "vulnerable", "empty"],
    tertiary: {
      lonely: ["isolated", "abandoned", "disconnected"],
      hurt: ["wounded", "betrayed", "resentful"],
      disappointed: ["let down", "discouraged", "dismayed"],
      grieving: ["sorrowful", "mournful", "heartbroken"],
      vulnerable: ["fragile", "exposed", "helpless"],
      empty: ["numb", "hollow", "depleted"]
    }
  },
  angry: {
    color: "bg-red-400",
    secondary: ["frustrated", "annoyed", "bitter", "defensive", "hurt", "critical"],
    tertiary: {
      frustrated: ["stuck", "impatient", "exasperated"],
      annoyed: ["irritated", "bothered", "aggravated"],
      bitter: ["resentful", "indignant", "wronged"],
      defensive: ["guarded", "threatened", "protective"],
      hurt: ["offended", "dismissed", "invalidated"],
      critical: ["judgmental", "disapproving", "contemptuous"]
    }
  },
  fearful: {
    color: "bg-purple-400",
    secondary: ["anxious", "insecure", "scared", "worried", "overwhelmed", "threatened"],
    tertiary: {
      anxious: ["nervous", "uneasy", "panicked"],
      insecure: ["inadequate", "uncertain", "doubtful"],
      scared: ["frightened", "terrified", "alarmed"],
      worried: ["concerned", ["apprehensive"], "troubled"],
      overwhelmed: ["stressed", "burdened", "pressured"],
      threatened: ["unsafe", ["exposed"], "vulnerable"]
    }
  },
  surprised: {
    color: "bg-orange-400",
    secondary: ["amazed", "confused", "shocked", "moved", "startled", "curious"],
    tertiary: {
      amazed: ["astonished", "awestruck", "wonderstruck"],
      confused: ["perplexed", "puzzled", "disoriented"],
      shocked: ["stunned", "dismayed", "speechless"],
      moved: ["touched", "stirred", "affected"],
      startled: ["jolted", "taken aback", "caught off guard"],
      curious: ["intrigued", "fascinated", "inquisitive"]
    }
  },
  disgusted: {
    color: "bg-green-600",
    secondary: ["disapproving", "disappointed", "awful", "repelled", "hesitant", "judgmental"],
    tertiary: {
      disapproving: ["critical", "dissatisfied", "unimpressed"],
      disappointed: ["let down", "disillusioned", "dejected"],
      awful: ["nauseated", ["revolted"], "horrified"],
      repelled: ["averse", "disgusted", "turned off"],
      hesitant: ["reluctant", "doubtful", "uncertain"],
      judgmental: ["contemptuous", "disdainful", "superior"]
    }
  }
};

export default function EmotionWheel() {
  const [level, setLevel] = useState(0);
  const [selectedPrimary, setSelectedPrimary] = useState(null);
  const [selectedSecondary, setSelectedSecondary] = useState(null);
  const [selectedTertiary, setSelectedTertiary] = useState(null);

  const reset = () => {
    setLevel(0);
    setSelectedPrimary(null);
    setSelectedSecondary(null);
    setSelectedTertiary(null);
  };

  const selectPrimary = (emotion) => {
    setSelectedPrimary(emotion);
    setLevel(1);
  };

  const selectSecondary = (emotion) => {
    setSelectedSecondary(emotion);
    setLevel(2);
  };

  const selectTertiary = (emotion) => {
    setSelectedTertiary(emotion);
    setLevel(3);
  };

  const primaryEmotions = Object.keys(emotionData);

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Emotion Wheel — The Genuine Love Project" />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <header className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4" data-testid="text-page-title">
            Interactive Emotion Wheel
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Explore and name your emotions with greater precision. Start with a core feeling and discover the nuances.
          </p>
        </header>

        <div className="flex items-center gap-2 mb-8 justify-center">
          <span className={`px-3 py-1 rounded-full text-sm ${level >= 0 ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
            Core
          </span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <span className={`px-3 py-1 rounded-full text-sm ${level >= 1 ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
            Secondary
          </span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <span className={`px-3 py-1 rounded-full text-sm ${level >= 2 ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
            Specific
          </span>
        </div>

        {level === 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4" role="group" aria-label="Choose a core emotion">
            {primaryEmotions.map(emotion => (
              <button
                key={emotion}
                onClick={() => selectPrimary(emotion)}
                className={`p-6 rounded-xl ${emotionData[emotion].color} text-white font-semibold text-lg capitalize hover:opacity-90 transition-opacity min-h-[80px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white`}
                data-testid={`emotion-${emotion}`}
                aria-label={`Select ${emotion} as core emotion`}
              >
                {emotion}
              </button>
            ))}
          </div>
        )}

        {level === 1 && selectedPrimary && (
          <div>
            <div className="text-center mb-6">
              <span className={`px-4 py-2 rounded-full ${emotionData[selectedPrimary].color} text-white font-medium capitalize`}>
                {selectedPrimary}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4" role="group" aria-label="Choose a secondary emotion">
              {emotionData[selectedPrimary].secondary.map(emotion => (
                <button
                  key={emotion}
                  onClick={() => selectSecondary(emotion)}
                  className="p-4 rounded-xl border-2 hover:border-primary transition-colors capitalize font-medium min-h-[60px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  data-testid={`emotion-${emotion}`}
                  aria-label={`Select ${emotion}`}
                >
                  {emotion}
                </button>
              ))}
            </div>
          </div>
        )}

        {level === 2 && selectedPrimary && selectedSecondary && (
          <div>
            <div className="text-center mb-6 flex items-center justify-center gap-2">
              <span className={`px-3 py-1 rounded-full ${emotionData[selectedPrimary].color} text-white text-sm capitalize`}>
                {selectedPrimary}
              </span>
              <ChevronRight className="w-4 h-4" />
              <span className="px-3 py-1 rounded-full bg-muted font-medium capitalize">
                {selectedSecondary}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {(emotionData[selectedPrimary].tertiary[selectedSecondary] || []).map((emotion, i) => (
                <button
                  key={i}
                  onClick={() => selectTertiary(Array.isArray(emotion) ? emotion[0] : emotion)}
                  className="p-4 rounded-xl border-2 hover:border-primary transition-colors capitalize font-medium min-h-[60px]"
                  data-testid={`emotion-${emotion}`}
                >
                  {Array.isArray(emotion) ? emotion[0] : emotion}
                </button>
              ))}
            </div>
          </div>
        )}

        {level === 3 && selectedTertiary && (
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-8 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold capitalize mb-2">{selectedTertiary}</h2>
              <p className="text-muted-foreground mb-6">
                You've identified feeling <strong className="capitalize">{selectedTertiary}</strong>, 
                which comes from <span className="capitalize">{selectedSecondary}</span>, 
                a form of <span className="capitalize">{selectedPrimary}</span>.
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Naming our emotions precisely helps us understand and process them more effectively.
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={reset} variant="outline" className="min-h-[44px]">
                  <RotateCcw className="w-4 h-4 mr-2" /> Start Over
                </Button>
                <Button className="min-h-[44px]">
                  <BookOpen className="w-4 h-4 mr-2" /> Journal This
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {level > 0 && level < 3 && (
          <div className="text-center mt-8">
            <Button onClick={reset} variant="ghost" className="min-h-[44px]">
              <RotateCcw className="w-4 h-4 mr-2" /> Start Over
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
