import type { GetStaticProps } from "next";
import Image from "next/image";
import { FunctionComponent } from "react";

import GitHubContributionGraph from "../components/GitHubContributionGraph";
import GitHubRepository from "../components/GitHubRepository";
import Layout from "../components/Layout";
import Link from "../components/Link";
import { getGitHubData, GitHubData } from "../lib/github";
import avatar from "../public/images/avatar.jpeg";

interface Props {
  data: GitHubData;
}

const IndexPage: FunctionComponent<Props> = ({
  data: { stats, repositories, avatarUrl },
}) => (
  <Layout
    title="Wyatt Johnson"
    description="Full-stack developer working at @voxmedia on the @coralproject."
  >
    <div className="bg-primary-dark p-4 text-white space-y-8 md:rounded-t-3xl min-h-full md:min-h-min">
      <div className="flex flex-col md:flex-row items-center">
        <Image
          className="rounded-full"
          alt="Wyatt Johnson Avatar"
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
        Developer with a security first mindset. Staff Engineer, Technical Lead
        of Audience Platform Team at{" "}
        <Link href="https://voxmedia.com/">@voxmedia</Link>. Previously{" "}
        Technical Lead of the{" "}
        <Link href="https://coralproject.net/">@coralproject</Link>.
      </p>
      <p>
        Feel free to check out my{" "}
        <Link href="https://github.com/wyattjoh">GitHub</Link> profile, follow
        me on <Link href="https://twitter.com/wyattjoh">Twitter</Link>, send me
        an <Link href="mailto:hello@wyattjoh.ca">Email</Link>, or a message on{" "}
        <Link href="https://keybase.io/wyattjoh">Keybase</Link>.
      </p>
      <div className="space-y-2">
        <h2 className="font-bold">Featured Repositories:</h2>
        <div className="grid grid-cols-1 gap-4">
          {repositories.featured.map((repo) => (
            <GitHubRepository key={repo.nameWithOwner} repo={repo} />
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <h2 className="font-bold">Recent Repositories:</h2>
        <div className="grid grid-cols-1 gap-4">
          {repositories.latest.map((repo) => (
            <GitHubRepository key={repo.nameWithOwner} repo={repo} />
          ))}
        </div>
      </div>
    </div>
    <GitHubContributionGraph stats={stats} />
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
