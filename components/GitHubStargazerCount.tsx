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
    <span className="lowercase text-xs">
      {formatNumber(repository.stargazers_count)}{" "}
      <span className="text-xl">★</span>
    </span>
  );
}
