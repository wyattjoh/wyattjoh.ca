import "server-only";

import { Client } from "@notionhq/client";
import type {
  BlockObjectResponse,
  PageObjectResponse,
  QueryDatabaseParameters,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { unstable_cacheLife, unstable_cacheTag } from "next/cache";
import { getColor } from "./colors";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

/**
 * Retrieves all child blocks from a Notion page, handling pagination automatically.
 * This function recursively fetches all blocks using Notion's pagination cursor.
 *
 * @param id - The Notion page or block ID to fetch children from
 * @returns Promise that resolves to an array of all block objects from the page
 */
export const getPageBlocks = async (id: string) => {
  "use cache";
  unstable_cacheTag("notion");
  unstable_cacheLife("hours");

  const allBlocks: BlockObjectResponse[] = [];
  let cursor: string | undefined;

  do {
    const response = await notion.blocks.children.list({
      block_id: id,
      start_cursor: cursor,
    });

    const blocks = response.results as BlockObjectResponse[];
    allBlocks.push(...blocks);

    cursor = response.next_cursor || undefined;
  } while (cursor);

  return allBlocks;
};

/**
 * Extracts heading blocks (h1, h2, h3) from a Notion page and returns them as a structured array.
 * Used for generating table of contents for blog posts.
 *
 * @param id - The Notion page ID to extract headings from
 * @returns Promise that resolves to an array of heading objects with id, text, and level properties
 */
export const extractHeadings = async (id: string): Promise<Heading[]> => {
  "use cache";
  unstable_cacheTag("notion");
  unstable_cacheLife("hours");

  const blocks = await getPageBlocks(id);
  const headings: Heading[] = [];

  for (const block of blocks) {
    if (block.type === "heading_1" && block.heading_1.rich_text[0]) {
      headings.push({
        id: block.id,
        text: block.heading_1.rich_text[0].plain_text,
        level: 1,
      });
    } else if (block.type === "heading_2" && block.heading_2.rich_text[0]) {
      headings.push({
        id: block.id,
        text: block.heading_2.rich_text[0].plain_text,
        level: 2,
      });
    } else if (block.type === "heading_3" && block.heading_3.rich_text[0]) {
      headings.push({
        id: block.id,
        text: block.heading_3.rich_text[0].plain_text,
        level: 3,
      });
    }
  }

  return headings;
};

export type Heading = {
  id: string;
  text: string;
  level: 1 | 2 | 3;
};

export type BlogPost = {
  id: string;
  title: string;
  summary: RichTextItemResponse[];
  tags: string[];
  date: string;
  slug: string;
};

const formatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

/**
 * Converts Notion rich text objects to plain text by extracting text content.
 * Filters out non-text items and joins all text blocks with spaces.
 *
 * @param text - Array of Notion rich text response objects
 * @returns Plain text string with all formatting removed
 */
export function toPlainText(text: RichTextItemResponse[]): string {
  return text
    .map((block) => {
      if (block.type !== "text") return null;

      return block.plain_text;
    })
    .filter((text) => typeof text === "string")
    .join(" ");
}

function createBlogPost(response: PageObjectResponse): BlogPost | null {
  if (!("properties" in response)) {
    return null;
  }

  const {
    Name,
    Date: BlogDate,
    Tags,
    Slug,
    Status,
    Summary,
  } = response.properties;

  if (!Name || Name.type !== "title" || !Name.title?.[0]?.plain_text) {
    return null;
  }

  if (!BlogDate || BlogDate.type !== "date" || !BlogDate.date?.start) {
    return null;
  }

  if (!Tags || Tags.type !== "multi_select") {
    return null;
  }

  if (Slug.type !== "rich_text" || !Slug.rich_text?.[0]?.plain_text) {
    return null;
  }

  // Ensure we only show published blog posts.
  if (
    process.env.ENABLE_DRAFT_MODE !== "true" &&
    (Status.type !== "select" || Status.select?.name !== "Published")
  ) {
    return null;
  }

  if (
    Summary.type !== "rich_text" ||
    (Summary.rich_text[0] && Summary.rich_text[0].type !== "text")
  ) {
    return null;
  }

  // Parse the date from the format 2023-04-25 into a JS Date object.
  const date = formatter.format(new Date(BlogDate.date.start));

  return {
    id: response.id,
    title: Name.title[0].plain_text,
    tags: Tags.multi_select.map((tag) => tag.name),
    summary: Summary.rich_text,
    date,
    slug: Slug.rich_text[0].plain_text,
  };
}

/**
 * Finds a specific blog post by its slug from the Notion database.
 * Filters by published status unless draft mode is enabled via environment variable.
 *
 * @param slug - The unique slug identifier for the blog post
 * @returns Promise that resolves to a BlogPost object or null if not found
 */
export const findBlogPost = async (slug: string): Promise<BlogPost | null> => {
  "use cache";
  unstable_cacheTag("notion");
  unstable_cacheLife("hours");

  const args: QueryDatabaseParameters = {
    database_id: "0b56732805064002a20bb6bb55da55eb",
    filter: {
      and: [
        {
          property: "Slug",
          rich_text: {
            equals: slug,
          },
        },
      ],
    },
  };

  if (process.env.ENABLE_DRAFT_MODE !== "true") {
    if (args.filter && "and" in args.filter) {
      args.filter.and.push({
        property: "Status",
        select: {
          equals: "Published",
        },
      });
    }
  }

  const { results } = await notion.databases.query(args);
  if (results.length === 0 || !("properties" in results[0])) {
    return null;
  }

  // We know results[0] is a PageObjectResponse because the blog post id is
  // hardcoded.
  return createBlogPost(results[0] as PageObjectResponse);
};

/**
 * Retrieves all published blog posts from the Notion database, sorted by date (newest first).
 * Filters out draft posts unless ENABLE_DRAFT_MODE environment variable is set.
 *
 * @returns Promise that resolves to an array of BlogPost objects
 */
export const getBlogPosts = async (): Promise<BlogPost[]> => {
  "use cache";
  unstable_cacheTag("notion");
  unstable_cacheLife("hours");

  const { results } = await notion.databases.query({
    database_id: "0b56732805064002a20bb6bb55da55eb",
    sorts: [{ property: "Date", direction: "descending" }],
    // Ensure we only show published blog posts.
    filter:
      process.env.ENABLE_DRAFT_MODE === "true"
        ? undefined
        : {
            property: "Status",
            select: {
              equals: "Published",
            },
          },
  });

  return results
    .filter<PageObjectResponse>((result): result is PageObjectResponse => {
      return "properties" in result;
    })
    .map<BlogPost | null>(createBlogPost)
    .filter((post): post is BlogPost => {
      return post !== null;
    });
};

type Repository = {
  id: string;
  name: string;
  url: string;
  description: string;
  color: string;
  language: string;
};

/**
 * Retrieves featured repositories from the Notion database, sorted by order.
 * Includes repository metadata like name, URL, description, and programming language.
 *
 * @returns Promise that resolves to an array of Repository objects with metadata
 */
export const getRepositories = async (): Promise<Repository[]> => {
  "use cache";
  unstable_cacheTag("notion");
  unstable_cacheLife("hours");

  const { results } = await notion.databases.query({
    database_id: "b3ccd60d3267422a8c28e9f8044e036b",
    sorts: [{ property: "Order", direction: "ascending" }],
  });

  return results
    .filter<PageObjectResponse>((result): result is PageObjectResponse => {
      return "properties" in result;
    })
    .map<Repository | null>((result) => {
      const { Name, URL, Description, Language } = result.properties;

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

      if (
        Language.type !== "rich_text" ||
        !Language.rich_text?.[0]?.plain_text
      ) {
        return null;
      }

      return {
        id: result.id,
        name: Name.title[0].plain_text,
        url: URL.url,
        description: Description.rich_text[0].plain_text,
        color: getColor(Language.rich_text[0].plain_text, "#858585"),
        language: Language.rich_text[0].plain_text,
      };
    })
    .filter((repository): repository is Repository => {
      return repository !== null;
    });
};
