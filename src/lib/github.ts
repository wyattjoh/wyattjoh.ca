import "server-only";

import { Octokit } from "@octokit/core";
import { unstable_cacheLife, unstable_cacheTag } from "next/cache";

import type {
  RepositoryFragment,
  ViewerRepositoriesQuery,
} from "@/generated/github-types";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export type Repository = {
  id: string;
  name: string;
  url: string;
  description: string | null;
  stargazers_count: number;
  language?: string;
  color?: string | null;
};

function mapRepository(node: RepositoryFragment): Repository {
  return {
    id: node.id,
    name: node.nameWithOwner,
    url: node.url,
    description: node.description ?? null,
    stargazers_count: node.stargazerCount,
    language: node.languages?.nodes?.[0]?.name,
    color: node.languages?.nodes?.[0]?.color,
  };
}

export type ViewerRepositories = {
  pinned: Repository[];
  repositories: Repository[];
};

export const getViewerRepositories = async (): Promise<ViewerRepositories> => {
  "use cache";
  unstable_cacheTag("github");
  unstable_cacheLife("hours");

  const data = await octokit.graphql<ViewerRepositoriesQuery>({
    query: /* GraphQL */ `
      fragment Repository on Repository {
        id
        nameWithOwner
        url
        stargazerCount
        description
        languages(first: 1) {
          nodes {
            name
            color
          }
        }
      }

      query ViewerRepositories {
        viewer {
          repositories(
            first: 12
            privacy: PUBLIC
            ownerAffiliations: [OWNER]
            orderBy: { field: PUSHED_AT, direction: DESC }
            isArchived: false
          ) {
            nodes {
              __typename
              ...Repository
            }
          }
          pinnedItems(first: 6) {
            nodes {
              __typename
              ...Repository
            }
          }
        }
      }`,
  });

  const repositories: ViewerRepositories = {
    pinned: [],
    repositories: [],
  };

  if (data.viewer.pinnedItems.nodes) {
    repositories.pinned = data.viewer.pinnedItems.nodes
      .map((node) => {
        if (!node || node.__typename !== "Repository") return null;
        return mapRepository(node);
      })
      .filter((repo): repo is Repository => repo !== null);
  }

  const pinnedIDs = new Set(repositories.pinned.map((repo) => repo.id));

  if (data.viewer.repositories.nodes) {
    repositories.repositories = data.viewer.repositories.nodes
      .map((node) => {
        if (!node || node.__typename !== "Repository") return null;
        return mapRepository(node);
      })
      .filter(
        (repo): repo is Repository => repo !== null && !pinnedIDs.has(repo.id)
      )
      .slice(0, 5);
  }

  return repositories;
};
