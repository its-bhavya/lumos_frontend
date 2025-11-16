"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

type Message = {
  role: "user" | "ai";
  content: string;
};

export default function ChatPage({ params }: { params: { sessionId: string } }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: "Hello! Ask me anything about your study materials." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setInput("");

    // Simulate API call and response
    setTimeout(() => {
      const aiMessage: Message = { role: "ai", content: "This is a placeholder response from the chatbot." };
      setMessages((prev) => [...prev, aiMessage]);
      setLoading(false);
    }, 1000);
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
    <div className="container py-12 flex justify-center">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Ask a Question</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] w-full pr-4" ref={scrollAreaRef}>
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div key={index} className={`flex items-start gap-3 ${message.role === "user" ? "justify-end" : ""}`}>
                  {message.role === "ai" && (
                    <Avatar>
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`rounded-lg p-3 max-w-[80%] ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                    <p className="text-sm">{message.content}</p>
                  </div>
                  {message.role === "user" && (
                    <Avatar>
                      <AvatarFallback>You</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
               {loading && (
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg p-3 bg-secondary flex items-center">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter>
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
        </CardFooter>
      </Card>
    </div>
  );
}
