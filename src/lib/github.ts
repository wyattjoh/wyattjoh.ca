import "server-only";

import { Octokit } from "@octokit/core";
import { cacheLife, cacheTag } from "next/cache";

import type {
  RepositoryFragment,
  ViewerRepositoriesQuery,
} from "@/generated/github-types";

export const PINNED_ITEMS_COUNT = 6;
export const MORE_REPOSITORIES_COUNT = 6;

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
  cacheTag("github");
  cacheLife("hours");

  const data = await octokit.graphql<ViewerRepositoriesQuery>(
    /* GraphQL */ `
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

      query ViewerRepositories($firstPinnedItems: Int!, $firstRepositories: Int!) {
        viewer {
          repositories(
            first: $firstRepositories
            privacy: PUBLIC
            ownerAffiliations: [OWNER]
            orderBy: { field: UPDATED_AT, direction: DESC }
            isArchived: false
          ) {
            nodes {
              __typename
              ...Repository
            }
          }
          pinnedItems(first: $firstPinnedItems) {
            nodes {
              __typename
              ...Repository
            }
          }
        }
      }`,
    {
      firstPinnedItems: PINNED_ITEMS_COUNT,
      firstRepositories: MORE_REPOSITORIES_COUNT + PINNED_ITEMS_COUNT,
    }
  );

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
      .slice(0, MORE_REPOSITORIES_COUNT);
  }

  return repositories;
};
