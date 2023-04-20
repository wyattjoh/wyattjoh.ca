import { Suspense } from "react";
import Image from "next/image";

import { Link } from "../components/link";
import { GitHubRepositories } from "../components/github-repositories";
import avatar from "../public/avatar.jpeg";

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
        <p>
          As an open source enthusiast, I am a developer with a security-first
          mindset. Currently, I work as a Software Engineer at{" "}
          <Link href="https://vercel.com/">Vercel</Link>, contributing to the
          development of <Link href="https://nextjs.org/">Next.js</Link>. I have
          previously worked for organizations like{" "}
          <Link href="https://voxmedia.com/">@voxmedia</Link>,{" "}
          <Link href="https://foundation.mozilla.org/">@mozilla</Link>, and{" "}
          <Link href="https://coralproject.net/">@coralproject</Link> where I
          gained experience working on a variety of projects.
        </p>
        <p>
          If you are interested in checking out my work, feel free to explore my{" "}
          <Link href="https://github.com/wyattjoh">GitHub</Link> profile.
          Alternatively, you can also reach out to me via{" "}
          <Link href="mailto:hello@wyattjoh.ca">email</Link>,{" "}
          <Link href="https://keybase.io/wyattjoh">Keybase</Link>, or{" "}
          <Link href="https://www.linkedin.com/in/wyattjoh">LinkedIn</Link>.
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="font-bold">Featured Repositories:</h2>
        <Suspense>
          {/* @ts-expect-error - async components aren't yet supported in TS */}
          <GitHubRepositories />
        </Suspense>
      </section>
    </div>
  );
}
