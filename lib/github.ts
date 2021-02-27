import { GraphQLClient } from "graphql-request";
import { HEIGHT, WIDTH } from "../components/GitHubContributionGraph";
import { getSdk, RepositoryFragmentFragment } from "./graphql";

function round(value: number, precision: number = 1): string {
  const factor = Math.pow(10, precision);
  const rounded = Math.floor(value * factor) / factor;
  return rounded.toString();
}

const OPACITY_CLAMP = 0.6;

export interface GitHubContributionStats {
  username: string;
  width: string;
  contributions: Array<{
    height: string;
    x: string;
    opacity: string;
  }>;
}

export interface GitHubData {
  repositories: RepositoryFragmentFragment[];
  stats: GitHubContributionStats;
}

export async function getGitHubData(): Promise<GitHubData> {
  const client = new GraphQLClient("https://api.github.com/graphql", {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },
  });
  const sdk = getSdk(client);
  const res = await sdk.GetViewer();

  const repositories = res.viewer.pinnedItems.nodes.filter(
    (node) => node.__typename === "Repository"
  ) as RepositoryFragmentFragment[];

  const contributions: number[] = res.viewer.contributionsCollection.contributionCalendar.weeks
    .reduce(
      (previousValue, week) =>
        previousValue.concat(
          week.contributionDays.map(
            ({ contributionCount }) => contributionCount
          )
        ),
      []
    )
    .slice(-112);

  const max = contributions.reduce(
    (previousValue, count) => Math.max(previousValue, count),
    0
  );

  const width = WIDTH / contributions.length;

  return {
    repositories,
    stats: {
      username: res.viewer.login,
      width: round(width),
      contributions: contributions
        .map((count, index) => {
          const scale = count / max;
          return {
            count,
            height: round(scale * HEIGHT, 0),
            x: round(index * width),
            opacity: round(OPACITY_CLAMP + scale * (1 - OPACITY_CLAMP)),
          };
        })
        .filter(({ count }) => count > 0),
    },
  };
}
