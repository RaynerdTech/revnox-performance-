// This file defines the root HTML layout, global metadata, font setup, and theme provider for the storefront.
import type { Metadata, Viewport } from "next";
import {
  Geist,
  Geist_Mono,
  Inter_Tight,
  Orbitron,
  Oxanium,
} from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["600", "700", "900"],
  display: "swap",
});

const oxanium = Oxanium({
  variable: "--font-oxanium",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Revnox Performance | Premium Auto Parts",
    template: "%s | Revnox Performance",
  },

  description:
    "Premium performance auto parts, wheels, braking, suspension, and build-focused upgrades for serious drivers.",

  applicationName: "Revnox Performance",

  keywords: [
    "Revnox Performance",
    "premium auto parts",
    "performance parts",
    "wheels",
    "brakes",
    "suspension",
    "automotive ecommerce",
  ],

  authors: [{ name: "Revnox Performance" }],
  creator: "Revnox Performance",
  publisher: "Revnox Performance",

  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Revnox Performance",
    title: "Revnox Performance | Premium Auto Parts",
    description:
      "A premium automotive parts storefront built for performance-focused drivers.",
  },

  twitter: {
    card: "summary_large_image",
    title: "Revnox Performance | Premium Auto Parts",
    description:
      "Premium performance auto parts, wheels, braking, suspension, and build-focused upgrades.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,

  themeColor: [
    {
      media: "(prefers-color-scheme: light)",
      color: "#f7f7f4",
    },
    {
      media: "(prefers-color-scheme: dark)",
      color: "#070708",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={[
          geistSans.variable,
          geistMono.variable,
          interTight.variable,
          orbitron.variable,
          oxanium.variable,
          "antialiased",
        ].join(" ")}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}