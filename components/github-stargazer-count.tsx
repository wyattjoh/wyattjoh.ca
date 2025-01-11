import { getRepository } from "../lib/github";

type Props = {
  name: string;
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

export async function GitHubStargazerCount({ name }: Props) {
  const repository = await getRepository(name);

  return (
    <span className="font-mono lowercase text-xs dark:text-gray-500">
      {formatNumber(repository.stargazers_count)}{" "}
      <span className="text-xl leading-none">☆</span>
    </span>
  );
}

export function GitHubStargazerCountSkeleton() {
  return (
    <span className="animate-pulse font-mono lowercase h-4 w-12 bg-gray-200 dark:bg-gray-700" />
  );
}
