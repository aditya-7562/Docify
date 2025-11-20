"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useEffect, useState } from "react";

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const root = document.documentElement;
    const isDark = root.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const newTheme = theme === "light" ? "dark" : "light";
    root.classList.toggle("dark");
    setTheme(newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="h-9 w-9 flex items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <MoonIcon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
      ) : (
        <SunIcon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
      )}
    </button>
  );
};

