import { getRepositories } from "../lib/notion";
import {
  GitHubRepository,
  GitHubRepositorySkeleton,
} from "./github-repository";

export function GitHubRepositoriesSkeleton(props: { count: number }) {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      {Array.from({ length: props.count }).map((_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        <GitHubRepositorySkeleton key={index} />
      ))}
    </div>
  );
}

export async function GitHubRepositories() {
  const repositories = await getRepositories();

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      {repositories.map((repo) => (
        <GitHubRepository key={repo.id} repo={repo} />
      ))}
    </div>
  );
}
