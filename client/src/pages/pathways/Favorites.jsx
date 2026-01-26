import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Heart, Star, Bookmark, Trash2, ArrowRight, Grid, List, Search } from "lucide-react";
import SEO from "../../components/SEO";
import SafetyFooter from "../../components/ui/SafetyFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card.jsx";
import { Button } from "@/components/ui/Button.jsx";
import { Input } from "@/components/ui/Input";
import { queryClient } from "../../lib/queryClient";

const MOCK_FAVORITES = [
  { id: "1", type: "tool", title: "Mood Tracker", path: "/mood", category: "Self-Awareness", savedAt: "2026-01-20" },
  { id: "2", type: "tool", title: "Breathwork", path: "/tools/breathwork", category: "Calm", savedAt: "2026-01-19" },
  { id: "3", type: "page", title: "Self-Love Guide", path: "/wisdom/self-love", category: "Wisdom", savedAt: "2026-01-18" },
  { id: "4", type: "tool", title: "Gratitude Journal", path: "/gratitude", category: "Positivity", savedAt: "2026-01-17" },
  { id: "5", type: "page", title: "Boundaries 101", path: "/wisdom/boundaries", category: "Relationships", savedAt: "2026-01-15" }
];

export default function Favorites() {
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState(MOCK_FAVORITES);

  const filteredFavorites = favorites.filter(fav => 
    fav.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fav.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const removeFavorite = (id) => {
    setFavorites(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="My Favorites — The Genuine Love Project"
        description="Quick access to your saved tools and pages."
      />
      
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <header className="mb-8">
          <div className="flex items-center gap-2 text-primary mb-2">
            <Heart className="w-5 h-5" />
            <span className="text-sm font-medium">Quick Access</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            My Favorites
          </h1>
          <p className="text-muted-foreground">
            Your saved tools and pages for easy access.
          </p>
        </header>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search favorites..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search-favorites"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
              data-testid="button-view-grid"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
              data-testid="button-view-list"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {filteredFavorites.length === 0 ? (
          <Card className="p-12 text-center">
            <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">No favorites yet</h2>
            <p className="text-muted-foreground mb-4">
              Save tools and pages you love for quick access.
            </p>
            <Link href="/tools">
              <Button data-testid="button-browse-tools">
                Browse Tools
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </Card>
        ) : (
          <div className={viewMode === "grid" ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" : "space-y-3"}>
            {filteredFavorites.map(favorite => (
              <Card 
                key={favorite.id}
                className={`group hover:shadow-md transition-all ${viewMode === "list" ? "flex items-center" : ""}`}
                data-testid={`card-favorite-${favorite.id}`}
              >
                <CardContent className={`p-4 ${viewMode === "list" ? "flex items-center justify-between w-full" : ""}`}>
                  <div className={viewMode === "list" ? "flex items-center gap-4" : ""}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        favorite.type === "tool" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                      }`}>
                        {favorite.type}
                      </span>
                      <span className="text-xs text-muted-foreground">{favorite.category}</span>
                    </div>
                    <h3 className="font-medium group-hover:text-primary transition-colors">
                      {favorite.title}
                    </h3>
                  </div>
                  <div className={`flex items-center gap-2 ${viewMode === "grid" ? "mt-4" : ""}`}>
                    <Link href={favorite.path}>
                      <Button variant="ghost" size="sm" data-testid={`button-open-${favorite.id}`}>
                        Open
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => removeFavorite(favorite.id)}
                      data-testid={`button-remove-${favorite.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <SafetyFooter />
    </div>
  );
}
