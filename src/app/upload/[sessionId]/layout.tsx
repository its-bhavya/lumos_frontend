import DashboardSidebar from '@/app/dashboard/[sessionId]/sidebar';
import { ModeToggle } from "@/components/mode-toggle";

export default function PreDashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { sessionId: string };
}) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <DashboardSidebar sessionId={params.sessionId} />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-56">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <div className="ml-auto">
                <ModeToggle />
            </div>
        </header>
        <main className="flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
