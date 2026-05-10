import { useState, useEffect, useCallback } from "react";
import { Moon, Wind, Volume2, Play, Pause, Clock, Star, Sparkles, CheckCircle, ChevronRight } from 'lucide-react';

const SLEEP_SOUNDS = [
  { id: "rain", name: "Gentle Rain", icon: "🌧️", color: "from-blue-500 to-cyan-500" },
  { id: "ocean", name: "Ocean Waves", icon: "🌊", color: "from-teal-500 to-blue-500" },
  { id: "forest", name: "Forest Night", icon: "🌲", color: "from-emerald-600 to-green-700" },
  { id: "fire", name: "Crackling Fire", icon: "🔥", color: "from-orange-500 to-red-500" },
  { id: "wind", name: "Soft Wind", icon: "💨", color: "from-slate-400 to-slate-500" },
  { id: "white", name: "White Noise", icon: "📻", color: "from-gray-400 to-gray-500" },
];

const SLEEP_STORIES = [
  {
    id: "meadow",
    title: "The Peaceful Meadow",
    duration: 15,
    icon: "🌸",
    preview: "Walk through a sun-dappled meadow as gentle breezes carry you toward rest...",
    content: [
      "Close your eyes and take a deep breath. You find yourself standing at the edge of a beautiful meadow.",
      "The grass sways gently in the warm breeze. Each blade catches the golden afternoon light.",
      "You begin to walk slowly through the meadow. The soft earth cushions your steps.",
      "Wildflowers surround you - purple lavender, yellow buttercups, delicate white daisies.",
      "Their sweet fragrance fills the air. With each breath, you feel more relaxed.",
      "A butterfly dances past, its wings catching the light like stained glass.",
      "You come to a gentle slope and lie down on the soft grass.",
      "The sky above is a perfect blue, with cotton-white clouds drifting slowly.",
      "The warmth of the sun wraps around you like a cozy blanket.",
      "You feel completely safe, completely at peace. Your body grows heavy and relaxed.",
      "Let the meadow hold you as you drift into deep, restorative sleep...",
    ],
  },
  {
    id: "cottage",
    title: "Cozy Mountain Cottage",
    duration: 12,
    icon: "🏔️",
    preview: "Settle into a warm cottage as snow falls gently outside...",
    content: [
      "Imagine yourself inside a cozy wooden cottage, high in the mountains.",
      "Through the frost-touched window, soft snowflakes fall in the moonlight.",
      "A fire crackles warmly in the stone fireplace beside you.",
      "You're wrapped in the softest blanket, sinking into a plush armchair.",
      "A cup of warm chamomile tea rests in your hands, steam rising gently.",
      "The scent of pine and woodsmoke fills the air with comfort.",
      "Outside, the world is quiet under its blanket of fresh snow.",
      "You are safe, you are warm, you are completely at peace.",
      "Your eyes grow heavy as the fire's gentle glow soothes you.",
      "Let the mountain cottage embrace you as you drift into peaceful dreams...",
    ],
  },
  {
    id: "train",
    title: "The Night Train",
    duration: 18,
    icon: "🚂",
    preview: "Rock gently to sleep on a peaceful overnight train journey...",
    content: [
      "You're aboard a luxurious night train, traveling through the countryside.",
      "Your private cabin is warm and cozy, the bed soft and inviting.",
      "Through the window, the moon illuminates rolling hills and quiet villages.",
      "The train rocks gently from side to side, a soothing, rhythmic motion.",
      "Click-clack, click-clack. The wheels on the tracks create a peaceful song.",
      "Occasional lights from distant farmhouses pass by like friendly stars.",
      "The conductor's voice echoes faintly: 'Next stop, Dreamland.'",
      "You sink deeper into the pillows as the train carries you forward.",
      "There's nowhere you need to be. Nothing you need to do.",
      "Just rest, and let the train rock you gently to sleep...",
    ],
  },
];

