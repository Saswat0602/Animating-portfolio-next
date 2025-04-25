"use client";

import { useTheme } from "next-themes";
import { Laptop, Moon, Sun } from "lucide-react";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();


  const ICON_SIZE = 16;

  const getIcon = (currentTheme: string | undefined) => {
    switch (currentTheme) {
      case "light":
        return <Sun size={ICON_SIZE} className="text-muted-foreground" />;
      case "dark":
        return <Moon size={ICON_SIZE} className="text-muted-foreground" />;
      default:
        return <Laptop size={ICON_SIZE} className="text-muted-foreground" />;
    }
  };

  return (
    <div className="flex items-center gap-2">
      {getIcon(theme)}
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="bg-transparent border border-input text-sm rounded-md px-2 py-1 text-muted-foreground focus:outline-none"
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
    </div>
  );
};

export { ThemeSwitcher };
