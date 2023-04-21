import { Suspense } from "react";
import Image from "next/image";

import { GitHubRepositories } from "../components/github-repositories";
import avatar from "../public/avatar.jpeg";
import { NotionBlocks } from "../components/notion-blocks";

export const metadata = {
  title: "Wyatt Johnson",
  description:
    "Full-stack developer with a security first mindset. Working on Next.js at @vercel.",
};

export default function Page() {
  return (
    <div className="p-4">
      <section className="flex flex-col sm:flex-row sm:items-center mb-8">
        <Image
          className="rounded-full border-4 border-gray-200 hidden sm:inline-block"
          alt="Wyatt Johnson Avatar"
          priority
          src={avatar}
          width={150}
          height={150}
        />
        <header className="sm:ml-8 mt-8 sm:my-0 flex-grow">
          <h1 className="font-bold text-6xl mb-2">Wyatt Johnson</h1>
          <h2 className="font-bold text-xs text-gray-500">
            (pronouns: he/him, pronounced: why-et)
          </h2>
        </header>
      </section>
      <section className="space-y-8 mb-16">
        {/* This represents the most important content on the page, so wait for it */}
        <Suspense>
          {/* @ts-expect-error - async components aren't yet supported in TS */}
          <NotionBlocks id="8f20fbb5857a44b487824528dc0217ca" />
        </Suspense>
      </section>
      <section className="space-y-2">
        {/* This list of repositories isn't critical, so let it stream in later */}
        <Suspense>
          <h2 className="font-bold">Featured Repositories:</h2>
          {/* @ts-expect-error - async components aren't yet supported in TS */}
          <GitHubRepositories />
        </Suspense>
      </section>
    </div>
  );
}
