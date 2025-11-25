import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MessageSquare, FileText, Share2, HelpCircle } from "lucide-react";

type DashboardOption = {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
};

export default function DashboardPage({ params }: { params: { sessionId: string } }) {

  const options: DashboardOption[] = [
    {
      title: "Ask Questions",
      description: "Chat with your documents.",
      href: `/dashboard/${params.sessionId}/chat`,
      icon: <MessageSquare className="h-10 w-10" />,
    },
    {
      title: "Generate Notes",
      description: "Get summarized notes.",
      href: `/dashboard/${params.sessionId}/notes`,
      icon: <FileText className="h-10 w-10" />,
    },
    {
      title: "Generate Mind Map",
      description: "Visualize key concepts.",
      href: `/dashboard/${params.sessionId}/mindmap`,
      icon: <Share2 className="h-10 w-10" />,
    },
    {
      title: "Generate Quiz",
      description: "Test your knowledge.",
      href: `/dashboard/${params.sessionId}/quiz`,
      icon: <HelpCircle className="h-10 w-10" />,
    },
  ];

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl">Study Dashboard</h1>
        <p className="text-xl text-muted-foreground mt-2">Choose how you want to study today.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {options.map((option) => (
          <Link href={option.href} key={option.title} className="block">
            <Card className="h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <CardHeader className="flex flex-row items-center gap-6 p-6">
                <div className="text-primary">{option.icon}</div>
                <div>
                  <CardTitle className="text-2xl font-bold">{option.title}</CardTitle>
                  <CardDescription className="text-base mt-1">{option.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
