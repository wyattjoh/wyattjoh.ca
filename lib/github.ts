import { GraphQLClient } from "graphql-request";
import { parse } from "node-html-parser";
import { HEIGHT, WIDTH } from "../components/GitHubContributionGraph";
import { getSdk, RepositoryFragmentFragment } from "./graphql";

export interface GitHubContributionStats {
  username: string;
  width: string;
  contributions: Array<{
    height: string;
    x: string;
    opacity: string;
  }>;
}

function round(value: number, precision: number = 1): string {
  const factor = Math.pow(10, precision);
  const rounded = Math.floor(value * factor) / factor;
  return rounded.toString();
}

const OPACITY_CLAMP = 0.6;

export const getGitHubContributionStats = async (
  username: string
): Promise<GitHubContributionStats> => {
  const res = await fetch(`https://github.com/users/${username}/contributions`);
  const data = await res.text();
  const html = parse(data);
  const svg = html.querySelector("svg.js-calendar-graph-svg");
  const contributions = svg
    .querySelectorAll(".ContributionCalendar-day")
    .map((el) => {
      const date = el.getAttribute("data-date") || "";
      const count = el.getAttribute("data-count") || "";

      return { date, count };
    })
    .filter(({ count, date }) => {
      return !!count && !!date;
    })
    .map(({ count, date }) => ({
      count: parseInt(count, 10),
      date,
    }))
    .slice(-112);

  const max = contributions.reduce(
    (previousValue, { count }) => Math.max(previousValue, count),
    0
  );

  const width = WIDTH / contributions.length;

  return {
    username,
    width: round(width),
    contributions: contributions
      .map(({ count }, index) => {
        const scale = count / max;
        return {
          count,
          height: round(scale * HEIGHT, 0),
          x: round(index * width),
          opacity: round(OPACITY_CLAMP + scale * (1 - OPACITY_CLAMP)),
        };
      })
      .filter(({ count }) => count > 0),
  };
};

export interface GitHubRepository {
  nameWithOwner: string;
  description?: string;
  stargazerCount: number;
}

export interface GitHubData {
  repositories: GitHubRepository[];
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

  return { repositories };
}
