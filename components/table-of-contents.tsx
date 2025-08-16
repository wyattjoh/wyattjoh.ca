"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";
import type { Heading } from "../lib/notion";

type Props = {
  headings: Heading[];
};

export function TableOfContents({ headings }: Props) {
  const [activeId, setActiveId] = useState<string | undefined>();
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      {
        rootMargin: "-20% 0% -80% 0%",
        threshold: 0,
      }
    );

    const headingElements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((el): el is HTMLElement => el !== null);

    for (const element of headingElements) {
      observer.observe(element);
    }

    return () => {
      for (const element of headingElements) {
        observer.unobserve(element);
      }
    };
  }, [headings]);

  useEffect(() => {
    const headerObserver = new IntersectionObserver(
      (entries) => {
        const headerEntry = entries[0];
        setIsSticky(!headerEntry.isIntersecting);
      },
      {
        rootMargin: "-20% 0% -80% 0%",
        threshold: 0,
      }
    );

    const headerElement = document.querySelector("header");
    if (headerElement) {
      headerObserver.observe(headerElement);
    }

    return () => {
      if (headerElement) {
        headerObserver.unobserve(headerElement);
      }
    };
  }, []);

  if (headings.length === 0) {
    return null;
  }

  return (
    <aside
      className={clsx(
        "hidden lg:block duration-200 opacity-50 hover:opacity-100 transition-opacity  max-h-[calc(100vh-5rem)] overflow-y-auto",
        isSticky ? "sticky top-10" : ""
      )}
    >
      <div className="text-sm font-medium text-gray-900/80 dark:text-gray-100 mb-4 flex items-center space-x-2">
        <svg
          role="img"
          aria-label="On this page"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3"
        >
          <path
            d="M2.44434 12.6665H13.5554"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
          <path
            d="M2.44434 3.3335H13.5554"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
          <path
            d="M2.44434 8H7.33323"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
        <span>On this page</span>
      </div>
      <nav className="space-y-1 text-sm">
        {headings.map((heading) => {
          const isActive = activeId === heading.id;
          const paddingClass =
            heading.level === 1 ? "" : heading.level === 2 ? "pl-2" : "pl-4";

          return (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              className={clsx(
                "block py-1 transition-colors",
                paddingClass,
                isActive && "text-indigo-600 dark:text-indigo-400 font-medium",
                !isActive &&
                  "hover:text-black dark:text-gray-300/70 dark:hover:text-white",
                heading.level === 1 && "font-medium text-gray-900/80",
                heading.level === 2 && "font-normal text-gray-800/80",
                heading.level === 3 && "font-light text-gray-700/70"
              )}
            >
              {heading.text}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
