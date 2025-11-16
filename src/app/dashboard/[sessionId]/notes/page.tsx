import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import MarkdownRenderer from "@/components/markdown-renderer";

const placeholderNotes = `
# Placeholder Study Notes

Here is a summary of your study materials, generated as a placeholder. You can replace this with a call to your backend API.

## Key Concept 1: The Mitochondria

- Often called the "powerhouse of the cell".
- Generates most of the cell's supply of adenosine triphosphate (ATP).
- ATP is used as a source of chemical energy.

## Key Concept 2: The French Revolution

- A period of radical political and societal change in France.
- Began in 1789 and ended in 1799.
- Key figures included Napoleon Bonaparte and Robespierre.
- Led to the end of the monarchy in France.

## Key Concept 3: Binary Trees in Computing

*   A tree data structure.
*   Each node has at most two children.
*   Children are referred to as the left child and the right child.
*   Fundamental for many search and sort algorithms.
`;

export default async function NotesPage({ params }: { params: { sessionId: string } }) {
  const notes = placeholderNotes;

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
