import { useState, useEffect, useRef } from "react";
import { Sparkles, Play, Pause, SkipForward, Volume2, VolumeX, Heart, Star } from "lucide-react";

const VISUALIZATIONS = [
  {
    id: "peaceful-beach",
    name: "Peaceful Beach",
    emoji: "🏖️",
    color: "from-cyan-400 to-blue-500",
    duration: 180,
    scenes: [
      { text: "Close your eyes and take a deep breath...", duration: 10 },
      { text: "Imagine yourself walking along a beautiful, pristine beach...", duration: 15 },
      { text: "Feel the warm, soft sand beneath your feet...", duration: 15 },
      { text: "The sun is setting, painting the sky in shades of orange and pink...", duration: 15 },
      { text: "Listen to the gentle rhythm of waves lapping at the shore...", duration: 15 },
      { text: "A cool, refreshing breeze carries the scent of the ocean...", duration: 15 },
      { text: "You find a comfortable spot and sit down, feeling completely at peace...", duration: 15 },
      { text: "Watch as the last rays of sunlight dance on the water...", duration: 15 },
      { text: "Stars begin to appear, twinkling softly above you...", duration: 15 },
      { text: "You feel safe, calm, and deeply connected to this moment...", duration: 15 },
      { text: "Carry this peace with you as you slowly return to the present...", duration: 15 },
      { text: "Take a deep breath... and when you're ready, open your eyes.", duration: 20 },
    ],
  },
  {
    id: "forest-sanctuary",
    name: "Forest Sanctuary",
    emoji: "🌲",
    color: "from-green-400 to-emerald-500",
    duration: 180,
    scenes: [
      { text: "Take a deep breath and let your body relax...", duration: 10 },
      { text: "You find yourself at the entrance of a magical forest...", duration: 15 },
      { text: "Tall, ancient trees surround you, their leaves filtering golden sunlight...", duration: 15 },
      { text: "A soft carpet of moss cushions your every step...", duration: 15 },
      { text: "Birds sing melodies high in the canopy above...", duration: 15 },
      { text: "You discover a hidden clearing with a crystal-clear stream...", duration: 15 },
      { text: "The water sparkles as it flows gently over smooth stones...", duration: 15 },
      { text: "You sit beside the stream, feeling the forest's healing energy...", duration: 15 },
      { text: "A gentle deer appears nearby, completely at peace in your presence...", duration: 15 },
      { text: "You feel connected to nature, grounded and whole...", duration: 15 },
      { text: "This sanctuary will always be here for you whenever you need it...", duration: 15 },
      { text: "Slowly return to the present, carrying this peace within you.", duration: 20 },
    ],
  },
  {
    id: "mountain-peak",
    name: "Mountain Peak",
    emoji: "🏔️",
    color: "from-slate-400 to-indigo-500",
    duration: 180,
    scenes: [
      { text: "Breathe deeply and prepare for a journey of strength...", duration: 10 },
      { text: "You stand at the base of a magnificent mountain...", duration: 15 },
      { text: "With each step, you feel stronger and more capable...", duration: 15 },
      { text: "The air becomes crisp and clean as you ascend...", duration: 15 },
      { text: "Wildflowers dot the path, celebrating your progress...", duration: 15 },
      { text: "You reach a plateau and pause to admire the view below...", duration: 15 },
      { text: "Clouds drift lazily beneath you, soft and white...", duration: 15 },
      { text: "With renewed energy, you continue toward the summit...", duration: 15 },
      { text: "Finally, you reach the peak. The world stretches before you...", duration: 15 },
      { text: "You've overcome challenges and achieved your goal...", duration: 15 },
      { text: "This strength lives within you always...", duration: 15 },
      { text: "Carry this feeling of achievement as you return.", duration: 20 },
    ],
  },
  {
    id: "healing-light",
    name: "Healing Light",
    emoji: "✨",
    color: "from-amber-400 to-yellow-500",
    duration: 180,
    scenes: [
      { text: "Close your eyes and center yourself...", duration: 10 },
      { text: "Imagine a warm, golden light appearing above you...", duration: 15 },
      { text: "This light is pure healing energy, gentle and loving...", duration: 15 },
      { text: "It begins to descend, touching the top of your head...", duration: 15 },
      { text: "Feel warmth spreading through your mind, releasing any tension...", duration: 15 },
      { text: "The light flows down through your face, relaxing every muscle...", duration: 15 },
      { text: "It continues through your neck and shoulders, melting away stress...", duration: 15 },
      { text: "Your chest fills with this golden warmth, calming your heart...", duration: 15 },
      { text: "The healing light spreads through your arms and into your hands...", duration: 15 },
      { text: "It flows through your core, your legs, down to your feet...", duration: 15 },
      { text: "Your entire being glows with healing energy...", duration: 15 },
      { text: "You are healed, renewed, and filled with light.", duration: 20 },
    ],
  },
];

