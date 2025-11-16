
"use client";

import { useEffect, useState } from "react";
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { finishQuiz } from "@/app/actions";
import { Loader2, ArrowLeft, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type QuizSummary = {
  accuracy: number;
  strong_topics: string[];
  weak_topics: string[];
  topic_strength: Record<string, number>;
};

export default function QuizSummaryClientPage({ sessionId }: { sessionId: string }) {
  const [summary, setSummary] = useState<QuizSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSummary = async () => {
      // Check if a quiz session was active to prevent direct navigation
      const quizSession = localStorage.getItem(`quizSession_${sessionId}`);
      if (!quizSession) {
        setLoading(false);
        // Redirect or show message? For now, just show empty state.
        toast({
            variant: "destructive",
            title: "No Quiz Data Found",
            description: "Please complete a quiz to see the summary.",
        });
        return;
      }
      
      try {
        const summaryData = await finishQuiz(sessionId);
        setSummary(summaryData);
      } catch (error) {
          console.error("Failed to fetch quiz summary", error);
          toast({
              variant: "destructive",
              title: "Error loading summary",
              description: "Could not retrieve your quiz results.",
          });
      } finally {
        setLoading(false);
        // Clean up local storage
        localStorage.removeItem(`quizSession_${sessionId}`);
      }
    };

    fetchSummary();
  }, [sessionId, toast]);

  if (loading) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center space-y-4">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <h1 className="font-headline text-4xl text-primary">Generating a summary of your results...</h1>
      </div>
    );
  }

  if (!summary) {
    return (
        <div className="flex h-[70vh] flex-col items-center justify-center space-y-4">
            <h1 className="font-headline text-4xl text-destructive">No summary available.</h1>
            <p className="text-lg text-muted-foreground">Please take a quiz first.</p>
             <Button asChild variant="outline" size="lg">
              <Link href={`/dashboard/${sessionId}`}>
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Dashboard
              </Link>
          </Button>
        </div>
    )
  }

  const chartData = Object.entries(summary.topic_strength).map(([name, value]) => ({ name, strength: value * 100 }));

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl">Quiz Summary</h1>
        <p className="text-xl text-muted-foreground mt-2">Here's how you did!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 shadow-lg">
          <CardHeader className="items-center text-center">
            <CardDescription className="text-lg">Overall Accuracy</CardDescription>
            <CardTitle className="text-7xl font-bold text-primary">{summary.accuracy}%</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-green-600">Strong Topics</h3>
              <ul className="list-disc list-inside text-muted-foreground">
                {summary.strong_topics.map(topic => <li key={topic}>{topic}</li>)}
              </ul>
            </div>
             <div>
              <h3 className="font-semibold text-red-600">Weak Topics</h3>
              <ul className="list-disc list-inside text-muted-foreground">
                {summary.weak_topics.map(topic => <li key={topic}>{topic}</li>)}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle>Topic Strength</CardTitle>
            <CardDescription>A breakdown of your performance by topic.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  labelStyle={{ color: 'hsl(var(--card-foreground))' }}
                />
                <Bar dataKey="strength" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-12 flex justify-center gap-4">
          <Button asChild variant="outline" size="lg">
              <Link href={`/dashboard/${sessionId}`}>
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Dashboard
              </Link>
          </Button>
          <Button asChild size="lg">
              <Link href={`/dashboard/${sessionId}/quiz`}>
                <RefreshCw className="mr-2 h-5 w-5" />
                Retry Quiz
              </Link>
          </Button>
      </div>
    </div>
  );
}

    