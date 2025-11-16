import UploadForm from './upload-form';

export default function UploadPage({ params }: { params: { sessionId: string } }) {
  return (
    <div className="container mx-auto py-12">
      <div className="w-full mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-headline text-4xl">Upload Your Resources</h1>
          <p className="text-lg pt-2 text-muted-foreground">Add your study materials to get started.</p>
        </div>
        <div>
          <UploadForm sessionId={params.sessionId} />
        </div>
      </div>
    </div>
  );
}
