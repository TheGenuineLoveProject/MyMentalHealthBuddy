import { useState, useEffect } from "react";
import { Brain, ChevronRight, RotateCcw, Trophy, Target, Lightbulb, Heart, Users, Zap } from "lucide-react";

const EQ_DIMENSIONS = {
  selfAwareness: { name: "Self-Awareness", icon: Brain, color: "from-violet-400 to-purple-500" },
  selfRegulation: { name: "Self-Regulation", icon: Target, color: "from-blue-400 to-indigo-500" },
  motivation: { name: "Motivation", icon: Zap, color: "from-amber-400 to-orange-500" },
  empathy: { name: "Empathy", icon: Heart, color: "from-rose-400 to-pink-500" },
  socialSkills: { name: "Social Skills", icon: Users, color: "from-teal-400 to-cyan-500" },
};

const QUESTIONS = [
  { dimension: "selfAwareness", text: "I can easily identify what emotion I'm feeling at any given moment.", reverse: false },
  { dimension: "selfAwareness", text: "I understand how my emotions affect my thoughts and behavior.", reverse: false },
  { dimension: "selfAwareness", text: "I'm aware of my strengths and weaknesses.", reverse: false },
  { dimension: "selfAwareness", text: "I often reflect on why I feel the way I do.", reverse: false },
  
  { dimension: "selfRegulation", text: "I can calm myself down when I'm feeling anxious or upset.", reverse: false },
  { dimension: "selfRegulation", text: "I think before I act, especially in emotional situations.", reverse: false },
  { dimension: "selfRegulation", text: "I handle unexpected changes with flexibility.", reverse: false },
  { dimension: "selfRegulation", text: "I take responsibility for my actions rather than blaming others.", reverse: false },
  
  { dimension: "motivation", text: "I set goals and work persistently to achieve them.", reverse: false },
  { dimension: "motivation", text: "I stay optimistic even when facing setbacks.", reverse: false },
  { dimension: "motivation", text: "I'm driven by personal values rather than external rewards.", reverse: false },
  { dimension: "motivation", text: "I commit to things and follow through on my commitments.", reverse: false },
  
  { dimension: "empathy", text: "I can sense how others are feeling, even if they don't say it.", reverse: false },
  { dimension: "empathy", text: "I listen attentively when others share their problems.", reverse: false },
  { dimension: "empathy", text: "I consider others' feelings when making decisions.", reverse: false },
  { dimension: "empathy", text: "I can see situations from other people's perspectives.", reverse: false },
  
  { dimension: "socialSkills", text: "I communicate my ideas clearly and effectively.", reverse: false },
  { dimension: "socialSkills", text: "I work well with others in team settings.", reverse: false },
  { dimension: "socialSkills", text: "I can resolve conflicts in a constructive way.", reverse: false },
  { dimension: "socialSkills", text: "I build trust and rapport easily with others.", reverse: false },
];

const ANSWERS = [
  { value: 1, label: "Rarely" },
  { value: 2, label: "Sometimes" },
  { value: 3, label: "Often" },
  { value: 4, label: "Almost Always" },
];

const STORAGE_KEY = "eq-quiz-results";

