import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { Footer } from "../components/footer";
import { base } from "../lib/base";
import { cn } from "../lib/cn";

import "./layout.css";

const inter = Inter({ subsets: ["latin"] });

type Props = {
  children: ReactNode;
};

export const metadata: Metadata = {
  title: {
    default: "Wyatt Johnson",
    template: "%s | Wyatt Johnson",
  },
  description:
    "Software Engineer with a security first mindset. Working on Next.js at @vercel.",
  keywords: [
    "Wyatt Johnson",
    "Full-stack Developer",
    "Next.js",
    "React",
    "TypeScript",
    "Vercel",
    "Web Development",
    "Software Engineering",
  ],
  authors: [{ name: "Wyatt Johnson", url: base }],
  creator: "Wyatt Johnson",
  publisher: "Wyatt Johnson",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: base,
    title: "Wyatt Johnson",
    description:
      "Software Engineer with a security first mindset. Working on Next.js at @vercel.",
    siteName: "Wyatt Johnson",
    images: [
      {
        url: `${base}/avatar.jpeg`,
        width: 1200,
        height: 630,
        alt: "Wyatt Johnson",
      },
    ],
  },
  icons: {
    icon: [
      { url: "/favicon64x64.png", sizes: "64x64" },
      { url: "/favicon128x128.png", sizes: "128x128" },
      { url: "/favicon256x256.png", sizes: "256x256" },
    ],
  },
  metadataBase: new URL(base),
  alternates: {
    canonical: base,
  },
};

export default function Layout({ children }: Props) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://avatars.githubusercontent.com" />
      </head>
      <body
        className={cn(
          inter.className,
          "min-h-screen font-sans font-light dark:bg-gray-800"
        )}
      >
        <main className="max-w-3xl mx-auto mt-6 mb-24 flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
      <Analytics />
      <SpeedInsights />
    </html>
  );
}
