import type { Metadata } from "next";
import { clsx } from "clsx";

import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";

import { Footer } from "../components/footer";
import { base } from "../lib/base";

import "./layout.css";

const inter = Inter({ subsets: ["latin"] });

type Props = {
  children: JSX.Element;
};

export const metadata: Metadata = {
  title: {
    default: "Wyatt Johnson",
    template: "%s | Wyatt Johnson",
  },
  icons: {
    icon: [
      { url: "/favicon64x64.png", sizes: "64x64" },
      { url: "/favicon128x128.png", sizes: "128x128" },
      { url: "/favicon256x256.png", sizes: "256x256" },
    ],
  },
  metadataBase: new URL(base),
};

export default function Layout({ children }: Props) {
  return (
    <html lang="en">
      <body
        className={clsx(
          inter.className,
          "min-h-screen font-sans font-light dark:bg-gray-800"
        )}
      >
        <main className="max-w-3xl mx-auto md:mt-6 mb-24 flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
      <Analytics />
    </html>
  );
}
