import type { Metadata, Viewport } from "next";
import { Anton, Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const anton = Anton({
  display: "swap",
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
});

const archivo = Archivo({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-archivo",
});

const plexMono = IBM_Plex_Mono({
  display: "swap",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Gründbar — pitch your idea, find your people",
    template: "%s — Gründbar",
  },
  description:
    "Gründbar is a registry for startup ideas: pitch yours, upvote the good ones, and team up with founders looking for co-founders, engineers and designers.",
};

export const viewport: Viewport = {
  themeColor: "#f4f0e4",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${anton.variable} ${archivo.variable} ${plexMono.variable} flex min-h-screen flex-col`}
      >
        {children}
      </body>
    </html>
  );
}
