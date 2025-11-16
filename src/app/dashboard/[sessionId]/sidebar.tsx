"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageSquare,
  FileText,
  Share2,
  HelpCircle,
  Home,
  BrainCircuit,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Logo } from "@/components/icons";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "", icon: Home, label: "Dashboard" },
  { href: "/chat", icon: MessageSquare, label: "Ask Questions" },
  { href: "/notes", icon: FileText, label: "Generate Notes" },
  { href: "/mindmap", icon: Share2, label: "Generate Mind Map" },
  { href: "/quiz", icon: HelpCircle, label: "Generate Quiz" },
];

export default function DashboardSidebar({
  sessionId,
}: {
  sessionId: string;
}) {
  const pathname = usePathname();
  const baseDashboardPath = `/dashboard/${sessionId}`;

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <TooltipProvider>
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="/"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Logo className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only">Lumos</span>
          </Link>
          {navItems.map(({ href, icon: Icon, label }) => {
            const fullPath = `${baseDashboardPath}${href}`;
            const isActive = href === "" ? pathname === fullPath : pathname.startsWith(fullPath);
            return (
              <Tooltip key={label}>
                <TooltipTrigger asChild>
                  <Link
                    href={fullPath}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8 ${
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">{label}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{label}</TooltipContent>
              </Tooltip>
            );
          })}
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
            <Button asChild variant="outline" className="h-9 w-9 md:h-8 md:w-8">
              <Link href="/">
                <BrainCircuit className="h-5 w-5" />
                <span className="sr-only">New Session</span>
              </Link>
            </Button>
            <ModeToggle />
        </nav>
      </TooltipProvider>
    </aside>
  );
}
