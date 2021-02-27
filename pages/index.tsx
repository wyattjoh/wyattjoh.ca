import { GetStaticProps } from "next";

import GitHubContributionGraph from "../components/GitHubContributionGraph";
import Layout from "../components/Layout";
import Link from "../components/Link";
import Pill from "../components/Pill";
import {
  getGitHubContributionStats,
  getGitHubData,
  GitHubContributionStats,
  GitHubRepository,
} from "../lib/github";

interface Props {
  stats: GitHubContributionStats;
  repositories: GitHubRepository[];
}

export default function IndexPage({ stats, repositories }: Props) {
  return (
    <Layout title="Wyatt Johnson">
      <div className="bg-pink-600 p-4 text-white space-y-8">
        <h1 className="font-bold text-6xl lowercase">Wyatt Johnson</h1>
        <p>
          Developer with a security first mindset. Lead Engineer at the
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
        <div className="">
          {repositories.map((repo) => (
            <div key={repo.nameWithOwner}></div>
          ))}
        </div>
        <div className="space-x-2">
          <Pill>Typescript</Pill>
          <Pill>GraphQL</Pill>
          <Pill>Go</Pill>
          <Pill>MongoDB</Pill>
          <Pill>Docker</Pill>
          <Pill>React</Pill>
        </div>
      </div>
      <GitHubContributionGraph stats={stats} />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const stats = await getGitHubContributionStats("wyattjoh");
  const { repositories } = await getGitHubData();

  return {
    props: { stats, repositories },
    // Revalidate every 6 hours.
    revalidate: 60 * 60 * 6,
  };
};
