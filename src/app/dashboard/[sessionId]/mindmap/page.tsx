import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default async function MindMapPage({ params }: { params: { sessionId: string } }) {

  const placeholderImageUrl = "https://picsum.photos/seed/mindmap-1/1200/800";

  return (
    <div className="container py-12">
      <Card className="max-w-6xl mx-auto shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="font-headline text-4xl">Generated Mind Map</CardTitle>
              <CardDescription className="text-lg pt-2">Here is a visualization of your study materials.</CardDescription>
            </div>
            <Button variant="outline" asChild>
              <a href={placeholderImageUrl} download="mindmap.jpg">
                <Download className="mr-2 h-4 w-4" />
                Download Image
              </a>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div 
            className="w-full h-[600px] bg-secondary rounded-lg p-4 overflow-auto border relative"
          >
            <Image 
                src={placeholderImageUrl}
                alt="Placeholder Mind Map"
                fill
                style={{objectFit: 'contain'}}
                data-ai-hint="concept map"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
