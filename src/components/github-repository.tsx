import type { Repository } from "@/lib/github";
import {
  GitHubStargazerCount,
  GitHubStargazerCountSkeleton,
} from "./github-stargazer-count";

export function GitHubRepositorySkeleton() {
  return (
    <span className="animate-pulse border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-900">
      <span className="flex items-start justify-between mb-2">
        <span className="font-mono h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
        <GitHubStargazerCountSkeleton />
      </span>
      <p className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mt-2" />
    </span>
  );
}

type Props = {
  repo: Repository;
};

export function GitHubRepository({ repo }: Props) {
  return (
    <a
      key={repo.name}
      href={repo.url}
      title={`Visit ${repo.name} on GitHub`}
      className="group block border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg transition-all duration-200 hover-lift bg-white dark:bg-gray-900 focus-ring"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-mono text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors dark:text-white">
          {repo.name}
        </h3>
        <div className="flex items-center gap-2">
          <GitHubStargazerCount count={repo.stargazers_count} />
        </div>
      </div>
      {repo.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {repo.description}
        </p>
      )}
      {repo.language && repo.color && (
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-500">
          <span
            className="flex items-center gap-1.5"
            style={{ color: repo.color }}
          >
            <span
              className="w-3 h-3 rounded-full inline-block"
              style={{ backgroundColor: repo.color }}
            />
            <span className="text-gray-600 dark:text-gray-400">
              {repo.language}
            </span>
          </span>
        </div>
      )}
    </a>
  );
}
