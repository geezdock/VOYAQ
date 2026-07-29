import type { Metadata } from "next";
import Script from "next/script";
import { Space_Grotesk, Syne, JetBrains_Mono } from "next/font/google";
import { SquadProvider } from "@/shared/providers/SquadContext";
import { AuthProvider } from "@/shared/providers/AuthContext";
import { AnalyticsProvider } from "@/shared/providers/AnalyticsProvider";
import { GlobalToast } from "@/shared/components";
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
  metadataBase: new URL("https://voyaq.app"),
  title: {
    default: "VOYAQ — Plan trips. Together.",
    template: "%s | VOYAQ",
  },
  description:
    "Collaborative group travel planner for Indian students. Budget, vote, and build itineraries as a squad.",
  keywords: ["group travel", "trip planner", "squad travel", "India travel", "student travel", "budget trip"],
  authors: [{ name: "VOYAQ" }],
  creator: "VOYAQ",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://voyaq.app",
    siteName: "VOYAQ",
    title: "VOYAQ — Plan trips. Together.",
    description:
      "Collaborative group travel planner for Indian students. Budget, vote, and build itineraries as a squad.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VOYAQ — Group trip planner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@voyaqapp",
    creator: "@voyaqapp",
    title: "VOYAQ — Plan trips. Together.",
    description:
      "Collaborative group travel planner for Indian students. Budget, vote, and build itineraries as a squad.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/icon.svg",
  },
  manifest: "/manifest.json",
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
        <Script
          id="clean-bis"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){function c(){var a=document.querySelectorAll("[bis_skin_checked]");for(var b=0;b<a.length;b++){a[b].removeAttribute("bis_skin_checked")}}var d=new MutationObserver(c);d.observe(document.documentElement,{attributes:!0,subtree:!0,attributeFilter:["bis_skin_checked"]});document.readyState==="loading"?document.addEventListener("DOMContentLoaded",c):c()})()`,
          }}
        />
        <Script
          id="register-sw"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `if("serviceWorker"in navigator){window.addEventListener("load",()=>{navigator.serviceWorker.register("/sw.js")})}`,
          }}
        />
        <AuthProvider>
          <SquadProvider>
            <AnalyticsProvider>
              {children}
              <GlobalToast />
            </AnalyticsProvider>
          </SquadProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
