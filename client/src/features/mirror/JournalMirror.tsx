import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export function JournalMirror() {
  const [text, setText] = useState("");
  const [reflection, setReflection] = useState<string | null>(null);
  const [askingPermission, setAskingPermission] = useState(false);
  const [permissionMessage, setPermissionMessage] = useState("");

  const mirrorMutation = useMutation({
    mutationFn: async (data: { text: string; permission: boolean }) => {
      const res = await apiRequest("POST", "/api/mirror/reflect", data);
      return res.json();
    },
    onSuccess: (data) => {
      if (data.askingPermission) {
        setAskingPermission(true);
        setPermissionMessage(data.message);
      } else if (data.reflection) {
        setReflection(data.reflection);
        setAskingPermission(false);
      }
    },
  });

  const handleRequestReflection = () => {
    if (!text.trim()) return;
    mirrorMutation.mutate({ text, permission: false });
  };

  const handleConfirmPermission = () => {
    mirrorMutation.mutate({ text, permission: true });
  };

  const handleClear = () => {
    setReflection(null);
    setAskingPermission(false);
    setPermissionMessage("");
  };

  return (
    <Card className="border-sage-200/50 dark:border-sage-700/50 bg-white/80 dark:bg-sage-900/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-sage-800 dark:text-sage-100 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-gold-500" />
          Gentle Mirror
        </CardTitle>
        <CardDescription className="text-sage-600 dark:text-sage-400">
          A space to reflect on your own words. The mirror does not interpret or advise — it simply offers back what you've written.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!reflection && !askingPermission && (
          <>
            <Textarea
              data-testid="input-mirror-text"
              placeholder="Write freely here. When you're ready, you may request a gentle reflection — or simply let the writing be enough."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[150px] resize-none border-sage-200 dark:border-sage-700 focus:ring-sage-400"
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-sage-500 dark:text-sage-400 italic">
                You know yourself best.
              </p>
              <Button
                data-testid="button-request-reflection"
                variant="outline"
                onClick={handleRequestReflection}
                disabled={!text.trim() || mirrorMutation.isPending}
                className="border-sage-300 hover:bg-sage-100 dark:border-sage-600 dark:hover:bg-sage-800"
              >
                {mirrorMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Request Reflection
              </Button>
            </div>
          </>
        )}

        {askingPermission && (
          <div className="space-y-4 p-4 bg-sage-50 dark:bg-sage-800/50 rounded-lg border border-sage-200 dark:border-sage-700">
            <p className="text-sage-700 dark:text-sage-300">{permissionMessage}</p>
            <div className="flex gap-3">
              <Button
                data-testid="button-confirm-reflection"
                onClick={handleConfirmPermission}
                disabled={mirrorMutation.isPending}
                className="bg-sage-600 hover:bg-sage-700 text-white"
              >
                {mirrorMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Yes, please
              </Button>
              <Button
                data-testid="button-decline-reflection"
                variant="ghost"
                onClick={handleClear}
                className="text-sage-600 dark:text-sage-400"
              >
                No, thank you
              </Button>
            </div>
          </div>
        )}

        {reflection && (
          <div className="space-y-4">
            <div className="p-4 bg-sage-50 dark:bg-sage-800/50 rounded-lg border border-sage-200 dark:border-sage-700">
              <p className="text-sage-700 dark:text-sage-300 whitespace-pre-wrap leading-relaxed">
                {reflection}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xs text-sage-500 dark:text-sage-400 italic">
                Take what serves you.
              </p>
              <Button
                data-testid="button-new-reflection"
                variant="ghost"
                onClick={() => {
                  handleClear();
                  setText("");
                }}
                className="text-sage-600 dark:text-sage-400"
              >
                <X className="w-4 h-4 mr-2" />
                Start Fresh
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
