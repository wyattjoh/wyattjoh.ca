import "server-only";

import { cache } from "react";

async function github<T>(endpoint: string): Promise<T> {
  const res = await fetch(new URL(endpoint, "https://api.github.com"), {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
    next: {
      // Revalidate every 7 days.
      revalidate: 7 * 24 * 60 * 60,
      tags: ["github"],
    },
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return await res.json();
}

export const getRepository = cache(async (name: string) => {
  const [owner, repo] = name.split("/");
  const repository = await github<{ stargazers_count: number }>(
    `/repos/${owner}/${repo}`
  );

  return repository;
});
