import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Instagram, Twitter, Facebook, Linkedin, Clock, CheckCircle2 } from "lucide-react";
import { SiTiktok } from "react-icons/si";

/**
 * Social Calendar - Schedule and manage social media posts
 */
export default function SocialCalendarPage() {
  const scheduledPosts = [
    {
      id: 1,
      content: "5 simple mindfulness exercises you can do in 5 minutes 🧘‍♀️",
      platforms: ["instagram", "twitter", "facebook"],
      scheduledFor: "Today, 2:00 PM",
      status: "scheduled",
      engagement: { likes: 0, shares: 0 }
    },
    {
      id: 2,
      content: "New blog post: Understanding anxiety and how to manage it 💙",
      platforms: ["linkedin", "twitter"],
      scheduledFor: "Tomorrow, 10:00 AM",
      status: "scheduled",
      engagement: { likes: 0, shares: 0 }
    },
    {
      id: 3,
      content: "Weekly check-in: How are you feeling today? 💭",
      platforms: ["instagram", "twitter", "tiktok"],
      scheduledFor: "Dec 30, 6:00 PM",
      status: "approved",
      engagement: { likes: 0, shares: 0 }
    }
  ];

  const getPlatformIcon = (platform: string) => {
    const icons: Record<string, any> = {
      instagram: Instagram,
      twitter: Twitter,
      facebook: Facebook,
      linkedin: Linkedin,
      tiktok: SiTiktok
    };
    return icons[platform] || CalendarIcon;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: "bg-gray-500",
      approved: "bg-green-500",
      scheduled: "bg-blue-500",
      published: "bg-purple-500"
    };
    return colors[status] || "bg-gray-500";
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2" data-testid="text-page-title">
          Social Calendar
        </h1>
        <p className="text-muted-foreground text-lg">
          Schedule and manage your social media presence across all platforms
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-6">
          <div className="text-sm text-muted-foreground mb-1">Scheduled Posts</div>
          <div className="text-3xl font-bold" data-testid="text-stats-scheduled">12</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-muted-foreground mb-1">Published Today</div>
          <div className="text-3xl font-bold" data-testid="text-stats-published">3</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-muted-foreground mb-1">Total Engagement</div>
          <div className="text-3xl font-bold" data-testid="text-stats-engagement">1.2k</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-muted-foreground mb-1">Pending Approval</div>
          <div className="text-3xl font-bold" data-testid="text-stats-pending">5</div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 mb-6">
        <Button data-testid="button-new-post">
          <CalendarIcon className="h-4 w-4 mr-2" />
          Schedule New Post
        </Button>
        <Button variant="outline" data-testid="button-view-calendar">
          <CalendarIcon className="h-4 w-4 mr-2" />
          Calendar View
        </Button>
        <Button variant="outline" data-testid="button-analytics">
          View Analytics
        </Button>
      </div>

      {/* Platform Connections */}
      <Card className="p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Connected Platforms</h3>
        <div className="flex gap-3 flex-wrap">
          <Badge variant="default" className="flex items-center gap-2 py-2 px-3" data-testid="badge-platform-instagram">
            <Instagram className="h-4 w-4" />
            Instagram
            <CheckCircle2 className="h-3 w-3 text-green-400" />
          </Badge>
          <Badge variant="default" className="flex items-center gap-2 py-2 px-3" data-testid="badge-platform-twitter">
            <Twitter className="h-4 w-4" />
            Twitter/X
            <CheckCircle2 className="h-3 w-3 text-green-400" />
          </Badge>
          <Badge variant="default" className="flex items-center gap-2 py-2 px-3" data-testid="badge-platform-facebook">
            <Facebook className="h-4 w-4" />
            Facebook
            <CheckCircle2 className="h-3 w-3 text-green-400" />
          </Badge>
          <Badge variant="default" className="flex items-center gap-2 py-2 px-3" data-testid="badge-platform-linkedin">
            <Linkedin className="h-4 w-4" />
            LinkedIn
            <CheckCircle2 className="h-3 w-3 text-green-400" />
          </Badge>
          <Badge variant="outline" className="flex items-center gap-2 py-2 px-3" data-testid="badge-platform-tiktok">
            <SiTiktok className="h-4 w-4" />
            TikTok
            <span className="text-xs text-muted-foreground">Not connected</span>
          </Badge>
        </div>
      </Card>

      {/* Scheduled Posts */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold mb-4">Upcoming Posts</h2>
        {scheduledPosts.map((post) => (
          <Card key={post.id} className="p-6 hover:shadow-lg transition-shadow" data-testid={`card-post-${post.id}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`h-2 w-2 rounded-full ${getStatusColor(post.status)}`} />
                  <Badge variant="outline" data-testid={`badge-status-${post.id}`}>
                    {post.status}
                  </Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    {post.scheduledFor}
                  </div>
                </div>
                <p className="text-lg mb-3" data-testid={`text-content-${post.id}`}>
                  {post.content}
                </p>
                <div className="flex gap-2">
                  {post.platforms.map((platform) => {
                    const Icon = getPlatformIcon(platform);
                    return (
                      <Badge key={platform} variant="secondary" className="flex items-center gap-1" data-testid={`badge-platform-${post.id}-${platform}`}>
                        <Icon className="h-3 w-3" />
                        {platform}
                      </Badge>
                    );
                  })}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" data-testid={`button-edit-${post.id}`}>
                  Edit
                </Button>
                <Button variant="outline" size="sm" data-testid={`button-preview-${post.id}`}>
                  Preview
                </Button>
              </div>
            </div>
            {post.status === "published" && (
              <div className="pt-4 border-t flex gap-6 text-sm text-muted-foreground">
                <div>
                  <span className="font-medium">{post.engagement.likes}</span> Likes
                </div>
                <div>
                  <span className="font-medium">{post.engagement.shares}</span> Shares
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Best Times to Post */}
      <Card className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
        <h3 className="text-xl font-semibold mb-4">📊 Best Times to Post</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="font-medium text-blue-600 dark:text-blue-400">Weekdays</div>
            <div className="text-sm text-muted-foreground">10:00 AM - 2:00 PM</div>
          </div>
          <div>
            <div className="font-medium text-purple-600 dark:text-purple-400">Evenings</div>
            <div className="text-sm text-muted-foreground">6:00 PM - 9:00 PM</div>
          </div>
          <div>
            <div className="font-medium text-green-600 dark:text-green-400">Weekends</div>
            <div className="text-sm text-muted-foreground">12:00 PM - 4:00 PM</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
