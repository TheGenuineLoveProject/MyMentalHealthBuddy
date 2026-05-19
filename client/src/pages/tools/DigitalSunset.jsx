import { useState } from "react";
import { Link } from "wouter";
import { Moon, ArrowLeft, Check, Clock, Smartphone, Monitor, Bell, Eye } from "lucide-react";
import SEO from "../../components/SEO";
import SafetyFooter from "../../components/ui/ReflectionFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card.jsx";
import { Button } from "@/components/ui/Button.jsx";
import { Switch } from "@/components/ui/Switch";

const DIGITAL_SUNSET_CHECKLIST = [
  { id: "notifications", icon: Bell, label: "Turn off non-essential notifications", tip: "Keep only emergency contacts" },
  { id: "bluelight", icon: Eye, label: "Enable night mode / blue light filter", tip: "Reduces eye strain" },
  { id: "charging", icon: Smartphone, label: "Put phone outside bedroom to charge", tip: "Reduces midnight scrolling temptation" },
  { id: "screens", icon: Monitor, label: "Turn off TV and computers", tip: "At least 30 min before bed" },
  { id: "dimming", icon: Moon, label: "Dim household lights", tip: "Signals your body it's time to wind down" }
];

const EVENING_ALTERNATIVES = [
  "Read a physical book",
  "Take a warm bath or shower",
  "Listen to calming music",
  "Practice gentle stretching",
  "Write in a journal",
  "Have a quiet conversation",
  "Practice breathing exercises",
  "Prepare for tomorrow calmly"
];

export default function DigitalSunset() {
  const [checkedItems, setCheckedItems] = useState({});
  const [sunsetTime, setSunsetTime] = useState("21:00");

  const toggleItem = (id) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const progress = (completedCount / DIGITAL_SUNSET_CHECKLIST.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-950 to-background dark:from-violet-950 dark:to-background">
      <SEO 
        title="Digital Sunset — The Genuine Love Project"
        description="A wind-down ritual to prepare for restful sleep."
      />
      
      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <Link href="/tools">
          <Button variant="ghost" size="sm" className="mb-6 text-white/80 hover:text-white hover:bg-white/10" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tools
          </Button>
        </Link>

        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-900/50 text-violet-200 text-sm mb-4">
            <Moon className="w-4 h-4" />
            <span>Evening Ritual</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Digital Sunset
          </h1>
          <p className="text-violet-200/80">
            Wind down from screens to prepare for restful sleep.
          </p>
        </header>

        <Card className="mb-6 bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Your Sunset Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <input
                type="time"
                value={sunsetTime}
                onChange={(e) => setSunsetTime(e.target.value)}
                className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-lg"
                data-testid="input-sunset-time"
              />
              <span className="text-violet-200/80">
                Start winding down at this time each evening
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-lg text-white">Wind-Down Checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {DIGITAL_SUNSET_CHECKLIST.map(item => {
              const Icon = item.icon;
              const isChecked = checkedItems[item.id];
              return (
                <div 
                  key={item.id}
                  className={`p-4 rounded-lg transition-all cursor-pointer ${
                    isChecked ? "bg-green-500/20" : "bg-white/5 hover:bg-white/10"
                  }`}
                  onClick={() => toggleItem(item.id)}
                  data-testid={`checklist-${item.id}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isChecked ? "bg-green-500" : "bg-white/10"
                    }`}>
                      {isChecked ? (
                        <Check className="w-5 h-5 text-white" />
                      ) : (
                        <Icon className="w-5 h-5 text-violet-300" />
                      )}
                    </div>
                    <div>
                      <span className={`font-medium ${isChecked ? "text-green-200" : "text-white"}`}>
                        {item.label}
                      </span>
                      <p className="text-xs text-violet-300/60">{item.tip}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <div className="mb-6">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-violet-400 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center text-sm text-violet-200/60 mt-2">
            {completedCount} of {DIGITAL_SUNSET_CHECKLIST.length} complete
          </p>
        </div>

        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-lg text-white">Instead of Screens, Try...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {EVENING_ALTERNATIVES.map((alt, i) => (
                <span 
                  key={i}
                  className="px-3 py-1.5 rounded-full bg-white/10 text-violet-200 text-sm"
                >
                  {alt}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      <SafetyFooter />
    </div>
  );
}
