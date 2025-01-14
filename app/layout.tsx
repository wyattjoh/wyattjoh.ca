import type { Metadata } from "next";

import { Analytics } from "@vercel/analytics/react";

import { Footer } from "../components/footer";
import { base } from "../lib/base";

import "./layout.css";

type Props = {
  children: JSX.Element;
};

export const metadata: Metadata = {
  title: {
    default: "Wyatt Johnson",
    template: "%s | Wyatt Johnson",
  },
  metadataBase: new URL(base),
};

export default function Layout({ children }: Props) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans font-light dark:bg-gray-800">
        <main className="max-w-3xl mx-auto md:mt-6 mb-24 flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
      <Analytics />
    </html>
  );
}
