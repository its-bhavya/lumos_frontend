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
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-56 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col gap-2 p-4">
          <Link
            href="/"
            className="group flex h-12 shrink-0 items-center gap-2 rounded-full px-4 text-lg font-semibold text-primary-foreground "
          >
            <Logo className="h-6 w-6 text-primary transition-all group-hover:scale-110" />
            <span className="text-primary font-bold">Lumos</span>
          </Link>
          {navItems.map(({ href, icon: Icon, label }) => {
            const fullPath = `${baseDashboardPath}${href}`;
            const isActive = href === "" ? pathname === fullPath : pathname.startsWith(fullPath);
            return (
              <Link
                key={label}
                href={fullPath}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto flex flex-col items-center gap-4 p-4">
            <Button asChild variant="outline" className="w-full">
              <Link href="/">
                <BrainCircuit className="mr-2 h-5 w-5" />
                New Session
              </Link>
            </Button>
            <ModeToggle />
        </div>
    </aside>
  );
}
