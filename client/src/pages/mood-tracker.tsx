/** 
 * © 2025 Aaliyah Draws Art LLC. All rights reserved.
 * Unauthorized copying or distribution of this file is prohibited.
 * Built with GPT-4o, MIT/Proprietary license, integrated with evidence-based mental health models.
 */
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, Heart, Smile, Frown, Meh, TrendingUp, TrendingDown, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const moodSchema = z.object({
  mood: z.number().min(1).max(10),
  energy: z.number().min(1).max(10),
  anxiety: z.number().min(1).max(10),
  notes: z.string().optional(),
  activities: z.array(z.string()).optional()
});

type MoodFormData = z.infer<typeof moodSchema>;

const moodEmojis = {
  1: { icon: "😔", label: "Very Low" },
  2: { icon: "😟", label: "Low" },
  3: { icon: "😕", label: "Below Average" },
  4: { icon: "😐", label: "Neutral" },
  5: { icon: "🙂", label: "Okay" },
  6: { icon: "😊", label: "Good" },
  7: { icon: "😄", label: "Happy" },
  8: { icon: "😃", label: "Very Happy" },
  9: { icon: "😁", label: "Excellent" },
  10: { icon: "🤩", label: "Amazing" }
};

const activities = [
  "Exercise", "Meditation", "Reading", "Socializing", "Work",
  "Therapy", "Nature", "Creative", "Sleep", "Eating Well",
  "Music", "Journaling", "Relaxing", "Learning", "Helping Others"
];

export default function MoodTracker() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  
  const form = useForm<MoodFormData>({
    resolver: zodResolver(moodSchema),
    defaultValues: {
      mood: 5,
      energy: 5,
      anxiety: 5,
      notes: "",
      activities: []
    }
  });

  // Fetch mood history
  const { data: moodHistory } = useQuery({
    queryKey: ['/api/mood/history'],
    queryFn: () => apiRequest('/api/mood/history')
  });

  // Fetch mood for selected date
  const { data: todayMood } = useQuery({
    queryKey: ['/api/mood/today', format(selectedDate, 'yyyy-MM-dd')],
    queryFn: () => apiRequest(`/api/mood/date/${format(selectedDate, 'yyyy-MM-dd')}`)
  });

  const saveMoodMutation = useMutation({
    mutationFn: (data: MoodFormData) => 
      apiRequest('/api/mood/track', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          date: selectedDate.toISOString(),
          activities: selectedActivities
        })
      }),
    onSuccess: () => {
      toast({
        title: "Mood tracked!",
        description: "Your mood has been recorded successfully."
      });
      queryClient.invalidateQueries({ queryKey: ['/api/mood'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save mood. Please try again.",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: MoodFormData) => {
    saveMoodMutation.mutate({ ...data, activities: selectedActivities });
  };

  const toggleActivity = (activity: string) => {
    setSelectedActivities(prev =>
      prev.includes(activity)
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  const getMoodTrend = () => {
    if (!moodHistory?.moods?.length) return null;
    const recent = moodHistory.moods.slice(-7);
    if (recent.length < 2) return null;
    
    const avgRecent = recent.reduce((sum: number, m: any) => sum + m.mood, 0) / recent.length;
    const avgPrevious = moodHistory.moods.slice(-14, -7).reduce((sum: number, m: any) => sum + m.mood, 0) / 7;
    
    return avgRecent > avgPrevious ? "improving" : avgRecent < avgPrevious ? "declining" : "stable";
  };

  const trend = getMoodTrend();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center items-center gap-3 mb-4">
            <Brain className="h-10 w-10 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Mood Tracker
            </h1>
            <Heart className="h-9 w-9 text-pink-500" />
          </div>
          <p className="text-gray-600">Track your emotional well-being daily</p>
          
          {trend && (
            <div className="mt-4 flex justify-center">
              <Badge variant="outline" className="text-lg px-4 py-2">
                {trend === "improving" ? (
                  <>
                    <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                    Mood Improving
                  </>
                ) : trend === "declining" ? (
                  <>
                    <TrendingDown className="w-5 h-5 mr-2 text-red-600" />
                    Needs Attention
                  </>
                ) : (
                  <>
                    <Meh className="w-5 h-5 mr-2 text-yellow-600" />
                    Stable
                  </>
                )}
              </Badge>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Mood Entry Form */}
          <Card>
            <CardHeader>
              <CardTitle>How are you feeling today?</CardTitle>
              <CardDescription>Rate different aspects of your well-being</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Mood Slider */}
                  <FormField
                    control={form.control}
                    name="mood"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center justify-between">
                          <span>Overall Mood</span>
                          <span className="text-2xl">
                            {moodEmojis[field.value as keyof typeof moodEmojis]?.icon}
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Slider
                            min={1}
                            max={10}
                            step={1}
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                            className="py-4"
                            data-testid="slider-mood"
                          />
                        </FormControl>
                        <div className="text-center text-sm text-gray-600">
                          {moodEmojis[field.value as keyof typeof moodEmojis]?.label}
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Energy Level */}
                  <FormField
                    control={form.control}
                    name="energy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center justify-between">
                          <span>Energy Level</span>
                          <span>⚡ {field.value}/10</span>
                        </FormLabel>
                        <FormControl>
                          <Slider
                            min={1}
                            max={10}
                            step={1}
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                            className="py-4"
                            data-testid="slider-energy"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Anxiety Level */}
                  <FormField
                    control={form.control}
                    name="anxiety"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center justify-between">
                          <span>Anxiety Level</span>
                          <span>😰 {field.value}/10</span>
                        </FormLabel>
                        <FormControl>
                          <Slider
                            min={1}
                            max={10}
                            step={1}
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                            className="py-4"
                            data-testid="slider-anxiety"
                          />
                        </FormControl>
                        <div className="text-center text-sm text-gray-600">
                          {field.value <= 3 ? "Low" : field.value <= 6 ? "Moderate" : "High"}
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Activities */}
                  <div>
                    <FormLabel>Activities Today</FormLabel>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {activities.map((activity) => (
                        <Badge
                          key={activity}
                          variant={selectedActivities.includes(activity) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleActivity(activity)}
                          data-testid={`activity-${activity.toLowerCase()}`}
                        >
                          {activity}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="How was your day? Any thoughts or reflections?"
                            {...field}
                            className="resize-none"
                            data-testid="textarea-notes"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    disabled={saveMoodMutation.isPending}
                    data-testid="button-save-mood"
                  >
                    Save Mood Entry
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Calendar & History */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  Mood Calendar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Entries</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  {moodHistory?.moods?.length ? (
                    <div className="space-y-4">
                      {moodHistory.moods.slice(-7).reverse().map((entry: any) => (
                        <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="text-sm text-gray-600">
                              {format(new Date(entry.date), 'MMM dd, yyyy')}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xl">
                                {moodEmojis[entry.mood as keyof typeof moodEmojis]?.icon}
                              </span>
                              <span className="font-medium">
                                {moodEmojis[entry.mood as keyof typeof moodEmojis]?.label}
                              </span>
                            </div>
                          </div>
                          <div className="text-right text-sm">
                            <div>Energy: {entry.energy}/10</div>
                            <div>Anxiety: {entry.anxiety}/10</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500">No mood entries yet</p>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}