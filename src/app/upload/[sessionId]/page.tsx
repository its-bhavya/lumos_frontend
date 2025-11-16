import UploadForm from './upload-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function UploadPage({ params }: { params: { sessionId: string } }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto py-12">
        <Card className="max-w-4xl mx-auto shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-4xl">Upload Your Resources</CardTitle>
            <CardDescription className="text-lg pt-2">Add your study materials to get started.</CardDescription>
          </CardHeader>
          <CardContent>
            <UploadForm sessionId={params.sessionId} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
