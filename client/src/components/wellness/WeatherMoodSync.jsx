import { useState, useEffect } from "react";
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Wind, Droplets, Moon, Loader2, MapPin, RefreshCw } from "lucide-react";

const WEATHER_AFFIRMATIONS = {
  Clear: {
    icon: Sun,
    color: "#fbbf24",
    gradient: "from-amber-400 to-orange-400",
    affirmation: "Let your light shine. The sun reminds us that warmth always returns.",
    suggestion: "This is a wonderful day to take a mindful walk outside.",
    background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
  },
  Clouds: {
    icon: Cloud,
    color: "#94a3b8",
    gradient: "from-slate-400 to-gray-500",
    affirmation: "Even behind clouds, the sun is always shining. Your inner light is constant too.",
    suggestion: "Find comfort in gentle introspection today.",
    background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
  },
  Rain: {
    icon: CloudRain,
    color: "#3b82f6",
    gradient: "from-blue-400 to-indigo-500",
    affirmation: "Rain nourishes the earth, just as tears can cleanse and heal the soul.",
    suggestion: "Listen to the rhythm of the rain. Let it wash away what no longer serves you.",
    background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
  },
  Drizzle: {
    icon: Droplets,
    color: "#60a5fa",
    gradient: "from-sky-400 to-blue-400",
    affirmation: "Gentle drops remind us that softness has its own quiet strength.",
    suggestion: "Practice self-compassion today, one small act at a time.",
    background: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
  },
  Thunderstorm: {
    icon: CloudLightning,
    color: "#8b5cf6",
    gradient: "from-violet-500 to-purple-600",
    affirmation: "After every storm comes clarity. You are stronger than any turbulence.",
    suggestion: "Ground yourself. You are safe. This too shall pass.",
    background: "linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)",
  },
  Snow: {
    icon: CloudSnow,
    color: "#e2e8f0",
    gradient: "from-slate-200 to-blue-200",
    affirmation: "Snow blankets the world in stillness. Give yourself permission to rest.",
    suggestion: "Embrace the quiet. Wrap yourself in warmth and peace.",
    background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
  },
  Mist: {
    icon: Cloud,
    color: "#a1a1aa",
    gradient: "from-zinc-300 to-gray-400",
    affirmation: "Clarity comes when you slow down. Trust the path even when you can't see far ahead.",
    suggestion: "Focus on just the next step. That's all you need.",
    background: "linear-gradient(135deg, #fafafa 0%, #e4e4e7 100%)",
  },
  Fog: {
    icon: Cloud,
    color: "#9ca3af",
    gradient: "from-gray-300 to-slate-400",
    affirmation: "In the fog, we learn to trust our inner compass. Your intuition is your guide.",
    suggestion: "Breathe deeply. Your clarity will emerge.",
    background: "linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)",
  },
  Wind: {
    icon: Wind,
    color: "#06b6d4",
    gradient: "from-cyan-400 to-teal-500",
    affirmation: "The wind carries away what we no longer need. Let go and trust the flow.",
    suggestion: "What are you ready to release today?",
    background: "linear-gradient(135deg, #cffafe 0%, #a5f3fc 100%)",
  },
  Night: {
    icon: Moon,
    color: "#6366f1",
    gradient: "from-indigo-500 to-purple-600",
    affirmation: "The night sky holds infinite possibilities. Rest now, dream deeply.",
    suggestion: "Honor your need for rest. Tomorrow is a new beginning.",
    background: "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)",
  },
};

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export default function WeatherMoodSync({ className = "" }) {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState("");
  const [inputLocation, setInputLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [usingGeolocation, setUsingGeolocation] = useState(false);

  async function fetchWeatherByCity(city) {
    if (!OPENWEATHER_API_KEY) {
      setWeather({
        condition: "Clear",
        temp: 72,
        city: city || "Your Location",
        description: "sunny",
      });
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=imperial&appid=${OPENWEATHER_API_KEY}`
      );
      if (!res.ok) throw new Error("City not found");
      const data = await res.json();
      
      const hour = new Date().getHours();
      const isNight = hour < 6 || hour > 20;
      
      setWeather({
        condition: isNight && data.weather[0].main === "Clear" ? "Night" : data.weather[0].main,
        temp: Math.round(data.main.temp),
        city: data.name,
        description: data.weather[0].description,
      });
      setLocation(data.name);
    } catch (err) {
      setError(err.message || "Could not fetch weather");
    } finally {
      setLoading(false);
    }
  }

  async function fetchWeatherByCoords(lat, lon) {
    if (!OPENWEATHER_API_KEY) {
      setWeather({
        condition: "Clear",
        temp: 72,
        city: "Your Location",
        description: "sunny",
      });
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${OPENWEATHER_API_KEY}`
      );
      if (!res.ok) throw new Error("Could not get weather");
      const data = await res.json();
      
      const hour = new Date().getHours();
      const isNight = hour < 6 || hour > 20;
      
      setWeather({
        condition: isNight && data.weather[0].main === "Clear" ? "Night" : data.weather[0].main,
        temp: Math.round(data.main.temp),
        city: data.name,
        description: data.weather[0].description,
      });
      setLocation(data.name);
    } catch (err) {
      setError(err.message || "Could not fetch weather");
    } finally {
      setLoading(false);
    }
  }

  function handleUseLocation() {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }
    
    setUsingGeolocation(true);
    setLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
        setUsingGeolocation(false);
      },
      (err) => {
        setError("Could not get your location. Please enter a city.");
        setUsingGeolocation(false);
        setLoading(false);
      }
    );
  }

  function handleCitySubmit(e) {
    e.preventDefault();
    if (inputLocation.trim()) {
      fetchWeatherByCity(inputLocation.trim());
    }
  }

  useEffect(() => {
    if (!OPENWEATHER_API_KEY) {
      setWeather({
        condition: "Clear",
        temp: 72,
        city: "Demo Mode",
        description: "Weather sync is ready",
      });
    }
  }, []);

  const weatherData = weather ? WEATHER_AFFIRMATIONS[weather.condition] || WEATHER_AFFIRMATIONS.Clear : null;
  const WeatherIcon = weatherData?.icon || Sun;

  return (
    <div className={`weather-mood-sync ${className}`} data-testid="weather-mood-sync">
      <div 
        className="rounded-xl shadow-lg border border-sageGreen/20 dark:border-gray-700 overflow-hidden transition-all duration-500"
        style={{ background: weatherData?.background || "linear-gradient(135deg, #f8f9fa 0%, #e8f5e9 100%)" }}
      >
        <div className="p-6">
          {!weather && !loading && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-softWhite/70 flex items-center justify-center mb-4">
                  <Sun className="w-8 h-8 text-metallicGold" aria-hidden="true" />
                </div>
                <h2 className="font-serif text-xl font-semibold text-deepTeal">Weather Mood Sync</h2>
                <p className="font-sans text-sm text-deepTeal/70 mt-1">Connect with nature's rhythm for healing affirmations</p>
              </div>

              <form onSubmit={handleCitySubmit} className="flex gap-2">
                <input
                  type="text"
                  value={inputLocation}
                  onChange={(e) => setInputLocation(e.target.value)}
                  placeholder="Enter your city..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-sageGreen/30 bg-softWhite/80 text-deepTeal placeholder-deepTeal/40 font-sans focus:ring-2 focus:ring-sageGreen focus:border-transparent transition"
                  data-testid="city-input"
                />
                <button
                  type="submit"
                  disabled={!inputLocation.trim()}
                  className="px-4 py-2.5 rounded-xl bg-softWhite text-deepTeal font-sans font-medium hover:bg-sageGreen/10 disabled:opacity-50 transition border border-sageGreen/30"
                  data-testid="submit-city"
                >
                  Go
                </button>
              </form>

              <button
                type="button"
                onClick={handleUseLocation}
                disabled={usingGeolocation}
                className="w-full py-2.5 rounded-xl bg-softWhite/60 text-deepTeal font-sans font-medium hover:bg-softWhite/80 transition flex items-center justify-center gap-2 border border-sageGreen/30"
                data-testid="use-location"
              >
                <MapPin className="w-4 h-4" aria-hidden="true" />
                Use My Location
              </button>
            </div>
          )}

          {loading && (
            <div className="py-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-3" aria-hidden="true" />
              <p className="text-gray-600">Finding your weather...</p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm text-center" role="alert" data-testid="weather-error">
              {error}
              <button
                onClick={() => setError("")}
                className="block mx-auto mt-2 text-red-500 underline"
                data-testid="weather-retry"
              >
                Try again
              </button>
            </div>
          )}

          {weather && !loading && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${weatherData?.color}40, ${weatherData?.color}20)` }}
                  >
                    <WeatherIcon 
                      className="w-8 h-8" 
                      style={{ color: weatherData?.color }} 
                      aria-hidden="true" 
                    />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{weather.temp}°F</p>
                    <p className="text-sm text-gray-600 capitalize">{weather.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <MapPin className="w-3 h-3" aria-hidden="true" />
                    {weather.city}
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-white/60 backdrop-blur-sm border border-white/50">
                <p className="text-lg font-medium text-gray-800 leading-relaxed" data-testid="affirmation">
                  "{weatherData?.affirmation}"
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/40 border border-white/30">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Gentle suggestion:</span> {weatherData?.suggestion}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setWeather(null);
                  setInputLocation("");
                }}
                className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-2 transition"
                data-testid="refresh-weather"
              >
                <RefreshCw className="w-3 h-3" aria-hidden="true" />
                Check different location
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
