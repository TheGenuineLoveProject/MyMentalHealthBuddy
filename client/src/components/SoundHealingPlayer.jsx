import { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Clock, Waves, Wind, CloudRain, Bird, Flame, Music, Heart, Moon } from "lucide-react";
import ZenScape from "./zen/ZenScape";

const SOUND_CATEGORIES = {
  nature: {
    name: "Nature",
    icon: Waves,
    color: "from-emerald-400 to-teal-500",
    sounds: [
      { id: "ocean", name: "Ocean Waves", description: "Calming beach sounds", frequency: 432 },
      { id: "rain", name: "Gentle Rain", description: "Soft rainfall on leaves", frequency: 396 },
      { id: "forest", name: "Forest Birds", description: "Morning birdsong in nature", frequency: 528 },
      { id: "stream", name: "Flowing Stream", description: "Peaceful water flowing", frequency: 417 },
    ],
  },
  ambient: {
    name: "Ambient",
    icon: Moon,
    color: "from-indigo-400 to-purple-500",
    sounds: [
      { id: "binaural-alpha", name: "Alpha Waves", description: "8-14 Hz for relaxation", frequency: 10 },
      { id: "binaural-theta", name: "Theta Waves", description: "4-8 Hz for meditation", frequency: 6 },
      { id: "binaural-delta", name: "Delta Waves", description: "0.5-4 Hz for deep sleep", frequency: 2 },
      { id: "white-noise", name: "White Noise", description: "Steady background sound", frequency: 0 },
    ],
  },
  healing: {
    name: "Healing Tones",
    icon: Heart,
    color: "from-rose-400 to-pink-500",
    sounds: [
      { id: "solfeggio-396", name: "396 Hz - Liberation", description: "Release fear and guilt", frequency: 396 },
      { id: "solfeggio-417", name: "417 Hz - Change", description: "Facilitate change", frequency: 417 },
      { id: "solfeggio-528", name: "528 Hz - Transformation", description: "DNA repair frequency", frequency: 528 },
      { id: "solfeggio-639", name: "639 Hz - Connection", description: "Harmonize relationships", frequency: 639 },
    ],
  },
};

const TIMER_OPTIONS = [
  { value: 5, label: "5 min" },
  { value: 10, label: "10 min" },
  { value: 15, label: "15 min" },
  { value: 30, label: "30 min" },
  { value: 60, label: "1 hour" },
  { value: 0, label: "Continuous" },
];

