import {
  GitHubRepository,
  GitHubRepositorySkeleton,
} from "@/components/github-repository";
import type { ViewerRepositories } from "@/lib/github";

export function GitHubRepositoriesSkeleton(props: { count: number }) {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      {Array.from({ length: props.count }).map((_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: Index is stable for skeleton placeholders
        <GitHubRepositorySkeleton key={index} />
      ))}
    </div>
  );
}

type Props = {
  data: Promise<ViewerRepositories>;
};

export async function GitHubRepositories({ data }: Props) {
  const { pinned } = await data;

  return (
    <div className="grid gap-4 grid-cols-1">
      {pinned.map((repo) => (
        <GitHubRepository key={repo.id} repo={repo} />
      ))}
    </div>
  );
}

export async function RecentGitHubRepositories({ data }: Props) {
  const { repositories } = await data;

  return (
    <div className="grid gap-4 grid-cols-1">
      {repositories.map((repo) => (
        <GitHubRepository key={repo.id} repo={repo} />
      ))}
    </div>
  );
}
