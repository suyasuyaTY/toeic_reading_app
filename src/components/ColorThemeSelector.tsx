"use client";

import { Laptop, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ColorThemeSelector = () => {
  const { theme, themes, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // クライアント側でのみレンダリング
  return (
    <div
      className="inline-flex rounded-full text-gray-950 dark:text-white bg-gray-950/5 dark:bg-white/10 shadow-xs"
      role="group"
    >
      {themes.map((item) => (
        <button
          className={`flex cursor-pointer w-8 h-8 rounded-full items-center gap-2 px-2 ${
            item === theme
              ? "bg-white dark:bg-gray-800 ring-1 ring-gray-950/5 inset-ring-white dark:ring-white/10"
              : ""
          }`}
          key={item}
          onClick={() => setTheme(item)}
        >
          {item === "light" ? (
            <SunIcon size={16} />
          ) : item === "system" ? (
            <Laptop size={16} />
          ) : (
            <MoonIcon size={16} />
          )}
        </button>
      ))}
    </div>
  );
};

export default ColorThemeSelector;
