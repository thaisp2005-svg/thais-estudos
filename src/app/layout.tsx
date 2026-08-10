import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/nav/AppShell";
import { getTema } from "@/lib/data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Estudo+ — agenda e revisões",
  description: "Organização pessoal: estudos com revisão espaçada e agenda em um só lugar.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const tema = await getTema();

  return (
    <html
      lang="pt-BR"
      data-theme={tema === "auto" ? undefined : tema}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-bg text-text">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
