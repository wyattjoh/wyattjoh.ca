import clsx from "clsx";

import { getPageBlocks } from "../lib/notion";
import { NotionBlock } from "./notion-block";

type Props = {
  id: string;
  className?: string;
};

export async function NotionBlocks({ id, className }: Props) {
  const blocks = await getPageBlocks(id);

  // Process blocks and group consecutive list items into proper HTML list structures
  const groupedBlocks = [];
  let i = 0;

  // Iterate through all blocks using a while loop to handle grouping logic
  while (i < blocks.length) {
    const currentBlock = blocks[i];

    // Handle bulleted list items: group consecutive items into a single <ul>
    if (currentBlock.type === "bulleted_list_item") {
      const listItems = [];

      // Collect all consecutive bulleted list items
      while (i < blocks.length && blocks[i].type === "bulleted_list_item") {
        listItems.push(blocks[i]);
        i++; // Increment index for each list item processed
      }

      // Create a single <ul> element containing all consecutive bulleted list items
      groupedBlocks.push(
        <ul key={`bulleted-list-${listItems[0].id}`}>
          {listItems.map((item) => (
            <NotionBlock key={item.id} block={item} />
          ))}
        </ul>
      );
    }
    // Handle numbered list items: group consecutive items into a single <ol>
    else if (currentBlock.type === "numbered_list_item") {
      const listItems = [];

      // Collect all consecutive numbered list items
      while (i < blocks.length && blocks[i].type === "numbered_list_item") {
        listItems.push(blocks[i]);
        i++; // Increment index for each list item processed
      }

      // Create a single <ol> element containing all consecutive numbered list items
      groupedBlocks.push(
        <ol key={`numbered-list-${listItems[0].id}`}>
          {listItems.map((item) => (
            <NotionBlock key={item.id} block={item} />
          ))}
        </ol>
      );
    }
    // Handle all other block types individually (paragraphs, headings, code, etc.)
    else {
      groupedBlocks.push(
        <NotionBlock key={currentBlock.id} block={currentBlock} />
      );
      i++; // Move to next block
    }
  }

  return (
    <div
      className={clsx(
        "max-w-none prose dark:prose-invert prose-a:decoration-2 prose-a:decoration-gray-500 prose-a:hover:decoration-black dark:prose-a:hover:decoration-gray-600 prose-a:transition-colors",
        className
      )}
    >
      {groupedBlocks}
    </div>
  );
}