export default function EmotionalIntelligenceQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [previousResults, setPreviousResults] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setPreviousResults(JSON.parse(saved));
    }
  }, []);

  const handleAnswer = (value) => {
    const newAnswers = { ...answers, [currentQuestion]: value };
    setAnswers(newAnswers);
    
    if (currentQuestion < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    } else {
      calculateResults(newAnswers);
    }
  };

  const calculateResults = (finalAnswers) => {
    const dimensionScores = {};
    const dimensionCounts = {};
    
    Object.keys(EQ_DIMENSIONS).forEach((dim) => {
      dimensionScores[dim] = 0;
      dimensionCounts[dim] = 0;
    });
    
    QUESTIONS.forEach((q, idx) => {
      const answer = finalAnswers[idx] || 0;
      const score = q.reverse ? 5 - answer : answer;
      dimensionScores[q.dimension] += score;
      dimensionCounts[q.dimension]++;
    });
    
    const dimensionPercentages = {};
    let totalScore = 0;
    let maxPossible = 0;
    
    Object.keys(EQ_DIMENSIONS).forEach((dim) => {
      const max = dimensionCounts[dim] * 4;
      dimensionPercentages[dim] = Math.round((dimensionScores[dim] / max) * 100);
      totalScore += dimensionScores[dim];
      maxPossible += max;
    });
    
    const overallScore = Math.round((totalScore / maxPossible) * 100);
    
    const result = {
      date: new Date().toISOString(),
      overall: overallScore,
      dimensions: dimensionPercentages,
    };
    
    const updatedResults = [result, ...previousResults].slice(0, 10);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedResults));
    setPreviousResults(updatedResults);
    
    setResults(result);
    setShowResults(true);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setResults(null);
  };

  const getScoreLevel = (score) => {
    if (score >= 80) return { label: "Excellent", color: "text-emerald-600" };
    if (score >= 60) return { label: "Good", color: "text-blue-600" };
    if (score >= 40) return { label: "Developing", color: "text-amber-600" };
    return { label: "Needs Growth", color: "text-rose-600" };
  };

  const getStrengthsAndGrowth = () => {
    if (!results) return { strengths: [], growth: [] };
    
    const sorted = Object.entries(results.dimensions).sort(([, a], [, b]) => b - a);
    return {
      strengths: sorted.slice(0, 2).map(([dim]) => dim),
      growth: sorted.slice(-2).map(([dim]) => dim),
    };
  };

  const question = QUESTIONS[currentQuestion];
  const DimensionIcon = question ? EQ_DIMENSIONS[question.dimension].icon : Brain;

  return (
    <div 
      className="min-h-[500px] bg-gradient-to-br from-violet-50 via-indigo-50 to-blue-50 dark:from-violet-950/30 dark:via-indigo-950/30 dark:to-blue-950/30 rounded-3xl p-6 relative overflow-hidden"
      data-testid="emotional-intelligence-quiz"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-400/20 to-indigo-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-400/20 to-cyan-500/20 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <Brain className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Emotional Intelligence Quiz</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Discover your EQ strengths</p>
          </div>
        </div>

        {!showResults ? (
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${EQ_DIMENSIONS[question.dimension].color}`}>
                  <DimensionIcon className="w-4 h-4 text-white" aria-hidden="true" />
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {EQ_DIMENSIONS[question.dimension].name}
                </span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {currentQuestion + 1} / {QUESTIONS.length}
              </span>
            </div>

            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-8">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${((currentQuestion + 1) / QUESTIONS.length) * 100}%` }}
              />
            </div>

            <p className="text-xl text-gray-900 dark:text-white mb-8 text-center font-medium">
              {question.text}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {ANSWERS.map((answer) => (
                <button
                  key={answer.value}
                  onClick={() => handleAnswer(answer.value)}
                  className={`p-4 rounded-xl font-medium transition-all ${
                    answers[currentQuestion] === answer.value
                      ? "bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-lg transform scale-105"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                  data-testid={`button-answer-${answer.value}`}
                >
                  {answer.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl text-center">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-amber-500" aria-hidden="true" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Your EQ Score
              </h3>
              <div className="text-5xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                {results.overall}%
              </div>
              <p className={`text-lg font-semibold ${getScoreLevel(results.overall).color}`}>
                {getScoreLevel(results.overall).label}
              </p>
            </div>

            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              <h4 className="font-bold text-gray-900 dark:text-white mb-4">Dimension Scores</h4>
              <div className="space-y-4">
                {Object.entries(EQ_DIMENSIONS).map(([key, dim]) => {
                  const Icon = dim.icon;
                  const score = results.dimensions[key];
                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-gray-500" aria-hidden="true" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {dim.name}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {score}%
                        </span>
                      </div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${dim.color} transition-all duration-1000`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl p-5">
                <h4 className="font-bold text-emerald-800 dark:text-emerald-300 mb-3 flex items-center gap-2">
                  <Trophy className="w-5 h-5" aria-hidden="true" />
                  Your Strengths
                </h4>
                <ul className="space-y-2">
                  {getStrengthsAndGrowth().strengths.map((dim) => (
                    <li key={dim} className="text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" />
                      {EQ_DIMENSIONS[dim].name}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-950/30 rounded-2xl p-5">
                <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-3 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" aria-hidden="true" />
                  Growth Areas
                </h4>
                <ul className="space-y-2">
                  {getStrengthsAndGrowth().growth.map((dim) => (
                    <li key={dim} className="text-amber-700 dark:text-amber-400 flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" />
                      {EQ_DIMENSIONS[dim].name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={resetQuiz}
              className="w-full py-3 bg-gradient-to-r from-violet-500 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              data-testid="button-retake-quiz"
            >
              <RotateCcw className="w-5 h-5" aria-hidden="true" />
              Take Quiz Again
            </button>

            {previousResults.length > 1 && (
              <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Previous Results</h4>
                <div className="space-y-2">
                  {previousResults.slice(1, 5).map((result, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {new Date(result.date).toLocaleDateString()}
                      </span>
                      <span className="font-bold text-gray-900 dark:text-white">{result.overall}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
