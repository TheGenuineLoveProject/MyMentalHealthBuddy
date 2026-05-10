import { useState, useEffect } from "react";
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { useAuth } from "../hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const VOICE_TONES = [
  { id: "default", name: "Default", description: "Standard voice" },
  { id: "soothing", name: "Soothing", description: "Calm and gentle" },
  { id: "gentle-female", name: "Gentle Female", description: "Warm feminine voice" },
  { id: "calm-male", name: "Calm Male", description: "Steady masculine voice" },
  { id: "nurturing", name: "Nurturing", description: "Caring and supportive" }
];

const DEFAULT_VOICE_SETTINGS = {
  enabled: true,
  tone: "soothing",
  speed: 0.9,
  pitch: 1.0,
  volume: 0.8,
  autoPlay: false
};

export default function VoiceSettings({ compact = false }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState(DEFAULT_VOICE_SETTINGS);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadSettings();
    loadVoices();
  }, [user]);

  const loadVoices = () => {
    const loadAvailableVoices = () => {
      const available = speechSynthesis.getVoices();
      setVoices(available);
    };
    
    loadAvailableVoices();
    speechSynthesis.addEventListener("voiceschanged", loadAvailableVoices);
    return () => speechSynthesis.removeEventListener("voiceschanged", loadAvailableVoices);
  };

  const loadSettings = async () => {
    try {
      const stored = localStorage.getItem("glp-voice-settings");
      if (stored) {
        setSettings(JSON.parse(stored));
      }
      
      if (user) {
        const response = await fetch("/api/user/settings");
        if (response.ok) {
          const data = await response.json();
          if (data.preferences?.voiceSettings) {
            setSettings(data.preferences.voiceSettings);
          }
        }
      }
    } catch (err) {
      console.error("Failed to load voice settings:", err);
    }
  };

  const saveSettings = async () => {
    try {
      localStorage.setItem("glp-voice-settings", JSON.stringify(settings));
      
      if (user) {
        await fetch("/api/user/settings", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ preferences: { voiceSettings: settings } })
        });
      }

      toast({
        title: "Voice settings saved",
        description: "Your preferences have been updated."
      });
      setHasChanges(false);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save settings.",
        variant: "destructive"
      });
    }
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const testVoice = () => {
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(
      "You are worthy of love. You are enough, exactly as you are."
    );
    
    utterance.rate = settings.speed;
    utterance.pitch = settings.pitch;
    utterance.volume = settings.volume;

    const preferredVoice = voices.find(v => {
      if (settings.tone === "gentle-female") return v.name.includes("Female") || v.name.includes("Samantha");
      if (settings.tone === "calm-male") return v.name.includes("Male") || v.name.includes("Daniel");
      return v.lang.startsWith("en");
    });
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    setIsSpeaking(true);
    speechSynthesis.speak(utterance);
  };

  if (compact) {
    return (
      <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: 'var(--glp-sage-10)' }} data-testid="voice-settings-compact">
        <button
          onClick={() => updateSetting("enabled", !settings.enabled)}
          className="p-2 rounded-lg transition-colors"
          style={{ background: settings.enabled ? 'var(--glp-sage)' : 'var(--glp-sage-20)' }}
          data-testid="toggle-voice-compact"
        >
          {settings.enabled ? (
            <Volume2 className="w-5 h-5 text-white" />
          ) : (
            <VolumeX className="w-5 h-5" style={{ color: 'var(--glp-ink)' }} />
          )}
        </button>
        <div className="flex-1">
          <span className="font-medium" style={{ color: 'var(--glp-ink)' }}>Voice Affirmations</span>
          <span className="text-sm ml-2" style={{ color: 'var(--glp-ink)', opacity: 0.7 }}>
            {settings.enabled ? "On" : "Off"}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6" data-testid="voice-settings">
      <div className="rounded-3xl p-8 shadow-lg" style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-15)' }}>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--glp-rose-30), var(--glp-rose-50))' }}>
            <Volume2 className="w-7 h-7" style={{ color: 'var(--glp-rose)' }} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--glp-ink)' }}>
              Voice Settings
            </h2>
            <p style={{ color: 'var(--glp-ink)', opacity: 0.7 }}>
              Customize your voice affirmation experience
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'var(--glp-sage-10)' }}>
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5" style={{ color: 'var(--glp-sage)' }} />
              <span className="font-medium" style={{ color: 'var(--glp-ink)' }}>Enable Voice Affirmations</span>
            </div>
            <button
              onClick={() => updateSetting("enabled", !settings.enabled)}
              className={`w-14 h-8 rounded-full transition-all relative ${settings.enabled ? 'bg-gradient-to-r from-[var(--glp-sage)] to-[var(--glp-sage-deep)]' : 'bg-gray-300'}`}
              data-testid="toggle-voice-enabled"
            >
              <span className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${settings.enabled ? 'right-1' : 'left-1'}`} />
            </button>
          </div>

          <div className={`space-y-5 transition-opacity ${settings.enabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <div>
              <label className="block mb-3 font-medium" style={{ color: 'var(--glp-ink)' }}>Voice Tone</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {VOICE_TONES.map(tone => (
                  <button
                    key={tone.id}
                    onClick={() => updateSetting("tone", tone.id)}
                    className={`p-3 rounded-xl text-left transition-all ${
                      settings.tone === tone.id 
                        ? 'ring-2 ring-[var(--glp-sage)]' 
                        : ''
                    }`}
                    style={{ 
                      background: settings.tone === tone.id ? 'var(--glp-sage-10)' : 'var(--glp-paper)',
                      border: '1px solid var(--glp-sage-15)'
                    }}
                    data-testid={`voice-tone-${tone.id}`}
                  >
                    <div className="font-medium" style={{ color: 'var(--glp-ink)' }}>{tone.name}</div>
                    <div className="text-xs" style={{ color: 'var(--glp-ink)', opacity: 0.7 }}>{tone.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center justify-between mb-2">
                <span className="font-medium" style={{ color: 'var(--glp-ink)' }}>Speed</span>
                <span className="text-sm" style={{ color: 'var(--glp-sage)' }}>{settings.speed.toFixed(1)}x</span>
              </label>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={settings.speed}
                onChange={(e) => updateSetting("speed", parseFloat(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{ background: 'var(--glp-sage-20)' }}
                data-testid="slider-speed"
              />
              <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--glp-ink)', opacity: 0.5 }}>
                <span>Slower</span>
                <span>Faster</span>
              </div>
            </div>

            <div>
              <label className="flex items-center justify-between mb-2">
                <span className="font-medium" style={{ color: 'var(--glp-ink)' }}>Pitch</span>
                <span className="text-sm" style={{ color: 'var(--glp-sage)' }}>{settings.pitch.toFixed(1)}</span>
              </label>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={settings.pitch}
                onChange={(e) => updateSetting("pitch", parseFloat(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{ background: 'var(--glp-sage-20)' }}
                data-testid="slider-pitch"
              />
              <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--glp-ink)', opacity: 0.5 }}>
                <span>Lower</span>
                <span>Higher</span>
              </div>
            </div>

            <div>
              <label className="flex items-center justify-between mb-2">
                <span className="font-medium" style={{ color: 'var(--glp-ink)' }}>Volume</span>
                <span className="text-sm" style={{ color: 'var(--glp-sage)' }}>{Math.round(settings.volume * 100)}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.volume}
                onChange={(e) => updateSetting("volume", parseFloat(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{ background: 'var(--glp-sage-20)' }}
                data-testid="slider-volume"
              />
            </div>

            <button
              onClick={testVoice}
              className="w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all"
              style={{ background: 'var(--glp-rose-15)', color: 'var(--glp-rose-dark)' }}
              data-testid="button-test-voice"
            >
              {isSpeaking ? (
                <>
                  <Pause className="w-5 h-5" />
                  Stop Preview
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Preview Voice
                </>
              )}
            </button>
          </div>

          {hasChanges && (
            <button
              onClick={saveSettings}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))' }}
              data-testid="button-save-voice"
            >
              Save Voice Settings
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
