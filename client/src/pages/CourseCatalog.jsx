import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { BookOpen, Clock, Star, Search, Lock, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SEO from "../components/SEO";
import SafetyFooter from "../components/ui/ReflectionFooter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const ENROLLMENT_KEY = "glp-course-enrollments";

export default function CourseCatalog() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(ENROLLMENT_KEY);
      if (saved) setEnrollments(JSON.parse(saved));
    } catch {}
  }, []);

  const enrollMutation = useMutation({
    mutationFn: async (courseId) => {
      return apiRequest("POST", "/api/gamification/record-session", {
        toolName: "course-enrollment",
        durationSeconds: 300,
        metadata: { courseId }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gamification/progress"] });
    },
    onError: (error) => {
      toast({
        title: "Server sync failed",
        description: "Your enrollment was saved locally. It will sync when you're back online.",
        variant: "destructive"
      });
    }
  });

  const handleEnroll = (courseId, courseTitle) => {
    if (enrollments.includes(courseId)) return;
    
    const updatedEnrollments = [...enrollments, courseId];
    setEnrollments(updatedEnrollments);
    try {
      localStorage.setItem(ENROLLMENT_KEY, JSON.stringify(updatedEnrollments));
    } catch {}

    if (user) {
      enrollMutation.mutate(courseId);
    }
    
    toast({
      title: "Enrolled!",
      description: `You've enrolled in "${courseTitle}". Start learning anytime.`
    });
  };

  const isEnrolled = (courseId) => enrollments.includes(courseId);

  const courses = [
    {
      id: "self-love-foundations",
      title: "Foundations of Self-Love",
      description: "Build a lasting relationship with yourself through daily practices",
      duration: "4 weeks",
      lessons: 12,
      level: "Beginner",
      category: "self-love",
      isFree: true,
      rating: 4.8
    },
    {
      id: "emotional-regulation",
      title: "Emotional Regulation Toolkit",
      description: "Learn to navigate difficult emotions with grace and awareness",
      duration: "3 weeks",
      lessons: 9,
      level: "Intermediate",
      category: "emotions",
      isFree: false,
      rating: 4.9
    },
    {
      id: "boundary-setting",
      title: "Healthy Boundaries Workshop",
      description: "Set and maintain boundaries that honor your wellbeing",
      duration: "2 weeks",
      lessons: 6,
      level: "Beginner",
      category: "relationships",
      isFree: false,
      rating: 4.7
    },
    {
      id: "mindfulness-basics",
      title: "Mindfulness for Everyday Life",
      description: "Bring presence and awareness into your daily routine",
      duration: "3 weeks",
      lessons: 10,
      level: "Beginner",
      category: "mindfulness",
      isFree: true,
      rating: 4.6
    },
    {
      id: "healing-trauma",
      title: "Gentle Trauma Awareness",
      description: "Educational exploration of trauma responses and self-compassion",
      duration: "6 weeks",
      lessons: 18,
      level: "Advanced",
      category: "healing",
      isFree: false,
      rating: 4.9
    },
    {
      id: "gratitude-practice",
      title: "The Gratitude Journey",
      description: "Explore your perspective through structured gratitude practices",
      duration: "2 weeks",
      lessons: 7,
      level: "Beginner",
      category: "self-love",
      isFree: true,
      rating: 4.5
    }
  ];

  const filters = [
    { id: "all", label: "All Courses" },
    { id: "free", label: "Free" },
    { id: "self-love", label: "Self-Love" },
    { id: "emotions", label: "Emotions" },
    { id: "relationships", label: "Relationships" },
    { id: "mindfulness", label: "Mindfulness" }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "all" || 
                         (activeFilter === "free" && course.isFree) ||
                         course.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Course Catalog — The Genuine Love Project"
        description="Explore our micro-courses on self-love, emotional regulation, boundaries, and mindfulness."
      />

      <main className="container mx-auto px-4 py-16 max-w-6xl">
        <header className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight" data-testid="text-page-title">
            Learning Library
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Bite-sized courses on wellness topics. Learn at your own pace.
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
              style={{ color: '#5a6a5a' }}
              aria-hidden="true"
            />
            <Input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 min-h-[44px] placeholder:text-[#5a6a5a]"
              style={{
                background: '#f4f7f4',
                color: '#1a1917',
                border: '1px solid #c8d9c8',
                borderRadius: '12px',
              }}
              data-testid="input-search-courses"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {filters.map(filter => {
              const isActive = activeFilter === filter.id;
              return (
                <Button
                  key={filter.id}
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveFilter(filter.id)}
                  className="min-h-[40px] px-4 rounded-lg whitespace-nowrap font-semibold"
                  style={
                    isActive
                      ? {
                          background: 'linear-gradient(135deg, #ffb93d 0%, #f5a623 100%)',
                          color: '#1a1917',
                          border: '1px solid #f5a623',
                          boxShadow: '0 2px 6px rgba(245,166,35,0.25)',
                        }
                      : {
                          background: '#faf9f6',
                          color: '#1a1917',
                          border: '1px solid #c8d9c8',
                        }
                  }
                  aria-pressed={isActive}
                  data-testid={`filter-${filter.id}`}
                >
                  {filter.label}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredCourses.map(course => (
            <div
              key={course.id}
              className="hover:shadow-lg transition-shadow"
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #c8d9c8',
                overflow: 'hidden',
              }}
              data-testid={`card-course-${course.id}`}
            >
              <div className="flex flex-col space-y-1.5 p-6 pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3
                      className="text-lg font-semibold leading-tight mb-1"
                      style={{ color: '#1a1917' }}
                    >
                      {course.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: '#4a4540' }}
                    >
                      {course.description}
                    </p>
                  </div>
                  {!course.isFree && (
                    <Lock className="w-4 h-4 flex-shrink-0" style={{ color: '#8a8278' }} />
                  )}
                </div>
              </div>
              <div className="p-6 pt-0">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span
                    className="px-2 py-1 rounded-full text-xs font-medium"
                    style={{ background: '#e8f0e8', color: '#2d5a3d' }}
                  >
                    {course.level}
                  </span>
                  <span
                    className="px-2 py-1 rounded-full text-xs"
                    style={{ background: '#f4f2ee', color: '#5a5550' }}
                  >
                    <Clock className="w-3 h-3 inline mr-1" />
                    {course.duration}
                  </span>
                  <span
                    className="px-2 py-1 rounded-full text-xs"
                    style={{ background: '#f4f2ee', color: '#5a5550' }}
                  >
                    {course.lessons} lessons
                  </span>
                  {course.isFree && (
                    <span
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{ background: '#dcfce7', color: '#166534' }}
                    >
                      Free
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-sm" style={{ color: '#5a5550' }}>
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    {course.rating}
                  </div>
                  <div className="flex gap-2">
                    {isEnrolled(course.id) ? (
                      <span className="flex items-center gap-1 text-sm" style={{ color: '#166534' }}>
                        <CheckCircle className="w-4 h-4" />
                        Enrolled
                      </span>
                    ) : (
                      <button
                        className="min-h-[36px] px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
                        style={{
                          background: '#faf9f6',
                          color: '#1a1917',
                          border: '1px solid #c8d9c8',
                        }}
                        onClick={() => handleEnroll(course.id, course.title)}
                        disabled={enrollMutation.isPending}
                        data-testid={`button-enroll-${course.id}`}
                      >
                        {enrollMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Enroll"
                        )}
                      </button>
                    )}
                    <Link href={`/courses/${course.id}`}>
                      <span
                        className="inline-flex items-center min-h-[36px] px-4 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-colors"
                        style={{
                          background: '#2d5a3d',
                          color: '#ffffff',
                          border: 'none',
                        }}
                        data-testid={`button-view-${course.id}`}
                      >
                        View Course
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No courses found matching your criteria.</p>
            <Button
              variant="link"
              onClick={() => { setSearchQuery(""); setActiveFilter("all"); }}
              className="mt-2"
            >
              Clear filters
            </Button>
          </div>
        )}

        <section className="text-center bg-muted/50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Want More Courses?</h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Pro members get access to all courses plus exclusive content and certificates.
          </p>
          <Link href="/pricing">
            <Button
              size="lg"
              className="min-h-[48px] font-semibold"
              style={{
                background: 'linear-gradient(135deg, #ffb93d 0%, #f5a623 100%)',
                color: '#1a1917',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(245,166,35,0.3)',
              }}
              data-testid="button-upgrade"
            >
              View Pro Plan
              <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
            </Button>
          </Link>
        </section>
      </main>

      <SafetyFooter />
    </div>
  );
}
