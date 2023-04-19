import clsx from "clsx";
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
      className="border border-blue-100 p-2 rounded-md duration-100 transition-colors hover:border-blue-300"
    >
      <div
        className={clsx(
          "font-bold flex items-baseline justify-between",
          repo.description && "mb-1"
        )}
      >
        <span>
          <span
            style={{ backgroundColor: repo.color }}
            className="w-3 h-3 inline-block rounded-full border border-white mr-2"
          />
          <span>{repo.name}</span>
        </span>
        <Suspense>
          {/* @ts-expect-error - async components aren't yet supported in TS */}
          <GitHubStargazerCount name={repo.name} />
        </Suspense>
      </div>
      {repo.description && <p className="text-xs">{repo.description}</p>}
    </a>
  );
}
