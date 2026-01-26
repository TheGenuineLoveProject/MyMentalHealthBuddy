import { useState } from "react";
import { User, Award, Calendar, Heart, Shield, Share2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import SEO from "../components/SEO";

export default function UserProfile() {
  const [isOwnProfile] = useState(true);

  const profile = {
    displayName: "Wellness Seeker",
    joinDate: "March 2025",
    streakDays: 45,
    level: 12,
    xp: 2340,
    badges: [
      { id: 1, name: "Week Warrior", icon: "🏆", earned: true },
      { id: 2, name: "Journal Keeper", icon: "📔", earned: true },
      { id: 3, name: "Meditation Master", icon: "🧘", earned: true },
      { id: 4, name: "Community Helper", icon: "🤝", earned: false },
      { id: 5, name: "30-Day Streak", icon: "🔥", earned: true }
    ],
    stats: {
      journalEntries: 87,
      meditationMinutes: 420,
      toolsExplored: 24
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO title="My Profile — The Genuine Love Project" />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <Card className="mb-8">
          <CardContent className="pt-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              <div className="text-center md:text-left flex-1">
                <h1 className="text-2xl font-bold" data-testid="text-display-name">
                  {profile.displayName}
                </h1>
                <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2 mt-1">
                  <Calendar className="w-4 h-4" />
                  Member since {profile.joinDate}
                </p>
                <div className="flex gap-4 mt-4 justify-center md:justify-start">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{profile.streakDays}</p>
                    <p className="text-xs text-muted-foreground">Day Streak</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">Level {profile.level}</p>
                    <p className="text-xs text-muted-foreground">{profile.xp} XP</p>
                  </div>
                </div>
              </div>
              {isOwnProfile && (
                <Button variant="outline" className="min-h-[44px]" data-testid="button-edit-profile">
                  Edit Profile
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <p className="text-3xl font-bold">{profile.stats.journalEntries}</p>
              <p className="text-sm text-muted-foreground">Journal Entries</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <p className="text-3xl font-bold">{profile.stats.meditationMinutes}</p>
              <p className="text-sm text-muted-foreground">Minutes Meditating</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <p className="text-3xl font-bold">{profile.stats.toolsExplored}</p>
              <p className="text-sm text-muted-foreground">Tools Explored</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" /> Badges Earned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {profile.badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`flex flex-col items-center p-4 rounded-lg border ${
                    badge.earned
                      ? "bg-primary/5 border-primary/20"
                      : "bg-muted/50 border-muted opacity-50"
                  }`}
                >
                  <span className="text-3xl mb-2">{badge.icon}</span>
                  <span className="text-sm font-medium">{badge.name}</span>
                  {!badge.earned && <span className="text-xs text-muted-foreground">Locked</span>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Your profile is private by default. Only you can see your detailed progress.
              </p>
              <Button variant="link" className="p-0 h-auto text-blue-600 text-sm">
                Manage privacy settings
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
