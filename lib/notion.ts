import "server-only";

import type {
  BlockObjectResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

import { cache } from "react";
import { Client } from "@notionhq/client";

import { request } from "./request";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
  fetch: (url, init) => {
    return request(url, {
      ...init,
      next: {
        // Revalidate every hour.
        revalidate: 1 * 60 * 60,
      },
    });
  },
});

export const getPageBlocks = cache(async (id: string) => {
  const { results } = await notion.blocks.children.list({
    block_id: id,
  });

  return results as BlockObjectResponse[];
});

export type BlogPost = {
  id: string;
  title: string;
  date: string;
  slug: string;
};

const formatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export const findBlogPost = cache(
  async (slug: string): Promise<BlogPost | null> => {
    const { results } = await notion.databases.query({
      database_id: "0b56732805064002a20bb6bb55da55eb",
      filter: {
        property: "Slug",
        rich_text: {
          equals: slug,
        },
      },
    });

    if (results.length === 0) {
      return null;
    }

    if (!("properties" in results[0])) {
      return null;
    }

    const { Name, Date: BlogDate } = results[0].properties;

    if (!Name || Name.type !== "title" || !Name.title?.[0]?.plain_text) {
      return null;
    }

    if (!BlogDate || BlogDate.type !== "date" || !BlogDate.date?.start) {
      return null;
    }

    // Parse the date from the format 2023-04-25 into a JS Date object.
    const date = formatter.format(new Date(BlogDate.date.start));

    return {
      id: results[0].id,
      title: Name.title[0].plain_text,
      date,
      slug,
    };
  }
);

export const getBlogPosts = cache(async (): Promise<BlogPost[]> => {
  const { results } = await notion.databases.query({
    database_id: "0b56732805064002a20bb6bb55da55eb",
    sorts: [{ property: "Date", direction: "descending" }],
  });

  return results
    .filter<PageObjectResponse>((result): result is PageObjectResponse => {
      return "properties" in result;
    })
    .map<BlogPost | null>((result) => {
      const { Name, Slug, Date: BlogDate } = result.properties;

      if (Name.type !== "title" || !Name.title?.[0]?.plain_text) {
        return null;
      }

      if (Slug.type !== "rich_text" || !Slug.rich_text?.[0]?.plain_text) {
        return null;
      }

      if (!BlogDate || BlogDate.type !== "date" || !BlogDate.date?.start) {
        return null;
      }

      // Parse the date from the format 2023-04-25 into a JS Date object.
      const date = formatter.format(new Date(BlogDate.date.start));

      return {
        id: result.id,
        title: Name.title[0].plain_text,
        slug: Slug.rich_text[0].plain_text,
        date,
      };
    })
    .filter((post): post is BlogPost => {
      return post !== null;
    });
});

type Repository = {
  id: string;
  name: string;
  url: string;
  description: string;
  color: string;
};

export const getRepositories = cache(async (): Promise<Repository[]> => {
  const { results } = await notion.databases.query({
    database_id: "b3ccd60d3267422a8c28e9f8044e036b",
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
});
