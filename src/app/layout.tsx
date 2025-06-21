import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { AppContextProvider } from "@/components/providers/AppContextProvider";
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TOEIC Reading Practice",
  description: "Practice TOEIC reading questions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head></head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AppContextProvider>
            <Header />
            <main className="container mx-auto px-4 py-8">{children}</main>
          </AppContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
