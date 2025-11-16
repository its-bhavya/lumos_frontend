"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import MarkdownRenderer from "@/components/markdown-renderer";
import { useToast } from "@/hooks/use-toast";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function NotesPage({ params }: { params: { sessionId: string } }) {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { sessionId } = params;

  useEffect(() => {
    const fetchNotes = async () => {
      if (!sessionId) return;
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('session_id', sessionId);
        const response = await fetch(`${BACKEND_URL}/get_notes`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to fetch notes.');
        }

        const data = await response.json();
        setNotes(data.notes);
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Error fetching notes",
          description: "Could not load notes from the server.",
        });
        setNotes("# Error\n\nCould not load notes.");
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [sessionId, toast]);

  const downloadNotes = () => {
    const blob = new Blob([notes], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'notes.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
      <div className="w-full">
        <div>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-headline text-4xl">Generated Notes</h2>
              <p className="text-lg pt-2 text-muted-foreground">Here is a summary of your study materials.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={downloadNotes} disabled={loading || !notes}>
                <Download className="mr-2 h-4 w-4" />
                Download as MD
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-6 h-[calc(100vh-16rem)] overflow-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : (
            <MarkdownRenderer content={notes} />
          )}
        </div>
      </div>
  );
}
