// This file defines the visible light and dark theme toggle while preserving system-theme detection by default.
"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils/cn";

const options = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
] as const;

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTheme = useMemo(() => {
    return resolvedTheme ?? theme ?? "light";
  }, [theme, resolvedTheme]);

  if (!mounted) {
    return (
      <div className="h-10 w-[78px] rounded-full border border-border bg-card sm:h-11 sm:w-[86px]" />
    );
  }

  return (
    <div className="flex items-center rounded-full border border-border bg-card p-1">
      {options.map((option) => {
        const Icon = option.icon;
        const isActive = activeTheme === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setTheme(option.value)}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:h-9 sm:w-9",
              isActive &&
                "bg-primary text-primary-foreground hover:text-primary-foreground",
            )}
            aria-label={`Use ${option.label} theme`}
            aria-pressed={isActive}
          >
            <Icon className="h-4 w-4" />
          </button>
        );
      })}
    </div>
  );
}