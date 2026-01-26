import { useState } from "react";
import { Link } from "wouter";
import { Flame, Calendar, TrendingUp, Award, Settings, X, ArrowRight, Check } from "lucide-react";
import SEO from "../../components/SEO";
import SafetyFooter from "../../components/ui/SafetyFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card.jsx";
import { Button } from "@/components/ui/Button.jsx";
import { Switch } from "@/components/ui/Switch";

const MOCK_STREAK_DATA = {
  currentStreak: 7,
  longestStreak: 14,
  totalDays: 45,
  thisWeek: [true, true, true, true, true, false, false],
  streakEnabled: true
};

const GENTLE_MESSAGES = [
  "Every moment is a fresh start.",
  "Progress isn't always linear, and that's okay.",
  "You're doing great just by being here.",
  "Self-compassion is the foundation of growth."
];

export default function ProgressStreaks() {
  const [data, setData] = useState(MOCK_STREAK_DATA);
  const [showSettings, setShowSettings] = useState(false);

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const randomMessage = GENTLE_MESSAGES[Math.floor(Math.random() * GENTLE_MESSAGES.length)];

  const toggleStreaks = () => {
    setData(prev => ({ ...prev, streakEnabled: !prev.streakEnabled }));
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Progress & Streaks — The Genuine Love Project"
        description="Celebrate your consistency with gentle streak tracking."
      />
      
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-primary mb-2">
              <Flame className="w-5 h-5" />
              <span className="text-sm font-medium">Your Journey</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Progress & Streaks
            </h1>
            <p className="text-muted-foreground">
              {randomMessage}
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setShowSettings(!showSettings)}
            data-testid="button-streak-settings"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </header>

        {showSettings && (
          <Card className="mb-6 border-amber-200 dark:border-amber-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Streak Tracking</h3>
                  <p className="text-sm text-muted-foreground">
                    Turn off if streak counting causes anxiety. Your progress is still valued.
                  </p>
                </div>
                <Switch
                  checked={data.streakEnabled}
                  onCheckedChange={toggleStreaks}
                  data-testid="switch-streak-toggle"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {data.streakEnabled ? (
          <>
            <div className="grid gap-4 sm:grid-cols-3 mb-8">
              <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-200 dark:border-orange-800">
                <CardContent className="p-6 text-center">
                  <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                    {data.currentStreak}
                  </div>
                  <div className="text-sm text-muted-foreground">Current Streak</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Award className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-3xl font-bold text-foreground">
                    {data.longestStreak}
                  </div>
                  <div className="text-sm text-muted-foreground">Longest Streak</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Calendar className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-3xl font-bold text-foreground">
                    {data.totalDays}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Days</div>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  This Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between gap-2">
                  {weekDays.map((day, i) => (
                    <div key={day} className="text-center flex-1">
                      <div className="text-xs text-muted-foreground mb-2">{day}</div>
                      <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${
                        data.thisWeek[i] 
                          ? "bg-primary text-white" 
                          : "bg-muted"
                      }`}>
                        {data.thisWeek[i] ? <Check className="w-5 h-5" /> : ""}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="mb-8 p-8 text-center">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">Streak Tracking is Off</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              That's completely okay. Your wellness journey is valid regardless of numbers. 
              Focus on what feels right for you.
            </p>
          </Card>
        )}

        <section className="text-center">
          <p className="text-muted-foreground mb-4">
            Ready to continue your practice?
          </p>
          <Link href="/tools">
            <Button data-testid="button-continue-practice">
              Explore Tools
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </section>
      </main>

      <SafetyFooter />
    </div>
  );
}