export default function PositiveVisualization() {
  const [selectedViz, setSelectedViz] = useState(VISUALIZATIONS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const intervalRef = useRef(null);
  const sceneTimeRef = useRef(0);

  useEffect(() => {
    const savedFavorites = localStorage.getItem("viz_favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    if (isPlaying && !completed) {
      intervalRef.current = setInterval(() => {
        sceneTimeRef.current += 1;
        const currentSceneData = selectedViz.scenes[currentScene];
        
        if (sceneTimeRef.current >= currentSceneData.duration) {
          if (currentScene < selectedViz.scenes.length - 1) {
            setCurrentScene(prev => prev + 1);
            sceneTimeRef.current = 0;
          } else {
            setCompleted(true);
            setIsPlaying(false);
          }
        }

        const totalElapsed = selectedViz.scenes.slice(0, currentScene).reduce((sum, s) => sum + s.duration, 0) + sceneTimeRef.current;
        setProgress((totalElapsed / selectedViz.duration) * 100);
      }, 1000);

      return () => clearInterval(intervalRef.current);
    }
  }, [isPlaying, currentScene, selectedViz, completed]);

  const togglePlay = () => {
    if (completed) {
      setCurrentScene(0);
      setProgress(0);
      setCompleted(false);
      sceneTimeRef.current = 0;
    }
    setIsPlaying(!isPlaying);
  };

  const skipScene = () => {
    if (currentScene < selectedViz.scenes.length - 1) {
      setCurrentScene(prev => prev + 1);
      sceneTimeRef.current = 0;
    }
  };

  const selectVisualization = (viz) => {
    setSelectedViz(viz);
    setCurrentScene(0);
    setProgress(0);
    setCompleted(false);
    setIsPlaying(false);
    sceneTimeRef.current = 0;
  };

  const toggleFavorite = (vizId) => {
    const newFavorites = favorites.includes(vizId)
      ? favorites.filter(f => f !== vizId)
      : [...favorites, vizId];
    setFavorites(newFavorites);
    localStorage.setItem("viz_favorites", JSON.stringify(newFavorites));
  };

  return (
    <div className="card-elevated p-6 relative overflow-hidden" data-testid="positive-visualization">
      <div className={`absolute inset-0 bg-gradient-to-br ${selectedViz.color} opacity-5`} />
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-400/10 to-yellow-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedViz.color} flex items-center justify-center shadow-lg`}>
              <Sparkles className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-display font-bold text-[var(--text)]" data-testid="text-viz-title">
                Guided Visualization
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">Healing imagery for your mind</p>
            </div>
          </div>
        </div>

        {!isPlaying && !completed && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            {VISUALIZATIONS.map((viz) => (
              <button
                key={viz.id}
                onClick={() => selectVisualization(viz)}
                className={`p-4 rounded-xl text-left transition-all relative ${
                  selectedViz.id === viz.id
                    ? `bg-gradient-to-br ${viz.color} text-white shadow-lg`
                    : "bg-[var(--surface)] hover:bg-[var(--surface-hover)]"
                }`}
                data-testid={`button-viz-${viz.id}`}
              >
                <button
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(viz.id); }}
                  className="absolute top-2 right-2"
                  aria-label={favorites.includes(viz.id) ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart 
                    className={`w-4 h-4 ${favorites.includes(viz.id) ? "fill-current text-pink-500" : selectedViz.id === viz.id ? "text-white/70" : "text-[var(--text-muted)]"}`} 
                  />
                </button>
                <span className="text-2xl mb-2 block">{viz.emoji}</span>
                <span className={`font-medium block ${selectedViz.id === viz.id ? "text-white" : "text-[var(--text)]"}`}>
                  {viz.name}
                </span>
                <span className={`text-xs ${selectedViz.id === viz.id ? "text-white/80" : "text-[var(--text-muted)]"}`}>
                  {Math.floor(viz.duration / 60)} min
                </span>
              </button>
            ))}
          </div>
        )}

        {(isPlaying || completed) && (
          <div className="mb-6 animate-fade-in-up">
            <div className={`p-8 rounded-2xl bg-gradient-to-br ${selectedViz.color} text-white mb-4`}>
              <div className="text-4xl mb-4 text-center">{selectedViz.emoji}</div>
              <p className="text-xl text-center font-medium leading-relaxed" data-testid="text-current-scene">
                {completed 
                  ? "Journey complete. Take a moment to notice how you feel."
                  : selectedViz.scenes[currentScene].text
                }
              </p>
            </div>

            <div className="h-2 bg-[var(--surface)] rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${selectedViz.color} transition-all duration-1000`}
                style={{ width: `${completed ? 100 : progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
              <span>{currentScene + 1} / {selectedViz.scenes.length}</span>
              <span>{Math.floor(progress)}%</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-3 rounded-xl bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors"
            aria-label={isMuted ? "Unmute" : "Mute"}
            data-testid="button-mute"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          <button
            onClick={togglePlay}
            className={`w-16 h-16 rounded-full bg-gradient-to-br ${selectedViz.color} text-white shadow-xl hover:shadow-2xl transition-all flex items-center justify-center`}
            data-testid="button-play-pause"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </button>

          <button
            onClick={skipScene}
            disabled={!isPlaying || completed}
            className="p-3 rounded-xl bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors disabled:opacity-50"
            aria-label="Skip to next scene"
            data-testid="button-skip"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {completed && (
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 text-center">
            <Star className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <p className="text-[var(--text)] font-medium">Visualization Complete!</p>
            <p className="text-sm text-[var(--text-secondary)]">You've invested in your mental wellbeing.</p>
          </div>
        )}
      </div>
    </div>
  );
}
