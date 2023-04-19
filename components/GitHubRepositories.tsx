import { getRepositories } from "../lib/notion";
import { GitHubRepository } from "./GitHubRepository";

export async function GitHubRepositories() {
  const repositories = await getRepositories();

  return (
    <div className="grid grid-cols-1 gap-4">
      {repositories.map((repo) => (
        <GitHubRepository key={repo.id} repo={repo} />
      ))}
    </div>
  );
}
