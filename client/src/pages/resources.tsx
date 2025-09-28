/** 
 * © 2025 Aaliyah Draws Art LLC. All rights reserved.
 * Unauthorized copying or distribution of this file is prohibited.
 * Built with GPT-4o, MIT/Proprietary license, integrated with evidence-based mental health models.
 */
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Video, Headphones, FileText, Heart, Brain, Search, ExternalLink, Star, Clock } from "lucide-react";

const resourceCategories = {
  articles: {
    icon: FileText,
    title: "Articles",
    description: "Educational content about mental health"
  },
  videos: {
    icon: Video,
    title: "Videos",
    description: "Watch helpful mental health videos"
  },
  exercises: {
    icon: Brain,
    title: "Exercises",
    description: "Interactive mental wellness exercises"
  },
  podcasts: {
    icon: Headphones,
    title: "Podcasts",
    description: "Listen to mental health discussions"
  }
};

// Static resources data (in production, this would come from API)
const staticResources = {
  articles: [
    {
      id: "1",
      title: "Understanding Anxiety: A Complete Guide",
      description: "Learn about anxiety symptoms, causes, and effective coping strategies.",
      category: "Anxiety",
      duration: "10 min read",
      rating: 4.8,
      url: "#",
      featured: true
    },
    {
      id: "2",
      title: "Building Resilience in Difficult Times",
      description: "Practical techniques to strengthen your emotional resilience.",
      category: "Resilience",
      duration: "8 min read",
      rating: 4.9,
      url: "#"
    },
    {
      id: "3",
      title: "Sleep and Mental Health: The Connection",
      description: "How sleep affects your mental well-being and tips for better rest.",
      category: "Sleep",
      duration: "12 min read",
      rating: 4.7,
      url: "#"
    },
    {
      id: "4",
      title: "Mindfulness for Beginners",
      description: "Start your mindfulness journey with these simple techniques.",
      category: "Mindfulness",
      duration: "6 min read",
      rating: 4.6,
      url: "#"
    }
  ],
  videos: [
    {
      id: "v1",
      title: "Guided Meditation for Anxiety Relief",
      description: "A 15-minute guided meditation to calm your mind.",
      category: "Meditation",
      duration: "15 min",
      rating: 4.9,
      url: "#",
      featured: true
    },
    {
      id: "v2",
      title: "Understanding Depression",
      description: "Expert insights on recognizing and managing depression.",
      category: "Depression",
      duration: "20 min",
      rating: 4.8,
      url: "#"
    },
    {
      id: "v3",
      title: "Breathing Techniques for Stress",
      description: "Learn effective breathing exercises for immediate stress relief.",
      category: "Stress",
      duration: "10 min",
      rating: 4.7,
      url: "#"
    }
  ],
  exercises: [
    {
      id: "e1",
      title: "Progressive Muscle Relaxation",
      description: "Step-by-step guide to release physical tension.",
      category: "Relaxation",
      duration: "20 min",
      rating: 4.8,
      url: "#",
      featured: true
    },
    {
      id: "e2",
      title: "Gratitude Journal Prompts",
      description: "Daily prompts to cultivate gratitude and positivity.",
      category: "Journaling",
      duration: "10 min",
      rating: 4.6,
      url: "#"
    },
    {
      id: "e3",
      title: "Cognitive Restructuring Worksheet",
      description: "Challenge and reframe negative thought patterns.",
      category: "CBT",
      duration: "30 min",
      rating: 4.9,
      url: "#"
    }
  ],
  podcasts: [
    {
      id: "p1",
      title: "Mental Health Matters",
      description: "Weekly discussions on mental health topics with experts.",
      category: "General",
      duration: "45 min",
      rating: 4.8,
      url: "#",
      featured: true
    },
    {
      id: "p2",
      title: "The Anxiety Coach",
      description: "Practical advice for managing anxiety in daily life.",
      category: "Anxiety",
      duration: "30 min",
      rating: 4.7,
      url: "#"
    }
  ]
};

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("articles");

  // In production, this would fetch from API
  const { data: resources = staticResources } = useQuery({
    queryKey: ['/api/resources'],
    queryFn: async () => staticResources,
    staleTime: 3600000 // Cache for 1 hour
  });

  const filterResources = (items: any[]) => {
    return items.filter(item => {
      const matchesSearch = !searchQuery || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  };

  const categories = ["all", "Anxiety", "Depression", "Stress", "Sleep", "Mindfulness", "CBT", "Meditation"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center items-center gap-3 mb-4">
            <BookOpen className="h-10 w-10 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Mental Health Resources
            </h1>
            <Heart className="h-9 w-9 text-pink-500" />
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our curated collection of articles, videos, exercises, and podcasts to support your mental wellness journey
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-resources"
            />
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(category => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer px-3 py-1"
                onClick={() => setSelectedCategory(category)}
                data-testid={`category-${category.toLowerCase()}`}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Resource Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-4">
            {Object.entries(resourceCategories).map(([key, { icon: Icon, title }]) => (
              <TabsTrigger key={key} value={key} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{title}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tab Contents */}
          {Object.keys(resourceCategories).map(categoryKey => (
            <TabsContent key={categoryKey} value={categoryKey}>
              <ScrollArea className="h-[600px] pr-4">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filterResources(resources[categoryKey] || []).map((resource: any) => (
                    <Card key={resource.id} className={`hover:shadow-lg transition-shadow ${resource.featured ? 'ring-2 ring-purple-500' : ''}`}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <Badge variant="secondary" className="mb-2">
                            {resource.category}
                          </Badge>
                          {resource.featured && (
                            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                          )}
                        </div>
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                        <CardDescription>{resource.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {resource.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500" />
                              {resource.rating}
                            </span>
                          </div>
                        </div>
                        <Button
                          className="w-full"
                          variant={resource.featured ? "default" : "outline"}
                          data-testid={`resource-${resource.id}`}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Access Resource
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {filterResources(resources[categoryKey] || []).length === 0 && (
                  <div className="text-center py-12">
                    <Brain className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No resources found matching your criteria</p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>

        {/* Help Section */}
        <div className="mt-12 text-center p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Need immediate support?</h3>
          <p className="text-gray-700 mb-4">
            If you're in crisis or need immediate help, please reach out:
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="destructive">
              Crisis Hotline: 988
            </Button>
            <Button variant="outline">
              Text HOME to 741741
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}