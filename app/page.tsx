import { Suspense } from "react";
import Image from "next/image";

import {
  GitHubRepositories,
  GitHubRepositoriesSkeleton,
} from "../components/github-repositories";
import avatar from "../public/avatar.jpeg";
import { NotionBlocks } from "../components/notion-blocks";
import { BlogPosts } from "../components/blog-posts";

export const metadata = {
  title: "Wyatt Johnson",
  description:
    "Full-stack developer with a security first mindset. Working on Next.js at @vercel.",
};

export default function Page() {
  return (
    <div className="p-4 space-y-10">
      <section className="flex flex-col sm:flex-row sm:items-center">
        <div className="relative hidden sm:inline-block">
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
        <header className="sm:ml-8 mt-8 sm:my-0 flex-grow">
          <h1 className="font-bold text-6xl mb-2 dark:text-white">
            Wyatt Johnson
          </h1>
          <h2 className="font-bold text-xs text-gray-500">
            (pronouns: he/him, pronounced: why-et)
          </h2>
        </header>
      </section>
      <NotionBlocks
        id="8f20fbb5857a44b487824528dc0217ca"
        className="space-y-8"
      />
      <BlogPosts className="space-y-6" />
      <section className="space-y-6">
        <h2 className="font-bold dark:text-white">Featured Repositories:</h2>
        <Suspense fallback={<GitHubRepositoriesSkeleton count={4} />}>
          <GitHubRepositories />
        </Suspense>
      </section>
    </div>
  );
}
