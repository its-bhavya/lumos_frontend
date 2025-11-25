
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BACKEND_URL = "https://lumos-ai-69yf.onrender.com";

export default function MindMapPage({ params }: { params: { sessionId: string } }) {
  const [mindMapUrl, setMindMapUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const generateMindMap = async () => {
      setLoading(true);
      try {
        const extractFormData = new FormData();
        extractFormData.append('session_id', params.sessionId);
        const extractRes = await fetch(`${BACKEND_URL}/extract`, { method: 'POST', body: extractFormData });
        if (!extractRes.ok) throw new Error("Failed to extract concepts for mind map.");

        const mindmapFormData = new FormData();
        mindmapFormData.append('session_id', params.sessionId);
        const mindmapRes = await fetch(`${BACKEND_URL}/generate_mindmap`, { method: 'POST', body: mindmapFormData });
        if (!mindmapRes.ok) throw new Error("Failed to generate the mind map image.");
        
        const imageBlob = await mindmapRes.blob();
        const imageUrl = URL.createObjectURL(imageBlob);
        setMindMapUrl(imageUrl);

      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Mind Map Generation Failed",
          description: error instanceof Error ? error.message : "An unknown error occurred.",
        });
      } finally {
        setLoading(false);
      }
    };

    generateMindMap();
  }, [params.sessionId, toast]);

  const downloadImage = () => {
    if (!mindMapUrl) return;
    const link = document.createElement('a');
    link.href = mindMapUrl;
    link.download = "mindmap.svg"; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
      <div className="w-full h-full flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="font-headline text-4xl">Generated Mind Map</h2>
            <p className="text-lg pt-2 text-muted-foreground">Here is a visualization of your study materials.</p>
          </div>
          <Button onClick={downloadImage} variant="outline" asChild={false} disabled={!mindMapUrl || loading}>
              <span>
                <Download className="mr-2 h-4 w-4" />
                Download SVG
              </span>
          </Button>
        </div>
        <div className="mt-6 flex-1 w-full overflow-auto">
            {loading ? (
                 <div className="flex flex-col items-center justify-center h-full gap-4 text-primary">
                    <Loader2 className="h-12 w-12 animate-spin" />
                    <p className="font-semibold">Generating your mind map...</p>
                 </div>
            ) : mindMapUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                    src={mindMapUrl}
                    alt="Generated Mind Map"
                    className="w-full h-auto"
                    data-ai-hint="concept map"
                />
            ) : (
                <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Could not load mind map.</p>
                </div>
            )}
        </div>
      </div>
  );
}
