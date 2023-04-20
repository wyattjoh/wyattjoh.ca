import { Suspense } from "react";
import Image from "next/image";

import { Link } from "../components/Link";
import { GitHubRepositories } from "../components/GitHubRepositories";
import avatar from "../public/avatar.jpeg";

export const metadata = {
  title: "Wyatt Johnson",
  description:
    "Full-stack developer with a security first mindset. Working on Next.js at @vercel.",
};

export default function Page() {
  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row sm:items-center mb-8">
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
      </div>
      <div className="space-y-8 mb-16">
        <p>
          Developer with a security first mindset. Software Engineer at{" "}
          <Link href="https://vercel.com/">Vercel</Link> working on{" "}
          <Link href="https://nextjs.org/">Next.js</Link>. Previously{" "}
          <Link href="https://voxmedia.com/">@voxmedia</Link>,{" "}
          <Link href="https://foundation.mozilla.org/">@mozilla</Link>,{" "}
          <Link href="https://coralproject.net/">@coralproject</Link>.
        </p>
        <p>
          Feel free to check out my{" "}
          <Link href="https://github.com/wyattjoh">GitHub</Link> profile, send
          me an <Link href="mailto:hello@wyattjoh.ca">Email</Link>, a message on{" "}
          <Link href="https://keybase.io/wyattjoh">Keybase</Link> or{" "}
          <Link href="https://www.linkedin.com/in/wyattjoh">LinkedIn</Link>.
        </p>
      </div>
      <div className="space-y-2">
        <h2 className="font-bold">Featured Repositories:</h2>
        <Suspense>
          {/* @ts-expect-error - async components aren't yet supported in TS */}
          <GitHubRepositories />
        </Suspense>
      </div>
    </div>
  );
}
