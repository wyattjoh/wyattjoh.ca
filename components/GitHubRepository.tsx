import { Suspense } from "react";

import { GitHubStargazerCount } from "./GitHubStargazerCount";

interface Props {
  repo: {
    name: string;
    url: string;
    description: string;
    color: string;
  };
}

export function GitHubRepository({ repo }: Props) {
  return (
    <a
      key={repo.name}
      href={repo.url}
      title={`Visit ${repo.name} on GitHub`}
      className="border border-gray-200 p-2 duration-200 transition-all hover:border-gray-300 drop-shadow-sm hover:drop-shadow-md bg-white"
    >
      <div className="flex items-baseline justify-between mb-1">
        <span
          style={{ textDecorationColor: repo.color }}
          className="underline decoration-2"
        >
          {repo.name}
        </span>
        <Suspense>
          {/* @ts-expect-error - async components aren't yet supported in TS */}
          <GitHubStargazerCount name={repo.name} />
        </Suspense>
      </div>
      <p className="text-xs">{repo.description}</p>
    </a>
  );
}
