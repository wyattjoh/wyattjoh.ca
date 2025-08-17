"use client";

import { useState } from "react";
import { cn } from "../lib/cn";
import type { Heading } from "../lib/notion";

type Props = {
  headings: Heading[];
};

export function MobileTableOfContents({ headings }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  if (headings.length === 0) {
    return null;
  }

  const handleHeadingClick = (id: string) => {
    setIsOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-40 lg:hidden w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors hover:cursor-pointer"
        aria-label="Open table of contents"
      >
        <svg
          className="w-5 h-5 text-gray-700 dark:text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          role="img"
          aria-label="Menu icon"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h7"
          />
        </svg>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <button
            type="button"
            className="absolute inset-0"
            onClick={() => setIsOpen(false)}
            aria-label="Close table of contents"
          />
          {/* Panel */}
          <div className="absolute left-0 top-0 bottom-0 w-96 max-w-[85vw] bg-white/50 dark:bg-gray-900/80 backdrop-blur-md shadow-xl slide-in-from-left animate-in">
            <div className="flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-gray-700/50">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                On this page
              </h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors hover:cursor-pointer"
                aria-label="Close table of contents"
              >
                <svg
                  className="w-4 h-4 text-gray-600 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  role="img"
                  aria-label="Close icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <nav className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-80px)]">
              {headings.map((heading) => {
                return (
                  <button
                    key={heading.id}
                    type="button"
                    onClick={() => handleHeadingClick(heading.id)}
                    className={cn(
                      "block w-full text-left py-2 px-2 rounded-lg transition-colors hover:cursor-pointer text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800",
                      heading.level === 1 && "font-bold",
                      heading.level === 2 && "pl-4",
                      heading.level === 3 && "pl-8"
                    )}
                  >
                    {heading.text}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
