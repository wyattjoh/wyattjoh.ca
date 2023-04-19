import { notion } from "../lib/notion";
import GitHubRepository from "./GitHubRepository";

export async function GitHubRepositories() {
  const repos = await notion.databases.query({
    database_id: process.env.NOTION_PINNED_DATABASE_ID!,
    sorts: [{ property: "Order", direction: "ascending" }],
  });

  return (
    <div className="grid grid-cols-1 gap-4">
      {repos.results.map((result) => {
        if (!("properties" in result)) return null;

        const { Name, URL, Description, Color } = result.properties;

        if (Name.type !== "title") return null;
        if (URL.type !== "url" || !URL.url) return null;
        if (Description.type !== "rich_text") return null;
        if (Color.type !== "rich_text") return null;

        return (
          <GitHubRepository
            key={result.id}
            repo={{
              name: Name.title[0].plain_text,
              url: URL.url,
              description: Description.rich_text[0].plain_text,
              color: Color.rich_text[0]?.plain_text,
            }}
          />
        );
      })}
    </div>
  );
}
