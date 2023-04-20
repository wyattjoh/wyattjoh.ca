import { getRepositories } from "../lib/notion";
import { GitHubRepository } from "./GitHubRepository";

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
