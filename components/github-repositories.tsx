import { getRepositories } from "../lib/notion";
import {
  GitHubRepository,
  GitHubRepositorySkeleton,
} from "./github-repository";

export function GitHubRepositoriesSkeleton(props: { count: number }) {
  return (
    <div className="flex flex-col space-y-3">
      {Array.from({ length: props.count }).map((_, index) => (
        <GitHubRepositorySkeleton key={index} />
      ))}
    </div>
  );
}

export async function GitHubRepositories() {
  const repositories = await getRepositories();

  return (
    <div className="flex flex-col space-y-3">
      {repositories.map((repo) => (
        <GitHubRepository key={repo.id} repo={repo} />
      ))}
    </div>
  );
}
