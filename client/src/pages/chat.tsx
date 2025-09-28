/** 
 * © 2025 Aaliyah Draws Art LLC. All rights reserved.
 * Unauthorized copying or distribution of this file is prohibited.
 * Built with GPT-4o, MIT/Proprietary license, integrated with evidence-based mental health models.
 */
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Send, Heart, Brain, Bot, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const messageSchema = z.object({
  message: z.string().min(1, "Please enter a message").max(1000, "Message is too long")
});

type MessageFormData = z.infer<typeof messageSchema>;

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

export default function Chat() {
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your AI mental health companion. I'm here to listen, support, and help you navigate your thoughts and feelings. How are you feeling today?",
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const form = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: ""
    }
  });

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  const sendMessageMutation = useMutation({
    mutationFn: async (data: MessageFormData) => {
      // Add user message immediately
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: data.message,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setIsTyping(true);
      
      // Send to API
      return apiRequest("/api/mental-health/chat", {
        method: "POST",
        body: JSON.stringify({ 
          message: data.message,
          sessionId: localStorage.getItem("chatSessionId") || undefined
        })
      });
    },
    onSuccess: (response) => {
      // Store session ID if this is a new session
      if (response.sessionId && !localStorage.getItem("chatSessionId")) {
        localStorage.setItem("chatSessionId", response.sessionId);
      }
      
      // Add AI response
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: response.response || response.message || "I'm here to help. Could you tell me more about how you're feeling?",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
      form.reset();
    },
    onError: (error: any) => {
      setIsTyping(false);
      
      // Add fallback message
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: "I apologize, but I'm having trouble connecting right now. Please know that you're not alone, and it's okay to take a moment to breathe. Try again in a moment, or consider reaching out to a mental health professional if you need immediate support.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Connection Issue",
        description: "Unable to send message. Please try again.",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: MessageFormData) => {
    sendMessageMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto max-w-4xl p-4">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="flex justify-center items-center gap-3 mb-2">
            <Brain className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Therapy Chat
            </h1>
            <Heart className="h-7 w-7 text-pink-500" />
          </div>
          <p className="text-gray-600">A safe space for your thoughts and feelings</p>
        </div>

        {/* Chat Container */}
        <Card className="h-[70vh] flex flex-col shadow-xl">
          <CardHeader className="border-b bg-gradient-to-r from-purple-100 to-pink-100">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <span>Your Mental Health Companion</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
              <div className="space-y-4" data-testid="chat-messages">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3",
                      message.role === "user" ? "justify-end" : "justify-start"
                    )}
                    data-testid={`message-${message.role}`}
                  >
                    {message.role === "assistant" && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-purple-100">
                          <Bot className="h-5 w-5 text-purple-600" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div
                      className={cn(
                        "max-w-[70%] rounded-lg px-4 py-2",
                        message.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-800"
                      )}
                    >
                      <p className="text-sm">{message.content}</p>
                      <span className="text-xs opacity-70 mt-1 block">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    
                    {message.role === "user" && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-blue-100">
                          <User className="h-5 w-5 text-blue-600" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-purple-100">
                        <Bot className="h-5 w-5 text-purple-600" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 rounded-lg px-4 py-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>

          {/* Input Form */}
          <div className="border-t p-4 bg-gray-50">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Share what's on your mind..."
                          disabled={isTyping}
                          autoComplete="off"
                          className="bg-white"
                          data-testid="input-message"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <Button
                  type="submit"
                  disabled={isTyping}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  data-testid="button-send"
                >
                  {isTyping ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </Card>

        {/* Help Resources */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Remember: This AI companion is here to support you, but it's not a replacement for professional help.</p>
          <p className="mt-1">
            If you're in crisis, please call <span className="font-semibold">988</span> (Suicide & Crisis Lifeline) 
            or text <span className="font-semibold">HOME</span> to <span className="font-semibold">741741</span> (Crisis Text Line)
          </p>
        </div>
      </div>
    </div>
  );
}