const CBT_I_TECHNIQUES = [
  {
    id: "stimulus",
    title: "Stimulus Control",
    icon: "🛏️",
    tips: [
      "Only use your bed for sleep",
      "Get up if you can't sleep after 20 minutes",
      "Return to bed only when sleepy",
      "Keep a consistent wake time",
    ],
  },
  {
    id: "restriction",
    title: "Sleep Restriction",
    icon: "⏰",
    tips: [
      "Limit time in bed to actual sleep time",
      "Gradually increase as sleep improves",
      "Maintain consistent bed and wake times",
      "Avoid naps longer than 20 minutes",
    ],
  },
  {
    id: "hygiene",
    title: "Sleep Hygiene",
    icon: "✨",
    tips: [
      "Keep bedroom cool and dark",
      "Avoid screens 1 hour before bed",
      "Limit caffeine after noon",
      "Exercise, but not too close to bedtime",
    ],
  },
  {
    id: "relaxation",
    title: "Relaxation Training",
    icon: "🧘",
    tips: [
      "Practice progressive muscle relaxation",
      "Try deep breathing exercises",
      "Use guided imagery",
      "Meditate for 10 minutes before bed",
    ],
  },
];

export default function SleepSanctuary({ onComplete, onXpEarned }) {
  const [activeTab, setActiveTab] = useState("sounds");
  const [selectedSound, setSelectedSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [sleepTimer, setSleepTimer] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [selectedStory, setSelectedStory] = useState(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const [completedTechniques, setCompletedTechniques] = useState([]);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    let interval;
    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((t) => {
          if (t <= 1) {
            setIsPlaying(false);
            setTimerActive(false);
            handleSessionComplete();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeRemaining]);

  useEffect(() => {
    let interval;
    if (isPlaying && selectedStory) {
      interval = setInterval(() => {
        setStoryProgress((p) => {
          const story = SLEEP_STORIES.find(s => s.id === selectedStory);
          if (p >= story.content.length - 1) {
            handleStoryComplete();
            return story.content.length - 1;
          }
          return p + 1;
        });
      }, 8000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, selectedStory]);

  const handleSessionComplete = useCallback(() => {
    const duration = startTime ? Math.floor((Date.now() - startTime) / 1000) : 60;
    if (onXpEarned) onXpEarned("Sleep Sanctuary", duration);
    if (onComplete) onComplete();
  }, [startTime, onXpEarned, onComplete]);

  const handleStoryComplete = useCallback(() => {
    setIsPlaying(false);
    handleSessionComplete();
  }, [handleSessionComplete]);

  const startSoundSession = (soundId) => {
    setSelectedSound(soundId);
    setIsPlaying(true);
    setStartTime(Date.now());
  };

  const toggleTimer = () => {
    if (!timerActive) {
      setTimeRemaining(sleepTimer * 60);
      setTimerActive(true);
    } else {
      setTimerActive(false);
    }
  };

  const startStory = (storyId) => {
    setSelectedStory(storyId);
    setStoryProgress(0);
    setIsPlaying(true);
    setStartTime(Date.now());
    setActiveTab("story-player");
  };

  const toggleTechnique = (id) => {
    setCompletedTechniques((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const story = selectedStory ? SLEEP_STORIES.find(s => s.id === selectedStory) : null;

  if (activeTab === "story-player" && story) {
    return (
      <div 
        className="bg-gradient-to-br from-indigo-950 to-purple-950 rounded-2xl overflow-hidden border border-indigo-800/50 min-h-[500px]"
        data-testid="sleep-story-player"
      >
        <div className="p-6 border-b border-indigo-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{story.icon}</span>
              <div>
                <h3 className="text-xl font-bold text-white">{story.title}</h3>
                <p className="text-indigo-300 text-sm">{story.duration} minutes</p>
              </div>
            </div>
            <button
              onClick={() => {
                setActiveTab("stories");
                setSelectedStory(null);
                setIsPlaying(false);
              }}
              className="text-indigo-400 hover:text-white transition-colors"
            >
              Exit
            </button>
          </div>
        </div>

        <div className="p-8 flex flex-col items-center justify-center min-h-[350px]">
          <div className="max-w-lg text-center">
            <p 
              className="text-xl text-indigo-100 leading-relaxed font-light animate-fade-in"
              key={storyProgress}
              aria-live="polite"
            >
              {story.content[storyProgress]}
            </p>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                isPlaying 
                  ? "bg-indigo-600 hover:bg-indigo-700" 
                  : "bg-indigo-500 hover:bg-indigo-600"
              }`}
              data-testid="button-story-playpause"
            >
              {isPlaying ? <Pause className="w-8 h-8 text-white" /> : <Play className="w-8 h-8 text-white ml-1" />}
            </button>
          </div>

          <div className="mt-6 flex gap-1">
            {story.content.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  i <= storyProgress ? "bg-indigo-400" : "bg-indigo-800"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-gradient-to-br from-indigo-950 to-purple-950 rounded-2xl overflow-hidden border border-indigo-800/50"
      data-testid="sleep-sanctuary"
    >
      <div className="p-6 border-b border-indigo-800/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Moon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Sleep Sanctuary</h2>
            <p className="text-indigo-300 text-sm">CBT-I based tools for better sleep</p>
          </div>
        </div>

        <div className="flex gap-2">
          {["sounds", "stories", "techniques"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg capitalize text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-indigo-600 text-white"
                  : "bg-indigo-900/50 text-indigo-300 hover:bg-indigo-800/50"
              }`}
              data-testid={`tab-${tab}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {activeTab === "sounds" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {SLEEP_SOUNDS.map((sound) => (
                <button
                  key={sound.id}
                  onClick={() => startSoundSession(sound.id)}
                  className={`p-4 rounded-xl transition-all ${
                    selectedSound === sound.id
                      ? `bg-gradient-to-br ${sound.color} text-white`
                      : "bg-indigo-900/50 text-indigo-200 hover:bg-indigo-800/50"
                  }`}
                  data-testid={`button-sound-${sound.id}`}
                >
                  <span className="text-3xl mb-2 block">{sound.icon}</span>
                  <span className="text-sm font-medium">{sound.name}</span>
                </button>
              ))}
            </div>

            {selectedSound && (
              <div className="bg-indigo-900/30 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    {isPlaying ? "Pause" : "Play"}
                  </button>
                  
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-4 h-4 text-indigo-400" />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      className="w-24"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-400" />
                    <span className="text-indigo-200 text-sm">Sleep Timer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={sleepTimer}
                      onChange={(e) => setSleepTimer(Number(e.target.value))}
                      className="bg-indigo-900/50 text-indigo-200 rounded px-2 py-1 text-sm"
                      disabled={timerActive}
                    >
                      {[15, 30, 45, 60, 90, 120].map((mins) => (
                        <option key={mins} value={mins}>{mins} min</option>
                      ))}
                    </select>
                    <button
                      onClick={toggleTimer}
                      className={`px-3 py-1 rounded text-sm ${
                        timerActive 
                          ? "bg-amber-600/80 text-white" 
                          : "bg-indigo-600/80 text-white hover:bg-indigo-600"
                      }`}
                    >
                      {timerActive ? formatTime(timeRemaining) : "Start"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "stories" && (
          <div className="space-y-4">
            {SLEEP_STORIES.map((s) => (
              <button
                key={s.id}
                onClick={() => startStory(s.id)}
                className="w-full text-left p-4 bg-indigo-900/30 rounded-xl hover:bg-indigo-800/40 transition-colors"
                data-testid={`button-story-${s.id}`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{s.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-white">{s.title}</h3>
                      <span className="text-indigo-400 text-sm flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {s.duration} min
                      </span>
                    </div>
                    <p className="text-indigo-300 text-sm mt-1">{s.preview}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-indigo-500" />
                </div>
              </button>
            ))}
          </div>
        )}

        {activeTab === "techniques" && (
          <div className="space-y-4">
            {CBT_I_TECHNIQUES.map((tech) => {
              const isCompleted = completedTechniques.includes(tech.id);
              return (
                <div
                  key={tech.id}
                  className={`p-4 rounded-xl transition-all ${
                    isCompleted 
                      ? "bg-emerald-900/30 border border-emerald-500/30" 
                      : "bg-indigo-900/30"
                  }`}
                >
                  <button
                    onClick={() => toggleTechnique(tech.id)}
                    className="w-full text-left"
                    data-testid={`button-technique-${tech.id}`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{tech.icon}</span>
                      <h3 className="font-semibold text-white flex-1">{tech.title}</h3>
                      {isCompleted && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                    </div>
                  </button>
                  <ul className="space-y-2 ml-10">
                    {tech.tips.map((tip, i) => (
                      <li key={i} className="flex items-center gap-2 text-indigo-200 text-sm">
                        <Star className="w-3 h-3 text-indigo-500 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}

            <div className="mt-4 p-4 bg-indigo-900/50 rounded-xl text-center">
              <p className="text-indigo-300 text-sm">
                <Sparkles className="w-4 h-4 inline mr-1" />
                Mark techniques you've practiced to track your progress
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