export default function SoundHealingPlayer() {
  const [selectedCategory, setSelectedCategory] = useState("nature");
  const [selectedSound, setSelectedSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  
  const audioContextRef = useRef(null);
  const oscillatorRef = useRef(null);
  const gainNodeRef = useRef(null);
  const noiseNodeRef = useRef(null);

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  useEffect(() => {
    let interval;
    if (isPlaying && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            stopAudio();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeRemaining]);

  const createAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContextRef.current;
  };

  const generateWhiteNoise = (audioContext) => {
    const bufferSize = 2 * audioContext.sampleRate;
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    
    const whiteNoise = audioContext.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;
    return whiteNoise;
  };

  const playSound = (sound) => {
    stopAudio();
    
    const audioContext = createAudioContext();
    
    gainNodeRef.current = audioContext.createGain();
    gainNodeRef.current.gain.value = isMuted ? 0 : volume / 100;
    gainNodeRef.current.connect(audioContext.destination);

    if (sound.id === "white-noise") {
      noiseNodeRef.current = generateWhiteNoise(audioContext);
      noiseNodeRef.current.connect(gainNodeRef.current);
      noiseNodeRef.current.start();
    } else if (sound.frequency > 0) {
      oscillatorRef.current = audioContext.createOscillator();
      oscillatorRef.current.type = "sine";
      oscillatorRef.current.frequency.value = sound.frequency;
      oscillatorRef.current.connect(gainNodeRef.current);
      oscillatorRef.current.start();
    }

    setSelectedSound(sound);
    setIsPlaying(true);
    
    if (timer > 0) {
      setTimeRemaining(timer * 60);
      setTotalMinutes(timer);
    }
  };

  const stopAudio = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current.disconnect();
      oscillatorRef.current = null;
    }
    if (noiseNodeRef.current) {
      noiseNodeRef.current.stop();
      noiseNodeRef.current.disconnect();
      noiseNodeRef.current = null;
    }
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      stopAudio();
    } else if (selectedSound) {
      playSound(selectedSound);
    }
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = isMuted ? 0 : newVolume / 100;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = !isMuted ? 0 : volume / 100;
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const category = SOUND_CATEGORIES[selectedCategory];
  const CategoryIcon = category.icon;

  return (
    <ZenScape
      buddyState={isPlaying ? "encouraged" : "calm"}
      buddySize={150}
      buddyLabel={isPlaying ? "Listening together — let the sound carry you." : "Pick a sound. We'll listen together."}
    >
    <div
      className="min-h-[500px] bg-gradient-to-br from-indigo-50/40 via-purple-50/40 to-pink-50/40 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-pink-950/30 rounded-3xl p-6 relative overflow-hidden"
      data-testid="sound-healing-player"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-400/20 to-purple-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-400/20 to-rose-500/20 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Music className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Sound Healing</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Therapeutic frequencies for wellness</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {Object.entries(SOUND_CATEGORIES).map(([key, cat]) => {
            const Icon = cat.icon;
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                  selectedCategory === key
                    ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                    : "bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800"
                }`}
                data-testid={`button-category-${key}`}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                {cat.name}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {category.sounds.map((sound) => (
            <button
              key={sound.id}
              onClick={() => playSound(sound)}
              className={`p-4 rounded-xl text-left transition-all ${
                selectedSound?.id === sound.id
                  ? `bg-gradient-to-r ${category.color} text-white shadow-lg transform scale-[1.02]`
                  : "bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:shadow-md"
              }`}
              data-testid={`button-sound-${sound.id}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold">{sound.name}</span>
                {selectedSound?.id === sound.id && isPlaying && (
                  <div className="flex gap-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-1 bg-white rounded-full animate-pulse"
                        style={{
                          height: `${8 + i * 4}px`,
                          animationDelay: `${i * 100}ms`,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
              <p className="text-sm opacity-80">{sound.description}</p>
              {sound.frequency > 0 && (
                <p className="text-xs mt-1 opacity-60">{sound.frequency} Hz</p>
              )}
            </button>
          ))}
        </div>

        {selectedSound && (
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">{selectedSound.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedSound.description}</p>
              </div>
              <button
                onClick={togglePlayPause}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${
                  isPlaying
                    ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white"
                    : `bg-gradient-to-r ${category.color} text-white`
                }`}
                data-testid="button-play-pause"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
              </button>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={toggleMute}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                data-testid="button-mute"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                data-testid="slider-volume"
                aria-label="Volume"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">{volume}%</span>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-500" aria-hidden="true" />
              <div className="flex gap-2 flex-wrap">
                {TIMER_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTimer(option.value)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                      timer === option.value
                        ? "bg-indigo-500 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                    data-testid={`button-timer-${option.value}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {timeRemaining > 0 && isPlaying && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span>Time Remaining</span>
                  <span className="font-mono">{formatTime(timeRemaining)}</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${category.color} transition-all duration-1000`}
                    style={{ width: `${(timeRemaining / (totalMinutes * 60)) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500" aria-hidden="true" />
            Benefits of Sound Healing
          </h4>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• Reduces stress and anxiety naturally</li>
            <li>• Promotes deep relaxation and better sleep</li>
            <li>• Enhances focus and concentration</li>
            <li>• Supports emotional balance and healing</li>
          </ul>
        </div>
      </div>
    </div>
    </ZenScape>
  );
}
