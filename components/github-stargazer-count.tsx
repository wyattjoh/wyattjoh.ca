import { Star } from "lucide-react";
import { getRepository } from "../lib/github";

type Props = {
  name: string;
  count?: number;
};

function formatNumber(n: number): string {
  if (n >= 1e4) {
    return `${(n / 1e3).toFixed(0)}k`;
  }

  if (n >= 1e3) {
    return `${(n / 1e3).toFixed(1)}k`;
  }

  return n.toString();
}

export async function GitHubStargazerCount({ name, count }: Props) {
  if (!count) {
    const repository = await getRepository(name);
    count = repository.stargazers_count;
  }

  return (
    <span className="font-mono lowercase text-sm dark:text-gray-500 flex items-center gap-1">
      {formatNumber(count)} <Star className="w-4 h-4" aria-label="stars" />
    </span>
  );
}

export function GitHubStargazerCountSkeleton({ name, count }: Partial<Props>) {
  if (name && count) {
    return <GitHubStargazerCount name={name} count={count} />;
  }

  return (
    <span className="animate-pulse font-mono lowercase h-4 w-12 bg-gray-200 dark:bg-gray-700" />
  );
}
