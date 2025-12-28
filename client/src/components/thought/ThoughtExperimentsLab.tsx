import { useState, useEffect } from "react";
import {
  THOUGHT_EXPERIMENTS,
  EXPERIMENT_CATEGORIES,
  createExperimentSession,
  saveExperimentSession,
  getExperimentSessions,
  deleteExperimentSession,
  getExperimentById,
  type ThoughtExperiment,
  type ExperimentSession
} from "@/lib/thought/thoughtExperiments";
import { Lightbulb, ChevronRight, Trash2 } from "lucide-react";

export default function ThoughtExperimentsLab() {
  const [sessions, setSessions] = useState<ExperimentSession[]>([]);
  const [activeSession, setActiveSession] = useState<ExperimentSession | null>(null);
  const [activeExperiment, setActiveExperiment] = useState<ThoughtExperiment | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentResponse, setCurrentResponse] = useState("");

  useEffect(() => {
    setSessions(getExperimentSessions());
  }, []);

  function handleStartExperiment(experiment: ThoughtExperiment) {
    const session = createExperimentSession(experiment.id);
    setActiveSession(session);
    setActiveExperiment(experiment);
    setCurrentQuestionIndex(0);
    setCurrentResponse("");
  }

  function handleSubmitResponse() {
    if (!activeSession || !activeExperiment || !currentResponse.trim()) return;
    
    const newResponse = {
      questionIndex: currentQuestionIndex,
      response: currentResponse,
      timestamp: new Date().toISOString()
    };
    
    const updated = {
      ...activeSession,
      responses: [...activeSession.responses, newResponse]
    };
    
    if (currentQuestionIndex < activeExperiment.questions.length - 1) {
      setActiveSession(updated);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentResponse("");
    } else {
      saveExperimentSession(updated);
      setActiveSession(updated);
      setSessions(getExperimentSessions());
    }
  }

  function handleUpdateSynthesis(synthesis: string) {
    if (!activeSession) return;
    const updated = { ...activeSession, synthesis };
    saveExperimentSession(updated);
    setActiveSession(updated);
  }

  function handleExit() {
    if (activeSession && activeSession.responses.length > 0) {
      saveExperimentSession(activeSession);
      setSessions(getExperimentSessions());
    }
    setActiveSession(null);
    setActiveExperiment(null);
    setCurrentQuestionIndex(0);
    setCurrentResponse("");
    setSelectedCategory(null);
  }

  if (activeSession && activeExperiment) {
    const allQuestionsAnswered = activeSession.responses.length >= activeExperiment.questions.length;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">{activeExperiment.name}</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 capitalize">
              {activeExperiment.category}
            </span>
          </div>
          <button
            onClick={handleExit}
            className="text-sm opacity-70 hover:opacity-100"
            data-testid="button-exit-experiment"
          >
            Exit
          </button>
        </div>

        <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-transparent p-5">
          <h3 className="font-medium mb-2">The Premise</h3>
          <p className="text-sm opacity-90">{activeExperiment.premise}</p>
        </div>

        {!allQuestionsAnswered ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs opacity-50">
                Question {currentQuestionIndex + 1} of {activeExperiment.questions.length}
              </span>
            </div>
            <p className="font-medium">{activeExperiment.questions[currentQuestionIndex]}</p>
            <textarea
              value={currentResponse}
              onChange={(e) => setCurrentResponse(e.target.value)}
              placeholder="Your thoughts..."
              className="w-full rounded-lg border border-white/10 bg-black/20 p-4 min-h-[150px] text-sm"
              data-testid="input-response"
            />
            <button
              onClick={handleSubmitResponse}
              disabled={!currentResponse.trim()}
              className="flex items-center gap-2 rounded-lg bg-purple-500/20 border border-purple-500/30 px-4 py-2 disabled:opacity-40"
              data-testid="button-submit-response"
            >
              {currentQuestionIndex < activeExperiment.questions.length - 1 ? "Next Question" : "Complete"}
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="font-medium">Your Responses</h3>
            {activeSession.responses.map((r, i) => (
              <div key={i} className="rounded-lg border border-white/10 bg-black/10 p-3">
                <p className="text-sm font-medium opacity-70 mb-1">{activeExperiment.questions[r.questionIndex]}</p>
                <p className="text-sm">{r.response}</p>
              </div>
            ))}

            <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent p-5">
              <h3 className="font-medium mb-2">Synthesis</h3>
              <p className="text-sm italic opacity-70 mb-3">
                What did this thought experiment reveal about your values or assumptions?
              </p>
              <textarea
                value={activeSession.synthesis}
                onChange={(e) => handleUpdateSynthesis(e.target.value)}
                placeholder="Looking back at your responses, what patterns or insights emerge?"
                className="w-full rounded-lg border border-white/10 bg-black/20 p-3 min-h-[100px] text-sm"
                data-testid="input-synthesis"
              />
            </div>

            <div className="text-sm opacity-60">
              <span className="font-medium">Related concepts: </span>
              {activeExperiment.relatedConcepts.join(", ")}
            </div>
          </div>
        )}
      </div>
    );
  }

  const filteredExperiments = selectedCategory
    ? THOUGHT_EXPERIMENTS.filter(e => e.category === selectedCategory)
    : THOUGHT_EXPERIMENTS;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-purple-400" />
        <h2 className="text-xl font-semibold">Thought Experiments Lab</h2>
      </div>

      <p className="text-sm opacity-80">
        Classic philosophical puzzles to test your intuitions and reveal hidden assumptions. 
        There are no right answers — only deeper understanding.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`rounded-lg px-3 py-1.5 text-xs ${!selectedCategory ? "bg-white/20" : "bg-white/5"}`}
          data-testid="button-category-all"
        >
          All
        </button>
        {EXPERIMENT_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`rounded-lg px-3 py-1.5 text-xs ${selectedCategory === cat.id ? "bg-white/20" : "bg-white/5"}`}
            data-testid={`button-category-${cat.id}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {filteredExperiments.map(experiment => (
          <button
            key={experiment.id}
            onClick={() => handleStartExperiment(experiment)}
            className="rounded-xl border border-white/10 bg-black/10 p-4 text-left hover:bg-white/5"
            data-testid={`button-experiment-${experiment.id}`}
          >
            <h3 className="font-medium">{experiment.name}</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 capitalize">{experiment.category}</span>
            <p className="text-sm opacity-70 mt-2 line-clamp-2">{experiment.premise}</p>
          </button>
        ))}
      </div>

      {sessions.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium opacity-70">Your Sessions</h3>
          {sessions.slice(0, 5).map(session => {
            const experiment = getExperimentById(session.experimentId);
            return (
              <div
                key={session.id}
                className="rounded-xl border border-white/10 bg-black/10 p-4 flex items-center justify-between"
              >
                <div>
                  <span className="font-medium">{experiment?.name || "Unknown"}</span>
                  <p className="text-xs opacity-50">{session.responses.length} responses</p>
                </div>
                <button
                  onClick={() => { deleteExperimentSession(session.id); setSessions(getExperimentSessions()); }}
                  className="p-2 rounded hover:bg-white/10"
                  data-testid={`button-delete-${session.id}`}
                >
                  <Trash2 className="h-4 w-4 opacity-60" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
