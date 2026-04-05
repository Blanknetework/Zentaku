import type { Metadata } from "next";
import { Bebas_Neue, Outfit, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
  subsets: ["latin"],
});

const notoJp = Noto_Sans_JP({
  variable: "--font-noto-jp",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Zentaku — Anime & Manga",
    template: "%s | Zentaku",
  },
  description: "Stream anime and read manga — dark, premium experience powered by live catalog data.",
};

import type { Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${outfit.variable} ${bebas.variable} ${notoJp.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col bg-background text-foreground overflow-x-hidden"
        suppressHydrationWarning
      >
        <Navbar />
        <div className="flex flex-1 flex-col overflow-x-hidden pb-20 md:pb-0">{children}</div>
        <BottomNav />
      </body>
    </html>
  );
}
