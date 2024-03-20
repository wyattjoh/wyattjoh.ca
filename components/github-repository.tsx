import { Suspense } from "react";

import {
  GitHubStargazerCount,
  GitHubStargazerCountSkeleton,
} from "./github-stargazer-count";

export function GitHubRepositorySkeleton() {
  return (
    <span className="animate-pulse border border-gray-200 p-2 duration-200 transition-all hover:border-gray-300 drop-shadow-sm hover:drop-shadow-md bg-white">
      <span className="flex items-baseline justify-between mb-1">
        <span className="font-mono underline decoration-2 h-6 w-24 bg-gray-200 text-gray-200">
          Loading...
        </span>
        <GitHubStargazerCountSkeleton />
      </span>
      <p className="text-xs h-4 w-48 bg-gray-200" />
    </span>
  );
}

type Props = {
  repo: {
    name: string;
    url: string;
    description: string;
    color: string;
  };
};

export function GitHubRepository({ repo }: Props) {
  return (
    <a
      key={repo.name}
      href={repo.url}
      title={`Visit ${repo.name} on GitHub`}
      className="border border-gray-200 p-2 duration-200 transition-all hover:border-gray-300 drop-shadow-sm hover:drop-shadow-md bg-white"
    >
      <span className="flex items-baseline justify-between mb-1">
        <span
          style={{ textDecorationColor: repo.color }}
          className="font-mono underline decoration-2"
        >
          {repo.name}
        </span>
        <Suspense fallback={<GitHubStargazerCountSkeleton />}>
          <GitHubStargazerCount name={repo.name} />
        </Suspense>
      </span>
      <p className="text-xs">{repo.description}</p>
    </a>
  );
}
