import { HEIGHT, WIDTH } from "../components/GitHubContributionGraph";
import {
  GetViewerQuery,
  RepositoryFragmentFragment,
} from "./__generated__/types";

async function request<T extends {}, V extends {} = {}>(
  query: string,
  variables?: V
): Promise<T> {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();

  return json.data;
}

function round(value: number, precision: number = 1): string {
  const factor = Math.pow(10, precision);
  const rounded = Math.floor(value * factor) / factor;
  return rounded.toString();
}

const OPACITY_CLAMP = 0.6;

export interface GitHubContributionStats {
  username: string;
  width: string;
  rx: string;
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

const GetViewer = /* GraphQL */ `
  fragment RepositoryFragment on Repository {
    nameWithOwner
    url
    description
    primaryLanguage {
      color
    }
  }

  query GetViewer {
    viewer {
      login
      contributionsCollection {
        contributionCalendar {
          weeks {
            contributionDays {
              contributionCount
            }
          }
        }
      }
      pinnedItems(first: 2) {
        nodes {
          __typename
          ... on Repository {
            ...RepositoryFragment
          }
        }
      }
    }
  }
`;

export async function getGitHubData(): Promise<GitHubData> {
  const res = await request<GetViewerQuery>(GetViewer);

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
    // 112 is a divisor of the value we have for width now, 672.
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
      rx: round(width / 2),
      contributions: contributions
        .map((count, index) => {
          const scale = count / max;
          return {
            count,
            height: round(scale * HEIGHT + width / 2),
            x: round(index * width),
            opacity: round(OPACITY_CLAMP + scale * (1 - OPACITY_CLAMP)),
          };
        })
        .filter(({ count }) => count > 0),
    },
  };
}
