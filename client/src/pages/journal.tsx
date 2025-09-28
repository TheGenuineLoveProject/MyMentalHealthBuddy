/** 
 * © 2025 Aaliyah Draws Art LLC. All rights reserved.
 * Unauthorized copying or distribution of this file is prohibited.
 * Built with GPT-4o, MIT/Proprietary license, integrated with evidence-based mental health models.
 */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, PenTool, Calendar, Lock, Sparkles, Clock, Edit, Trash } from "lucide-react";
import { format } from "date-fns";

const journalSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(10, "Write at least 10 characters"),
  mood: z.string().optional(),
  isPrivate: z.boolean().default(true)
});

type JournalFormData = z.infer<typeof journalSchema>;

const journalPrompts = [
  "What are three things you're grateful for today?",
  "Describe a moment that made you smile recently.",
  "What challenge did you overcome today?",
  "How are you feeling right now, and why?",
  "What would you like to let go of?",
  "Write about a person who inspires you.",
  "What are your hopes for tomorrow?",
  "Describe your ideal day.",
  "What lesson did you learn recently?",
  "Write a letter to your future self."
];

export default function Journal() {
  const { toast } = useToast();
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [editingEntry, setEditingEntry] = useState<any>(null);
  
  const form = useForm<JournalFormData>({
    resolver: zodResolver(journalSchema),
    defaultValues: {
      title: "",
      content: "",
      mood: "",
      isPrivate: true
    }
  });

  // Fetch journal entries
  const { data: entries } = useQuery({
    queryKey: ['/api/journal/entries'],
    queryFn: async () => {
      // In production, this would fetch from API
      return {
        entries: [
          {
            id: "1",
            title: "A Day of Reflection",
            content: "Today was challenging but I learned a lot about resilience...",
            mood: "thoughtful",
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            isPrivate: true
          },
          {
            id: "2",
            title: "Grateful Moments",
            content: "I'm grateful for the support of my friends and family...",
            mood: "grateful",
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            isPrivate: true
          }
        ]
      };
    }
  });

  const saveEntryMutation = useMutation({
    mutationFn: (data: JournalFormData) =>
      apiRequest('/api/journal/save', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          id: editingEntry?.id
        })
      }),
    onSuccess: () => {
      toast({
        title: editingEntry ? "Entry updated!" : "Entry saved!",
        description: "Your journal entry has been saved successfully."
      });
      form.reset();
      setEditingEntry(null);
      queryClient.invalidateQueries({ queryKey: ['/api/journal'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save entry. Please try again.",
        variant: "destructive"
      });
    }
  });

  const deleteEntryMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/api/journal/delete/${id}`, {
        method: 'DELETE'
      }),
    onSuccess: () => {
      toast({
        title: "Entry deleted",
        description: "Your journal entry has been removed."
      });
      queryClient.invalidateQueries({ queryKey: ['/api/journal'] });
    }
  });

  const onSubmit = (data: JournalFormData) => {
    saveEntryMutation.mutate(data);
  };

  const usePrompt = (prompt: string) => {
    form.setValue("content", prompt + "\n\n");
    setSelectedPrompt(prompt);
  };

  const editEntry = (entry: any) => {
    setEditingEntry(entry);
    form.setValue("title", entry.title);
    form.setValue("content", entry.content);
    form.setValue("mood", entry.mood || "");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <BookOpen className="h-10 w-10 text-indigo-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              My Journal
            </h1>
            <PenTool className="h-9 w-9 text-purple-500" />
          </div>
          <p className="text-gray-600">Your private space for thoughts and reflections</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Writing Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{editingEntry ? "Edit Entry" : "New Entry"}</span>
                  <Lock className="h-5 w-5 text-gray-400" />
                </CardTitle>
                <CardDescription>
                  Write freely - your journal is your safe space
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <input
                              {...field}
                              className="w-full px-3 py-2 border rounded-md"
                              placeholder="Give your entry a title..."
                              data-testid="input-journal-title"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Thoughts</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Write your thoughts here..."
                              className="min-h-[300px] resize-none"
                              data-testid="textarea-journal-content"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="mood"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mood (Optional)</FormLabel>
                          <FormControl>
                            <input
                              {...field}
                              className="w-full px-3 py-2 border rounded-md"
                              placeholder="How are you feeling?"
                              data-testid="input-journal-mood"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-4">
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                        disabled={saveEntryMutation.isPending}
                        data-testid="button-save-journal"
                      >
                        {editingEntry ? "Update Entry" : "Save Entry"}
                      </Button>
                      {editingEntry && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setEditingEntry(null);
                            form.reset();
                          }}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Writing Prompts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                  Writing Prompts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2">
                    {journalPrompts.map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => usePrompt(prompt)}
                        className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors"
                        data-testid={`prompt-${index}`}
                      >
                        <p className="text-sm">{prompt}</p>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Previous Entries */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Previous Entries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  {entries?.entries?.length ? (
                    <div className="space-y-4">
                      {entries.entries.map((entry: any) => (
                        <Card key={entry.id} className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold">{entry.title}</h4>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => editEntry(entry)}
                                  className="text-gray-500 hover:text-gray-700"
                                  data-testid={`edit-${entry.id}`}
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => deleteEntryMutation.mutate(entry.id)}
                                  className="text-gray-500 hover:text-red-600"
                                  data-testid={`delete-${entry.id}`}
                                >
                                  <Trash className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                              {entry.content}
                            </p>
                            <div className="flex items-center justify-between">
                              <Badge variant="secondary">
                                {entry.mood || "No mood"}
                              </Badge>
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {format(new Date(entry.createdAt), 'MMM dd, yyyy')}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500">No journal entries yet</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Start writing to track your thoughts
                      </p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Your Writing Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Entries</span>
                    <span className="font-semibold">{entries?.entries?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">This Week</span>
                    <span className="font-semibold">2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Streak</span>
                    <span className="font-semibold">3 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}