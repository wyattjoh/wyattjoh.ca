async function github<T>(endpoint: string): Promise<T> {
  const url = new URL("https://api.github.com");
  url.pathname = endpoint;
  const res = await fetch(url, {
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

export async function getRepository(name: string) {
  const [owner, repo] = name.split("/");
  const repository = await github<{ stargazers_count: number }>(
    `/repos/${owner}/${repo}`
  );

  return repository;
}

type User = {
  avatar: string;
  bio: string;
  name: string;
};

export async function getUser(): Promise<User> {
  const user = await github<{ name: string; avatar_url: string; bio: string }>(
    "/user"
  );

  const avatar = new URL(user.avatar_url);
  avatar.searchParams.set("s", "300");

  return {
    avatar: avatar.toString(),
    bio: user.bio,
    name: user.name,
  };
}
