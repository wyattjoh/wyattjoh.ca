import type { GetStaticProps } from "next";
import Image from "next/image";
import { FunctionComponent } from "react";

import GitHubRepository from "../components/GitHubRepository";
import Layout from "../components/Layout";
import Link from "../components/Link";
import { getGitHubData, GitHubData } from "../lib/github";

interface Props {
  data: GitHubData;
}

const IndexPage: FunctionComponent<Props> = ({
  data: { repositories, avatarUrl },
}) => (
  <Layout
    title="Wyatt Johnson"
    description="Full-stack developer working at @vercel on Next.js."
  >
    <div className="bg-primary-dark p-4 text-white space-y-8 min-h-full md:min-h-min relative overflow-hidden">
      {/* <GitHubContributionGraph stats={stats} /> */}
      <div className="flex flex-col md:flex-row items-center">
        <Image
          className="rounded-full"
          alt="Wyatt Johnson Avatar"
          priority
          src={avatarUrl}
          width={150}
          height={150}
        />
        <header className="md:ml-8 my-8 md:my-0 flex-grow">
          <h1 className="font-bold text-6xl lowercase mb-2">Wyatt Johnson</h1>
          <h2 className="font-bold text-sm">(he/him)</h2>
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
        <div className="grid grid-cols-1 gap-4">
          {repositories.featured.map((repo) => (
            <GitHubRepository key={repo.nameWithOwner} repo={repo} />
          ))}
        </div>
      </div>
      <p>
        Feel free to check out my{" "}
        <Link href="https://github.com/wyattjoh">GitHub</Link> profile, send me
        an <Link href="mailto:hello@wyattjoh.ca">Email</Link>, or a message on{" "}
        <Link href="https://keybase.io/wyattjoh">Keybase</Link>.
      </p>
    </div>
  </Layout>
);

export const getStaticProps: GetStaticProps<Props> = async () => {
  const data = await getGitHubData();

  return {
    props: { data },
    // Revalidate every hour.
    revalidate: 1 * 60 * 60,
  };
};

export default IndexPage;
