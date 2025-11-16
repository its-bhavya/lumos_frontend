import { generateNotes } from "@/ai/flows/generate-notes-from-resources";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import MarkdownRenderer from "@/components/markdown-renderer";

export default async function NotesPage({ params }: { params: { sessionId: string } }) {
  const { notes } = await generateNotes({ sessionId: params.sessionId });

  return (
    <div className="container py-12">
      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="font-headline text-4xl">Generated Notes</CardTitle>
              <CardDescription className="text-lg pt-2">Here is a summary of your study materials.</CardDescription>
            </div>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download as PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="p-6 bg-secondary rounded-lg">
            <MarkdownRenderer content={notes} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
