import Link from "next/link";
import { Logo } from "@/components/icons";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { sessionId: string };
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="sticky top-0 z-40 w-full border-b bg-card">
        <div className="container flex h-16 items-center justify-between">
          <Link href={`/dashboard/${params.sessionId}`} className="flex items-center gap-2">
            <Logo className="h-7 w-7 text-primary" />
            <span className="font-headline text-2xl font-bold text-primary">Lumos</span>
          </Link>
          <Button asChild variant="outline">
            <Link href="/">New Session</Link>
          </Button>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
