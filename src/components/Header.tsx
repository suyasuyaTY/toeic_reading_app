"use client";
import Link from "next/link";
import { Home, Settings, BookOpen } from "lucide-react";
import ColorThemeSelector from "./ColorThemeSelector";

const Header = () => {
  return (
    <header className="shadow-md dark:border-b-white/10 dark:border-b-1">
      <nav className="container mx-auto px-2 py-2 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <BookOpen size={28} className="text-blue-600" />
          <span>TOEIC Practice</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1 text-slate-600 dark:text-white hover:text-blue-600 transition-colors"
          >
            <Home size={20} />
            <span>ホーム</span>
          </Link>
          <Link
            href="/settings"
            className="flex items-center gap-1 text-slate-600 dark:text-white hover:text-blue-600 transition-colors"
          >
            <Settings size={20} />
            <span>設定</span>
          </Link>
          <ColorThemeSelector />
        </div>
      </nav>
    </header>
  );
};

export default Header;
