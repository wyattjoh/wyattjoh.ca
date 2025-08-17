import { Star } from "lucide-react";

type Props = {
  count: number;
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

export function GitHubStargazerCount({ count }: Props) {
  return (
    <span className="font-mono lowercase text-sm dark:text-gray-500 flex items-center gap-1">
      {formatNumber(count)} <Star className="w-4 h-4" aria-label="stars" />
    </span>
  );
}

export function GitHubStargazerCountSkeleton() {
  return (
    <span className="animate-pulse font-mono lowercase h-4 w-12 bg-gray-200 dark:bg-gray-700" />
  );
}
