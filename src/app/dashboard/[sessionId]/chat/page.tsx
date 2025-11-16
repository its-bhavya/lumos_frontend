"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Send, Lightbulb, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

type Message = {
  role: "user" | "ai";
  content: string;
};

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function ChatPage({ params }: { params: { sessionId: string } }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: "Hello! Ask me anything about your study materials." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setInput("");

    try {
      const formData = new FormData();
      formData.append('session_id', params.sessionId);
      formData.append('question', input);

      const response = await fetch(`${BACKEND_URL}/ask`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('The request to the chatbot failed.');
      }
      
      const data = await response.json();
      const aiMessage: Message = { role: "ai", content: data.answer };
      setMessages((prev) => [...prev, aiMessage]);

    } catch (error) {
      console.error("Chat API error:", error);
      const errorMessage: Message = { role: 'ai', content: "Sorry, I couldn't get a response. Please try again."};
      setMessages(prev => [...prev, errorMessage]);
      toast({
        variant: "destructive",
        title: "Chat Error",
        description: "There was an issue communicating with the chatbot.",
      });
    } finally {
        setLoading(false);
    }
  };
  
  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if(viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);


  return (
    <div className="flex justify-center h-[calc(100vh-2rem-env(safe-area-inset-bottom))] sm:h-[calc(100vh-4rem-env(safe-area-inset-bottom))]">
      <div className="w-full max-w-4xl flex flex-col">
        <div className="flex flex-row items-center justify-between">
          <h2 className="font-headline text-3xl">Ask a Question</h2>
        </div>
        <div className="flex-1 mt-6">
          <ScrollArea className="h-[calc(100vh-18rem)] sm:h-[calc(100vh-16rem)] w-full pr-4" ref={scrollAreaRef}>
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div key={index} className={`flex items-start gap-3 ${message.role === "user" ? "justify-end" : ""}`}>
                  {message.role === "ai" && (
                    <Avatar>
                      <AvatarFallback><Lightbulb /></AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`rounded-lg p-3 max-w-[80%] ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                    <p className="text-sm">{message.content}</p>
                  </div>
                  {message.role === "user" && (
                    <Avatar>
                      <AvatarFallback><User /></AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
               {loading && (
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarFallback><Lightbulb /></AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg p-3 bg-secondary flex items-center">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
        <div className="mt-auto pt-4">
          <form
            className="flex w-full items-center space-x-2"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <Input
              id="message"
              placeholder="Type your question..."
              className="flex-1"
              autoComplete="off"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <Button type="submit" size="icon" disabled={loading || !input.trim()}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
