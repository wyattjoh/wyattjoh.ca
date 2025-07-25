import "server-only";

import { Octokit } from "@octokit/core";
import { unstable_cacheLife, unstable_cacheTag } from "next/cache";
import { getColor } from "./colors";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export const getRepository = async (name: string) => {
  "use cache";
  unstable_cacheTag("github");
  unstable_cacheLife("days");

  const [owner, repo] = name.split("/");
  const repository = await octokit.request("GET /repos/{owner}/{repo}", {
    owner,
    repo,
  });

  return repository.data;
};

export const getRecentRepositories = async () => {
  "use cache";
  unstable_cacheTag("github");
  unstable_cacheLife("days");

  const repositories = await octokit.request("GET /user/repos", {
    sort: "pushed",
    direction: "desc",
    per_page: 30,
    type: "owner",
  });

  return repositories.data
    .filter((repo) => repo.private === false) // Exclude private repositories.
    .filter((repo) => repo.fork === false) // Exclude repositories that are forks.
    .filter((repo) => repo.archived === false) // Exclude repositories that are archived.
    .slice(0, 10) // Limit it to the last 10 repositories.
    .map((repo) => ({
      id: repo.id.toString(),
      name: repo.full_name,
      url: repo.html_url,
      description: repo.description || "No description",
      language: repo.language || "Unknown",
      color: getColor(repo.language || "Unknown", "#858585"),
      stargazers_count: repo.stargazers_count,
    }));
};
