import "server-only";

import { unstable_cacheLife, unstable_cacheTag } from "next/cache";

async function github<T>(endpoint: string): Promise<T> {
  const res = await fetch(new URL(endpoint, "https://api.github.com"), {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return await res.json();
}

export const getRepository = async (name: string) => {
  "use cache";
  unstable_cacheTag("github");
  unstable_cacheLife("days");

  const [owner, repo] = name.split("/");
  const repository = await github<{ stargazers_count: number }>(
    `/repos/${owner}/${repo}`
  );

  return repository;
};
