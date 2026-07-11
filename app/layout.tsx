import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Schibsted_Grotesk } from "next/font/google";
import "./globals.css";

const grotesk = Schibsted_Grotesk({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-grotesk",
});

const jetbrains = JetBrains_Mono({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: {
    default: "Gründbar — pitch your idea, find your people",
    template: "%s — Gründbar",
  },
  description:
    "Gründbar is a directory for startup ideas: pitch yours, upvote the good ones, and team up with founders looking for co-founders, engineers and designers.",
};

export const viewport: Viewport = {
  themeColor: "#fafdf9",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${grotesk.variable} ${jetbrains.variable} flex min-h-screen flex-col`}
      >
        {children}
      </body>
    </html>
  );
}
