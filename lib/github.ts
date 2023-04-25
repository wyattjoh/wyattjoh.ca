import { cache } from "react";

import { request } from "./request";

async function github<T>(endpoint: string): Promise<T> {
  const res = await request(new URL(endpoint, "https://api.github.com"), {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
    next: {
      // Revalidate every day.
      revalidate: 1 * 24 * 60 * 60,
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
