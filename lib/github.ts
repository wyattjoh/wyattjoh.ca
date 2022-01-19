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

  if (!res.ok) {
    throw new Error(await res.text());
  }

  const json = await res.json();

  return json.data;
}

function round(value: number, precision: number = 1): string {
  const factor = Math.pow(10, precision);
  const rounded = Math.floor(value * factor) / factor;
  return rounded.toString();
}

const OPACITY_CLAMP = 0.6;

// 112 is a divisor of the value we have for width now, 672.
export const CONTRIBUTION_DAYS = 112;

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
  avatarUrl: string;
  repositories: {
    featured: ReadonlyArray<RepositoryFragmentFragment>;
    latest: ReadonlyArray<RepositoryFragmentFragment>;
  };
  stats: GitHubContributionStats;
}

const GetViewer = /* GraphQL */ `
  fragment RepositoryFragment on Repository {
    id
    nameWithOwner
    url
    description
    primaryLanguage {
      color
      name
    }
  }

  query GetViewer($repositories: Int!) {
    viewer {
      login
      avatarUrl(size: 300)
      contributionsCollection {
        contributionCalendar {
          weeks {
            contributionDays {
              contributionCount
            }
          }
        }
      }
      pinnedItems(first: $repositories) {
        nodes {
          __typename
          ... on Repository {
            ...RepositoryFragment
          }
        }
      }
      repositories(
        orderBy: { field: PUSHED_AT, direction: DESC }
        isLocked: false
        first: $repositories
        privacy: PUBLIC
      ) {
        nodes {
          ...RepositoryFragment
        }
      }
    }
  }
`;

const REPOSITORY_COUNT = 8;

export async function getGitHubData(): Promise<GitHubData> {
  const res = await request<GetViewerQuery>(GetViewer, {
    repositories: REPOSITORY_COUNT,
  });

  const featured = res.viewer.pinnedItems?.nodes?.filter(
    (node) => node?.__typename === "Repository"
  ) as RepositoryFragmentFragment[];

  const latest = res.viewer.repositories.nodes
    ?.filter((latestRepo) => {
      if (!latestRepo) {
        return false;
      }

      return featured.every((repo) => repo.id !== latestRepo.id);
    })
    .slice(
      0,
      REPOSITORY_COUNT - featured.length
    ) as RepositoryFragmentFragment[];

  const contributions =
    res.viewer.contributionsCollection.contributionCalendar.weeks
      .reduce<number[]>(
        (previousValue, week) =>
          previousValue.concat(
            week.contributionDays.map(
              ({ contributionCount }) => contributionCount
            )
          ),
        []
      )

      .slice(-CONTRIBUTION_DAYS);

  const max = contributions.reduce(
    (previousValue, count) => Math.max(previousValue, count),
    0
  );

  const width = WIDTH / contributions.length;

  return {
    avatarUrl: res.viewer.avatarUrl,
    repositories: {
      featured: featured,
      latest: latest,
    },
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
