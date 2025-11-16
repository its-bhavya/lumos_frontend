"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { buildIndex } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

export default function ProcessingClientPage({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const process = async () => {
      try {
        const result = await buildIndex(sessionId);
        if (result.success) {
          toast({
            title: "Ready to Go!",
            description: "Your study materials are all set.",
          });
          router.push(`/dashboard/${sessionId}`);
        } else {
          throw new Error("Index building failed");
        }
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "An Error Occurred",
          description: "Could not prepare your materials. Please try again.",
        });
        router.push(`/upload/${sessionId}`);
      }
    };
    process();
  }, [sessionId, router, toast]);

  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-4 bg-background">
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
      <h1 className="font-headline text-4xl text-primary">Preparing your study materials…</h1>
      <p className="text-lg text-muted-foreground">This may take a moment. Please don't refresh the page.</p>
    </div>
  );
}
