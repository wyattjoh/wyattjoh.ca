import { Github } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import type { Person } from "schema-dts";

import { BlogPosts } from "@/components/blog-posts";
import {
  GitHubRepositories,
  GitHubRepositoriesSkeleton,
  RecentGitHubRepositories,
} from "@/components/github-repositories";
import { NotionBlocks } from "@/components/notion-blocks";
import { StructuredData } from "@/components/structured-data";
import { base } from "@/lib/base";
import {
  getViewerRepositories,
  MORE_REPOSITORIES_COUNT,
  PINNED_ITEMS_COUNT,
} from "@/lib/github";
import avatar from "../../public/avatar.jpeg";

export const metadata: Metadata = {
  title: "Wyatt Johnson",
  description:
    "Full-stack developer with a security first mindset. Working on Next.js at @vercel.",
  alternates: {
    canonical: base,
  },
};

export default function Page() {
  const personStructuredData: Person = {
    "@type": "Person",
    name: "Wyatt Johnson",
    jobTitle: "Software Engineer",
    description:
      "Software Engineer with a security first mindset. Working on Next.js at @vercel.",
    url: base,
    image: `${base}/avatar.jpeg`,
    sameAs: [
      "https://github.com/wyattjoh",
      "https://www.linkedin.com/in/wyattjohnson/",
    ],
    worksFor: {
      "@type": "Organization",
      name: "Vercel",
      url: "https://vercel.com",
    },
    knowsAbout: [
      "Next.js",
      "React",
      "TypeScript",
      "Node.js",
      "Full-stack Development",
      "Web Security",
      "Software Engineering",
    ],
  };

  const data = getViewerRepositories();

  return (
    <>
      <StructuredData data={personStructuredData} />
      <div className="p-4 md:p-8 space-y-12 md:space-y-16 max-w-4xl mx-auto">
        <section className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8">
          <div className="relative hidden sm:inline-block mx-auto sm:mx-0 animate-fade-in">
            <Image
              className="rounded-full border-4 border-gray-200 dark:border-gray-700"
              alt="Picture of Wyatt Johnson"
              priority
              src={avatar}
              width={150}
              height={150}
            />
            <a
              href="https://www.skippingstone.ca/"
              title="Donate to the Skipping Stone Foundation"
            >
              <span className="text-4xl absolute bottom-1 right-1">🏳️‍🌈</span>
            </a>
          </div>
          <header className="sm:ml-8 grow">
            <h1 className="font-bold text-4xl sm:text-5xl md:text-6xl mb-2 dark:text-white gradient-text leading-relaxed">
              Wyatt Johnson
            </h1>
            <h2 className="font-semibold text-sm sm:text-base text-gray-600 dark:text-gray-400">
              (pronouns: he/him, pronounced: why-et)
            </h2>
          </header>
        </section>
        <div id="about">
          <NotionBlocks
            id="8f20fbb5857a44b487824528dc0217ca"
            className="space-y-6 prose prose-lg dark:prose-invert max-w-none"
          />
        </div>
        <div id="posts">
          <BlogPosts className="space-y-8" />
        </div>
        <section className="space-y-8" id="projects">
          <h2 className="font-bold text-2xl dark:text-white">
            Featured Repositories
          </h2>
          <Suspense
            fallback={<GitHubRepositoriesSkeleton count={PINNED_ITEMS_COUNT} />}
          >
            <GitHubRepositories data={data} />
          </Suspense>
        </section>
        <section className="space-y-8" id="recent-projects">
          <h2 className="font-bold text-2xl dark:text-white">
            Recent Projects
          </h2>
          <Suspense
            fallback={
              <GitHubRepositoriesSkeleton count={MORE_REPOSITORIES_COUNT} />
            }
          >
            <RecentGitHubRepositories data={data} />
          </Suspense>
        </section>
        <section className="flex justify-center">
          <a
            href="https://github.com/wyattjoh"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg transition-all duration-200 hover-lift bg-white dark:bg-gray-900 focus-ring text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            <Github size={20} aria-label="GitHub" />
            <span className="font-medium">View all repositories on GitHub</span>
          </a>
        </section>
      </div>
    </>
  );
}
