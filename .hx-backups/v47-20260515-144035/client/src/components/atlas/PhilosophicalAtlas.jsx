import { useState } from "react";
import { 
  WISDOM_TRADITIONS, 
  getDailyTradition,
  createAtlasPath,
  saveAtlasPath
} from "@/lib/atlas/philosophicalAtlas";
import { Map, BookOpen, ChevronRight, Check, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PhilosophicalAtlas() {
  const { toast } = useToast();
  const [selectedTradition, setSelectedTradition] = useState(null);
  const [activePath, setActivePath] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentResponse, setCurrentResponse] = useState("");
  const dailyTradition = getDailyTradition();

  function handleStartPath(tradition) {
    const path = createAtlasPath(tradition.id);
    setActivePath(path);
    setSelectedTradition(tradition);
    setCurrentQuestionIndex(0);
    setCurrentResponse("");
  }

  function handleSaveResponse() {
    if (!activePath || !selectedTradition || !currentResponse.trim()) return;

    const updatedPath = {
      ...activePath,
      progress: [...activePath.progress, currentQuestionIndex],
      reflections: [
        ...activePath.reflections,
        {
          questionIndex: currentQuestionIndex,
          response: currentResponse,
          timestamp: new Date().toISOString()
        }
      ]
    };

    if (currentQuestionIndex >= selectedTradition.questions.length - 1) {
      updatedPath.completed = true;
      saveAtlasPath(updatedPath);
      toast({
        title: "Path completed",
        description: `You've explored all questions in the ${selectedTradition.name} tradition.`
      });
      setActivePath(null);
      setSelectedTradition(null);
    } else {
      saveAtlasPath(updatedPath);
      setActivePath(updatedPath);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentResponse("");
    }
  }

  if (activePath && selectedTradition) {
    const progress = ((currentQuestionIndex + 1) / selectedTradition.questions.length) * 100;

    return (
      <div className="space-y-6" role="main" aria-label="Active wisdom path exploration">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Map className="h-5 w-5 text-emerald-400" aria-hidden="true" />
            <h2 className="text-xl font-semibold">{selectedTradition.name}</h2>
          </div>
          <button
            onClick={() => { setActivePath(null); setSelectedTradition(null); }}
            className="text-sm opacity-70 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 rounded px-2 py-1"
            aria-label="Exit current wisdom path"
            data-testid="button-exit-path"
          >
            Exit path
          </button>
        </div>

        <div 
          className="h-1.5 rounded-full bg-white/10 overflow-hidden"
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Question ${currentQuestionIndex + 1} of ${selectedTradition.questions.length}`}
        >
          <div 
            className="h-full bg-emerald-500 transition-all duration-300 motion-reduce:transition-none" 
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="rounded-xl border border-white/10 bg-black/10 p-4">
          <p className="text-xs opacity-60 mb-2">{selectedTradition.origin} • {selectedTradition.era}</p>
          <p className="text-sm opacity-80 italic">{selectedTradition.coreInsight}</p>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent p-5">
          <div className="text-xs opacity-60 mb-2" aria-hidden="true">
            Question {currentQuestionIndex + 1} of {selectedTradition.questions.length}
          </div>
          <p className="text-lg font-medium" id="current-question">
            {selectedTradition.questions[currentQuestionIndex]}
          </p>
        </div>

        <div>
          <label htmlFor="atlas-response" className="sr-only">
            Your reflection on this question
          </label>
          <textarea
            id="atlas-response"
            value={currentResponse}
            onChange={(e) => setCurrentResponse(e.target.value)}
            placeholder="Take your time with this question..."
            className="w-full rounded-xl border border-white/10 bg-black/20 p-4 min-h-[150px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-describedby="current-question"
            data-testid="input-atlas-response"
          />
        </div>

        <div className="flex justify-between">
          {currentQuestionIndex > 0 && (
            <button
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              aria-label={`Go back to question ${currentQuestionIndex}`}
              data-testid="button-atlas-previous"
            >
              Previous
            </button>
          )}
          <button
            onClick={handleSaveResponse}
            disabled={!currentResponse.trim()}
            className="ml-auto flex items-center gap-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30 px-4 py-2 text-sm hover:bg-emerald-500/30 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-label={currentQuestionIndex >= selectedTradition.questions.length - 1 ? "Complete this wisdom path" : "Save response and continue to next question"}
            data-testid="button-atlas-next"
          >
            {currentQuestionIndex >= selectedTradition.questions.length - 1 ? (
              <>Complete <Check className="h-4 w-4" aria-hidden="true" /></>
            ) : (
              <>Continue <ChevronRight className="h-4 w-4" aria-hidden="true" /></>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" role="main" aria-label="Philosophical Atlas - Wisdom traditions explorer">
      <div className="flex items-center gap-2">
        <Map className="h-5 w-5 text-emerald-400" aria-hidden="true" />
        <h2 className="text-xl font-semibold">Philosophical Atlas</h2>
      </div>

      <p className="text-sm opacity-80">
        Explore inquiry paths from wisdom traditions across time and culture — 
        not as prescriptions, but as lenses to try on.
      </p>

      <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-5 w-5 text-amber-400" aria-hidden="true" />
          <span className="font-medium">Today's Tradition</span>
        </div>
        <h3 className="text-lg font-semibold">{dailyTradition.name}</h3>
        <p className="text-sm opacity-70 mt-1">{dailyTradition.origin}</p>
        <p className="text-sm italic mt-2 opacity-90">{dailyTradition.coreInsight}</p>
        <button
          onClick={() => handleStartPath(dailyTradition)}
          className="mt-4 text-sm underline underline-offset-2 opacity-70 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 rounded px-1"
          aria-label={`Begin exploring the ${dailyTradition.name} tradition`}
          data-testid="button-start-daily-tradition"
        >
          Begin this path
        </button>
      </div>

      <div 
        className="grid gap-3 sm:grid-cols-2"
        role="list"
        aria-label="Available wisdom traditions"
      >
        {WISDOM_TRADITIONS.map((tradition) => (
          <button
            key={tradition.id}
            onClick={() => handleStartPath(tradition)}
            className="rounded-xl border border-white/10 bg-black/10 p-4 text-left hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            role="listitem"
            aria-label={`${tradition.name} from ${tradition.origin} - ${tradition.questions.length} questions`}
            data-testid={`button-tradition-${tradition.id}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{tradition.name}</span>
              <BookOpen className="h-4 w-4 opacity-60" aria-hidden="true" />
            </div>
            <p className="text-xs opacity-60">{tradition.origin}</p>
            <p className="text-xs opacity-50 mt-1">{tradition.questions.length} questions</p>
          </button>
        ))}
      </div>
    </div>
  );
}
