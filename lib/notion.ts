import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
  fetch: (url, init) => {
    return fetch(url, {
      ...init,
      next: {
        // Revalidate every hour.
        revalidate: 1 * 60 * 60,
      },
    });
  },
});

type Repository = {
  id: string;
  name: string;
  url: string;
  description: string;
  color: string;
};

export async function getRepositories(): Promise<Repository[]> {
  const { results } = await notion.databases.query({
    database_id: process.env.NOTION_PINNED_DATABASE_ID!,
    sorts: [{ property: "Order", direction: "ascending" }],
  });

  return results
    .filter<PageObjectResponse>((result): result is PageObjectResponse => {
      return "properties" in result;
    })
    .map<Repository | null>((result) => {
      const { Name, URL, Description, Color } = result.properties;

      if (Name.type !== "title" || !Name.title?.[0]?.plain_text) {
        return null;
      }

      if (URL.type !== "url" || !URL.url) {
        return null;
      }

      if (
        Description.type !== "rich_text" ||
        !Description.rich_text?.[0]?.plain_text
      ) {
        return null;
      }

      if (Color.type !== "rich_text" || !Color.rich_text?.[0]?.plain_text) {
        return null;
      }

      return {
        id: result.id,
        name: Name.title[0].plain_text,
        url: URL.url,
        description: Description.rich_text[0].plain_text,
        color: Color.rich_text[0].plain_text,
      };
    })
    .filter((repository): repository is Repository => {
      return repository !== null;
    });
}
