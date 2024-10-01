import clsx from "clsx";

import { getPageBlocks } from "../lib/notion";
import { NotionBlock } from "./notion-block";

type Props = {
  id: string;
  className?: string;
};

export async function NotionBlocks({ id, className }: Props) {
  const blocks = await getPageBlocks(id);

  return (
    <div
      className={clsx(
        "max-w-none prose prose-a:decoration-2 prose-a:decoration-gray-500 hover:prose-a:decoration-black prose-a:transition-colors",
        className
      )}
    >
      {blocks.map((block) => (
        <NotionBlock key={block.id} block={block} />
      ))}
    </div>
  );
}
