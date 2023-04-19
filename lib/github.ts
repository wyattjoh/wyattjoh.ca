export async function github<T>(endpoint: string): Promise<T> {
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
