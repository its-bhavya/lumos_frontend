"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createSession } from "@/app/actions";
import { Logo } from "./icons";
import { ModeToggle } from "./mode-toggle";

export default function LandingPageClient() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGetStarted = async () => {
    setLoading(true);
    try {
      const sessionId = await createSession();
      router.push(`/upload/${sessionId}`);
    } catch (error) {
      console.error("Failed to create session:", error);
      setLoading(false);
    }
  };

  return (
    <main className="relative flex h-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-blue-200 to-blue-300 p-8 text-center dark:from-gray-900 dark:via-gray-950 dark:to-black" style={{'--tw-gradient-from': 'hsl(212, 100%, 92%)', '--tw-gradient-to': 'hsl(212, 100%, 87%)', '--tw-gradient-stops': 'var(--tw-gradient-from), var(--tw-gradient-to)'} as React.CSSProperties}>
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <div className="flex items-center gap-4 text-primary">
        <Logo className="h-16 w-16" />
        <h1 className="font-headline text-7xl font-bold tracking-tight">
          Lumos
        </h1>
      </div>
      <p className="mt-4 max-w-xl text-center text-2xl text-primary/80">
        Your personal AI study companion.
      </p>
      <p className="mt-2 max-w-xl text-center text-lg text-primary/60">
        Turn your PDFs, videos, audio, and notes into instant summaries, mindmaps, quizzes, and a smart Q&A experience.
      </p>
      <div className="mt-10">
        <Button
          size="lg"
          className="h-14 rounded-full px-12 text-lg font-semibold"
          onClick={handleGetStarted}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Get Started"
          )}
        </Button>
      </div>
    </main>
  );
}
