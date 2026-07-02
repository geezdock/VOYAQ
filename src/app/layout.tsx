import type { Metadata } from "next";
import { Space_Grotesk, Syne, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { SquadProvider } from "@/lib/SquadContext";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VOYAQ — Plan trips. Together.",
  description:
    "Collaborative group travel planner for Indian students. Budget, vote, and build itineraries as a squad.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${syne.variable} ${jetbrainsMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Script
          src="/scripts/clean-bis.js"
          strategy="beforeInteractive"
        />
        <SquadProvider>{children}</SquadProvider>
      </body>
    </html>
  );
}
