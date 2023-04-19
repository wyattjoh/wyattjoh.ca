import type { Metadata } from "next";

import Image from "next/image";

import Link from "../components/Link";
import { GitHubRepositories } from "../components/GitHubRepositories";
import { getUser } from "../lib/github";
import { Suspense } from "react";

export async function generateMetadata(): Promise<Metadata> {
  const user = await getUser();

  return {
    title: user.name,
    description: user.bio,
  };
}

export default async function Page() {
  const user = await getUser();

  return (
    <div className="p-4 space-y-8 min-h-full md:min-h-min relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-center">
        <Image
          className="rounded-full border-4 border-gray-200"
          alt="Wyatt Johnson Avatar"
          priority
          src={user.avatar}
          width={150}
          height={150}
        />
        <header className="md:ml-8 my-8 md:my-0 flex-grow">
          <h1 className="font-bold text-6xl mb-2">Wyatt Johnson</h1>
          <h2 className="font-bold text-xs text-gray-500">
            (pronouns: he/him, pronounced: why-et)
          </h2>
        </header>
      </div>
      <p>
        Developer with a security first mindset. Software Engineer at{" "}
        <Link href="https://vercel.com/">Vercel</Link> working on{" "}
        <Link href="https://nextjs.org/">Next.js</Link>. Previously{" "}
        <Link href="https://voxmedia.com/">@voxmedia</Link>,{" "}
        <Link href="https://foundation.mozilla.org/">@mozilla</Link>,{" "}
        <Link href="https://coralproject.net/">@coralproject</Link>.
      </p>
      <div className="space-y-2">
        <h2 className="font-bold">Featured Repositories:</h2>
        <Suspense>
          {/* @ts-expect-error - async components aren't yet supported in TS */}
          <GitHubRepositories />
        </Suspense>
      </div>
      <p>
        Feel free to check out my{" "}
        <Link href="https://github.com/wyattjoh">GitHub</Link> profile, send me
        an <Link href="mailto:hello@wyattjoh.ca">Email</Link>, or a message on{" "}
        <Link href="https://keybase.io/wyattjoh">Keybase</Link>.
      </p>
    </div>
  );
}
