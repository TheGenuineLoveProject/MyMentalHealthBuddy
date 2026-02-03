import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Heart, Star, Bookmark, Trash2, ArrowRight, Grid, List, Search, RefreshCw, AlertCircle } from "lucide-react";
import SEO from "../../components/SEO";
import SafetyFooter from "../../components/ui/SafetyFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card.jsx";
import { Button } from "@/components/ui/Button.jsx";
import { Input } from "@/components/ui/Input";
import { queryClient, apiRequest } from "../../lib/queryClient";

export default function Favorites() {
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: favoritesData, isLoading, isError, refetch } = useQuery({
    queryKey: ["/api/favorites"],
    staleTime: 1000 * 60 * 5
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => apiRequest("DELETE", `/api/favorites/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
    }
  });

  const favorites = (favoritesData || []).map(fav => ({
    id: fav.id,
    type: fav.itemType || "tool",
    title: fav.itemContent || "Saved Item",
    path: fav.itemPath || "/tools",
    category: fav.category || "Wellness",
    savedAt: fav.createdAt ? new Date(fav.createdAt).toISOString().split("T")[0] : ""
  }));

  const filteredFavorites = favorites.filter(fav => 
    fav.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fav.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const removeFavorite = (id) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" role="status" aria-busy="true">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-4" aria-hidden="true" />
          <p className="text-muted-foreground">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" role="alert" aria-live="assertive">
        <div className="text-center p-8 max-w-md">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" aria-hidden="true" />
          <h2 className="text-xl font-semibold mb-2">Unable to load favorites</h2>
          <p className="text-muted-foreground mb-6">Please try again in a moment.</p>
          <Button onClick={() => refetch()} data-testid="button-retry">
            <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

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
