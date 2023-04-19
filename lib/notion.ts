import { Client } from "@notionhq/client";

export const notion = new Client({
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
