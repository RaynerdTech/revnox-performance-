// This file defines the root HTML layout, global metadata, font setup, and theme provider for the storefront.
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Michroma } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const michroma = Michroma({
  variable: "--font-michroma",
  subsets: ["latin"],
  weight: "400",
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
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          ${michroma.variable}
          antialiased
        `}
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