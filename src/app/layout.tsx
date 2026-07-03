import type { Metadata } from "next";
import { Space_Grotesk, Syne, JetBrains_Mono } from "next/font/google";
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

export const viewport = {
  width: "device-width",
  initialScale: 1,
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
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){function c(){var a=document.querySelectorAll("[bis_skin_checked]");for(var b=0;b<a.length;b++){a[b].removeAttribute("bis_skin_checked")}}var d=new MutationObserver(c);d.observe(document.documentElement,{attributes:!0,subtree:!0,attributeFilter:["bis_skin_checked"]});document.readyState==="loading"?document.addEventListener("DOMContentLoaded",c):c()})()`,
          }}
        />
        <SquadProvider>{children}</SquadProvider>
      </body>
    </html>
  );
}
