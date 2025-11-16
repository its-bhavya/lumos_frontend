import { generateMindMapFromResources } from "@/ai/flows/generate-mind-map-from-resources";
import { getCombinedResourceText } from "@/app/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default async function MindMapPage({ params }: { params: { sessionId: string } }) {
  const resourceText = await getCombinedResourceText(params.sessionId);
  const { mindMapSvg } = await generateMindMapFromResources({ resourceText });

  return (
    <div className="container py-12">
      <Card className="max-w-6xl mx-auto shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="font-headline text-4xl">Generated Mind Map</CardTitle>
              <CardDescription className="text-lg pt-2">Here is a visualization of your study materials.</CardDescription>
            </div>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download SVG
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div 
            className="w-full h-[600px] bg-secondary rounded-lg p-4 overflow-auto border"
            dangerouslySetInnerHTML={{ __html: mindMapSvg }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
