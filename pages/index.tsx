import { GetStaticProps } from "next";

import GitHubContributionGraph from "../components/GitHubContributionGraph";
import GitHubRepository from "../components/GitHubRepository";
import Layout from "../components/Layout";
import Link from "../components/Link";
import { getGitHubData, GitHubData } from "../lib/github";

interface Props {
  data: GitHubData;
}

export default function IndexPage({ data: { stats, repositories } }: Props) {
  return (
    <Layout title="Wyatt Johnson">
      <div className="bg-pink-700 p-4 text-white space-y-8">
        <h1 className="font-bold text-6xl lowercase">Wyatt Johnson</h1>
        <p>
          Developer with a security first mindset. Lead Engineer at the{" "}
          <Link href="https://coralproject.net/">coralproject</Link> with{" "}
          <Link href="https://voxmedia.com/">Vox Media Inc</Link>.
        </p>
        <p>
          Feel free to check out my{" "}
          <Link href="https://github.com/wyattjoh">GitHub</Link> profile, follow
          me on <Link href="https://twitter.com/wyattjoh">Twitter</Link>, send
          me an <Link href="mailto:hello@wyattjoh.ca">Email</Link>, or a message
          on <Link href="https://keybase.io/wyattjoh">Keybase</Link>.
        </p>
        <div className="space-y-2">
          <h2 className="font-bold">Recent Projects:</h2>
          <div className="grid grid-cols-1 gap-4">
            {repositories.map((repo) => (
              <GitHubRepository key={repo.nameWithOwner} repo={repo} />
            ))}
          </div>
        </div>
      </div>
      <GitHubContributionGraph stats={stats} />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const data = await getGitHubData();

  return {
    props: { data },
    // Revalidate every 6 hours.
    revalidate: 60 * 60 * 6,
  };
};
