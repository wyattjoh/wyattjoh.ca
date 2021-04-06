import { GetStaticProps } from "next";

import GitHubContributionGraph from "../components/GitHubContributionGraph";
import GitHubRepository from "../components/GitHubRepository";
import Layout from "../components/Layout";
import Link from "../components/Link";
import { getGitHubData, GitHubData } from "../lib/github";

interface Props {
  data: GitHubData;
}

export const config = {
  unstable_runtimeJS: false,
};

export default function IndexPage({ data: { stats, repositories } }: Props) {
  return (
    <Layout
      title="Wyatt Johnson"
      description="Full-stack developer working at @voxmedia on the @coralproject."
    >
      <div className="bg-pink-700 p-4 text-white space-y-8">
        <header>
          <h1 className="font-bold text-6xl lowercase mb-2">Wyatt Johnson</h1>
          <h2 className="font-bold text-sm">(he/him)</h2>
        </header>
        <p>
          Developer with a security first mindset. Senior Engineer, Technical
          Lead of Audience Platform Team at{" "}
          <Link href="https://voxmedia.com/">@voxmedia</Link>. Previously{" "}
          <Link href="https://coralproject.net/">@coralproject</Link>.
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
    // Revalidate every 3 hours.
    revalidate: 60 * 60 * 3,
  };
};
