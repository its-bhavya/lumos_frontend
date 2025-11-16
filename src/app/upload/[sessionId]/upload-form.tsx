"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { File, Youtube, Mic, FileText, Upload, CheckCircle, Loader2, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { buildIndex, uploadResource } from '@/app/actions';
import { cn } from '@/lib/utils';

type Resource = {
  id: string;
  name: string;
  type: 'PDF' | 'YouTube' | 'Audio' | 'Text';
  icon: React.ReactNode;
};

type UploadCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  inputType: 'file' | 'text';
  inputPlaceholder: string;
  onUpload: (name: string, type: 'PDF' | 'YouTube' | 'Audio' | 'Text') => void;
  fileType?: 'PDF' | 'Audio';
};

function UploadCard({ icon, title, description, inputType, inputPlaceholder, onUpload, fileType }: UploadCardProps) {
    const [value, setValue] = useState('');
    const [fileName, setFileName] = useState('');
    const [loading, setLoading] = useState(false);
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!value && !fileName) return;
      setLoading(true);
      await onUpload(fileType ? fileName : value, fileType || (title as 'YouTube' | 'Text'));
      setLoading(false);
      setValue('');
      setFileName('');
    };

  return (
    <Card className="flex-1 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="text-primary">{icon}</div>
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
            {inputType === 'file' ? (
                 <label className="flex-1 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer">
                    <span className={cn("truncate", fileName ? 'text-foreground' : 'text-muted-foreground')}>{fileName || 'Select a file'}</span>
                    <Input 
                        type="file" 
                        className="sr-only"
                        onChange={(e) => {
                            if(e.target.files && e.target.files.length > 0) {
                                setFileName(e.target.files[0].name);
                                setValue(e.target.files[0].name); // for validation
                            }
                        }}
                        accept={fileType === 'PDF' ? '.pdf' : '.mp3,.wav,.m4a'}
                    />
                </label>
            ) : (
                <Input
                    type="text"
                    placeholder={inputPlaceholder}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    required
                />
            )}
          <Button type="submit" size="icon" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : <Upload className="h-4 w-4" />}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function UploadForm({ sessionId }: { sessionId: string }) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleUpload = async (name: string, type: 'PDF' | 'YouTube' | 'Audio' | 'Text') => {
    const { success, message } = await uploadResource(sessionId, type, name);
    if (success) {
      const newResource: Resource = {
        id: `${type}-${Date.now()}`,
        name,
        type,
        icon: type === 'PDF' ? <File /> : type === 'YouTube' ? <Youtube /> : type === 'Audio' ? <Mic /> : <FileText />,
      };
      setResources(prev => [...prev, newResource]);
      toast({
        title: "Upload Successful",
        description: `Added "${name}" to your session.`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: message,
      });
    }
  };
  
  const handlePrepare = async () => {
    setIsProcessing(true);
    router.push(`/processing/${sessionId}`);
  };

  const uploadCards: UploadCardProps[] = [
    { icon: <File className="h-8 w-8" />, title: 'Upload PDF', description: 'Upload PDF documents.', inputType: 'file', inputPlaceholder: '', onUpload: handleUpload, fileType: 'PDF' },
    { icon: <Youtube className="h-8 w-8" />, title: 'Add YouTube Video', description: 'Paste a YouTube URL.', inputType: 'text', inputPlaceholder: 'https://youtube.com/watch?v=...', onUpload: handleUpload },
    { icon: <Mic className="h-8 w-8" />, title: 'Upload Audio', description: 'Upload audio files.', inputType: 'file', inputPlaceholder: '', onUpload: handleUpload, fileType: 'Audio' },
    { icon: <FileText className="h-8 w-8" />, title: 'Paste Text', description: 'Paste raw text.', inputType: 'text', inputPlaceholder: 'Paste your notes here...', onUpload: handleUpload },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {uploadCards.map(card => <UploadCard key={card.title} {...card} />)}
      </div>

      {resources.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Uploaded Resources</h3>
          <Card>
            <CardContent className="p-4 space-y-3">
              {resources.map(resource => (
                <div key={resource.id} className="flex items-center justify-between p-2 rounded-md bg-secondary">
                  <div className="flex items-center gap-3">
                    <span className="text-primary">{resource.icon}</span>
                    <span className="font-medium truncate max-w-xs md:max-w-md">{resource.name}</span>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      <div className="text-center pt-4">
        <Button 
            size="lg" 
            disabled={resources.length === 0 || isProcessing}
            onClick={handlePrepare}
            className="h-12 px-10 text-base"
        >
          {isProcessing ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <BrainCircuit className="mr-2 h-5 w-5" />
          )}
          Prepare Study Materials
        </Button>
      </div>
    </div>
  );
}
