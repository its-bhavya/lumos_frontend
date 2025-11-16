"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Switch } from "@/components/ui/switch"

export function ModeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a placeholder or nothing on the server to prevent hydration mismatch
    return (
        <div className="flex items-center space-x-2 h-6 w-[76px]">
        </div>
    );
  }

  const handleToggle = (isChecked: boolean) => {
    setTheme(isChecked ? "dark" : "light")
  }

  return (
    <div className="flex items-center space-x-2">
      <Sun className="h-5 w-5" />
      <Switch 
        id="theme-toggle" 
        checked={theme === 'dark'}
        onCheckedChange={handleToggle}
        aria-label="Toggle theme"
      />
      <Moon className="h-5 w-5" />
    </div>
  )
}
