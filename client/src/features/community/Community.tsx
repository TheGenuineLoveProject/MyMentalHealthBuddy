import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Users, Send, Quote } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface Reflection {
  id: string;
  content: string;
  createdAt: string;
}

interface QuestionResponse {
  ok: boolean;
  question: string;
  context: string;
}

interface ReflectionsResponse {
  ok: boolean;
  reflections: Reflection[];
  disclaimer: string;
}

export function Community() {
  const [myReflection, setMyReflection] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const questionQuery = useQuery<QuestionResponse>({
    queryKey: ["/api/community/question"],
  });

  const reflectionsQuery = useQuery<ReflectionsResponse>({
    queryKey: ["/api/community/reflections"],
  });

  const submitMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await apiRequest("POST", "/api/community/reflect", { content });
      return res.json();
    },
    onSuccess: () => {
      setSubmitted(true);
      setMyReflection("");
      queryClient.invalidateQueries({ queryKey: ["/api/community/reflections"] });
    },
  });

  const question = questionQuery.data?.question;
  const reflections = reflectionsQuery.data?.reflections || [];
  const disclaimer = reflectionsQuery.data?.disclaimer || "";

  return (
    <div className="space-y-6">
      <Card className="border-sage-200/50 dark:border-sage-700/50 bg-white/80 dark:bg-sage-900/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-sage-800 dark:text-sage-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-clay-500" />
            Shared Presence
          </CardTitle>
          <CardDescription className="text-sage-600 dark:text-sage-400">
            A space for anonymous reflection. No usernames, no metrics, no performance — just shared humanity.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {questionQuery.isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-sage-400" />
            </div>
          ) : question ? (
            <div className="p-6 bg-sage-50 dark:bg-sage-800/50 rounded-xl border border-sage-200 dark:border-sage-700">
              <div className="flex items-start gap-3">
                <Quote className="w-5 h-5 text-gold-500 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-lg text-sage-800 dark:text-sage-200 font-medium mb-2">
                    {question}
                  </p>
                  <p className="text-sm text-sage-500 dark:text-sage-400">
                    {questionQuery.data?.context}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {!submitted ? (
            <div className="space-y-3">
              <Textarea
                data-testid="input-community-reflection"
                placeholder="If you'd like to share a reflection, write here. Your response will be anonymous."
                value={myReflection}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMyReflection(e.target.value)}
                maxLength={500}
                className="min-h-[100px] resize-none border-sage-200 dark:border-sage-700 focus:ring-sage-400"
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-sage-500 dark:text-sage-400">
                  {myReflection.length}/500 characters • Sharing is optional
                </p>
                <Button
                  data-testid="button-share-reflection"
                  onClick={() => submitMutation.mutate(myReflection)}
                  disabled={myReflection.length < 10 || submitMutation.isPending}
                  className="bg-sage-600 hover:bg-sage-700 text-white"
                >
                  {submitMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  <Send className="w-4 h-4 mr-2" />
                  Share Anonymously
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-sage-100 dark:bg-sage-800 rounded-lg text-center">
              <p className="text-sage-700 dark:text-sage-300">
                Your reflection has been shared. Thank you for contributing to the collective space.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-sage-200/50 dark:border-sage-700/50 bg-white/80 dark:bg-sage-900/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-sage-800 dark:text-sage-100 text-lg">
            Reflections from Others
          </CardTitle>
          {disclaimer && (
            <CardDescription className="text-sage-600 dark:text-sage-400 italic">
              {disclaimer}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {reflectionsQuery.isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-sage-400" />
            </div>
          ) : reflections.length === 0 ? (
            <p className="text-center text-sage-500 dark:text-sage-400 py-8">
              No reflections yet. You could be the first to share.
            </p>
          ) : (
            <div className="space-y-4">
              {reflections.map((r) => (
                <div
                  key={r.id}
                  data-testid={`card-reflection-${r.id}`}
                  className="p-4 bg-sage-50 dark:bg-sage-800/30 rounded-lg border border-sage-100 dark:border-sage-700/50"
                >
                  <p className="text-sage-700 dark:text-sage-300 leading-relaxed">
                    {r.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <p className="text-center text-xs text-sage-500 dark:text-sage-400 italic">
        You know yourself best. Take what serves you.
      </p>
    </div>
  );
}
