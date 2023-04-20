import { getPageBlocks } from "../lib/notion";

import { NotionBlock } from "./notion-block";

type Props = {
  id: string;
};

export async function NotionBlocks({ id }: Props) {
  const blocks = await getPageBlocks(id);

  return (
    <>
      {blocks.map((block, index) => (
        <NotionBlock key={index} block={block} />
      ))}
    </>
  );
}
